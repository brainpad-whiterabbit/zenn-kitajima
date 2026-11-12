// 日付付きの slug（YYYYMMDD-<topic>）で、Publication（brainpad）を指定した下書きの記事を作る。
// 使い方: npm run new:article -- <topic>
// articles/<slug>.md と、記事の画像を置く images/<slug>/（コミットできるよう .gitkeep 入り）を作る。
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Zenn の slug の制約（a-z、0-9、-、_ だけで 12〜50 文字）
const SLUG_PATTERN = /^[a-z0-9_-]{12,50}$/;

const fail = (message) => {
  console.error(`new:article: ${message}`);
  process.exit(1);
};

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === "") {
  fail("topic を 1 つ指定してください（例: npm run new:article -- zenn-setup）");
}
const topic = args[0];

const now = new Date();
const date = [
  String(now.getFullYear()),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("");
const slug = `${date}-${topic}`;

if (!SLUG_PATTERN.test(slug)) {
  fail(
    `slug "${slug}" は Zenn の制約（a-z、0-9、-、_ だけで 12〜50 文字）を満たしません。` +
      `topic は ${12 - date.length - 1}〜${50 - date.length - 1} 文字で、a-z、0-9、-、_ だけを使ってください`,
  );
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const articlePath = join(root, "articles", `${slug}.md`);
const imagesDir = join(root, "images", slug);

const content = `---
title: "記事のタイトル"
emoji: "📝"
type: "tech"
topics: []
published: false
publication_name: "brainpad"
---

## はじめに

ここに本文を書きます。
`;

try {
  // 既にある記事は上書きしない（wx は既存ファイルがあると EEXIST で失敗する）
  writeFileSync(articlePath, content, { flag: "wx" });
} catch (error) {
  if (error.code === "EEXIST") {
    fail(`articles/${slug}.md は既にあります`);
  }
  throw error;
}

mkdirSync(imagesDir, { recursive: true });
writeFileSync(join(imagesDir, ".gitkeep"), "");

console.log(`articles/${slug}.md と images/${slug}/ を作りました`);
