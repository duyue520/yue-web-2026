from __future__ import annotations

import os
import shutil
import sys
import unicodedata
from dataclasses import dataclass, field
from typing import TextIO

from PIL import Image


RESET = "\x1b[0m"
DEFAULT_FG = "\x1b[39m"
DEFAULT_BG = "\x1b[49m"
HIDE_CURSOR = "\x1b[?25l"
SHOW_CURSOR = "\x1b[?25h"
ALT_SCREEN = "\x1b[?1049h"
MAIN_SCREEN = "\x1b[?1049l"
HOME = "\x1b[H"
CLEAR_SCREEN = "\x1b[2J"


@dataclass
class ColorCache:
    foreground: dict[tuple[int, int, int], str] = field(default_factory=dict)
    background: dict[tuple[int, int, int], str] = field(default_factory=dict)

    def fg(self, color: tuple[int, int, int]) -> str:
        cached = self.foreground.get(color)
        if cached is None:
            cached = f"\x1b[38;2;{color[0]};{color[1]};{color[2]}m"
            self.foreground[color] = cached
        return cached

    def bg(self, color: tuple[int, int, int]) -> str:
        cached = self.background.get(color)
        if cached is None:
            cached = f"\x1b[48;2;{color[0]};{color[1]};{color[2]}m"
            self.background[color] = cached
        return cached


