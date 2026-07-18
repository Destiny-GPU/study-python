"""Render the social-share cover image (og:image) for the docs site.

Source: docs/scripts/social-card.svg (dark tech style, 1200x630).
WeChat / Open Graph need a raster image, so we render the SVG to JPG
with cairosvg. SVG keeps the layout precise and version-controlled.

Run:  uv run python docs/scripts/generate_social_card.py
Output: docs/static/img/docusaurus-social-card.jpg
"""

import pathlib

import cairosvg

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "social-card.svg"
OUT = HERE.parent / "static" / "img" / "docusaurus-social-card.jpg"


def main() -> None:
    cairosvg.svg2png(
        url=str(SRC),
        write_to=str(OUT.with_suffix(".png")),
        output_width=1200,
        output_height=630,
        background_color="white",
    )
    # Convert PNG -> JPG (cairosvg emits PNG; WeChat OG accepts jpg/png).
    from PIL import Image

    Image.open(OUT.with_suffix(".png")).convert("RGB").save(OUT, "JPEG", quality=92)
    OUT.with_suffix(".png").unlink()
    print(f"wrote {OUT} (1200x630)")


if __name__ == "__main__":
    main()
