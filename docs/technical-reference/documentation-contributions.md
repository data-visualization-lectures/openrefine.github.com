---
id: documentation-contributions
title: ドキュメント貢献
sidebar_label: ドキュメント貢献
---

OpenRefine のドキュメントは [Markdown](https://www.markdownguide.org/) で書かれており、[OpenRefine/openrefine.org](https://github.com/OpenRefine/openrefine.org) リポジトリで管理しています。貢献を歓迎します。

## GitHub から単一ページを編集

1 ページだけの修正なら Git の知識は不要です。対象ページの下部にある "Edit this page" をクリックすると GitHub に移動し、アカウントでログイン後、ガイドに従って変更提案（Pull Request）が作成できます。

Pull Request が作成されると、自動的にチェックが走り、問題がなければ変更を反映したサイトのプレビューが生成されます。その後メンテナーがレビューしてサイトに反映します。

## ローカル環境で複数ページを編集

大きな変更では、提出前にサイトの見た目を確認できると便利です。その場合は以下のツールをインストールしてください。
* Git クライアント（GitHub Desktop や `git` コマンドなど）
* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/getting-started/install)（Node.js インストール後 `npm install -g yarn`）

準備ができたら [OpenRefine/openrefine.org](https://github.com/OpenRefine/openrefine.org) を fork し、クローンして以下を実行します。

```sh
git clone git@github.com:<myaccount>/openrefine.org.git
cd openrefine.org
yarn
```

依存関係（主に [Docusaurus](https://docusaurus.io/)）がインストールされます。続けてドキュメントをローカルで起動します。

```sh
yarn start
```

`http://localhost:3000` でドキュメントが表示され、ソースを編集すると自動的に更新されます。必要なら静的ファイルを生成することもできます。

```sh
yarn build
```

内容に満足したら、[Pull Request を作成](https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github-3/)して送ってください。
