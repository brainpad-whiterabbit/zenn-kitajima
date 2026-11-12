# zenn-kitajima

会社の Zenn Publication「[brainpad](https://zenn.dev/p/brainpad)」に載せる記事のリポジトリです。Zenn の GitHub 連携で main ブランチと同期しており、main にマージした記事が Zenn に反映されます。

## 構成

```text
articles/           記事（articles/<slug>.md）
images/<slug>/      記事ごとの画像
scripts/            mise タスクから呼ぶスクリプト（記事の作成、textlint の実行）
.mise.toml          Node のバージョンとコマンド（mise タスク）
.textlintrc.yml     textlint の設定
.markdownlint-cli2.jsonc  markdownlint の設定
.github/workflows/  PR と main への push で lint を実行する CI
.claude/skills/yomiyasu/  記事の日本語を推敲する Claude Code のスキル（外部のもの）
```

`books/`（本）はまだ使っていません。

## セットアップ

1. [mise](https://mise.jdx.dev/) を入れます
2. リポジトリで次を実行します

```sh
mise trust          # .mise.toml を信頼する
mise install        # .mise.toml の Node（24 LTS）を入れる
mise run install    # 依存パッケージを package-lock.json のとおりに入れる
```

Node は 24 LTS に固定しています（Node 26 はホストに libatomic1 が必要なため）。

コマンドはすべて mise タスクから実行します。一覧は `mise tasks` で見られます。

## 記事を書く

### 新しい記事を作る

```sh
mise run new -- <topic>
```

`articles/<slug>.md` と画像用の `images/<slug>/` ができます。

- slug は `YYYYMMDD-<topic>`（作成日 + topic）です。例: `20261112-zenn-setup`
- slug に使える文字は a-z、0-9、`-`、`_` で、全体で 12〜50 文字です（topic は 3〜41 文字）
- frontmatter には `publication_name: "brainpad"` と `published: false` が入ります。`published: false` のまま main にマージしても公開されません

### 画像

画像は `images/<slug>/` に置き、記事からは `/images/<slug>/xxx.png` のように絶対パスで参照します。

```md
![説明](/images/20261112-zenn-setup/screenshot.png)
```

### プレビュー

```sh
mise run preview
```

http://localhost:8000 で記事をブラウザで確認できます。

## lint

```sh
mise run lint
```

`articles/` 直下の記事を textlint（preset-ja-technical-writing）と markdownlint で検査します。PR と main への push では CI（GitHub Actions）でも同じコマンドが実行されます。

### Zenn 記法の注意点

- `:::message` や `:::details` の行は、textlint の ja-no-mixed-period が「句点がない」と誤検出するため、textlint の対象から外しています
  - 開きの行（`:::details タイトル` など）は常に除外します。そのため `:::details` のタイトルは textlint で検査されません
  - 閉じの `:::` は、直前の行が「。」か数式の `$$` で終わるときだけ除外します。句点のない文の直後の閉じは除外しないため、句点の抜けは報告されます
- `:::` ブロックの中でも、コードブロックとリストの前後には空行を入れます（markdownlint の MD031 / MD032）
- 行に URL だけを書くと Zenn がリンクカードとして埋め込むため、裸の URL を許可しています（MD034 を無効化）

## スキル

記事の日本語は、Claude Code のスキル [yomiyasu](https://github.com/nanaism/yomiyasu)（MIT ライセンス。`.claude/skills/yomiyasu/LICENSE`）で推敲します。clone すれば同じスキルが使えます。Claude Code で `/yomiyasu` と頼むと、AI っぽい言い回しを意味を変えずに直し、付属の Python スクリプト（`python3` が必要）で検査します。

- 入れている版: v3.1.0（コミット `db78b9bc5e868549b517a037df7a4d1c93edac23`）
- 検査の記録は `.yomiyasu/` にでき、git には入りません

更新は次のコマンドで行います。mise タスクではない一度きりのツールの実行なので、`mise exec` で mise の Node を使って `npx` を直接呼びます。上流の既定ブランチの最新が入ります。`skills` の CLI は利用統計を送ることがあるため、環境変数で切って実行します。

```sh
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 mise exec -- npx skills@1.8.1 add nanaism/yomiyasu --agent claude-code -y
```

更新したら、差分（とくに `scripts/` と SKILL.md の `allowed-tools`）を読んで外部への送信や危険な処理がないことを確かめ、上の版とコミットを書き換えてからコミットします。コマンドが作る `skills-lock.json` は git に入りません。

`mise run lint`（textlint）は、箇条書きの文末を「である」調にするよう求めます。yomiyasu は文体を原文のままにするため、敬体の箇条書きは推敲のあとも lint で報告されます。そのときは箇条書きの文末を常体にそろえます。

## 公開

記事の公開は人が行います。`published` を `true` にした PR を main にマージすると、Zenn の GitHub 連携で記事が公開されます。
