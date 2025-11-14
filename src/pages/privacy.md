---
title: プライバシー
description: OpenRefine でデータを処理するときの取り扱いについて
hide_table_of_contents: true
---

# OpenRefine のプライバシー

## データはどこに保存されますか？

  OpenRefine で処理したデータは、OpenRefine をインストールしているコンピューター上にのみ保存されます。
  プロジェクトデータ・履歴・設定などが含まれ、外部サーバーに複製されることはありません。

  保存場所は OS によって異なります。ドキュメントの [ワークスペースディレクトリの場所](docs/manual/installing#back-up-your-data) を参照してください。

  とくにアップグレード前など、定期的にワークスペースディレクトリをバックアップすることをおすすめします。

## 開発チームは私のデータにアクセスできますか？

いいえ。データはあなたのコンピューター内にのみ保存されるため、OpenRefine の開発者がアクセスすることはできません。

（繰り返しになりますが）とくにアップグレード前などは、ワークスペースディレクトリのバックアップを推奨します。

## どの操作で外部にデータが送信されますか？

一部の操作・インポーター・エクスポーターは外部サービスと通信するため、データが送信されます。
UI からオンラインサービスを利用していることが分かるようにしています。該当する例:
- URL 取得による列追加
- リコンシリエーションサービス経由での照合
- 照合結果から列を追加
- リコンシリエーション候補の手動選択
- Google Sheets / Google Drive とのインポート・エクスポート
- SQL データベースとのインポート・エクスポート
- URL から取得したファイルのインポート
- Wikibase へのアップロード

特定のワークフローが外部通信を含むか分からない場合は、[お気軽に質問してください](/community)。

## データは暗号化されていますか？

OpenRefine が保存するデータは既定では暗号化されていません。
OS のフルディスク暗号化などを有効にすることで暗号化できます。

## Cookie ポリシー

OpenRefine は通常 Cookie にユーザーデータを保存しません。例外は、Google Drive や Wikibase との OAuth 認証時のみです。

## スタートページでのアップデート通知

新しいバージョンの存在を確認するため、v3.6 より前の OpenRefine はスタートページを開く際に外部サイトへアクセスします。3.6 以降では、[システムプロパティ](docs/manual/running#jvm-preferences) `refine.display.new.version.notice` を `false` に設定すると無効化できます。
* OpenRefine 3.8 以前では GitHub.com に問い合わせます。送信情報については [GitHub のプライバシーポリシー](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) を参照してください。
* 3.8 以降では、ユーザーが opt-in した場合のみ openrefine.org（Netlify 上）に問い合わせます。保存されうるデータは [Netlify の Data Processing Agreement](https://www.netlify.com/pdf/netlify-dpa.pdf) をご覧ください。OpenRefine プロジェクト側ではこれらのアクセス解析を取得していません。
