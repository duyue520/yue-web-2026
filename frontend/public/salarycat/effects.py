"""Particle effects system — fireworks, sparkles, and zoom animation helpers."""

from __future__ import annotations

import math
import random
from dataclasses import dataclass

# ──────────────────────────────────────────────
#  Fireworks & Sparkle Particle System
# ──────────────────────────────────────────────

# Unicode sparkle characters arranged roughly by visual weight
SPARKLE_CHARS_LIGHT = ["·", "⋅", "⏺", "◦"]
SPARKLE_CHARS_BRIGHT = ["✦", "✧", "⋆", "✶", "⭑", "★", "✴", "⬥", "◆"]
BURST_CHARS = ["•", "·", "✦", "✧", "⋆", "⭑", "✶", "∗", "∘", "⋅", "⬥"]

FIREWORK_PALETTE: list[tuple[int, int, int]] = [
    (255, 80, 80),     # bright red
    (255, 160, 40),    # orange
    (255, 220, 60),    # gold
    (255, 220, 100),   # warm yellow
    (100, 255, 100),   # neon green
    (60, 200, 255),    # sky blue
    (130, 140, 255),   # periwinkle
    (255, 90, 200),    # hot pink
    (200, 100, 255),   # purple
    (80, 255, 200),    # mint
    (255, 140, 180),   # rose
    (140, 255, 140),   # lime
    (255, 200, 80),    # amber
    (100, 200, 255),   # light blue
    (255, 120, 120),   # coral
    (220, 180, 255),   # lavender
]

# Position-themed palettes for multi-cat mode
LEFT_PALETTE: list[tuple[int, int, int]] = [
    (60, 180, 255),     # sky blue
    (100, 140, 255),    # soft blue
    (80, 200, 255),     # cyan
    (130, 160, 255),    # periwinkle
    (100, 220, 200),    # teal
    (120, 180, 255),    # cornflower
    (60, 200, 220),     # turquoise
    (140, 200, 255),    # light blue
]

CENTER_PALETTE: list[tuple[int, int, int]] = [
    (255, 220, 60),     # gold
    (255, 200, 80),     # amber
    (255, 240, 100),    # bright yellow
    (255, 180, 50),     # warm orange
    (255, 220, 100),    # warm yellow
    (255, 160, 40),     # orange
    (255, 200, 120),    # peach
    (255, 230, 80),     # sunny
]

RIGHT_PALETTE: list[tuple[int, int, int]] = [
    (255, 80, 120),     # rose red
    (255, 100, 180),    # hot pink
    (220, 80, 200),     # magenta
    (255, 120, 160),    # coral pink
    (200, 100, 255),    # purple
    (255, 140, 200),    # light pink
    (255, 90, 150),     # crimson
    (240, 130, 220),    # orchid
]

HEART_PALETTE: list[tuple[int, int, int]] = [
    (255, 100, 130),
    (255, 60, 90),
    (255, 140, 170),
    (255, 180, 200),
    (255, 80, 110),
    (255, 200, 220),
]


@dataclass
class Particle:
    """A single particle in the fireworks system."""

    x: float
    y: float
    vx: float
    vy: float
    life: float
    max_life: float
    color: tuple[int, int, int]
    char: str
    gravity: float = 15.0
    drag: float = 0.0

    @property
    def alpha(self) -> float:
        return max(0.0, min(1.0, self.life / self.max_life))

    @property
    def alive(self) -> bool:
        return self.life > 0


@dataclass
class Rocket:
    """A firework rocket that launches up and then explodes."""

    x: float
    y: float
    target_y: float
    speed: float
    trail_timer: float
    color: tuple[int, int, int]
    exploded: bool = False

    @property
    def alive(self) -> bool:
        return not self.exploded


