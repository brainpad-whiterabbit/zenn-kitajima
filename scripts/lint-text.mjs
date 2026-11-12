// articles/ の記事を textlint で検査する。
// textlint は対象ファイルが 1 つもないとエラーで終わるため、記事がないときは検査せずに成功で終える。
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";

const files = readdirSync("articles")
  .filter((name) => name.endsWith(".md"))
  .map((name) => `articles/${name}`);

if (files.length === 0) {
  console.log("textlint: articles/ に記事がないため検査を省きます");
  process.exit(0);
}

const result = spawnSync("textlint", files, { stdio: "inherit" });
if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
