"""Rebuild selected legacy Markdown content from the sibling Docusaurus checkout.

Run from the repository root: python3 scripts/migrate_legacy.py
The source checkout is read only; generated MDX and referenced images live here.
"""

from __future__ import annotations

import json
import csv
import re
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "noShellAccess.com-main-blog"
STATIC = SOURCE / "static"

POSTS = [
    ("appsecurity/2021-08-26-welcome/2020-05-09-looking-for-js-gems.md", "looking-for-js-gems", "2020-05-09", "Finding secrets and overlooked details in JavaScript files with Dumpster Diver.", "tutorial", ["application-security", "tools-automation"]),
    ("appsecurity/2021-08-26-welcome/2021-01-11-auth-checks-made-easy.md", "auth-checks-made-easy", "2021-01-11", "A practical workflow for testing authorization boundaries with browser containers and proxy tools.", "tutorial", ["application-security"]),
    ("appsecurity/2021-08-26-welcome/2021-01-17-CSV-formula-injection.md", "csv-formula-injection", "2021-01-17", "Tracing how spreadsheet formulas can be injected through exported CSV data.", "tutorial", ["application-security"]),
    ("appsecurity/2021-08-26-welcome/2021-11-28-long-Lived-JWT.md", "long-lived-jwt", "2021-11-28", "Why long-lived access tokens increase exposure and how expiration, revocation, and rotation change the tradeoffs.", "essay", ["application-security"]),
    ("containersecurity/2024-04-12-guide-admission-controllers.md", "guide-admission-controllers", "2024-04-12", "A visual guide to Kubernetes admission controllers and where they sit in the API request path.", "tutorial", ["containers-kubernetes"]),
    ("containersecurity/2024-04-12-informer-controllers.md", "informer-controllers", "2024-04-12", "How Kubernetes informers and custom controllers watch resources and reconcile desired state.", "tutorial", ["containers-kubernetes", "engineering"]),
]

BOOKS = [
    ("same-origin-policy", "docs/AppSec/sameOriginPolicy", {"toc.md", "Online.md"}),
    ("kubernetes-101", "docs/Kubernetes/Kubernetes101", set()),
]

IMAGE_RE = re.compile(r"!\[([^\]]*)\]\((/img/[^)]+)\)")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\s*\n", re.S)


def frontmatter(source: str) -> tuple[dict[str, str], str]:
    match = FRONTMATTER_RE.match(source)
    if not match:
        raise ValueError("Missing source frontmatter")
    fields = dict(re.findall(r"^([a-z_]+):\s*(.*)$", match.group(1), re.M))
    return fields, source[match.end():]


def clean_body(body: str, title: str) -> tuple[str, list[str]]:
    assets: list[str] = []
    body = body.replace("<!--more-->", "")
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = re.sub(r"^```JS\s*$", "```js", body, flags=re.M)
    # The old page injected an executable third-party gist. Preserve the source
    # reference as a normal link, without executing it in the reader.
    body = re.sub(
        r'<script src="(https://gist\.github\.com/[^\"]+)\.js"></script>',
        r"[Read the original example on GitHub](\1)", body,
    )
    body = body.replace(
        "https://noshellaccess.com/docs/Kubernetes/Kubernetes101/k8s-declarative-method",
        "/books/kubernetes-101/k8s-declarative-method",
    )
    body = body.replace(
        "https://blog.rootrwx.com/post/2020-07-31-devtool-security-assessments/",
        "[DevTools security assessments](/blog/devtools)",
    )
    figure_number = 0

    def replace_image(match: re.Match[str]) -> str:
        nonlocal figure_number
        figure_number += 1
        alt, url = match.groups()
        file = STATIC / url.lstrip("/")
        if not file.is_file():
            raise FileNotFoundError(f"Missing image: {file}")
        destination = ROOT / "public" / url.lstrip("/")
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, destination)
        with Image.open(file) as image:
            width, height = image.size
        assets.append(url)
        label = alt if alt and not re.fullmatch(r"[0-9a-f-]+\.(png|jpg|jpeg)", alt, re.I) else f"{title}, figure {figure_number}"
        return f'<Figure src={json.dumps(url)} alt={json.dumps(label)} width={{{width}}} height={{{height}}} />'

    body = IMAGE_RE.sub(replace_image, body)
    body = re.sub(r"(<Figure [^\n]+ />)(?=\S)", r"\1\n\n", body)
    body = re.sub(r"\n{4,}", "\n\n\n", body)
    return body.strip() + "\n", assets