class FireworksSystem:
    """Manages all particle effects: ambient sparkles, firework bursts, and rocket trails."""

    def __init__(self, columns: int, rows: int) -> None:
        self.columns = columns
        self.rows = rows
        self.particles: list[Particle] = []
        self.rockets: list[Rocket] = []
        self._firework_cooldown: float = 0.0
        self._sparkle_cooldown: float = 0.0
        self._rng = random.Random()

    def resize(self, columns: int, rows: int) -> None:
        self.columns = columns
        self.rows = rows

    def update(self, dt: float) -> None:
        """Advance all particles and spawn new effects as needed."""
        dt = min(dt, 0.1)  # clamp to avoid physics explosion on lag spikes

        # ── Update rockets ──
        for rocket in self.rockets:
            rocket.y -= rocket.speed * dt
            if rocket.y <= rocket.target_y:
                rocket.exploded = True
                self._burst(rocket.x, rocket.y, rocket.color)
            else:
                # spawn trail particle
                rocket.trail_timer -= dt
                if rocket.trail_timer <= 0:
                    rocket.trail_timer = 0.04
                    self.particles.append(
                        Particle(
                            x=rocket.x + self._rng.uniform(-0.3, 0.3),
                            y=rocket.y,
                            vx=self._rng.uniform(-1.5, 1.5),
                            vy=2.0,
                            life=0.5,
                            max_life=0.5,
                            color=_dim_color(rocket.color, 0.8),
                            char=self._rng.choice(["•", "·", "┃", "┆"]),
                            gravity=0.0,
                        )
                    )

        self.rockets = [r for r in self.rockets if not r.exploded]

        # ── Update particles ──
        for p in self.particles:
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.vy += p.gravity * dt
            if p.drag > 0:
                p.vx *= (1.0 - p.drag * dt)
                p.vy *= (1.0 - p.drag * dt)
            p.life -= dt

        self.particles = [p for p in self.particles if p.alive]

        # ── Spawn fireworks periodically ──
        self._firework_cooldown -= dt
        if self._firework_cooldown <= 0:
            margin = max(8, self.columns // 8)
            x = self._rng.uniform(margin, self.columns - margin)
            target_y = self._rng.uniform(self.rows * 0.15, self.rows * 0.55)
            start_y = self.rows - 2
            color = self._rng.choice(FIREWORK_PALETTE)
            self.rockets.append(
                Rocket(
                    x=x,
                    y=start_y,
                    target_y=target_y,
                    speed=self._rng.uniform(12, 22),
                    trail_timer=0.03,
                    color=color,
                )
            )
            self._firework_cooldown = self._rng.uniform(2.0, 5.0)

        # ── Spawn ambient sparkles ──
        self._sparkle_cooldown -= dt
        if self._sparkle_cooldown <= 0:
            count = self._rng.randint(1, 3)
            for _ in range(count):
                x = self._rng.uniform(2, self.columns - 2)
                # sparkles mostly around the center area (where the cat is)
                y = self._rng.uniform(2, self.rows * 0.8)
                color = self._rng.choice(FIREWORK_PALETTE)
                life = self._rng.uniform(0.6, 2.0)
                char = self._rng.choice(SPARKLE_CHARS_BRIGHT if self._rng.random() < 0.4 else SPARKLE_CHARS_LIGHT)
                self.particles.append(
                    Particle(
                        x=x,
                        y=y,
                        vx=self._rng.uniform(-2.5, 2.5),
                        vy=self._rng.uniform(-7, -1.5),
                        life=life,
                        max_life=life,
                        color=color,
                        char=char,
                        gravity=3.0,
                        drag=1.5,
                    )
                )
            self._sparkle_cooldown = self._rng.uniform(0.08, 0.25)

    def _burst(self, x: float, y: float, color: tuple[int, int, int]) -> None:
        """Create an explosion burst of particles."""
        burst_type = self._rng.random()

        if burst_type < 0.08:
            # Heart-shaped burst
            self._burst_heart(x, y)
        elif burst_type < 0.25:
            # Double ring burst
            self._burst_ring(x, y, color, 18, 6, 14)
            self._burst_ring(x, y, _dim_color(color, 0.7), 12, 3, 8)
        elif burst_type < 0.5:
            # Ring + center fill
            self._burst_ring(x, y, color, 22, 7, 18)
            self._burst_fill(x, y, color, 8)
        else:
            # Classic sphere burst
            self._burst_sphere(x, y, color, self._rng.randint(30, 55))

    def _burst_ring(self, x: float, y: float, color: tuple[int, int, int], count: int, speed_min: float, speed_max: float) -> None:
        for i in range(count):
            angle = (i / count) * 2 * math.pi + self._rng.uniform(-0.1, 0.1)
            speed = self._rng.uniform(speed_min, speed_max)
            life = self._rng.uniform(1.0, 2.2)
            self.particles.append(
                Particle(
                    x=x, y=y,
                    vx=math.cos(angle) * speed,
                    vy=math.sin(angle) * speed - 3,
                    life=life,
                    max_life=life,
                    color=color,
                    char=self._rng.choice(BURST_CHARS[:6]),
                    gravity=12.0,
                    drag=0.3,
                )
            )

    def _burst_sphere(self, x: float, y: float, color: tuple[int, int, int], count: int) -> None:
        for _ in range(count):
            # random direction with spherical distribution
            theta = self._rng.uniform(0, 2 * math.pi)
            phi = self._rng.uniform(-math.pi / 2, math.pi / 2)
            speed = self._rng.uniform(5, 22) * math.cos(phi)
            life = self._rng.uniform(0.8, 2.0)
            self.particles.append(
                Particle(
                    x=x, y=y,
                    vx=math.cos(theta) * speed,
                    vy=math.sin(theta) * speed - self._rng.uniform(0, 5),
                    life=life,
                    max_life=life,
                    color=color if self._rng.random() < 0.7 else _dim_color(color, self._rng.uniform(0.5, 0.9)),
                    char=self._rng.choice(BURST_CHARS),
                    gravity=14.0,
                    drag=0.4,
                )
            )

    def _burst_fill(self, x: float, y: float, color: tuple[int, int, int], count: int) -> None:
        for _ in range(count):
            life = self._rng.uniform(0.4, 1.0)
            self.particles.append(
                Particle(
                    x=x + self._rng.uniform(-2, 2),
                    y=y + self._rng.uniform(-1, 1),
                    vx=self._rng.uniform(-3, 3),
                    vy=self._rng.uniform(-5, 1),
                    life=life,
                    max_life=life,
                    color=color,
                    char=self._rng.choice(["·", "•", "∘"]),
                    gravity=5.0,
                    drag=2.0,
                )
            )

    def _burst_heart(self, x: float, y: float) -> None:
        """Create a heart-shaped burst (special effect)."""
        color = self._rng.choice(HEART_PALETTE)
        count = self._rng.randint(30, 50)
        for i in range(count):
            t = (i / count) * 2 * math.pi
            # Parametric heart curve
            hx = 16 * math.sin(t) ** 3
            hy = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
            speed = 0.55
            life = self._rng.uniform(1.2, 2.5)
            self.particles.append(
                Particle(
                    x=x, y=y,
                    vx=hx * speed + self._rng.uniform(-1, 1),
                    vy=-hy * speed + self._rng.uniform(-1, 1),
                    life=life,
                    max_life=life,
                    color=color if self._rng.random() < 0.6 else _dim_color(color, self._rng.uniform(0.5, 0.8)),
                    char=self._rng.choice(["*", "+", "·", "✦", "✧"]),
                    gravity=6.0,
                    drag=0.2,
                )
            )

    def collect_visible_particles(self) -> list[tuple[int, int, str, tuple[int, int, int]]]:
        """Return (row, col, char, color) for each particle visible within terminal bounds."""
        result: list[tuple[int, int, str, tuple[int, int, int]]] = []
        for p in self.particles:
            col = int(p.x)
            row = int(p.y)
            if 0 <= col < self.columns and 0 <= row < self.rows - 1:
                alpha = p.alpha
                faded = tuple(max(0, min(255, int(c * (0.3 + 0.7 * alpha)))) for c in p.color)
                result.append((row, col, p.char, faded))
        return result

    def spawn_zone_sparkles(
        self,
        dt: float,
        zone_left: float,
        zone_right: float,
        palette: list[tuple[int, int, int]],
        rate: float = 0.15,
    ) -> None:
        """Spawn ambient sparkles constrained to a horizontal zone [zone_left, zone_right)."""
        self._zone_cooldowns = getattr(self, "_zone_cooldowns", {})
        key = (zone_left, zone_right)
        cd = self._zone_cooldowns.get(key, 0.0)
        cd -= dt
        if cd <= 0:
            count = self._rng.randint(1, 2)
            for _ in range(count):
                x = self._rng.uniform(zone_left + 1, zone_right - 1)
                y = self._rng.uniform(2, self.rows * 0.75)
                color = self._rng.choice(palette)
                life = self._rng.uniform(0.6, 1.8)
                char = self._rng.choice(SPARKLE_CHARS_BRIGHT if self._rng.random() < 0.35 else SPARKLE_CHARS_LIGHT)
                self.particles.append(
                    Particle(
                        x=x, y=y,
                        vx=self._rng.uniform(-2, 2),
                        vy=self._rng.uniform(-6, -1),
                        life=life, max_life=life,
                        color=color, char=char,
                        gravity=3.0, drag=1.5,
                    )
                )
            cd = self._rng.uniform(rate * 0.5, rate * 1.5)
        self._zone_cooldowns[key] = cd

    def spawn_zone_firework(
        self,
        dt: float,
        zone_left: float,
        zone_right: float,
        palette: list[tuple[int, int, int]],
    ) -> None:
        """Spawn a firework rocket constrained to a horizontal zone."""
        self._fw_cooldowns = getattr(self, "_fw_cooldowns", {})
        key = (zone_left, zone_right)
        cd = self._fw_cooldowns.get(key, 0.0)
        cd -= dt
        if cd <= 0:
            x = self._rng.uniform(zone_left + 2, zone_right - 2)
            target_y = self._rng.uniform(self.rows * 0.12, self.rows * 0.45)
            start_y = self.rows - 2
            color = self._rng.choice(palette)
            self.rockets.append(
                Rocket(
                    x=x, y=start_y,
                    target_y=target_y,
                    speed=self._rng.uniform(10, 20),
                    trail_timer=0.03,
                    color=color,
                )
            )
            cd = self._rng.uniform(3.0, 6.0)
        self._fw_cooldowns[key] = cd


# ──────────────────────────────────────────────
#  Utility helpers
# ──────────────────────────────────────────────

def _dim_color(color: tuple[int, int, int], factor: float) -> tuple[int, int, int]:
    return tuple(max(0, min(255, int(c * factor))) for c in color)
