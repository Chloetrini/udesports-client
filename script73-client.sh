#!/usr/bin/env bash
set -e

REPO_DIR="udesports-client"
if [ ! -f "src/App.tsx" ] && [ -d "$REPO_DIR" ]; then
  cd "$REPO_DIR"
fi
if [ ! -f "src/App.tsx" ]; then
  echo "ABORT: run this from inside your udesports-client repo (or its parent folder)."
  exit 1
fi

python3 - << 'PYEOF'
import sys

path = "src/components/home/ArticleSection.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

MARKER = "lg:pl-[calc((100vw-1280px)/2+20px)]"
if MARKER in content:
    print("  SKIP  " + path + " (already matches the Instagram Archive / Featured Players carousel pattern)")
    sys.exit(0)

OLD = """    <PageWrapper className="p-[20px] mb-11">
      {/* Header */}
      {Header}

      {/* Article Cards — same auto-scrolling embla carousel as the home
          page's Featured Players and Instagram Archive sections: loops
          through the real article list (no duplicated cards), pauses on
          hover. */}
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="w-full -mx-5 px-5"
      >
        <CarouselContent className="ml-0 gap-6 md:gap-8 mb-5">"""

NEW = """    <div className="mb-11">
      <PageWrapper className="p-[20px]">
        {/* Header */}
        {Header}
      </PageWrapper>

      {/* Article Cards — same auto-scrolling embla carousel as the home
          page's Featured Players and Instagram Archive sections: loops
          through the real article list (no duplicated cards), pauses on
          hover. Previously this carousel lived directly inside PageWrapper
          (a "container mx-auto" with its own max-width) and only canceled
          its own local padding with -mx-5/px-5 — it never actually broke out
          of that max-width the way the other two carousels do, so on wider
          screens it stayed boxed in with visible padding on the right
          instead of bleeding to the viewport edge like Instagram Archive
          and Featured Players. Moving it outside PageWrapper and using the
          same lg:mr-[calc((100vw-100%)/-2)] breakout, with the same
          pl-[20px] / lg:pl-[calc((100vw-1280px)/2+20px)] content padding
          Instagram Archive uses, makes it match exactly. */}
      <div className="w-full lg:mr-[calc((100vw-100%)/-2)]">
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent className="ml-0 pl-[20px] lg:pl-[calc((100vw-1280px)/2+20px)] gap-6 md:gap-8 mb-5">"""

if content.count(OLD) != 1:
    print("  ABORT: could not find a unique carousel wrapper block in " + path + " — check it manually.")
    sys.exit(1)
content = content.replace(OLD, NEW, 1)

OLD_CLOSE = """        </CarouselContent>
      </Carousel>
    </PageWrapper>
  );
};"""

NEW_CLOSE = """          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};"""

if content.count(OLD_CLOSE) != 1:
    print("  ABORT: could not find a unique closing block in " + path + " — check it manually.")
    sys.exit(1)
content = content.replace(OLD_CLOSE, NEW_CLOSE, 1)

# The CarouselItem/article-card block in between the two edited regions is
# now nested two spaces deeper under its new parents; reindent it to match
# (purely cosmetic — JSX doesn't care — but keeps the file readable).
MARK_START = content.index(NEW) + len(NEW)
MARK_END = content.index("          </CarouselContent>")
middle = content[MARK_START:MARK_END]
reindented = "\n".join(("  " + line if line.strip() else line) for line in middle.split("\n"))
content = content[:MARK_START] + reindented + content[MARK_END:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("  OK    " + path + " (news carousel now bleeds to the edge and aligns exactly like Instagram Archive / Featured Players)")
PYEOF

echo ""
echo "Next: verify with"
echo "  npx tsc -p tsconfig.app.json --noEmit && npx eslint . && npm run build"