def write_post(row: tuple) -> dict[str, str | int]:
    path, slug, date, description, kind, tags = row
    raw = (SOURCE / path).read_text()
    fields, body = frontmatter(raw)
    title = fields["title"].strip().strip('"')
    if slug == "informer-controllers":
        body = re.sub(r"^# ", "## ", body, flags=re.M)
    body, assets = clean_body(body, title)
    out = ROOT / "content/blog" / f"{slug}.mdx"
    meta = {
        "title": title, "description": description, "slug": slug,
        "date": date, "author": "Pankaj Mouriya", "draft": False,
        "kind": kind, "tags": tags,
        "security": {"status": "historical"},
    }
    out.write_text("---\n" + "\n".join(f"{key}: {json.dumps(value)}" for key, value in meta.items()) + "\n---\n\n" + body)
    old_slug = fields["slug"].strip()
    if " " in old_slug:
        old_slug = slug  # Legacy CSV frontmatter had spaces; indexed path is normalized.
    return {"source": path, "old_url": "/" + ("appsecurity" if path.startswith("appsecurity/") else "containersecurity") + "/" + old_slug, "new_url": "/blog/" + slug, "status": "migrated", "images": len(assets)}


def write_book(book: str, folder: str, excluded: set[str]) -> list[dict[str, str | int]]:
    records = []
    for path in sorted((SOURCE / folder).glob("*.md")):
        if path.name in excluded:
            continue
        fields, body = frontmatter(path.read_text())
        slug = re.sub(r"^\d+-", "", path.stem).lower()
        title = fields["title"].strip().strip('"')
        order = int(fields["sidebar_position"])
        if book == "same-origin-policy" and order > 2:
            order -= 1  # Legacy toc.md occupied position 2; reader navigation replaces it.
        if book == "same-origin-policy" and path.stem in {"References", "postmessage"}:
            order = 14 if path.stem == "References" else 13
        body, assets = clean_body(body, title)
        meta = {
            "title": title, "description": f"{title} in Pankaj Mouriya's {('Same Origin Policy' if book == 'same-origin-policy' else 'Kubernetes 101')} guide.",
            "slug": slug, "book": book, "order": order, "draft": False,
        }
        output = ROOT / "content/books" / book / f"{slug}.mdx"
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text("---\n" + "\n".join(f"{key}: {json.dumps(value)}" for key, value in meta.items()) + "\n---\n\n" + body)
        old_slug = re.sub(r"^\d+-", "", path.stem)
        old_url = "/docs/sop/" + slug if book == "same-origin-policy" else "/" + folder + "/" + old_slug
        records.append({"source": str(path.relative_to(SOURCE)), "old_url": old_url, "new_url": "/books/" + book + "/" + slug, "status": "migrated", "images": len(assets)})
    return records


def main() -> None:
    records = [{"source": "appsecurity/2021-08-26-welcome/2021-07-07-devtools.md", "old_url": "/appsecurity/devtools", "new_url": "/blog/devtools", "status": "migrated-earlier", "images": 14}]
    records.extend(write_post(row) for row in POSTS)
    for book, folder, excluded in BOOKS:
        records.extend(write_book(book, folder, excluded))
        for filename in sorted(excluded):
            old_url = "/docs/sop/" + Path(filename).stem.lower() if book == "same-origin-policy" else "/" + folder + "/" + Path(filename).stem
            records.append({"source": f"{folder}/{filename}", "old_url": old_url, "new_url": "/books/" + book, "status": "redirected to book index", "images": 0})
    output = ROOT / "docs/migration/legacy-route-map.json"
    output.write_text(json.dumps(records, indent=2) + "\n")
    with (ROOT / "docs/migration/legacy-inventory.csv").open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=["source_path", "old_url", "new_url", "status", "heading_count", "image_count", "code_fence_count", "notes"], lineterminator="\n")
        writer.writeheader()
        for record in records:
            raw = (SOURCE / record["source"]).read_text()
            writer.writerow({
                "source_path": record["source"], "old_url": record["old_url"],
                "new_url": record["new_url"], "status": record["status"],
                "heading_count": len(re.findall(r"^#{1,6} ", raw, re.M)),
                "image_count": record["images"],
                "code_fence_count": len(re.findall(r"^```", raw, re.M)) // 2,
                "notes": "historical edition; source body and local figures preserved" if record["status"].startswith("migrated") else "utility page replaced by book navigation",
            })
    print(f"Migrated {len(POSTS)} articles and {sum(row['status'] == 'migrated' and row['new_url'].startswith('/books/') for row in records)} book chapters; copied {sum(row['images'] for row in records if row['status'] == 'migrated')} image references")


if __name__ == "__main__":
    main()
