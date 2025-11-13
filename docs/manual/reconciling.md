---
id: reconciling
title: リコンシリエーション（データ照合）
sidebar_label: データ照合
---

## Overview {#overview}

リコンシリエーションとは、手元のデータと外部のデータセットを照合する作業です。[レコードリンク](https://en.wikipedia.org/wiki/Record_linkage) やデータマッチングとも呼ばれ、エンティティ解決、フィールド（プロパティ）マッチ、[重複レコードの検出](https://en.wikiversity.org/wiki/Duplicate_record_detection) などと併せて行われることもあります。比較対象となるデータは図書館・アーカイブ・博物館・学術機関・研究機関・非営利団体・関心団体などが作成したもののほか、[Wikidata や他の Wikibase インスタンス](wikibase/reconciling) 上のユーザー編集データ、あるいは [ローカルで用意したデータセット](https://github.com/OpenRefine/OpenRefine/wiki/Reconcilable-Data-Sources#local-services) に対しても行うことができます。

OpenRefine で外部データと照合するには、そのデータが [Reconciliation Service API](https://reconciliation-api.github.io/specs/0.1/) に準拠した Web サービスを提供している必要があります。

照合を行う目的としては:
* 変名や誤字などの正規化
* [Library of Congress Subject Headings](https://id.loc.gov/authorities/subjects.html) などの権威ファイルと照合して主題見出しを補正
* 自分のデータと既存のデータセットをリンク
* [Wikidata](https://www.wikidata.org) のような編集可能なプラットフォームに書き込み
* [パナマ文書](https://aleph.occrp.org/datasets/734) のような特定のリストに含まれているか確認

OpenRefine のリコンシリエーションは半自動です。OpenRefine はできるだけ候補を自動抽出しますが、人の目で見直して承認する必要があります。リコンシリエーションは文字列検索に基づくため、スペルミス・空白・不要な文字があると結果に影響します。リコンシリエーション前に [データのクリーンアップやクラスタリング](cellediting) を行うと精度が上がります。

:::info 繰り返しの作業
リコンシリエーションは一度で完了しない場合が多いため、異なる設定やデータのサブセットで繰り返し実行することをおすすめします。
:::

## Sources {#sources}

[このリコンシリエーション可能な公開サービス一覧](https://reconciliation-api.github.io/testbench/) から始めてください。新しいサービスがあれば Wikidata 編集を通じて追加できます。

OpenRefine では [さらに多くのソースを Wiki にまとめたページ](https://github.com/OpenRefine/OpenRefine/wiki/Reconcilable-Data-Sources) をメンテナンスしており、誰でも編集可能です。この中には [ローカルデータ](https://github.com/OpenRefine/OpenRefine/wiki/Reconcilable-Data-Sources#local-services) との照合方法も含まれています。

この2つのページにまだ掲載されていないサービスも存在するかもしれません。たとえば [Organized Crime and Corruption Reporting Project (OCCRP)](https://aleph.occrp.org/datasets/) には 310 種類のデータセットがあり、それぞれ固有のリコンシリエーション URL を持っています（[照合リスト](https://reconciliation-api.github.io/testbench/) に URL が載っています）。また Virtual International Authority File (VIAF) 全体、あるいは特定機関の寄与のみと照合することもできます。お目当ての権威ファイルがサービスを提供しているか、CSV をダウンロードしてローカルリコンシリエーションを構築できないかを調査してみてください。

OpenRefine にはインストール時点で Wikidata リコンシリエーションが同梱されています。詳細は [Wikibase](wikibase/reconciling) ページを参照してください。拡張機能を使えば、さらなるリコンシリエーションサービスや機能拡張を追加できます。[ダウンロードページ](/download) の拡張機能一覧を確認してください。

各サービスには提供方法が異なるため、[照合 API リスト](https://reconciliation-api.github.io/testbench/) の表で対応している機能を確認してください。挙動や OpenRefine 機能との互換性について疑問があれば、該当サービスのドキュメントを参照してください。

独自のサービスを構築したい場合も [API 仕様](https://reconciliation-api.github.io/specs/latest/) からスクラッチで作るか、[リコンシリエーションサーベイ](https://reconciliation-api.github.io/census/services/) で紹介されているフレームワークを使うことができます。

注目すべきプロジェクトに [reconcile-csv](http://okfnlabs.org/reconcile-csv/) があり、単純な CSV から独自のリコンシリエーションサービスを構築できます。たとえば別の OpenRefine プロジェクトと照合したい場合、対象プロジェクトを CSV でエクスポートし、`reconcile-csv` でその CSV を読み込ませるだけで準備が整います。Python で書かれた後継プロジェクトも存在します。

## 取得済みの URL から追加データを取り込む {#add-entity-identifiers-column}

照合先サービスがデータを拡張できない場合は、一般的な Web API や固有 ID を持つ構造化 URL（例: `https&#58;//viaf.org/viaf/000000`）を探してください。取得した ID を使って <span class="menuItems">Edit column</span> → [<span class="menuItems">Add column by fetching URLs</span>](columnediting#add-column-by-fetching-urls) を実行し、[expressions](expressions) で URL を構築すると API を呼び出せます。

ページ全体の HTML を取得したくない場合は、JSON 形式などのメタデータエンドポイントを探して利用するとよいでしょう。照合プロセス中に取得した ID を活用したり、マッチしたセルの `cell.recon.match.id` から ID を取り出して URL を生成したりできます。

たとえば Getty ULAN にアーティストを照合し、固有の ULAN ID を列として持っているなら、`Add column by fetching URLs` で GREL 式 `"http://vocab.getty.edu/" + value + ".json"` を使って JSON を取得できます（ID が `ulan/000000` 形式）。

またはマッチした候補を直接参照するには、`"http://vocab.getty.edu/" + cell.recon.match.id + ".json"` のように書くことで逐一 ID を埋め込めます。

適切なスロットルを設定し、サービスの利用規約に従ってください。[この操作の説明](columnediting#add-column-by-fetching-urls) を参考にフェッチ処理の詳細を確認できます。

## 提案候補をすべて保持する {#keep-all-the-suggestions-made}

最良候補だけでなく、すべての提案候補の一覧を得たい場合は [GREL 式](expressions#GREL) を使います。<span class="menuItems">Edit column</span> → <span class="menuItems">Add column based on this column</span> で次のように書くと候補名を列挙できます。

```
forEach(cell.recon.candidates,c,c.name).join(", ")
```

候補の ID を取得したい場合は:

```
forEach(cell.recon.candidates,c,c.id).join(", ")
```

これで文字列として保存され、リコンシリエーション情報自体は含まれません。

## リコンシリエーション式を書く {#writing-reconciliation-expressions}

OpenRefine にはリコンシリエーション用の変数が用意されており、GREL/Jython の式内で利用できます。主な変数には:

* `cell.recon.match.id` / `cell.recon.match.name`（マッチした候補）
* `cell.recon.best.name` / `cell.recon.best.id`（ベスト候補）
* `cell.recon.candidates`（セルごとの候補リスト）
* `cell.recon.judgment`（「judgment」ファセットの値）
* `cell.recon.judgmentHistory`（判断タイムスタンプ）
* `cell.recon.matched`（true/false）

詳しくは [reconciliation variables](expressions#reconciliation) セクションを参照してください。

:::tip リコンシリエーション列をコピーする
<span class="menuItems">Edit column</span> → <span class="menuItems">Add column based on this column</span> で GREL 式に `cell` だけを書くと、入力のセルを丸ごと別列にコピーできます（リコンシリエーション情報を含む）。
:::

## リコンシリエーション結果のエクスポート {#exporting-reconciled-data}

既に Web 上のエンティティと照合済みのデータは [Wikidata や他の Wikibase へのアップロード](wikibase/uploading) や [その他の形式](exporting) でエクスポートできます。

途中経過の照合データを共有するには、[プロジェクトをエクスポート/インポート](exporting#export-a-project) する方法があります。読み込む側の OpenRefine には対象のリコンシリエーションサービス（<span class="menuItems">Start reconciling</span> → <span class="buttonLabels">Add Standard Service...</span>）が事前に追加されている必要があります。追加されていないと候補や ID のリンクが壊れるため、再度サービスを追加してリコンシリエーションし直す必要があります。[Wikidata](wikibase/reconciling) の場合は OpenRefine に標準添付されているため、より簡単に共有できます。
