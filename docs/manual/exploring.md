---
id: exploring
title: データの探索
sidebar_label: 概要
---

## Overview {#overview}

OpenRefine には、1 字も変更しなくてもデータセットを理解するのに役立つ機能が多数用意されています。このセクションでは、ソート・フィルター・表示のさまざまな方法を紹介します。

スプレッドシートと違って OpenRefine は式を記憶して結果だけを表示するのではなく、各セル内の値そのものだけを表示します。セルの色やテキストの書式設定はサポートされていません。

## Data types {#data-types}

OpenRefine の各セルにはデータ型が割り当てられます。インポート時にデータ型を設定できる形式もありますが、データ型が設定されていないセルは最初「文字列」として扱われ、後から他の型に変換することも可能です。これは列単位ではなくセル単位の設定です。

新しいプロジェクトのプレビュー画面で、<span class="fieldLabels">Attempt to parse cell text into numbers</span> にチェックを入れると、内容に応じてセルが「数値」データ型に変換され、認識された数値は黒文字から緑文字に変わります。

データ型は、その値に対して何ができるかを決定します。たとえば 2 つの値を足し合わせたい場合、それぞれが数値型として認識されている必要があります。

データ型はいつでも確認できます:
* 単一のセルで「edit」をクリックして型を確認・変更する
* 列に <span class="menuItems">Custom Text Facet</span> を作り、<span class="fieldLabels">Expression</span> 欄に `type(value)` を入力する。プレビューに型が表示され、<span class="buttonLabels">OK</span> を押せばデータ型ごとにファセットできます。

