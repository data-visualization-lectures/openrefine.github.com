---
id: expressions
title: 式
sidebar_label: 概要
---

## Overview {#overview}

OpenRefine では、データのクリーンアップや変換を拡張するためにさまざまな場所で式（expression）を利用できます。式が使える機能は次の通りです:
* <span class="menuItems">Facet</span>:

    *   <span class="menuItems">Custom text facet...</span>
    *   <span class="menuItems">Custom numeric facet…</span>
    *   <span class="menuItems">Customized facets</span>（作成後に「change」をクリックすると式ウィンドウが開きます）
* <span class="menuItems">Edit cells</span>: 

    *   <span class="menuItems">Transform…</span>
    *   <span class="menuItems">Split multi-valued cells…</span>
    *   <span class="menuItems">Join multi-valued cells…</span>
* <span class="menuItems">Edit column</span>: 

    *   <span class="menuItems">Split</span>
    *   <span class="menuItems">Join</span>
    *   <span class="menuItems">Add column based on this column</span>
    *   <span class="menuItems">Add column by fetching URLs</span>

式エディターでは、サポートされている言語を選択できます。デフォルトは [GREL (General Refine Expression Language)](grel) ですが、OpenRefine には [Clojure](jythonclojure#clojure) と [Jython](jythonclojure#jython) のサポートも同梱されています。拡張機能によってはさらに多くの言語を追加できる場合もあります。

これらの言語は構文に若干の違いがあるものの、多くの [variables](#variables) を共通で扱えます。たとえば GREL の `value.split(" ")[1]` は Jython では `return value.split(" ")[1]` となります。

このページは利用可能な関数・変数・構文の総覧です。具体的な例を見たい場合は、[ウィキのレシピセクション](https://github.com/OpenRefine/OpenRefine/wiki/Documentation-For-Users#recipes-and-worked-examples) をご覧ください。

## Expressions {#expressions}

OpenRefine の式は、一般的な表計算ソフトの数式とは仕組みが異なります。OpenRefine ではセルに式を保存して出力を自動的に更新するのではなく、式を実行するとそれが一度だけ列の中身を変更したり、新しい列を生成したりします。これらは `value` や `cell` のような変数を使って、列内のすべてのセルに同じ処理を適用する形になります。

たとえば次のようなデータがあるとします:

|ID|Friend|Age|
|---|---|---|
|1.|John Smith|28|
|2.|Jane Doe|33|

「friend」列に次の式を適用すると:

```
 value.split(" ")[1]
```

OpenRefine は各行を順に処理し、空白で分割します。行 1 の `value` は “John Smith” なので結果は “Smith” になります（`[1]` で分割後の第 2 要素を選んでいます）。行 2 は “Jane Doe” で結果は “Doe” です。1 つの式で行ごとに違う結果が得られる仕組みです。元の情報は破棄されるので、[History](running#history-undoredo) タブで操作を取り消さない限り “John” や “Jane” は戻りません。

別の例として、`row.starred` を使って新しい列を作成すると、当時星付きになっていた行に応じて true/false の列が作成されます。後から行に星を付けたり外したりしても、値が自動的に更新されることはありません。最新の状態を反映するには再度操作を実行する必要があります。

式は通常特定の列（最初にドロップダウンで選んだ列）を基準にしています。その「ベース列」にあるセルに関する情報を表す変数が多数用意されており、ほかの列のセルにアクセスするための行単位の変数も利用できます。

## The expressions editor {#the-expressions-editor}

式を受け付ける機能を選ぶと、画面を覆うように式エディターが表示されます。

![The expressions editor window with a simple expression: value + 10.](/img/expression-editor.png)

式エディターには式を入力するフィールドと、先頭の数行に対する変換結果のプレビューが表示されます。

また、使用する言語を選択できるドロップダウンがあり、最初は GREL が選ばれています。ほかの言語を選ぶとその選択が次回以降も保持されます。Jython・Clojure も標準インストールに含まれており、サードパーティ製の拡張やカスタマイズでさらに言語を追加できる場合もあります。

さらに以下のタブがあります:
*   <span class="tabLabels">History</span>: すべてのプロジェクトで最近使った式の一覧
*   <span class="tabLabels">Starred</span>: スターを付けた式を再利用できる一覧
*   <span class="tabLabels">Help</span>: GREL 関数の簡易リファレンス

過去に使った式をスターしておくと、繰り返し作業をバッチで実行するときに便利です。

式のエラー処理方法も選べます: 元のセル値を維持する、エラーを表示する、または空セルを出力するかです。

## Regular expressions {#regular-expressions}

OpenRefine では、<span class="menuItems">Text filter</span> や <span class="menuItems">Replace…</span> などのフィールドで正規表現（regex）を使えます。GREL やほかの言語でも正規表現を組み込むことで式の表現力を高められます。

正規表現が初めての場合は、[OpenRefine がサポートする Java 構文向けのチュートリアル](https://docs.oracle.com/javase/tutorial/essential/regex/) を読むとよいでしょう。テストや学習には [このツール](https://regexr.com/) もおすすめです。

### GREL-supported regex {#grel-supported-regex}

GREL 内で正規表現を書くには、JavaScript のように前後をスラッシュ（/）で囲みます。たとえば:

```
value.replace(/\s+/, " ")
```

この例では正規表現そのものが `\s+` で、スラッシュ `/\s+/` で囲む構文を使っています。OpenRefine の正規表現エンジンは Java に基づいていますが、Java で文字列として記述する際のようにバックスラッシュを二重にする必要はありません。

GREL 式以外ではスラッシュで正規表現を囲まないでください。

[GREL functions](grelfunctions) ページでは、正規表現に対応する関数に “p”（pattern）が付いています。対応する関数は次の通りです:
*   [contains](grelfunctions#containss-sub-or-p)
*   [replace](grelfunctions#find-and-replace)
*   [find](grelfunctions#find-and-replace)
*   [match](grelfunctions#matchs-p)
*   [partition](grelfunctions#partitions-s-or-p-fragment-b-omitfragment-optional)
*   [rpartition](grelfunctions#rpartitions-s-or-p-fragment-b-omitfragment-optional)
*   [split](grelfunctions#splits-s-or-p-sep-b-preservetokens-optional)
*   [smartSplit](grelfunctions#smartsplits-s-or-p-sep-optional)

### Jython-supported regex {#jython-supported-regex}

GREL の代わりに [Jython](http://www.jython.org/docs/library/re.html) 式で正規表現を使うこともできます。たとえば <span class="menuItems">Custom Text Facet</span> で次のように記述できます:

```
python import re g = re.search(ur"\u2014 (.*),\s*BWV", value) return g.group(1)
```

### Clojure-supported regex {#clojure-supported-regex}

[Clojure](https://clojure.org/reference/reader) は Java と同じ正規表現エンジンを使い、[re-find](http://clojure.github.io/clojure/clojure.core-api.html#clojure.core/re-find) や [re-matches](http://clojure.github.io/clojure/clojure.core-api.html#clojure.core/re-matches) などで利用できます。Clojure ドキュメントに記載の `#"pattern"` マクロも使えます。たとえば:

```
clojure (nth (re-find #"\u2014 (.*),\s*BWV" value) 1)
```

## Variables {#variables}

OpenRefine の変数の多くには、それぞれに呼び出せる属性（member field）があります。たとえば `row.record.rowCount` は、`record` 変数の member field である `rowCount` にアクセスし、レコード内の行数が取得できます。member field はドットまたは角括弧（`row["record"]`）でたどれます。角括弧は列名でセルにアクセスする場合（例: `cells["Postal Code"]`）にも使います。

|Variable |Meaning |
|-|-|
| `value` | 現在の行のベース列セルの値（null の可能性あり） |
| `row` | 現在の行 |
| `row.record` | レコードを構成する 1 行以上の集合 |
| `cells` | 現在の行のセル（列名に対応したフィールドがある） |
| `cell` | 現在の列のセルオブジェクト（value などを含む） |
| `cell.recon` | リコンシリエーションサービスが返す情報 |
| `rowIndex` | 現在の行のインデックス（0 から始まる） |
| `columnName` | 現在のセルの列名（文字列） |

### Row {#row}

`row` 変数はその member field を呼び出すのに適しています。ドットまたは角括弧で `row.index` / `row["index"]` と記述できます。

|Field |Meaning |
|-|-|
| `row.index` | 現在の行のインデックス（0 が最初） |
| `row.cells` | 行に含まれる複数の [cells](#cells) オブジェクト |
| `row.columnNames` | プロジェクト内すべての列名の配列（null セルの列も含む）。`row.columnNames[3]` のように番号で取り出せます。 |
| `row.starred` | 行がスター付きかどうか（真偽値） |
| `row.flagged` | 行がフラグ付きかどうか（真偽値） |
| `row.record` | 現在の行を含む [record](#record) オブジェクト |

`row.columnNames` のような配列は式ウィンドウでプレビューでき、`toString(row.columnNames)` や次のように文字列化できます:

```
forEach(row.columnNames,v,v).join("; ")
```

### Cells {#cells}

`cells` オブジェクトを使うとプロジェクト内の他の列のセル情報を取得できます。たとえば `cells.Foo` は現在の行で “Foo” 列に当たる [cell](#cell) を返します。列名に空白が含まれる場合は `cells["Postal Code"]` と角括弧を使います。対応するセルの値を得るには `.value` をつけます（例: `cells["Postal Code"].value`）。`cells.value` という直接的なフィールドは存在しません。

### Cell {#cell}

`cell` オブジェクトにはセルの全情報がまとまっており、1 つのオブジェクトとして扱われます。

式エディターで `cell` をそのまま使うと、リコンシリエーション情報も含めて列全体を別列にコピーできます。プレビューには `[object Cell]` と表示されますが、実際にはすべてのデータをコピーします。試すには <span class="menuItems">Edit Column</span> → <span class="menuItems">Add Column based on this column ...</span> を使ってください。

|Field |Meaning |Member fields |
|-|-|-|
| `cell` | セルの全内容を含むオブジェクト | .value, .recon, .errorMessage |
| `cell.value` | セルの値（文字列・数値・真偽値・null・エラー） |  |
| `cell.recon` | リコンシリエーション結果を表すオブジェクト | [reconciliation](expressions#reconciliation) セクション参照 |
| `cell.errorMessage` | EvalError のメッセージを返す（エラーオブジェクト自体ではなく） | .value |

### Reconciliation {#reconciliation}

このセクションのフィールドは [reconciliation facets](reconciling#reconciliation-facets) で使われます。`cell.recon` と完全に記述する必要があり、単に `recon` では動作しません。

|Field|Meaning |Member fields |
|-|-|-|
| `cell.recon.judgment` | 「matched」「new」「none」のいずれかの文字列 |
| `cell.recon.judgmentAction` | 「single」「similar」「unknown」などの文字列 |
| `cell.recon.judgmentHistory` | 判定のタイムスタンプ（ミリ秒） |
| `cell.recon.matched` | 判定が matched なら true |
| `cell.recon.match` | このセルにマッチした候補（または null） | .id, .name, .type |
| `cell.recon.best` | 最もスコアの高い候補（または null） | .id, .name, .type, .score |
| `cell.recon.features` | 精度評価のための配列 | .typeMatch, .nameMatch, .nameLevenshtein, .nameWordDistance |
| `cell.recon.features.typeMatch`  | 選択した型が matched なら true（未一致なら “(no type)”） |
| `cell.recon.features.nameMatch` | セルと候補文字列が一致しているなら true（未一致なら “(unreconciled)”） |
| `cell.recon.features.nameLevenshtein` | [Levenshtein 距離](https://en.wikipedia.org/wiki/Levenshtein_distance)（差が大きいほど値が大きくなる） |
| `cell.recon.features.nameWordDistance` | [単語の類似度](reconciling#reconciliation-facets) を表す数値 |
| `cell.recon.candidates` | 既定では上位 3 件の候補配列 | .id, .name, .type, .score |

`cell.recon.candidates` や `cell.recon.best` にはさらに `id`、`name`、`type`、`score` などがあります。`type` は候補のタイプ識別子の配列、最高位の候補では単一の文字列です。

`cell.recon.candidates` や `cell.recon.candidates.type` のような配列は次のように連結して文字列にできます:
```
forEach(cell.recon.candidates,v,v.name).join("; ")
```

### Record {#record}

`row.record` はレコードモードでグループ化された 1 つ以上の行を包みます。`row.record` と完全に書かないと値は返りません。

|Field|Meaning |
|-|-|
| `row.record.index` | 現在のレコードのインデックス（0 ベース） |
| `row.record.cells` | レコード内の [cells](#cells) 配列 |
| `row.record.fromRowIndex` | レコードの先頭行のインデックス |
| `row.record.toRowIndex` | レコード末尾行の次のインデックス |
| `row.record.rowCount` | レコード内の行数 |

たとえば <span class="menuItems">Custom Numeric Facet</span>（または <span class="menuItems">Custom Text Facet</span>）で `row.record.rowCount` を使えば、レコードごとの行数でファセットできます。
