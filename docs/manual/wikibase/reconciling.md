---
id: reconciling
title: Wikibase とのリコンサイル
sidebar_label: Wikibase との照合
---

OpenRefine が利用する Wikidata の [リコンサイルサービス](reconciling) は、[次の機能](https://reconciliation-api.github.io/testbench/) を備えています。
* さまざまなタイプに対するリコンサイル
* エンティティのプレビュー表示
* エンティティ・タイプ・プロパティの候補提示
* Wikidata から情報を取得してプロジェクトを拡張

リコンサイル API の詳しいドキュメントは [https://wikidata.reconci.link/](https://wikidata.reconci.link/) にあります。基本的な操作は他のリコンサイルサービスと同じですが、Wikidata 固有の機能がいくつかあります。

## Language settings {#language-settings}

リコンサイルサービスは言語別に用意されています。まず [Wikipedia の言語コード一覧](https://en.wikipedia.org/wiki/List_of_Wikipedias) などから 2 文字のコード（例: フランス語なら `fr`）を確認し、<span class="menuItems">Reconcile</span> → <span class="menuItems">Start reconciling...</span> で開くウィンドウから <span class="menuItems">Add Standard Service</span> を選択します。`https://wikidata.reconci.link/fr/api` のように、URL 中の `fr` を希望の言語コードに置き換えて追加してください。

このサービスを利用すると、対象エンティティに該当言語のラベルが存在する場合はその言語で表示されます。言語設定はマッチングスコアには影響しません。データセットの言語とも関係なく、単に表示するラベルの言語を切り替えるための設定です。

## Restricting matches by type {#restricting-matches-by-type}

Wikidata のタイプはアイテムとして表現され、[instance of (P31)](https://www.wikidata.org/wiki/Property:P31) で関連付けられます。例えば [university of Ljubljana (Q1377)](https://www.wikidata.org/wiki/Q1377) は [public university (Q875538)](https://www.wikidata.org/wiki/Q875538) のインスタンスです。タイプ同士も [subclass of (P279)](https://www.wikidata.org/wiki/Property:P279) で階層化されています（Q875538 は [university (Q3918)](https://www.wikidata.org/wiki/Q3918) のサブクラス）。[Wikidata Graph Builder](https://angryloki.github.io/wikidata-graph-builder/) で視覚化できます。

リコンサイル時にタイプを指定すると、そのタイプとすべてのサブタイプが候補になります。たとえば [university (Q3918)](https://www.wikidata.org/wiki/Q3918) を選べば、直接 Q3918 に紐付いていない [university of Ljubljana (Q1377)](https://www.wikidata.org/wiki/Q1377) も候補に含まれます（Q875538 経由でサブクラス関係があるため）。

クラウドソースゆえに、まだタイプが設定されていないアイテムも存在します。タイプで絞り込むとこうしたアイテムは結果に表示されず（フォールバックで表示された場合でもスコアは低くなります）。

## Reconciling via unique identifiers {#reconciling-via-unique-identifiers}

QID（「Q###」形式）を列に持っている場合は、<span class=\"menuItems\">Reconcile</span> → <span class=\"menuItems\">Use values as identifiers</span> を適用すると直接エンティティを参照できます。この方法では外部データセットとの照合は行われませんが、すべてのセルが濃青色で「confirmed」と表示され、追加情報の取得に利用できます。誤った QID が含まれている場合は、セルにマウスオーバーして確認してください。プロパティ（「P###」形式）には利用できません。

誤って 1 つの識別子が複数のアイテムに付与されている場合は、すべての候補が表示されますが、自動的に確定されるものはありません。

## Property paths, special properties, and subfields {#property-paths-special-properties-and-subfields}

Wikidata のプロパティは階層構造になっており、`|`、`/`、`.` を使ったプロパティパスで参照できます。ラベル・別名・説明・サイトリンクも同様に取得できます。また、地理座標の緯度・経度のようなサブフィールドにもアクセスできます。

ラベル・別名・説明・サイトリンクの例（L=Label、D=Description、A=Alias、S=Sitelink）:

```\nLen  英語ラベル\nDfi  フィンランド語の説明\nApt  ポルトガル語の別名\nSdewiki  ドイツ語版 Wikipedia の記事タイトル\nScommonswiki  Wikimedia Commons のサイトリンク\n```\n\n小文字の部分は言語コードで、取得する言語を指定します。値の取得時にフォールバックは行われません。

詳しくは [公式ドキュメント](https://wikidata.reconci.link/#documentation) を参照してください。