サポートされるデータ型:
* 文字列（1 文字以上のテキスト）
* 数値（数字のみの 1 文字以上）
* 真偽値（“true” または “false”）
* [日付](#dates)（UTC 時間を含む ISO-8601 拡張形式: YYYY-MM-DDTHH:MM:SSZ）

OpenRefine 独自の処理により認識される追加の型:
* error
* null

「error」型は、変換中に発生したエラーがセルに格納されたときに割り当てられます。

「null」型は「このセルには値が存在しない」ことを示す特殊な型です。たとえば “0” や “false”、空白に見えるがスペースが入っているセル、または空文字列を含むセルとは区別されます。`type(value)` を使うと、セルの値は “null” で型が “undefined” だと示されます。<span class="menuItems">All</span> → <span class="menuItems">View</span> → <span class="menuItems">Show/Hide ‘null’ values in cells</span> で [“null” を表示](sortview#showhide-null) できます。

セルのデータ型を変更する操作は、内容を変換する操作とは別です。たとえば <span class="menuItems">Transform</span> → <span class="menuItems">Common transforms</span> → <span class="menuItems">To date</span> のような列全体の変換がすべて成功しなくても、個々のセルで「edit」して型を変更すればテキストを日付に変換できる場合があります。この 2 種類の操作は内部的に異なるコードを使っています。日付の書式や変換については次のセクションで詳しく説明します。

ある型から別の型へ変換するには、[Transforming data](cellediting#data-type-transforms) を参照し、共通変換の使い方を確認してください。また [Expressions](expressions) で [toString()](grelfunctions#tostringo-string-format-optional)、[toDate()](grelfunctions#todateo-b-monthfirst-s-format1-s-format2-) などの関数を使う方法もご覧ください。


### Dates {#dates}

「日付」型は、列を [日付型に変換](transforming#to-date) したとき、式で [セルを日付に変換](grelfunctions#todateo-b-monthfirst-s-format1-s-format2-) したとき、あるいは個別のセルに「date」型を割り当てたときに作成されます。

OpenRefine における日付データのフォーマットは複数の変換ツールと標準に依存しています。日付と認識されるには、UTC 時間付きの ISO-8601 拡張形式 YYYY-MM-DDTHH:MM:SSZ に変換される必要があります。

<span class="menuItems">Edit cells</span> → <span class="menuItems">Common transforms</span> → <span class="menuItems">To date</span> を実行すると、左側の文字列列が右側の値に変換されます:

|Input|→|Output|
|---|---|---|
|23/12/2019|→|2019-12-23T00:00:00Z|
|14-10-2015|→|2015-10-14T00:00:00Z|
|2012 02 16|→|2012-02-16T00:00:00Z|
|August 2nd 1964|→|1964-08-02T00:00:00Z|
|today|→|today|
|never|→|never|

OpenRefine はさまざまなツールで [日付](exploring#dates) を認識・変換・書式化するため、上記の値も別の方法で再フォーマットできます。たとえば「today」のセルをクリックして型を手動で変更すると、“2020-08-14T00:00:00Z” のような値に変換されます。「never」に同じ処理をしようとするとエラーが出て実行されません。

式と引数を使えば、データの状態に応じてより厳密な変換や書式設定ができます。詳細は GREL 関数リファレンスの [Date functions](grelfunctions#date-functions) をご覧ください。

[カスタムタブ区切りエクスポーター](exporting#custom-tabular-exporter) でデータをエクスポートするときに、人間が読みやすい形式に変換することもできます。ISO 8601 フォーマットを維持するか、短・中・長・完全などのロケール形式、あるいは独自形式を指定できるため、作業中は ISO-8601 形式で保持しつつ、最終的には MM/DD/YY（米国の短い形式）など好みの書式と時間の有無を選べます。

以下の表は、米国とフランスのロケールにおける [日付/時刻の書式スタイル](https://docs.oracle.com/javase/tutorial/i18n/format/dateFormat.html) の例です:

|Style 	|U.S. Locale 	|French Locale|
|---|---|---|
|Default 	|Jun 30, 2009 7:03:47 AM 	|30 juin 2009 07:03:47|
|Short	|6/30/09 7:03 AM 	|30/06/09 07:03|
|Medium 	|Jun 30, 2009 7:03:47 AM 	|30 juin 2009 07:03:47|
|Long	|June 30, 2009 7:03:47 AM PDT 	|30 juin 2009 07:03:47 PDT|
|Full 	|Tuesday, June 30, 2009 7:03:47 AM PDT 	|mardi 30 juin 2009 07 h 03 PDT|

## Rows vs. records {#rows-vs-records}

行は、列ごとに 1 つのセルを並べた単純なデータ構造です。たとえばアンケートで複数回答を許す項目がある場合、1 つのセルに複数の情報が含まれることがあります。

1 つの列に複数の値があり、それが複数行にまたがる場合は、OpenRefine のレコードモードを使うと便利です。レコードモードでは 1 つのレコードが複数行を含む可能性を認め、そこから セルを複数行に展開して個別に操作できます。

データをインポートすると初期状態では通常行モードです。プロジェクト画面からレコードモードに切り替えれば、以降そのプロジェクトを開くたびに記憶された状態で表示されます。

OpenRefine は最初の列（「キー列」）の内容に基づいてレコードを認識します。1 行を複数行のレコードとして分割すると、すべての関連はデータセットの最初の列に依存します。

複数列を分割したい場合でも、OpenRefine は元のレコードとの関連を保ち、各グループの最上段の行を基準にサブグループを関連付けます。

構造は多くの枝を持ちつつ同じ幹に戻る木のように想像できます。

たとえばキー列が映画やテレビ作品で、複数の出演者が名前で記録され、それぞれが複数の役を持つ場合を考えます。役柄は俳優に、俳優は作品タイトルにリンクしています。

| Work             | Actor             | Role                         |
|------------------|-------------------|------------------------------|
| The Wizard of Oz | Judy Garland      | Dorothy Gale                 |
|                  | Ray Bolger        | "Hunk"                       |
|                  |                   | The Scarecrow                |
|                  | Jack Haley        | "Hickory"                    |
|                  |                   | The Tin Man                  |
|                  | Bert Lahr         | "Zeke"                       |
|                  |                   | The Cowardly Lion            |
|                  | Frank Morgan      | Professor Marvel             |
|                  |                   | The Gatekeeper               |
|                  |                   | The Carriage Driver          |
|                  |                   | The Guard                    |
|                  |                   | The Wizard of Oz             |
|                  | Margaret Hamilton | Miss Almira Gulch            |
|                  |                   | The Wicked Witch of the West |

レコードモードでも列を移動できますが、先頭に移動させるとデータがずれてしまうことがあります。新しいキー列は空白セルを基準にレコードへ並び替えられ、旧キー列の値は元レコードの最終行（該当値の上部）に割り当てられるためです。

OpenRefine は内部で一意のキーを割り当てているので、キー列に固有の識別子がなくても構いません。どの行がどのレコードに属しているかは、<span class="menuItems">All</span> 列に表示されるレコード番号で確認できます。

[複数値セルの分割](transforming#split-multi-valued-cells) などレコードモードを活用する操作については [Transforming data](transforming) をご覧ください。

レコードモードでは、ある列が空白でも別の列に値があれば誤って行を削除しないよう注意してください。

この機能は [Column Groups](../technical-reference/architecture-before-4#column-groups) と関連していますが、そちらは未完成かつ非推奨です。
