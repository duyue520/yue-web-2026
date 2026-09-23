from __future__ import annotations

import argparse
import math
import sys
import time
from collections import deque
from dataclasses import dataclass
from pathlib import Path

from audio_player import AudioPlayer
from effects import (
    CENTER_PALETTE,
    LEFT_PALETTE,
    RIGHT_PALETTE,
    FireworksSystem,
)
from gif_loader import (
    GifFrame,
    crop_frames_to_content,
    fit_size,
    load_gif,
    prepare_frames,
    resolve_gif_path,
)
from renderer import TerminalRenderer


LOVE_MESSAGE = "我真的特别爱你"
BACKGROUND = None
VERTICAL_MARGIN_ROWS = 1
DEFAULT_SCALE = 0.95
ZOOM_LEVELS = 18
BREATH_PERIOD = 3.5
SIDE_SCALE = 0.7  # side cats are 70 % of center cat


@dataclass(frozen=True)
class RenderedFrame:
    lines: list[str]
    duration: float


@dataclass
class ZoomLevel:
    """One zoom step: holds frames rendered for center (full-size) and side cats."""
    scale: float
    center_frames: list[RenderedFrame]
    center_width: int
    side_frames: list[RenderedFrame]
    side_width: int


# ───────────────────────────────────────────────────────────
#  CLI
# ───────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render cat.gif as ANSI TrueColor terminal animation "
                    "— three cats, breathing zoom, firework effects."
    )
    parser.add_argument("--gif", default="cat.gif", help="GIF path.")
    parser.add_argument("--fps", action="store_true", help="Show live FPS.")
    parser.add_argument("--dither", action="store_true", help="Enable Floyd-Steinberg dithering.")
    parser.add_argument("--dither-levels", type=int, default=32, help="Dither levels (2-256).")
    parser.add_argument("--margin-rows", type=int, default=VERTICAL_MARGIN_ROWS, help="Vertical margin rows.")
    parser.add_argument("--scale", type=float, default=DEFAULT_SCALE, help="Base scale 0.1-2.0.")
    parser.add_argument("--no-trim", action="store_true", help="Keep transparent GIF padding.")
    parser.add_argument("--alpha-threshold", type=int, default=220,
                        help="Alpha cutoff 0-255. Higher = sharper edges. Default: 220.")
    parser.add_argument("--solid-block", action="store_true", help="Use solid-block (lower res).")
    parser.add_argument("--smooth", action="store_true", help="Antialiased scaling.")
    parser.add_argument("--music", default="music.mp3", help="MP3 to play.")
    parser.add_argument("--no-music", action="store_true", help="Disable music.")
    parser.add_argument("--no-zoom", action="store_true", help="Disable breathing zoom.")
    parser.add_argument("--no-fireworks", action="store_true", help="Disable fireworks.")
    parser.add_argument("--zoom-speed", type=float, default=1.0, help="Zoom speed multiplier.")
    parser.add_argument("--cats", type=int, default=3, choices=[1, 3], help="1 or 3 cats. Default: 3.")
    parser.add_argument("--side-scale", type=float, default=SIDE_SCALE,
                        help="Size ratio of side cats vs center (0.3-1.0). Default: 0.7.")
    parser.add_argument("--overlap", type=int, default=2,
                        help="Columns of overlap between cats for seamless blending. Default: 2.")
    return parser.parse_args()


# ───────────────────────────────────────────────────────────
#  Rendering helpers
# ───────────────────────────────────────────────────────────

