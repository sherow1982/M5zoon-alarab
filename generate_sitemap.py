#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import pathlib
import json
import subprocess
from datetime import datetime, timezone
from urllib.parse import urljoin, quote
from xml.etree.ElementTree import Element, SubElement, ElementTree
from xml.dom import minidom

PRODUCTS_DIR = pathlib.Path("products")
SITEMAP_FILE = pathlib.Path("sitemap-products.xml")
SITEMAP_PREFIX = "sitemap-products"   # for chunked files like sitemap-products-1.xml
MAX_URLS_PER_SITEMAP = 50000          # per protocol
# Note: keep total uncompressed file size <= 50MB per sitemap

def git_last_commit_iso(path: pathlib.Path) -> str:
    """Return last commit time in ISO-8601 with timezone, else file mtime in UTC."""
    try:
        ts = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", str(path)],
            text=True
        ).strip()
        if ts:
            return ts
    except Exception:
        pass
    dt = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).replace(microsecond=0)
    return dt.isoformat()

def ensure_trailing_slash(u: str) -> str:
    return u if u.endswith("/") else u + "/"

def build_url(base_url: str, products_dir: pathlib.Path, file_path: pathlib.Path) -> str:
    rel_path = file_path.relative_to(products_dir).as_posix()
    rel_url = quote(rel_path, safe="/-_.~")
    return urljoin(ensure_trailing_slash(base_url), rel_url)

def prettify_xml(elem: Element) -> bytes:
    import io
    rough = ElementTree(elem)
    buf = io.BytesIO()
    rough.write(buf, encoding="utf-8", xml_declaration=True)
    return minidom.parseString(buf.getvalue()).toprettyxml(indent="  ", encoding="utf-8")

def iter_product_files(root: pathlib.Path):
    return sorted(root.rglob("*.html"))

def write_sitemap(url_items: list[tuple[str, str]], outfile: pathlib.Path):
    urlset = Element("urlset", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    for loc, lastmod in url_items:
        url = SubElement(urlset, "url")
        SubElement(url, "loc").text = loc
        SubElement(url, "lastmod").text = lastmod
    outfile.write_bytes(prettify_xml(urlset))

def write_sitemap_index(files: list[str], outfile: pathlib.Path):
    idx = Element("sitemapindex", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    for loc in files:
        sm = SubElement(idx, "sitemap")
        SubElement(sm, "loc").text = loc
        # lastmod optional for index; omitted for simplicity
    outfile.write_bytes(prettify_xml(idx))

def get_base_url_from_config():
    """Reads the base_url from seo_config.json."""
    config_path = pathlib.Path(__file__).parent / "seo_config.json"
    if not config_path.exists():
        print(f"Error: Config file not found at {config_path}", file=sys.stderr)
        sys.exit(1)
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    return config.get("base_url")

def main():
    base_url = get_base_url_from_config()
    products_url = urljoin(ensure_trailing_slash(base_url), "products/")
    if not PRODUCTS_DIR.exists():
        print("Missing products/ directory", file=sys.stderr)
        sys.exit(1)

    # Collect URLs
    items = []
    for f in iter_product_files(PRODUCTS_DIR):
        loc = build_url(products_url, PRODUCTS_DIR, f)
        lastmod = git_last_commit_iso(f)
        items.append((loc, lastmod))

    count = len(items)
    if count == 0:
        print("No product HTML files found under products/", file=sys.stderr)
        sys.exit(0)

    # Chunk if needed
    if count > MAX_URLS_PER_SITEMAP:
        # write parts: sitemap-products-1.xml, -2.xml, ...
        part_files_web = []
        for i in range(0, count, MAX_URLS_PER_SITEMAP):
            chunk = items[i:i + MAX_URLS_PER_SITEMAP]
            part_idx = i // MAX_URLS_PER_SITEMAP + 1
            part_name = f"{SITEMAP_PREFIX}-{part_idx}.xml"
            part_path = pathlib.Path(part_name)
            write_sitemap(chunk, part_path)
            # The web location of the part file is at the project root
            part_files_web.append(urljoin(base_url, part_name))
        # Create sitemap index
        write_sitemap_index(part_files_web, pathlib.Path("sitemap-index.xml"))
        print(f"Wrote {len(part_files_web)} sitemap parts and sitemap-index.xml")
    else:
        write_sitemap(items, SITEMAP_FILE)
        print(f"Wrote {count} URLs to {SITEMAP_FILE}")

if __name__ == "__main__":
    main()
