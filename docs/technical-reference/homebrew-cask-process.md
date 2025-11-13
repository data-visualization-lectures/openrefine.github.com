---
id: homebrew-cask-process
title: Homebrew cask のメンテナンス
sidebar_label: Homebrew cask のメンテナンス
---

[Homebrew](https://brew.sh) は macOS 向けの人気パッケージマネージャーです。Homebrew をインストールすれば `brew install openrefine` で OpenRefine を導入できます。OpenRefine の cask は https://github.com/Homebrew/homebrew-cask/blob/master/Casks/o/openrefine.rb にあります。

**用語:** GUI 付きのアプリや事前ビルド済みバイナリは「Homebrew Cask」で扱われ、コマンドライン用のソースビルドパッケージが「Homebrew（Formula）」に分類されます。OpenRefine の macOS 版はアプリバンドル（GUI）なので Cask 側で管理されます。

新リリース時は `brew bump-cask-pr` コマンドで簡単に更新できます（自動 PR が作られる場合もあります。例: [この PR](https://github.com/Homebrew/homebrew-cask/pull/192923)）。詳細な手順は [Homebrew Cask CONTRIBUTING](https://github.com/Homebrew/homebrew-cask/blob/master/CONTRIBUTING.md) を参照してください。単純なバージョンアップなら以下の 1 行で済みます（例: 3.4.1 への更新）。

```
brew bump-cask-pr --version 3.4.1 openrefine
```

このコマンドはローカルの Homebrew で新バージョンをダウンロードし、インストーラの SHA-256 を計算し、あなたの GitHub アカウントから PR を作成します。PR 作成後に CI が走り、Homebrew コミュニティがレビューします。CI に待ちが発生することがありますが、テスト完了後は数時間以内にレビューされることがほとんどです。

**注意:** OpenRefine のリリースタグとバージョン番号が一致していることが重要です。Homebrew の cask は以下の URL 形式でインストーラを取得するためです。

```
https://github.com/OpenRefine/OpenRefine/releases/download/#{version}/openrefine-mac-#{version}.dmg
```

たとえば Homebrew に `3.4.1` と伝えた場合、以下の URL からダウンロードを試みます。

```
https://github.com/OpenRefine/OpenRefine/releases/download/3.4.1/openrefine-mac-3.4.1.dmg
```
