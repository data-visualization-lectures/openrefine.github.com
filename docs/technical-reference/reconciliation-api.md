---
id: reconciliation-api
title: リコンサイル API
sidebar_label: リコンサイル API
---

_ここでは OpenRefine のリコンサイル機構の技術的仕組みを説明します。使い方は [リコンサイル](manual/reconciling.md) を参照してください。_

リコンサイルサービスは、名前やラベルなどのテキストと任意の追加情報を受け取り、条件に合致する候補エンティティを順位付きで返す Web サービスです。候補テキストは公式名称と完全一致する必要はありません。これにより曖昧な文字列から確定したエンティティ ID に結び付けられます。例えば "apple" なら、果物の Apple、企業 Apple Inc.、通称 Big Apple のニューヨークなどが返るでしょう。

エンティティは特定の ID 空間で一意の識別子を持ちます。例: Wikidata で "apple" に対する候補は `Q89`、`Q312`、`Q60` などです。1 つのリコンサイルサービスは単一の ID 空間に対してのみ動作しますが、同じ空間に複数サービスが存在することは可能です。

OpenRefine は [reconciliation API v0.2](https://reconciliation-api.github.io/specs/0.2/) に従う任意のサービスと接続できます。以前は OpenRefine が策定していましたが、現在は [W3C Entity Reconciliation Community Group](https://www.w3.org/community/reconciliation/) に移管されています。

非公式には、リコンサイルサービスは以下の情報から適切な候補を検索します。

- エンティティの名称やタイトルとなる文字列
- 任意: Type。どのタイプのエンティティに絞るか。Type の定義はサービス側に委ねられています（Suggest API を参照）。
- 任意: プロパティと値の組。例: 書籍データなら著者名や出版年など。ユーザーが列をプロパティに紐付けると、この情報が送信されます。プロパティの定義もサービスに依存します。

リコンサイルプロトコルはデータ照合向けに特化した検索 API と捉えられます。候補検索だけでなく、プレビューや補完機能でユーザーによる結果確認・修正も支援します。

詳細は [仕様](https://reconciliation-api.github.io/specs/0.1) を参照し、変更提案は [Issue トラッカー](https://github.com/reconciliation-api/specs/issues) や [メーリングリスト](https://lists.w3.org/Archives/Public/public-reconciliation/) へどうぞ。

## OpenRefine がサポートする API バージョン

- [v0.1](https://www.w3.org/community/reports/reconciliation/CG-FINAL-specs-0.1-20230321/)（OpenRefine 2.7〜）。JSONP ベースでセキュリティリスクがあるため実装は推奨しません。
- [v0.2](https://reconciliation-api.github.io/specs/0.2/)（OpenRefine 3.3〜）。現行の安定版で、実装を推奨します。
- [次期ドラフト](https://reconciliation-api.github.io/specs/draft/)（未対応）。

## 新しいリコンサイルサービスを作るには

仕様を参照して自作するほか、以下の方法もあります。

- [既存のライブラリ／フレームワーク](https://reconciliation-api.github.io/census/libraries/) を利用して Web API を公開する（対応バージョンに注意）。
- [スタンドアロンツール](https://reconciliation-api.github.io/census/services/) でデータセットにリコンサイルサービスを被せる。

どの場合も [test bench](https://reconciliation-api.github.io/testbench/) で挙動を確認し、公開サービス一覧に追加できます。
