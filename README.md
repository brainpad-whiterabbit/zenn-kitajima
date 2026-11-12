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

## 公開

記事の公開は人が行います。`published` を `true` にした PR を main にマージすると、Zenn の GitHub 連携で記事が公開されます。
