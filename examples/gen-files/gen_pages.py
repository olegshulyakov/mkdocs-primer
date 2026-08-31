"""Write a small section of pages that has no counterpart on disk."""

import mkdocs_gen_files

SECTIONS = {
    "one": "The first generated page.",
    "two": "The second generated page.",
    "three": "The third generated page.",
}

with mkdocs_gen_files.open("generated/index.md", "w") as fd:
    print("# Generated", file=fd)
    print("", file=fd)
    print(
        "This page and the ones below it were written during the build. "
        "Nothing under `generated/` exists in `docs/`.",
        file=fd,
    )

for name, body in SECTIONS.items():
    with mkdocs_gen_files.open(f"generated/{name}.md", "w") as fd:
        print(f"# Page {name}", file=fd)
        print("", file=fd)
        print(body, file=fd)
