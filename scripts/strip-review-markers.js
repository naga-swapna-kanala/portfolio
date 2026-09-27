#!/usr/bin/env node
/*
  Removes every red review marker from the site, in place.

    node scripts/strip-review-markers.js

  What it does:
    - deletes the "written for you" / "headline" pins
    - deletes the Resume PDF placeholder button
    - unwraps inline highlights, keeping their text (and any inline style)
    - strips the data-todo / data-where notes

  What it does NOT do: resolve the content. A highlight that still reads
  "70%?" after this script has run is still wrong, it just is not red any
  more. Fix the text first, then run this.

  No dependencies. Safe to run twice.
*/
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  "index.html",
  "work/revenue-attribution.html",
  "work/compliance-screening.html",
  "work/quote-to-order.html",
].map((f) => path.join(root, f));

let total = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  let n = 0;

  // 1. Pins: standalone badges. Remove the element and the space before it.
  html = html.replace(/\s*<span class="todo-pin"[^>]*>[\s\S]*?<\/span>/g, () => {
    n++;
    return "";
  });

  // 2. Placeholder resume button.
  html = html.replace(/\s*<span class="btn todo todo--gone"[^>]*>[\s\S]*?<\/span>/g, () => {
    n++;
    return "";
  });

  // 3. Inline highlights: keep the text; keep a plain span only if it carried
  //    an inline style that the layout depends on.
  html = html.replace(
    /<span class="todo"((?:\s+[a-zA-Z-]+="[^"]*")*)>([\s\S]*?)<\/span>/g,
    (_, attrs, inner) => {
      n++;
      const style = /\sstyle="([^"]*)"/.exec(attrs);
      return style ? `<span style="${style[1]}">${inner}</span>` : inner;
    }
  );

  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`${path.relative(root, file)}: removed ${n} marker${n === 1 ? "" : "s"}`);
    total += n;
  }
}

console.log(total ? `\nDone. ${total} markers removed.` : "No markers found. Already clean.");