def prerender_for_terminal(
    frames: list[GifFrame],
    renderer: TerminalRenderer,
    terminal_size: tuple[int, int],
    dither: bool,
    dither_levels: int,
    margin_rows: int,
    alpha_threshold: int,
    smooth: bool,
    scale: float,
) -> tuple[list[RenderedFrame], int]:
    reserved_rows = 1 + (max(0, margin_rows) * 2)
    target_size = fit_size(
        frames[0].image.size, terminal_size,
        reserved_rows=reserved_rows, scale_factor=scale,
    )
    term_cols, term_rows = terminal_size
    max_width = term_cols
    max_height = (term_rows - reserved_rows) * 2

    prepared = prepare_frames(
        frames, target_size,
        background=renderer.background, dither=dither,
        dither_levels=dither_levels, alpha_threshold=alpha_threshold,
        smooth=smooth,
    )

    if target_size[0] > max_width or target_size[1] > max_height:
        prepared = _crop_frames_to_viewport(prepared, max_width, max_height)
        display_width = min(target_size[0], max_width)
    else:
        display_width = target_size[0]

    rendered = [
        RenderedFrame(renderer.render_image_lines(frame.image), frame.duration)
        for frame in prepared
    ]
    return rendered, display_width


def _crop_frames_to_viewport(
    frames: list[GifFrame], max_width: int, max_height: int,
) -> list[GifFrame]:
    result: list[GifFrame] = []
    for frame in frames:
        w, h = frame.image.size
        left = max(0, (w - max_width) // 2)
        top = max(0, (h - max_height) // 2)
        right = min(w, left + max_width)
        bottom = min(h, top + max_height)
        result.append(GifFrame(frame.image.crop((left, top, right, bottom)), frame.duration))
    return result


# ───────────────────────────────────────────────────────────
#  Zoom helpers
# ───────────────────────────────────────────────────────────

def build_zoom_scales(num_levels: int, min_scale: float, max_scale: float) -> list[float]:
    half = num_levels // 2
    scales: list[float] = []
    for i in range(half):
        t = i / max(1, half - 1)
        eased = 0.5 - 0.5 * math.cos(t * math.pi)
        scales.append(min_scale + (max_scale - min_scale) * eased)
    for i in range(num_levels - half):
        t = i / max(1, num_levels - half - 1)
        eased = 0.5 - 0.5 * math.cos(t * math.pi)
        scales.append(max_scale - (max_scale - min_scale) * eased)
    return scales


def prerender_asymmetric_zoom(
    frames: list[GifFrame],
    renderer: TerminalRenderer,
    center_terminal: tuple[int, int],
    side_terminal: tuple[int, int],
    base_scale: float,
    side_scale: float,
    dither: bool, dither_levels: int,
    margin_rows: int, alpha_threshold: int,
    smooth: bool, num_levels: int,
) -> list[ZoomLevel]:
    """Pre-render zoom levels for both center (full-size) and side (scaled-down) cats."""
    min_s = base_scale * 0.5
    max_s = base_scale * 1.5
    scales = build_zoom_scales(num_levels, min_s, max_s)

    seen: set[float] = set()
    unique_scales: list[float] = []
    for s in scales:
        r = round(s, 3)
        if r not in seen:
            seen.add(r)
            unique_scales.append(s)

    zoom_levels: list[ZoomLevel] = []
    for scale in unique_scales:
        c_rend, c_w = prerender_for_terminal(
            frames, renderer, center_terminal,
            dither=dither, dither_levels=dither_levels,
            margin_rows=margin_rows, alpha_threshold=alpha_threshold,
            smooth=smooth, scale=scale,
        )
        s_rend, s_w = prerender_for_terminal(
            frames, renderer, side_terminal,
            dither=dither, dither_levels=dither_levels,
            margin_rows=margin_rows, alpha_threshold=alpha_threshold,
            smooth=smooth, scale=scale,
        )
        zoom_levels.append(ZoomLevel(scale, c_rend, c_w, s_rend, s_w))

    if len(zoom_levels) > 1:
        playback = (list(range(len(zoom_levels)))
                    + list(range(len(zoom_levels) - 2, 0, -1)))
    else:
        playback = [0]
    return [zoom_levels[i] for i in playback]


# ───────────────────────────────────────────────────────────
#  Layout calculations
# ───────────────────────────────────────────────────────────

def compute_asymmetric_layout(
    columns: int, side_scale: float,
) -> tuple[int, int, int, int]:
    """Return (center_cols, side_cols, total_used, side_margin)
    so center + 2×side ≈ columns with no gaps."""
    # centre_w + 2 * side_scale * centre_w ≤ columns
    denom = 1.0 + 2.0 * float(side_scale)
    center_w = max(10, int(columns / denom))
    side_w = max(6, int(center_w * side_scale))
    total = center_w + 2 * side_w
    margin = max(0, (columns - total) // 2)
    return center_w, side_w, total, margin


def compute_asymmetric_zones(
    columns: int, center_w: int, side_w: int, margin: int,
) -> list[tuple[float, float]]:
    """Return (left, right) column ranges for fireworks per cat position."""
    left_start = margin
    center_start = margin + side_w
    right_start = margin + side_w + center_w
    return [
        (float(left_start), float(left_start + side_w)),
        (float(center_start), float(center_start + center_w)),
        (float(right_start), float(right_start + side_w)),
    ]


# ───────────────────────────────────────────────────────────
#  Main loop
# ───────────────────────────────────────────────────────────

def sleep_until(target_time: float) -> None:
    while True:
        remaining = target_time - time.perf_counter()
        if remaining <= 0:
            return
        time.sleep(min(remaining, 0.02))


def bundled_asset_dir() -> Path:
    return Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))


def resolve_optional_asset(path: str | Path, extra_dirs: tuple[Path, ...]) -> Path:
    requested = Path(path)
    if requested.exists():
        return requested
    for directory in (Path.cwd(), *extra_dirs):
        candidate = directory / requested.name
        if candidate.exists():
            return candidate
    return requested


def run() -> int:
    args = parse_args()
    asset_dir = bundled_asset_dir()
    gif_path = resolve_gif_path(Path(args.gif), extra_dirs=(asset_dir,))
    frames = load_gif(gif_path)
    if not args.no_trim:
        frames = crop_frames_to_content(frames)

    block_mode = "solid" if args.solid_block else "half"
    renderer = TerminalRenderer(background=BACKGROUND, block_mode=block_mode)

    num_cats: int = args.cats
    side_scale: float = max(0.3, min(1.0, args.side_scale))

    zoom_levels: list[ZoomLevel] = []
    cached_terminal_size: tuple[int, int] | None = None
    zoom_index = 0
    frame_index = 0
    next_frame_at = time.perf_counter()
    anim_start_time = time.perf_counter()
    timestamps: deque[float] = deque(maxlen=120)
    music_path = resolve_optional_asset(args.music, extra_dirs=(asset_dir,))
    audio = None if args.no_music else AudioPlayer(music_path)
    fireworks: FireworksSystem | None = None

    try:
        if audio is not None:
            audio.start()
        renderer.enter()

        term_cols, term_rows = renderer.terminal_size()
        loading_line = _center_text("Loading...", term_cols)
        try:
            renderer.stream.write(f"\x1b[H{loading_line}")
            renderer.stream.flush()
        except UnicodeEncodeError:
            pass

        while True:
            terminal_size = renderer.terminal_size()
            if terminal_size != cached_terminal_size:
                cached_terminal_size = terminal_size
                term_cols, term_rows = terminal_size
                renderer.clear()

                if num_cats == 3:
                    center_w, side_w, _, margin = compute_asymmetric_layout(term_cols, side_scale)
                    zones = compute_asymmetric_zones(term_cols, center_w, side_w, margin)
                    center_term = (center_w, term_rows)
                    side_term = (side_w, term_rows)
                else:
                    center_w = term_cols
                    side_w = 0
                    zones = [(0.0, float(term_cols))]
                    center_term = terminal_size
                    side_term = terminal_size

                if args.no_zoom:
                    c_rend, c_w = prerender_for_terminal(
                        frames, renderer, center_term,
                        dither=args.dither, dither_levels=args.dither_levels,
                        margin_rows=args.margin_rows, alpha_threshold=args.alpha_threshold,
                        smooth=args.smooth, scale=args.scale,
                    )
                    if num_cats == 3:
                        s_rend, s_w = prerender_for_terminal(
                            frames, renderer, side_term,
                            dither=args.dither, dither_levels=args.dither_levels,
                            margin_rows=args.margin_rows, alpha_threshold=args.alpha_threshold,
                            smooth=args.smooth, scale=args.scale,
                        )
                    else:
                        s_rend, s_w = c_rend, c_w
                    zoom_levels = [ZoomLevel(args.scale, c_rend, c_w, s_rend, s_w)]
                else:
                    zoom_levels = prerender_asymmetric_zoom(
                        frames, renderer, center_term, side_term,
                        base_scale=args.scale, side_scale=side_scale,
                        dither=args.dither, dither_levels=args.dither_levels,
                        margin_rows=args.margin_rows, alpha_threshold=args.alpha_threshold,
                        smooth=args.smooth, num_levels=ZOOM_LEVELS,
                    )

                if not args.no_fireworks:
                    fireworks = FireworksSystem(term_cols, term_rows)

                renderer.reset_buffer()
                zoom_index = 0
                frame_index = 0
                next_frame_at = time.perf_counter()
                anim_start_time = time.perf_counter()

            now = time.perf_counter()
            timestamps.append(now)
            while timestamps and now - timestamps[0] > 1.0:
                timestamps.popleft()
            fps = len(timestamps) / max(0.001, now - timestamps[0]) if len(timestamps) > 1 else 0.0

            # ── Time-based zoom ──
            n_zoom = len(zoom_levels)
            if n_zoom > 1:
                elapsed = (now - anim_start_time) / max(0.1, args.zoom_speed)
                period = max(0.5, BREATH_PERIOD)
                zoom_t = (elapsed % period) / period
                zoom_index = int(zoom_t * n_zoom) % n_zoom
            else:
                zoom_index = 0

            zl = zoom_levels[zoom_index]
            gif_frames = zl.center_frames
            frame = gif_frames[frame_index % len(gif_frames)]

            # ── Compose screen ──
            if num_cats == 3:
                screen = renderer.compose_asymmetric_triple(
                    zl.side_frames[frame_index % len(zl.side_frames)].lines, zl.side_width,
                    frame.lines, zl.center_width,
                    zl.side_frames[frame_index % len(zl.side_frames)].lines, zl.side_width,
                    LOVE_MESSAGE,
                    show_fps=args.fps, fps=fps,
                    vertical_margin=args.margin_rows,
                    overlap=args.overlap,
                )
            else:
                screen = renderer.compose_screen(
                    frame.lines, zl.center_width,
                    LOVE_MESSAGE,
                    show_fps=args.fps, fps=fps,
                    vertical_margin=args.margin_rows,
                )

            # ── Fireworks ──
            dt = frame.duration
            particles: list = []
            if fireworks is not None:
                fireworks.update(dt)
                if num_cats == 3:
                    for i, (z_l, z_r) in enumerate(zones):
                        palette = [LEFT_PALETTE, CENTER_PALETTE, RIGHT_PALETTE][i]
                        fireworks.spawn_zone_sparkles(dt, z_l, z_r, palette, rate=0.12)
                        fireworks.spawn_zone_firework(dt, z_l, z_r, palette)
                particles = fireworks.collect_visible_particles()

            # ── Draw ──
            renderer.draw(screen, full_redraw=True)
            if particles:
                renderer.draw_particles(particles, term_cols, term_rows)

            # ── Advance GIF frame ──
            frame_index = (frame_index + 1) % len(gif_frames)
            next_frame_at += frame.duration
            if next_frame_at < time.perf_counter() - 0.1:
                next_frame_at = time.perf_counter()
            sleep_until(next_frame_at)

    except KeyboardInterrupt:
        return 0
    finally:
        if audio is not None:
            audio.stop()
        renderer.exit()


def _center_text(text: str, columns: int) -> str:
    from renderer import display_width as dw
    w = dw(text)
    left = max(0, (columns - w) // 2)
    return (" " * left) + text


if __name__ == "__main__":
    sys.exit(run())
