#!/usr/bin/env python3
"""
CBM Asset Converter
Converts HEIC images to JPEG and renames MP4 files for web use.
Replaces spaces and parentheses in filenames (e.g. IMG (1).heic → IMG-1.jpg).

Requirements:
    pip install pillow-heif Pillow

Usage:
    python convert_images.py
"""

import os
import re
import sys
from pathlib import Path


def web_safe_stem(stem: str) -> str:
    """'IMG_20260501_133014 (1)' → 'IMG_20260501_133014-1'"""
    stem = re.sub(r"\s+\((\d+)\)", r"-\1", stem)
    stem = stem.strip().replace(" ", "_")
    return stem


def check_dependencies() -> bool:
    try:
        from pillow_heif import register_heif_opener  # noqa: F401
        from PIL import Image  # noqa: F401
        return True
    except ImportError:
        print("Missing dependencies. Installing now...")
        import subprocess
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "pillow-heif", "Pillow"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print("Auto-install failed. Please run manually:")
            print("    pip install pillow-heif Pillow")
            return False
        print("Installed successfully.\n")
        return True


def convert_heic_to_jpeg(assets_dir: Path) -> None:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    from PIL import Image

    heic_files = sorted(
        list(assets_dir.glob("*.heic")) + list(assets_dir.glob("*.HEIC"))
    )

    if not heic_files:
        print("No HEIC files found in assets/")
        return

    print(f"Found {len(heic_files)} HEIC images. Converting to JPEG...\n")
    converted = skipped = failed = 0

    for heic_path in heic_files:
        new_stem = web_safe_stem(heic_path.stem)
        jpg_path = assets_dir / f"{new_stem}.jpg"

        if jpg_path.exists():
            print(f"  SKIP   {heic_path.name}")
            skipped += 1
            continue

        try:
            with Image.open(heic_path) as img:
                if img.mode in ("RGBA", "P", "LA", "CMYK"):
                    img = img.convert("RGB")
                img.save(jpg_path, "JPEG", quality=88, optimize=True)
            size_kb = jpg_path.stat().st_size // 1024
            print(f"  OK     {heic_path.name}  →  {jpg_path.name}  ({size_kb} KB)")
            converted += 1
        except Exception as exc:
            print(f"  FAIL   {heic_path.name}: {exc}")
            failed += 1

    print(f"\n  Converted: {converted} | Skipped: {skipped} | Failed: {failed}")


def rename_videos(assets_dir: Path) -> None:
    mp4_files = sorted(assets_dir.glob("*.mp4"))
    needs_rename = [p for p in mp4_files if " " in p.name or "(" in p.name]

    if not needs_rename:
        print("\nAll MP4 files already have web-safe names. No renaming needed.")
        return

    print(f"\nRenaming {len(needs_rename)} MP4 files...\n")
    renamed = skipped = 0

    for mp4_path in needs_rename:
        new_stem = web_safe_stem(mp4_path.stem)
        new_path = assets_dir / f"{new_stem}.mp4"

        if new_path.exists():
            print(f"  SKIP   {mp4_path.name} → {new_path.name} (target exists)")
            skipped += 1
            continue

        mp4_path.rename(new_path)
        print(f"  OK     {mp4_path.name}  →  {new_path.name}")
        renamed += 1

    print(f"\n  Renamed: {renamed} | Skipped: {skipped}")


def print_html_snippet(assets_dir: Path) -> None:
    """Print image filenames ready to paste into HTML src attributes."""
    jpg_files = sorted(assets_dir.glob("IMG_*.jpg"))
    mp4_files = sorted(assets_dir.glob("VID_*.mp4"))

    print(f"\n{'='*60}")
    print(f"Ready to use: {len(jpg_files)} images, {len(mp4_files)} videos")
    print(f"Reference in HTML as:  assets/<filename>")
    print(f"Example: <img src=\"assets/{jpg_files[0].name if jpg_files else 'IMG_XXXXX.jpg'}\" loading=\"lazy\">")
    print(f"{'='*60}")


def main():
    assets_dir = Path(__file__).parent / "assets"

    if not assets_dir.exists():
        print(f"ERROR: assets/ folder not found at {assets_dir}")
        sys.exit(1)

    print("=" * 60)
    print("CBM Asset Converter for Web")
    print("=" * 60)
    print(f"Folder: {assets_dir}\n")

    if not check_dependencies():
        sys.exit(1)

    convert_heic_to_jpeg(assets_dir)
    rename_videos(assets_dir)
    print_html_snippet(assets_dir)

    print("\nDone! Run 'npm start' to preview the website.")


if __name__ == "__main__":
    main()
