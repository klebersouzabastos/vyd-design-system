#!/usr/bin/env python3
"""
VYD Design System — gerador de favicon/ícones.
Deriva todos os PNG/ICO de brand/icons/favicon.svg (que deve refletir o símbolo).

Requisitos:  pip install cairosvg pillow
Uso:         python3 build/make-icons.py   (ou: npm run icons)
"""
import os
from io import BytesIO
import cairosvg
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, "brand", "icons")
SYM = os.path.join(ICONS, "favicon.svg")
CHROME = (13, 17, 23, 255)  # --vyd-bg-chrome / neutral-0  #0D1117


def render(size):
    png = cairosvg.svg2png(url=SYM, output_width=size, output_height=size)
    return Image.open(BytesIO(png)).convert("RGBA")


def app_icon(size, cube_scale=0.62, radius_frac=0.18, rounded=True):
    if rounded:
        base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ImageDraw.Draw(base).rounded_rectangle(
            [0, 0, size - 1, size - 1], radius=int(size * radius_frac), fill=CHROME
        )
    else:
        base = Image.new("RGBA", (size, size), CHROME)
    cs = int(size * cube_scale)
    off = (size - cs) // 2
    base.alpha_composite(render(cs), (off, off))
    return base


def main():
    for s in (16, 32, 48, 64):
        render(s).save(os.path.join(ICONS, f"favicon-{s}.png"))
    render(64).save(os.path.join(ICONS, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    app_icon(180, cube_scale=0.6, rounded=False).save(os.path.join(ICONS, "apple-touch-icon.png"))
    app_icon(192).save(os.path.join(ICONS, "icon-192.png"))
    app_icon(512).save(os.path.join(ICONS, "icon-512.png"))
    app_icon(512, cube_scale=0.52, rounded=False).save(os.path.join(ICONS, "icon-512-maskable.png"))
    print("VYD icons written to brand/icons/")


if __name__ == "__main__":
    main()
