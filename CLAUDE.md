# CLAUDE.md

AI エージェント向けのルールです。リポジトリの構成、slug 規則、画像の置き場、コマンド、lint の注意点は [README.md](README.md) を参照してください。ここでは README と重複させません。

## 基本ルール

- コマンドは `mise run <task>` で実行します（`install` / `preview` / `new` / `lint`）。npm scripts を直接の入口にしません
- 記事は `mise run new -- <topic>` で作ります（slug、Publication、`published: false` が入ります）
- worktree のフォルダ名やブランチ名に `mise-tasks` を含めません（mise 2026.11 がそのディレクトリをタスクのディレクトリとして扱い、動かなくなります）

## AI は published を true にしない

AI は `published: false` の記事だけを扱います。`published` を `true` にするのは人で、記事の「公開」チケットで行います。AI が `published: true` に変える変更をコミットしたり PR に含めたりしてはいけません。

## dg（deguboard）の運用

- チケットを起票するときは `--workflow software-development` を付けます。プロジェクトの既定の `general` は squash マージを検出しないため、チケットが自動で閉じません
- マージは squash だけです（GitHub で squash だけを許可し、マージ後のブランチは自動で削除されます）。マージは `dg pr merge` で行います
- 品質ゲートの check（actions.test）は `mise run lint` です

### 記事チケットの方針

- Epic は 1 記事につき 1 つ作ります。タイトルは「記事: <テーマ>」とし、説明には slug、想定読者、読後のゴールを書きます
- チケットは PR 1 本で終わる工程ごとに切ります。工程は「構成案」「本文の執筆」「サンプルコードや図の作成と動作確認」「レビューの反映」「公開」です。規模に応じて統合や分割をしてかまいません
- 公開チケットは人が担当し、ほかの工程すべてに depends_on します。公開チケットで `published` を `true` にして main にマージします
- 記事を跨ぐ作業（lint の設定、テンプレート、README など）は記事の Epic に入れません

## リリース手順

dgrelease はこの節に従います。

- 記事の公開は記事ごとに、その記事の公開チケットで行います（`published: true` の PR を main にマージすると、Zenn の GitHub 連携で公開されます）
- Iteration の release では追加のリリース作業はありません。バージョン、タグ、CHANGELOG は作りません。Iteration のチケットがすべて done になっていることを確かめて、Iteration を閉じるだけです
