---
id: quality-assurance
title: Wikibase へのアップロードにおける品質管理
sidebar_label: 品質管理
---

このページでは、OpenRefine の Wikidata 拡張がアップロード前に行うチェックについて説明します。ほとんどの検査は [Wikibase Quality Constraints](https://gerrit.wikimedia.org/g/mediawiki/extensions/WikibaseQualityConstraints) 拡張と、[Wikibase マニフェスト](./configuration) で設定されたプロパティ／アイテム ID に依存しています。

## 概要 {#overview}

更新内容は、既存のアイテムを取得してマージする前に検査されます。そのため、既存のステートメントと矛盾するようなケースは検出できませんが、大量の編集でも高速にチェックできます。スキーマを組み立てている最中にリアルタイムで警告が更新されます。

すべての制約違反が検出されるわけではなく、対応しているものは [制約違反](#constraint-violations) に列挙しています。一方、検出されたすべての問題が Wikibase 側の制約違反として表示されるわけではなく、[一般的な問題](#generic-issues) として扱うものもあります。

## リコンサイル結果の確認 {#reconciliation}

まずはリコンサイル結果の品質を確認しましょう。OpenRefine には品質確認用のツールがいくつか用意されています。

* <span class="menuItems">Reconcile</span> → <span class="menuItems">Facets</span> → <span class="menuItems">Best candidate's name edit distance</span> で元データと候補名の編集距離を調べる
* カスタム式でテキストファセットを作り、表の値とアイテムの値を比較する
* タイプ情報を新しい列に取得し、件数順のファセットで分布を確認する

## 制約違反 {#constraint-violations}

制約は各プロパティの [P2302](https://www.wikidata.org/wiki/Property:P2302) に沿って取得されます。

対応している制約は以下のとおりです。
* [format constraint (Q21502404)](https://www.wikidata.org/wiki/Q21502404): 文字列や識別子の形式を検査
* [inverse constraint (Q21510855)](https://www.wikidata.org/wiki/Q21510855): 逆方向のステートメントがまだ存在しないと仮定して警告します。既に Wikidata にあると分かっている場合は無視して構いません。
* [used for values only constraint (Q21528958)](https://www.wikidata.org/wiki/Q21528958)、[used as qualifier constraint (Q21510863)](https://www.wikidata.org/wiki/Q21510863)、[used as reference constraint (Q21528959)](https://www.wikidata.org/wiki/Q21528959)
* [allowed qualifiers constraint (Q21510851)](https://www.wikidata.org/wiki/Q21510851)
* [required qualifier constraint (Q21510856)](https://www.wikidata.org/wiki/Q21510856)
* [single-value constraint (Q19474404)](https://www.wikidata.org/wiki/Q19474404): 同じアイテムに同じプロパティを 2 回以上追加する場合のみ検出します（既存のステートメントは確認しません）
* [distinct values constraint (Q21502410)](https://www.wikidata.org/wiki/Q21502410): 同じバッチ内での重複のみ検査します

他の実装との比較は [こちら](https://www.wikidata.org/wiki/Wikidata:WikiProject_property_constraints/reports/implementations) を参照してください。

## 一般的な問題 {#generic-issues}

以下のように、Wikidata 側では制約違反として扱われない問題も検出します。
* 出典の無いステートメント（[citation needed constraint (Q54554025)](https://www.wikidata.org/wiki/Q54554025) に依存せず、すべてのステートメントに出典が必要とみなします。データセットをインポートする場合は、[instance of (P31)](https://www.wikidata.org/wiki/Property:P31) のような汎用プロパティでもデータセットへの参照を付けるのが望ましいと考えています）
* ラベル・説明・別名などの文字列に含まれる不要な空白や制御文字
* 自分自身（所属するアイテム）を参照するステートメント
* ラベルのない新規アイテム
* 説明のない新規アイテム
* [instance of (P31)](https://www.wikidata.org/wiki/Property:P31) または [subclass of (P279)](https://www.wikidata.org/wiki/Property:P279) を持たない新規アイテム