class TerminalRenderer:
    def __init__(
        self,
        stream: TextIO | None = None,
        background: tuple[int, int, int] | None = None,
        block_mode: str = "solid",
    ) -> None:
        self.stream = stream or sys.stdout
        self.background = background
        self.block_mode = block_mode
        self.colors = ColorCache()
        self.previous_buffer: list[str] = []

    def enter(self) -> None:
        enable_virtual_terminal_on_windows()
        _reconfigure_stdout_utf8()
        self.stream.write(ALT_SCREEN + HIDE_CURSOR + RESET + DEFAULT_FG + DEFAULT_BG + CLEAR_SCREEN + HOME)
        self.stream.flush()

    def exit(self) -> None:
        self.stream.write(RESET + SHOW_CURSOR + MAIN_SCREEN)
        self.stream.flush()

    def clear(self) -> None:
        self.stream.write(RESET + DEFAULT_FG + DEFAULT_BG + CLEAR_SCREEN + HOME)
        self.stream.flush()

    def terminal_size(self) -> tuple[int, int]:
        size = shutil.get_terminal_size(fallback=(80, 24))
        return max(1, size.columns), max(2, size.lines)

    def reset_buffer(self) -> None:
        self.previous_buffer = []

    def render_image_lines(self, image: Image.Image) -> list[str]:
        if self.block_mode == "half":
            return self._render_half_block_lines(image)
        return self._render_solid_block_lines(image)

    def _render_half_block_lines(self, image: Image.Image) -> list[str]:
        rgba = image.convert("RGBA")
        width, height = rgba.size
        pixels = rgba.load()
        lines: list[str] = []

        for y in range(0, height, 2):
            parts: list[str] = []
            last_fg: tuple[int, int, int] | None = None
            last_bg: tuple[int, int, int] | None = None

            for x in range(width):
                top = pixels[x, y]
                bottom = pixels[x, y + 1] if y + 1 < height else (0, 0, 0, 0)
                top_visible = top[3] >= 128
                bottom_visible = bottom[3] >= 128

                if top_visible and bottom_visible:
                    fg = top[:3]
                    bg = bottom[:3]
                    char = "▀"
                elif top_visible:
                    fg = top[:3]
                    bg = None
                    char = "▀"
                elif bottom_visible:
                    fg = bottom[:3]
                    bg = None
                    char = "▄"
                else:
                    fg = None
                    bg = None
                    char = " "

                if fg != last_fg:
                    parts.append(self.colors.fg(fg) if fg is not None else DEFAULT_FG)
                    last_fg = fg
                if bg != last_bg:
                    parts.append(self.colors.bg(bg) if bg is not None else DEFAULT_BG)
                    last_bg = bg

                parts.append(char)

            parts.append(RESET)
            lines.append("".join(parts))

        return lines

    def _render_solid_block_lines(self, image: Image.Image) -> list[str]:
        rgba = image.convert("RGBA")
        width, height = rgba.size
        pixels = rgba.load()
        lines: list[str] = []

        for y in range(0, height, 2):
            parts: list[str] = []
            last_fg: tuple[int, int, int] | None = None

            for x in range(width):
                top = pixels[x, y]
                bottom = pixels[x, y + 1] if y + 1 < height else (0, 0, 0, 0)
                top_visible = top[3] >= 128
                bottom_visible = bottom[3] >= 128

                if top_visible and bottom_visible:
                    fg = top[:3]
                    char = "█"
                elif top_visible:
                    fg = top[:3]
                    char = "█"
                elif bottom_visible:
                    fg = bottom[:3]
                    char = "█"
                else:
                    fg = None
                    char = " "

                if fg != last_fg:
                    parts.append(self.colors.fg(fg) if fg is not None else DEFAULT_FG)
                    parts.append(DEFAULT_BG)
                    last_fg = fg

                parts.append(char)

            parts.append(RESET)
            lines.append("".join(parts))

        return lines

    def compose_screen(
        self,
        image_lines: list[str],
        image_width: int,
        message: str,
        show_fps: bool = False,
        fps: float = 0.0,
        vertical_margin: int = 6,
    ) -> list[str]:
        columns, rows = self.terminal_size()
        animation_rows = max(1, rows - 1)
        background = self.colors.bg(self.background) if self.background is not None else ""
        blank = background + (" " * columns) + RESET
        screen = [blank for _ in range(animation_rows)]

        effective_margin = min(max(0, vertical_margin), max(0, (animation_rows - 1) // 2))
        image_area_rows = max(1, animation_rows - (effective_margin * 2))
        image_rows = min(len(image_lines), image_area_rows)
        display_width = min(image_width, columns)
        top_padding = effective_margin + max(0, (image_area_rows - image_rows) // 2)
        left_padding = max(0, (columns - display_width) // 2)
        right_padding = max(0, columns - left_padding - display_width)

        for index in range(image_rows):
            screen[top_padding + index] = (
                background
                + (" " * left_padding)
                + image_lines[index]
                + background
                + (" " * right_padding)
                + RESET
            )

        screen.append(self._footer_line(message, columns, show_fps, fps))
        return screen

    def compose_triple_screen(
        self,
        left_lines: list[str],
        left_width: int,
        center_lines: list[str],
        center_width: int,
        right_lines: list[str],
        right_width: int,
        message: str,
        show_fps: bool = False,
        fps: float = 0.0,
        vertical_margin: int = 1,
        cat_gap: int = 2,
    ) -> list[str]:
        """Compose three cat images side-by-side, centered horizontally."""
        columns, rows = self.terminal_size()
        animation_rows = max(1, rows - 1)
        background = self.colors.bg(self.background) if self.background is not None else ""
        blank = background + (" " * columns) + RESET
        screen = [blank for _ in range(animation_rows)]

        # Layout: margin | cat_l | gap | cat_c | gap | cat_r | margin
        total_fixed = cat_gap * 2
        cat_col = max(1, (columns - total_fixed) // 3)
        total_used = cat_col * 3 + total_fixed
        side_margin = max(0, (columns - total_used) // 2)

        # column where each cat starts
        left_start = side_margin
        center_start = side_margin + cat_col + cat_gap
        right_start = side_margin + cat_col * 2 + cat_gap * 2

        def _pad_cat(lines: list[str], width: int, alloc: int) -> list[str]:
            """Pad or crop each line to exactly `alloc` display columns."""
            if width <= alloc:
                pad_left = max(0, (alloc - width) // 2)
                pad_right = max(0, alloc - width - pad_left)
                return [
                    background + (" " * pad_left) + ln + background + (" " * pad_right) + RESET
                    for ln in lines
                ]
            else:
                # width > alloc — must not happen if prerender crops correctly
                return [ln[:alloc] for ln in lines]

        left_padded = _pad_cat(left_lines, left_width, cat_col)
        center_padded = _pad_cat(center_lines, center_width, cat_col)
        right_padded = _pad_cat(right_lines, right_width, cat_col)

        # ── Compose rows ──
        effective_margin = min(max(0, vertical_margin), max(0, (animation_rows - 1) // 2))
        image_area_rows = max(1, animation_rows - (effective_margin * 2))
        max_lines = max(len(left_padded), len(center_padded), len(right_padded))
        image_rows = min(max_lines, image_area_rows)
        top_offset = effective_margin + max(0, (image_area_rows - image_rows) // 2)
        gap_fill = background + (" " * cat_gap) + RESET

        for idx in range(image_rows):
            l = left_padded[idx] if idx < len(left_padded) else blank
            c = center_padded[idx] if idx < len(center_padded) else blank
            r = right_padded[idx] if idx < len(right_padded) else blank
            screen[top_offset + idx] = l + gap_fill + c + gap_fill + r

        screen.append(self._footer_line(message, columns, show_fps, fps))
        return screen

    def compose_asymmetric_triple(
        self,
        left_lines: list[str],
        left_width: int,
        center_lines: list[str],
        center_width: int,
        right_lines: list[str],
        right_width: int,
        message: str,
        show_fps: bool = False,
        fps: float = 0.0,
        vertical_margin: int = 1,
        overlap: int = 2,
    ) -> list[str]:
        """Compose three cats with seamless blending via overlap.
        Center cat is larger; left & right are smaller.  Cats overlap by
        ``overlap`` columns so transparent edges merge instead of creating seams."""
        columns, rows = self.terminal_size()
        animation_rows = max(1, rows - 1)
        background = self.colors.bg(self.background) if self.background is not None else ""
        blank = background + (" " * columns) + RESET
        screen = [blank for _ in range(animation_rows)]

        # ── Vertical layout ──
        effective_margin = min(max(0, vertical_margin), max(0, (animation_rows - 1) // 2))
        image_area_rows = max(1, animation_rows - (effective_margin * 2))
        max_lines = max(len(left_lines), len(center_lines), len(right_lines))
        image_rows = min(max_lines, image_area_rows)
        top_offset = effective_margin + max(0, (image_area_rows - image_rows) // 2)

        # ── Build each row character-by-character with overlap ──
        for idx in range(image_rows):
            l_line = left_lines[idx] if idx < len(left_lines) else ""
            c_line = center_lines[idx] if idx < len(center_lines) else ""
            r_line = right_lines[idx] if idx < len(right_lines) else ""

            # Parse ANSI lines into (char, fg, bg) cell lists
            l_cells = _parse_ansi_to_cells(l_line, left_width)
            c_cells = _parse_ansi_to_cells(c_line, center_width)
            r_cells = _parse_ansi_to_cells(r_line, right_width)

            # Positions (may be negative if overlap pushes off-screen — clipped later)
            total_visual = left_width + center_width + right_width - 2 * overlap
            left_start = max(0, (columns - total_visual) // 2)
            center_start = left_start + left_width - overlap
            right_start = center_start + center_width - overlap

            # Build row buffer
            row_cells: list[tuple[str, tuple | None, tuple | None]] = [
                (" ", None, None) for _ in range(columns)
            ]

            def _place(cells, start_col):
                for i, (ch, fg, bg) in enumerate(cells):
                    col = start_col + i
                    if 0 <= col < columns:
                        # Only overwrite if we have content (non-default)
                        if ch != " " or fg is not None or bg is not None:
                            row_cells[col] = (ch, fg, bg)

            _place(l_cells, left_start)
            _place(c_cells, center_start)
            _place(r_cells, right_start)

            # Convert back to ANSI string
            screen[top_offset + idx] = _cells_to_ansi(row_cells, background)

        screen.append(self._footer_line(message, columns, show_fps, fps))
        return screen

    def draw_particles(
        self,
        particles: list[tuple[int, int, str, tuple[int, int, int]]],
        columns: int,
        rows: int,
    ) -> None:
        """Draw sparkle particles at specific terminal positions on top of the current frame."""
        if not particles:
            return
        updates: list[str] = []
        for row, col, char, color in particles:
            if 0 <= col < columns and 0 <= row < rows - 1:
                color_code = self.colors.fg(color)
                updates.append(f"\x1b[{row + 1};{col + 1}H{color_code}{char}{RESET}")
        if updates:
            self.stream.write("".join(updates))
            self.stream.flush()

    def draw(self, buffer: list[str], full_redraw: bool = False) -> None:
        updates: list[str] = []
        force = full_redraw or len(self.previous_buffer) != len(buffer)

        for row, line in enumerate(buffer, start=1):
            if force or self.previous_buffer[row - 1] != line:
                updates.append(f"\x1b[{row};1H{line}")

        if updates:
            self.stream.write("".join(updates))
            self.stream.flush()
            self.previous_buffer = buffer

    def _footer_line(
        self,
        message: str,
        columns: int,
        show_fps: bool,
        fps: float,
    ) -> str:
        message = fit_text(message, columns)
        message_width = display_width(message)
        fps_text = f"{fps:5.1f} FPS" if show_fps else ""
        fps_width = display_width(fps_text)
        footer_style = self.colors.fg((32, 32, 32))
        if self.background is not None:
            footer_style = self.colors.bg(self.background) + footer_style

        if fps_text and message_width + fps_width + 2 <= columns:
            left = max(0, (columns - message_width) // 2)
            middle = max(1, columns - left - message_width - fps_width)
            return (
                footer_style
                + (" " * left)
                + message
                + (" " * middle)
                + fps_text
                + RESET
            )

        left = max(0, (columns - message_width) // 2)
        right = max(0, columns - left - message_width)
        return footer_style + (" " * left) + message + (" " * right) + RESET


# ──────────────────────────────────────────────
#  ANSI cell-level helpers (for seamless overlap)
# ──────────────────────────────────────────────

def _parse_ansi_to_cells(
    line: str, expected_width: int,
) -> list[tuple[str, tuple | None, tuple | None]]:
    """Parse a half-block-rendered ANSI line into (char, fg, bg) cells.
    Returns exactly `expected_width` cells."""
    if not line:
        return [(" ", None, None) for _ in range(expected_width)]

    cells: list[tuple[str, tuple | None, tuple | None]] = []
    # Remove trailing RESET for parsing — we track state ourselves
    clean = line
    if clean.endswith("\x1b[0m"):
        clean = clean[:-4]

    cur_fg: tuple | None = None
    cur_bg: tuple | None = None
    i = 0

    while i < len(clean):
        if clean[i] == "\x1b" and i + 1 < len(clean) and clean[i + 1] == "[":
            # Parse escape sequence
            end = clean.find("m", i)
            if end == -1:
                break
            seq = clean[i + 2:end]
            i = end + 1

            if seq == "39":
                cur_fg = None
            elif seq == "49":
                cur_bg = None
            elif seq.startswith("38;2;"):
                parts = seq[5:].split(";")
                if len(parts) >= 3:
                    try:
                        cur_fg = (int(parts[0]), int(parts[1]), int(parts[2]))
                    except ValueError:
                        pass
            elif seq.startswith("48;2;"):
                parts = seq[5:].split(";")
                if len(parts) >= 3:
                    try:
                        cur_bg = (int(parts[0]), int(parts[1]), int(parts[2]))
                    except ValueError:
                        pass
        else:
            ch = clean[i]
            # East-Asian fullwidth check — skip combining chars for simplicity
            cells.append((ch, cur_fg, cur_bg))
            i += 1

    # Pad / trim to expected width
    if len(cells) < expected_width:
        cells += [(" ", None, None)] * (expected_width - len(cells))
    return cells[:expected_width]


def _cells_to_ansi(
    cells: list[tuple[str, tuple | None, tuple | None]],
    background: str = "",
) -> str:
    """Convert cell list back to a single ANSI string."""
    parts: list[str] = []
    last_fg: tuple | None = None
    last_bg: tuple | None = None

    for ch, fg, bg in cells:
        if fg != last_fg:
            parts.append(
                f"\x1b[38;2;{fg[0]};{fg[1]};{fg[2]}m" if fg is not None else DEFAULT_FG
            )
            last_fg = fg
        if bg != last_bg:
            parts.append(
                f"\x1b[48;2;{bg[0]};{bg[1]};{bg[2]}m" if bg is not None else DEFAULT_BG
            )
            last_bg = bg
        parts.append(ch)

    parts.append(RESET)
    return "".join(parts)


def display_width(text: str) -> int:
    width = 0
    for char in text:
        if unicodedata.combining(char):
            continue
        if unicodedata.east_asian_width(char) in {"F", "W"}:
            width += 2
        else:
            width += 1
    return width


def fit_text(text: str, max_width: int) -> str:
    if display_width(text) <= max_width:
        return text

    result: list[str] = []
    width = 0
    for char in text:
        char_width = 0 if unicodedata.combining(char) else (
            2 if unicodedata.east_asian_width(char) in {"F", "W"} else 1
        )
        if width + char_width > max_width:
            break
        result.append(char)
        width += char_width
    return "".join(result)


def enable_virtual_terminal_on_windows() -> None:
    if os.name != "nt":
        return

    import ctypes

    kernel32 = ctypes.windll.kernel32
    handle = kernel32.GetStdHandle(-11)
    mode = ctypes.c_uint32()

    if kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
        kernel32.SetConsoleMode(handle, mode.value | 0x0004)


def _reconfigure_stdout_utf8() -> None:
    """Try to reconfigure stdout for UTF-8 so Unicode box-drawing and symbols work."""
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
    except (AttributeError, OSError):
        pass
