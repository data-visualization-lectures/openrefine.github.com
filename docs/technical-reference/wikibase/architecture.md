---
id: architecture
title: Wikibase 拡張のアーキテクチャ
sidebar_label: Wikibase extension
---


# Wikibase 拡張の概要

この拡張は、表形式のデータを [Wikibase エンティティのデータモデル](https://www.mediawiki.org/wiki/Wikibase/DataModel) に変換し、[Wikibase](https://wikiba.se/) インスタンスへアップロードする機能を提供します。

編集パイプラインは次の図のようになっています。
![Directed graph representing the pipeline from schema to upload into Wikibase](/img/editing-pipeline.png)

1. プロジェクト内の可視行ごとにスキーマ（`WikibaseSchema::evaluate`）を評価し、1 行につき 1 つ以上の `EntityEdit` オブジェクトを生成します。各オブジェクトは候補編集と、その編集を既存データにどのようにマッチさせるかの設定を持ちます。
2. `WikibaseAPIScheduler` が編集をまとめ、Wikibase HTTP API で効率的に処理できるようにします。これは、同じアイテムに対する変更を 1 つのオブジェクトに集約すること、および新規エンティティが参照される前に作成されるよう順序を調整することを意味します。
3. 編集候補に対して `EditScrutinizer` の集合を実行し、検出可能な問題がないか確認します。結果は `QAWarning` として集約されます。この仕組みは、対象 Wikibase で [WikibaseQualityConstraints](https://www.mediawiki.org/wiki/Extension:WikibaseQualityConstraints) が利用されている場合にその制約システムに基づきます。

以上の処理はスキーマをプレビューするたびに実行されます。アップロード時には 2 つの経路があります。
 
4. [QuickStatements](https://github.com/magnusmanske/quickstatements) を利用する方法。`QuickStatementsScheduler` が編集を再編成し、QuickStatements v1 形式で表現できるようにし、`QuickStatementsExporter` が最終的なテキストを生成します。

もう一つは OpenRefine から直接アップロードする方法で、この場合は各編集に対して次の処理を行います。

5. 編集内容に新規エンティティが含まれている場合は、`ReconEntityRewriter` が実際の識別子を挿入して書き換えます。
6. 既存エンティティへの編集では、保存されているマッチング条件に従って現状データと比較し、適用すべき差分（`EntityEdit::toUpdate`）を生成します。
7. 最後に [Wikidata-Toolkit](https://github.com/Wikidata/Wikidata-Toolkit) を通じて Wikibase インスタンスへ送信します。
