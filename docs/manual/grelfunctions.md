---
id: grelfunctions
title: GREL 関数
sidebar_label: GREL 関数
---

**この参考資料に加え、OpenRefine の GitHub Wiki には、[よく使われる GREL 関数の例とレシピ](https://github.com/OpenRefine/OpenRefine/wiki/Recipes) をまとめたページがあります。**

## Reading this reference {#reading-this-reference}

以下のリファレンスでは関数をフル表記で示し、本文中の例はドット記法で記述しています。関数ごとに使われる [データ型](exploring#data-types) を s（文字列）、b（真偽値）、n（数値）、d（日付）、a（配列）、p（正規表現パターン）、o（任意の型＝文字列、真偽値、日付、数値など）のように略記しています。null や error も含みます。

複数の型を受け取ったり返したりできる関数は “s or a” のように複数の記号や、任意の型を示す o を使って示します。

部分列は “sub”、区切り文字列は “sep” の略記を使うことがあります。オプション引数には “(optional)” と記載します。

文字列（s）または正規表現パターン（p）を受け付ける場所では引用符で文字列を渡せます。正規表現を使いたい場合はスラッシュで囲ってください（詳細は [regex](expressions#regular-expressions) を参照）。

## Boolean functions {#boolean-functions}

###### and(b1, b2, ...) {#andb1-b2-}

複数の真偽値に論理 AND を適用し、すべて true なら true を返します。例: `(1 < 3).and(1 < 0)` は 1 つが false なので false になります。

###### or(b1, b2, ...) {#orb1-b2-}

複数の真偽値に論理 OR を適用し、どれか 1 つでも true なら true を返します。例: `(1 < 3).or(1 > 7)` は第一条件が true なので true になります。

###### not(b) {#notb}

真偽値を否定して返します。例: `not(1 > 7)` は false の否定なので true になります。

###### xor(b1, b2, ...) {#xorb1-b2-}

排他的論理和（XOR）を返し、条件のうちちょうど 1 つだけ true なら true を返します。例: `(1 < 3).xor(1 < 7)` は複数の条件が true なので false になります。
## String functions {#string-functions}

###### length(s) {#lengths}

文字列 s の長さを数値で返します。

###### levenshteinDistance(s1, s2) {#levenshteinDistance-s1-s2}
2 つの文字列を一致させるために必要な単一文字の変更回数（追加・削除・置換）を整数で返します。例: `levenshteinDistance("New York", "newyork")` は 1、`levenshteinDistance("M. Makeba", "Miriam Makeba")` は 5 を返します。

注: 距離を計算する前に、入力文字列はトリム・句読点・制御文字の除去・連続空白の縮約・小文字化で前処理されます。

###### toString(o, string format (optional)) {#tostringo-string-format-optional}

任意の値（文字列・数値・日付・真偽値・エラー・null）を文字列に変換します。

文字列フォーマット（[Java Formatter](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html)準拠）を指定すると、数値を丸めて出力できます。たとえば `value.toString("%.0f")` を実行すると:

|Input|Output|
|-|-|
|3.2|3|
|0.8|1|
|0.15|0|
|100.0|100|

日付も OpenRefine に組み込まれたパース構文を使って文字列に変換できます（[toDate() 関数](#todateo-b-monthfirst-s-format1-s-format2-) 参照）。例: `value.toString("MMM-dd-yyyy")` は `2024-10-15T00:00:00Z` を “Oct-15-2024” に変換します。

注意: null セルに toString() を使うと文字列 “null” が出力されます。

:::info
OpenRefine 3.0（2018年5月）のリリースまでは、タイムゾーンなしの日付/時刻はローカルタイムと解釈されていましたが、その後 UTC に変更されました。[issue #6009](https://github.com/OpenRefine/OpenRefine/issues/6009) を参照してください。
:::

### Testing string characteristics {#testing-string-characteristics}

###### startsWith(s, sub) {#startswiths-sub}

s が sub で始まるかどうかを真偽値で返します。例: `"food".startsWith("foo")` は true、`"food".startsWith("bar")` は false です。

###### endsWith(s, sub) {#endswiths-sub}

s が sub で終わるかどうかを真偽値で返します。例: `"food".endsWith("ood")` は true、`"food".endsWith("odd")` は false です。

###### contains(s, sub or p) {#containss-sub-or-p}

s に sub（文字列または正規表現）が含まれるかどうかを返します。例: `"food".contains("oo")` は true、`"food".contains("ee")` は false です。

正規表現を使うにはスラッシュで囲みます: `"rose is a rose".contains(/\s+/)` は true になります。startsWith()/endsWith() は文字列しか取れませんが、contains() は正規表現を使えるので、部分パターンの検出に使えます。 

### Basic string modification {#basic-string-modification}

#### Case conversion {#case-conversion}

###### toLowercase(s) {#tolowercases}

文字列 s のすべての文字を小文字に変換します。

###### toUppercase(s) {#touppercases}

文字列 s のすべての文字を大文字に変換します。

###### toTitlecase(s, delimiters (optional)) {#totitlecases}

各単語の先頭文字だけを大文字にするタイトルケースを返します。例: `"Once upon a midnight DREARY".toTitlecase()` は “Once Upon A Midnight Dreary” になります。

任意の区切り文字列を指定すると、その文字の直後の非区切り文字と文字列の最初の文字が大文字になります。例: `"jean-michel jarre".toTitlecase(" -")` は “Jean-Michel Jarre” です。

#### Trimming {#trimming}

###### trim(s) {#trims}

文字列 s の両端の空白を取り除いたコピーを返します。例: `" island ".trim()` は “island”。`strip()` と同じ振る舞いです。

###### strip(s) {#strips}

文字列 s の両端の空白を取り除いたコピーを返します。例: `" island ".strip()` は “island”。`trim()` と同等です。

###### chomp(s, sep) {#chomps-sep}

s が sep で終わる場合、その末尾を取り除いた文字列を返します。そうでなければ s をそのまま返します。例: `"barely".chomp("ly")` も `"bare".chomp("ly")` も “bare” になります。

#### Substring {#substring}

###### substring(s, n from, n to (optional)) {#substrings-n-from-n-to-optional}

インデックス `from` から `to` 未満の部分列を返します。`to` を省略すると末尾までを返します。例: `"profound".substring(3)` は “found”、`"profound".substring(2, 4)` は “of” です。

インデックスは 0 から始まり、負の値は末尾からの位置を示します。たとえば `"profound".substring(0, -1)` は “profoun” を返します。

###### slice(s, n from, n to (optional)) {#slices-n-from-n-to-optional}

文字列に対しては substring と同じですが、配列にも使えます（[Array functions](#slicea-n-from-n-to-n-optional) を参照）。負のインデックスも利用可能です。

###### get(s, n from, n to (optional)) {#gets-n-from-n-to-optional}

文字列では substring と似た挙動ですが、`n to` を省略すると 1 文字を返します。名前付きフィールド（[JSON プロパティ](#parsejsons) や [OpenRefine 変数](expressions#variables)）や配列にも使えます（[Array functions](#geta-n-from-n-to-optional) 参照）。

#### Find and replace {#find-and-replace}

###### indexOf(s, sub) {#indexofs-sub}

s の中で sub が最初に出現する位置を返します。見つからなければ -1。例: `"internationalization".indexOf("nation")` は 5、`"internationalization".indexOf("world")` は -1 です。

###### lastIndexOf(s, sub) {#lastindexofs-sub}

s の中で sub が最後に出現する位置を返します。見つからなければ -1。例: `"parallel".lastIndexOf("a")` は 3（2 番目の “a”）です。

###### replace(s, s or p find, s replace) {#replaces-s-or-p-find-s-replace}

find（文字列または正規表現）を replace で置き換えた文字列を返します。例: `"The cow jumps over the moon and moos".replace("oo", "ee")` は “The cow jumps over the meen and mees” を返します。正規表現を渡すこともでき、`"The cow jumps over the moon and moos".replace(/\s+/, "_")` は “The_cow_jumps_over_the_moon_and_moos” になります。

null は文字列ではないためこの関数では扱えません。代わりに:

1. null でファセットし、文字列に一括編集する
2. `if(value==null,"new",value)` のような変換を使って文字列化する

###### replaceChars(s, s find, s replace) {#replacecharss-s-find-s-replace}

find に含まれる各文字を replace の対応位置の文字に置き換えます。例: `"Téxt thát was optícálly recógnízéd".replaceChars("áéíóú", "aeiou")` は “Text that was optically recognized” を返します。1 文字を複数文字に置き換えることはできません。

###### replaceEach(s, a find, a replace) {#replaceeach-s-a-find-a-replace}

find 配列の要素を順に replace 配列の対応要素で置換します。例: `"The cow jumps over the moon and moos".replaceEach(["th", "moo"], ["ex", "mee"])` は “The cow jumps over exe meen and mees” になります。

find と replace の配列長は一致させる必要があります。find の方が長い場合は replace の最後の要素を残りに使います。

この関数は OpenRefine 3.6 以降で利用可能です。

###### find(s, sub or p) {#finds-sub-or-p}

s の中から sub または [正規表現](expressions#grel-supported-regex) p に一致する連続部分列をすべて配列で返します。例: `"abeadsabmoloei".find(/[aeio]+/)` は `[ "a", "ea", "a", "o", "oei" ]` を返します。

sub の代わりに引用符付き文字列を渡すと、内部で正規表現に変換されます。引用符ありなら文字列、正規表現を使いたいならスラッシュで囲んでください。

:::tip

[match()](grelfunctions#matchs-p) も参照してください。

:::

###### match(s, p) {#matchs-p}

正規表現 p が文字列 s 全体に一致するかを調べ、一致するとキャプチャグループを順に格納した配列を返します。例: `"230.22398, 12.3480".match(/.*(\d\d\d\d)/)` は `[ "3480" ]` を返し、末尾の 4 桁以外は対象にしません。

結果をセルに保存するには toString() などで文字列化してください。マッチがなければ空配列 `[]`、正規表現全体が一致しないと null を返します。

正規表現はスラッシュで囲み、必要な文字をエスケープして括弧でグループ化します。たとえば `".*(\d\d\d\d)"` は 1 要素、`"(.*)(\d\d\d\d)"` は 2 要素になります。部分列が任意の場所にある場合は `value.match(/.*(desired-substring-regex).*/)` のようにします。

たとえば `value` が “hello 123456 goodbye” なら:

|Expression|Result|
|-|-|
|`value.match(/\d{6}/)` |null（全文一致しない）|
|`value.match(/.*\d{6}.*/)` |[ ]（キャプチャなし）|
|`value.match(/.*(\d{6}).*/)` |[ "123456" ]（1 要素）|
|`value.match(/(.*)(\d{6})(.*)/)` |[ "hello ", "123456", " goodbye" ]（3 要素）|

:::tip

[find()](grelfunctions#finds-sub-or-p) もどうぞ。

:::
### String parsing and splitting {#string-parsing-and-splitting}

###### toNumber(s) {#tonumbers}

文字列 s を数値に変換します。まず文字列として解釈し、その後数値に変換する処理が試みられます。すでに数値ならそのまま返ります。

###### split(s, s or p sep, b preserveTokens (optional)) {#splits-s-or-p-sep-b-preservetokens-optional}

文字列 s を sep（文字列または正規表現）で分割し、結果の文字列配列を返します。例: `"fire, water, earth, air".split(",")` は `[ "fire", " water", " earth", " air" ]`（区切り文字は除かれますが空白は残ります）。`preserveTokens` を true にすると空の要素も保持します。

###### splitByLengths(s, n1, n2, ...) {#splitbylengthss-n1-n2}

指定した長さごとに文字列を分割し、配列で返します。例: `"internationalization".splitByLengths(5, 6, 3)` は `[ "inter", "nation", "ali" ]` になります。余った文字は破棄されます。

配列を返す関数のため、返り値に対して配列スライスも利用できます。例:

|Expression|Result|
|-|-|
|`"internationalization".splitByLengths(5, 6, 3)[0,3]` |3 要素の配列 `[ "inter", "nation", "ali" ]`|
|`"internationalization".splitByLengths(5, 6, 3)[0,2]` |2 要素の配列 `[ "inter", "nation" ]`|
|`"internationalization".splitByLengths(5, 6, 3)[1,3]` |2 要素 `[ "nation", "ali" ]`|
|`"internationalization".splitByLengths(5, 6, 3)[1]` |インデックス 1 の文字列 `"nation"`|

###### smartSplit(s, s or p sep (optional)) {#smartsplits-s-or-p-sep-optional}

sep が指定されていない場合はタブやカンマを推測し、引用符やエスケープ文字にも対応して文字列を分割し、配列を返します。例: `value.smartSplit("
")` は改行ごとに分割します。

:::info
`value.escape('javascript')` を使うと、非表示文字を可視化してから smartSplit() を使うのに便利です。
:::

###### splitByCharType(s) {#splitbychartypes}

文字カテゴリ（Unicode General Category）が切り替わるたびに文字列を分割し、配列として返します。例: `"HenryCTaylor".splitByCharType()` は `[ "H", "enry", "CT", "aylor" ]`、`"BE1A3E".splitByCharType()` は `[ "BE", "1", "A", "3", "E" ]` になります。

###### partition(s, s or p fragment, b omitFragment (optional)) {#partitions-s-or-p-fragment-b-omitfragment-optional}

文字列 s の、最初の fragment の前後と fragment 自体からなる配列 `[ a, fragment, z ]` を返します。fragment は文字列または正規表現です。例: `"internationalization".partition("nation")` は `[ "inter", "nation", "alization" ]` を返します。fragment が見つからないときは `[ s, "", "" ]` です。

omitFragment を true にすると fragment は返されず `[ "inter", "alization" ]` になります。

正規表現 fragment の例: `"abcdefgh".partition(/c.e/)` は `[ "ab", "cde", "fgh" ]` を返します。

###### rpartition(s, s or p fragment, b omitFragment (optional)) {#rpartitions-s-or-p-fragment-b-omitfragment-optional}

文字列すべてではなく、最後に現れる fragment で分割して `[ a, fragment, z ]` を返します。例: `"parallel".rpartition("a")` は `[ "par", "a", "llel" ]`。他は partition と同じです。

"改善された"partition と考えることができます。
### Encoding and hashing {#encoding-and-hashing}

###### diff(s1, s2, s timeUnit (optional)) {#diffs1-s2-s-timeunit-optional}

2 つの文字列を比較し、異なる最初の位置から s2 の残りの部分を返します。例: `"cacti".diff("cactus")` は "us" を返します。日付にも使えます（[Date functions](#diffd1-d2-s-timeunit) 参照）。

###### escape(s, s mode) {#escapes-s-mode}

指定したモード（"html", "xml", "csv", "url", "javascript"）で文字列 s をエスケープします。モード名は引用符で囲んでください。[レシピ](https://github.com/OpenRefine/OpenRefine/wiki/Recipes#question-marks--showing-in-your-data) で escaping/unescaping の例を紹介しています。

###### unescape(s, s mode) {#unescapes-s-mode}

指定したモードでエスケープされた文字列 s を元に戻します。モードは escape と同じく引用符が必要です。[レシピ](https://github.com/OpenRefine/OpenRefine/wiki/Recipes#atampampt----att) を参照してください。

###### encode(s, s encoding) {#encodes-s-encoding}

文字列 s を指定したエンコーディング（"base16", "base32", "base32hex", "base64", "base64url"）でエンコードします。例: `encode("abc", "base64")` は "YWJj" です。

この関数は OpenRefine 3.6 以降で利用できます。

###### decode(s, s encoding) {#decodes-s-encoding}

指定したエンコーディングから文字列 s をデコードします。例: `decode("YWJj", "base64")` は "abc" です。

この関数も OpenRefine 3.6 以降で利用可能です。

###### md5(o) {#md5o}

オブジェクトの [MD5 ハッシュ](https://en.wikipedia.org/wiki/MD5) を返します。文字列以外（配列・数値・日付など）でも文字列化したうえでハッシュを計算します。例: `"internationalization".md5()` は `2c55a1626e31b4e373ceedaa9adc12a3` になります。

###### sha1(o) {#sha1o}

オブジェクトの [SHA-1 ハッシュ](https://en.wikipedia.org/wiki/SHA-1) を返します。同じく文字列以外を文字列化して計算します。例: `"internationalization".sha1()` は `cd05286ee0ff8a830dbdc0c24f1cb68b83b0ef36` です。

###### phonetic(s, s encoding) {#phonetics-s-encoding}

利用可能な音声アルゴリズムにより、文字列の音声符号を返します。[クラスタリングの音声手法](cellediting#clustering-methods) を参照してください。利用できる手法には [metaphone/doublemetaphone/metaphone3](https://www.wikipedia.org/wiki/Metaphone)、[soundex](https://en.wikipedia.org/wiki/Soundex)、[cologne-phonetic](https://en.wikipedia.org/wiki/Cologne_phonetics)、[daitch-mokotoff](https://en.wikipedia.org/wiki/Daitch%E2%80%93Mokotoff_Soundex)、[beider-morse](https://en.wikipedia.org/wiki/Daitch%E2%80%93Mokotoff_Soundex#Beider%E2%80%93Morse_Phonetic_Name_Matching_Algorithm) などがあります。エンコーディング名は引用符で囲んでください。例: `"Ruth Prawer Jhabvala".phonetic("metaphone")` は “R0PRWRJHBFL” を返します。

###### reinterpret(s, s encoderTarget, s encoderSource) {#reinterprets-s-encodertarget-s-encodersource}

文字列 s を指定したエンコーダーで再解釈します。ターゲットとソースの両方に [サポートされるエンコーディング](http://java.sun.com/j2se/1.5.0/docs/guide/intl/encoding.doc.html) を指定し、引用符で囲んでください。

OpenRefine はプロジェクト開始時にデータをインポートしてエンコーディングを解釈します（例: UTF-8）。reinterpret() を使えば、列を別のエンコーディングで再解釈できますが、データ修復の万能薬ではないため、必要なら新しいプロジェクトで試してから使用するのがよいでしょう。

###### fingerprint(s) {#fingerprints}

`s` の fingerprint（クラスタリングで前処理される値）を返します。空白のトリム・小文字化・句読点除去・単語のアルファベット順ソートなどを行います。例: `"Ruth  Prawer    Jhabvala".fingerprint()` は “jhabvala prawer ruth” になります。

###### ngram(s, n) {#ngrams-n}

単語の n-gram 配列を返します。例: `"Ruth Prawer Jhabvala".ngram(2)` は `[ "Ruth Prawer", "Prawer Jhabvala" ]`。n=1 なら単語のリスト、n が単語数を超えると元の文字列をひとつの配列要素として返します。

###### ngramFingerprint(s, n) {#ngramfingerprints-n}

[n-gram fingerprint](cellediting#clustering-methods) を返します。例: `"banana"` は 2-gram を生成し、重複削除・ソート後に “anbana” を返します。

###### unicode(s) {#unicodes}

文字列 s に含まれる各文字の Unicode 十進コードを配列で返します。例: `"Bernice Rubens".unicode()` は `[ 66, 101, 114, 110, 105, 99, 101, 32, 82, 117, 98, 101, 110, 115 ]`。

###### unicodeType(s) {#unicodetypes}

各文字の Unicode 型（カテゴリ）を配列で返します。例: `"Bernice Rubens".unicodeType()` は `[ "uppercase letter", "lowercase letter", … ]` などになります。
### Translating

###### detectLanguage(s) {#detectlanguages}

文字列 s の言語を判定し、ロケール（71 言語対応）を返します。例: `"Hello, world!".detectLanguage()` は `"en"` を返します。
## Format-based functions (JSON, HTML, XML) {#format-based-functions-json-html-xml}

###### jsonize(o) {#jsonizeo}

値 o を JSON リテラルとして引用します。

###### parseJson(s) {#parsejsons}

文字列 s を JSON として解析します。結果に `get()` を使えるため、`parseJson("{ 'a' : 1 }").get("a")` は 1 を返します。

たとえば `value` に以下の JSON オブジェクトがあり、「text」プロパティを持つ `keywords` をすべて取り出して連結したいとします。`forEach()` で配列を走査できます。

```json
    {
       "status":"OK",
       "url":"",
       "language":"english",
       "keywords":[
          {
             "text":"York en route",
             "relevance":"0.974363"
          },
          {
             "text":"Anthony Eden",
             "relevance":"0.814394"
          },
          {
             "text":"President Eisenhower",
             "relevance":"0.700189"
          }
       ]
    }
```

`forEach(value.parseJson().keywords, v, v.text).join(":::")` のように書けば `York en route:::Anthony Eden:::President Eisenhower` を返します。
### Jsoup XML and HTML parsing {#jsoup-xml-and-html-parsing}

###### parseHtml(s) {#parsehtmls}

HTML を含むセルを解析し、自己終了タグの末尾の “ /” を削除したり、閉じていないタグを補完したり、改行・インデントを挿入して整形します。URL を直接渡すことはできませんが、<span class="menuItems">[Add column by fetching URLs](columnediting#add-column-by-fetching-urls)</span> で事前に取得した HTML を解析できます。

`parseHtml()` の結果はセルにそのまま保持されないので、`toString()` などで文字列化してください（例: `value.parseHtml().toString()`）。

HTML を整形する過程では推測を行うため、タグの補完で意図しない結果になることもあるので、必要に応じて手動で確認してください。

その後、[select()](#selects-element) を使って必要な要素を抽出し、分割・partition などの処理に渡せます。`parseHtml().select()` で div 以下の tr を抽出する例は [StrippingHTML](https://github.com/OpenRefine/OpenRefine/wiki/StrippingHTML) を参照してください。

###### parseXml(s) {#parsexmls}

XML を含むセルを解析し、不足している閉じタグを補いつつ XML ドキュメントを返します。以後は parseHtml と同様に [select()](#selects-element) と組み合わせて任意の部分を抽出できます。

###### select(s, element) {#selects-element}

HTML や XML ドキュメントから Jsoup セレクタ（https://jsoup.org/apidocs/org/jsoup/select/Selector.html）で一致した要素をすべて配列で返します。例: `value.parseHtml().select("img.portrait")[0]` は、parsed HTML 内の最初の `img` タグ（class=portrait）を返します。見つからなければ空配列です。`toString()` と組み合わせてセルに保存します。チュートリアルは [StrippingHTML](https://github.com/OpenRefine/OpenRefine/wiki/StrippingHTML) にあります。

複数回 select() をチェーンできます:

```
value.parseHtml().select("div#content")[0].select("tr").toString()
```

###### htmlAttr(s, element) {#htmlattrs-element}

HTML 要素の属性値を文字列で返します。例: `value.parseHtml().select("a.email")[0].htmlAttr("href")` は email クラスのリンクの href を返します。

###### xmlAttr(s, element) {#xmlattrs-element}

XML 要素の属性値を返します。htmlAttr と同様に parseXml() と組み合わせて使います。

###### htmlText(element) {#htmltextelement}

HTML 要素（子要素を含む）のテキストのみを取り出し、HTML タグや改行を除いた文字列を返します。例: `value.parseHtml().select("div.footer")[0].htmlText()`。

###### xmlText(element) {#xmltextelement}

XML 要素（子要素含む）のテキストを返します。htmlText と同様に parseXml() と select() で使います。

###### wholeText(element) {#wholetextelement}

要素とその子要素に含まれる非エンコードのテキスト（改行・空白を含む）をそのまま返します。例: `value.parseHtml().select("div.footer")[0].wholeText()`。

この関数は OpenRefine 3.5 以降で利用できます。

###### innerHtml(element) {#innerhtmlelement}

HTML 要素の [inner HTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) を返します。子要素も含めた HTML コードです。parseHtml() と select() の結果を渡します。

###### innerXml(element) {#innerxmlelement}

XML 要素の内側にある子要素（テキストではない）を返します。直接のテキストを取り出すには ownText()、両方を得たいときは xmlText() を使います。

###### ownText(element) {#owntextelement}

指定した HTML/XML 要素の直下にあるテキストだけを返します（子要素内のテキストは含まない）。parseHtml()/parseXml() と select() と組み合わせて使います。

###### parent(element) {#parentelement}

要素の親ノードを返します。親がなければ null。

この関数は OpenRefine 3.6 以降で利用できます。
### URI parsing {#uri-parsing}

###### parseUri(s) {#parseUris}

有効な URI（例: `https://www.openrefine.org:80/documentation#download?format=xml&os=mac`）を解析し、以下のプロパティを持つ JSON オブジェクトを返します:
 - `scheme`: URI のスキーム（例: `http`）
 - `host`: ホスト名（例: `www.openrefine.org`）
 - `port`: ポート番号（例: `80`）
 - `path`: パス（例: `/documentation`）
 - `query`: クエリ文字列（例: `format=xml&os=mac`）
 - `authority`: 権限部分（例: `www.openrefine.org:80`）
 - `fragment`: フラグメント（例: `download`）
 - `query_params`: クエリを JSON オブジェクトにしたもの（例: `{format: "xml", os: "mac"}`）
## Array functions {#array-functions}

###### length(a) {#lengtha}

配列 a の要素数を返します。

###### slice(a, n from, n to (optional)) {#slicea-n-from-n-to-optional}

配列 a からインデックス `from` から `to`（未満）までの部分配列を返します。to を省略すると末尾までです。

###### get(a, n from, n to (optional)) {#geta-n-from-n-to-optional}

配列 a の `from` から `to-1` までの部分配列・要素を返します。文字列と同じく負のインデックスも使えます。

###### inArray(a, s) {#inarraya-s}

文字列 s が配列 a に含まれるかを真偽値で返します。

###### reverse(a) {#reversea}

配列 a を逆順にして返します。

###### sort(a) {#sorta}

配列 a を昇順に並び替えて返します。

###### sum(a) {#suma}

数値の配列 a の合計を返します。

###### join(a, sep) {#joina-sep}

配列 a の要素を sep で連結した文字列を返します。

###### uniques(a) {#uniquesa}

配列 a の重複を取り除いた要素を返します。

###### zip(a, b, …) {#zipa-b}

複数の配列を同じインデックスごとにまとめ、配列の配列として返します。例: `zip([1, 2], ["a", "b"])` は `[ [1, "a"], [2, "b"] ]` を返します。
## Date functions {#date-functions}

###### now() {#now}

システム時刻に基づく日付オブジェクトを返します。`now()` は `[date 2020-11-26T15:53:00Z]` のような値になり、`now.toString()` は `"Nov 26, 2020"` になります。

###### toDate(o, b monthFirst, s format1, s format2, ...) {#todateo-b-monthfirst-s-format1-s-format2-}

オブジェクト o を日付オブジェクトに変換します。引数なしなら ISO 8601 拡張形式を返します。引数を指定すると書式を制御できます:
* `monthFirst`: 月が先の場合は true（デフォルト）、日が先なら false
* `formatN`: [SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) 構文で指定した候補書式の順にパースを試みます

たとえば “Nov-09” や “11/09” の混在する列では `value.toDate('MM/yy','MMM-yy').toString('yyyy-MM')` とすれば両者とも “2009-11” になります。また “1/4/2012 13:30:00” は `value.toDate('d/M/y H\:m\:s')` でパースできます。テキストで言語が異なる場合は `format1` に言語コードを渡します。たとえばフランス語 “10 janvier 2023” は `value.toDate('fr','dd MMM yyyy')` で処理できます。

| 文字 | 日付/時刻要素 | 表示 | 例 |
|-|-|-|-|
| G | Era 指示子 | テキスト | AD |
| u | Year | 年 | 1996; 96 |
| y | year-of-era | 年 | 1996; 96 |
| M/L | Month | 数値/テキスト | 7; 07; Jul; July; J |
| Q/q | quarter-of-year | 数値/テキスト | 3; 03; Q3; 3rd quarter |
| Y | week-based-year | 年 | 1996; 96 |
| w | Week in year | 数値 | 27 |
| W | Week in month | 数値 | 2 |
| D | Day in year | 数値 | 189 |
| d | Day in month | 数値 | 10 |
| F | Day of week in month | 数値 | 2 |
| E | Day name in week | テキスト | Tuesday; Tue |
| e/c | localized day-of-week | 数値/テキスト | 2; 02; tue; tuesday; T |
| a | AM/PM | テキスト | PM |
| H | Hour in day (0-23) | 数値 | 0 |
| k | Hour in day (1-24) | 数値 | 24 |
| K | Hour in AM/PM (0-11) | 数値 | 0 |
| h | Hour in AM/PM (1-12) | 数値 | 12 |
| m | Minute in hour | 数値 | 30 |
| s | Second in minute | 数値 | 55 |
| S | Millisecond | 数値 | 978 |
| n | Nanosecond | 数値 | 789000 |
| z | Time zone | 一般的なタイムゾーン | Pacific Standard Time; PST; GMT-08:00 |
| Z | Time zone | RFC 822 表記 | -0800 |
| X | Time zone | ISO 8601 表記 | -08; -0800; -08:00 |

###### diff(d1, d2, s timeUnit) {#diffd1-d2-s-timeunit}

2 つの日付の差を timeUnit（下表参照）で数値として返します。例: `diff(("Nov-11".toDate('MMM-yy')), ("Nov-09".toDate('MMM-yy')), "weeks")` は 104（週）つまり 2 年になります。後の日付を先にし、結果が負なら d1 と d2 を逆にしてください。

文字列も扱えます（[String functions の diff](#diffsd1-sd2-s-timeunit-optional)）。

###### inc(d, n, s timeUnit) {#incd-n-s-timeunit}

日付 d を指定した timeUnit だけ増減します（デフォルトは "hour"）。正の値で未来、負の値で過去へ移動します。たとえば 2 か月前に移動するには `value.inc(-2, "month")` を使います。

###### datePart(d, s timeUnit) {#datepartd-s-timeunit}

timeUnit に応じた日付要素を返します（下表参照）。戻り値の型は要素によって異なります。

| Unit | 戻り値の要素 | 型 | 例（`[date 2014-03-14T05:30:04.000789000Z]` を value とした場合） |
|-|-|-|-|
| years/year | 年 | 数値 | value.datePart("years") → 2014 |
| months/month | 月 | 数値 | value.datePart("months") → 2 |
| weeks/week/w | 月内の週 | 数値 | value.datePart("weeks") → 3 |
| days/day/d | 月の日 | 数値 | value.datePart("days") → 14 |
| weekday | 曜日 | 文字列 | value.datePart("weekday") → Friday |
| hours/hour/h | 時 | 数値 | value.datePart("hours") → 5 |
| minutes/minute/min | 分 | 数値 | value.datePart("minutes") → 30 |
| seconds/sec/s | 秒 | 数値 | value.datePart("seconds") → 04 |
| milliseconds/ms/S | ミリ秒 | 数値 | value.datePart("milliseconds") → 789 |
| nanos/nano/n | ナノ秒 | 数値 | value.datePart("n") → 789000 |
| time | Unix Epoch からのミリ秒 | 数値 | value.datePart("time") → 1394775004000 |

###### timeSinceUnixEpochToDate(duration, scale)

Unix Epoch（1970-01-01）からの経過時間を日付オブジェクトに変換します。scale には "second", "millisecond", "microsecond" を指定でき、省略時は "second" です。

この関数は OpenRefine 3.6 以降で利用できます。
## Math functions {#math-functions}

整数除算と精度に関しては `1 / 2` のように記述すると `floor(1/2)` と同様に小数点以下を切り捨てた結果になります。いずれかのオペランドが浮動小数点なら両方が浮動小数点に昇格し、浮動小数点の結果になります。変数の型が不明な場合は `1 / 2.0` や `1.0 / 2`、`1.0 * x / y` のように使ってください。

:::caution
一部の数学関数はドット記法で整数を直接渡すと整数を返したままになる場合があります（例: `5.cos()` は 5 のまま）。成功させるには括弧で値を囲んで `(value).cos()` のようにしてください。
:::

|Function|Use|Example|
|-|-|-|
|`abs(n)`|数値の絶対値を返します。|`abs(-6)` は 6。|
|`acos(n)`|アークコサイン（0〜[PI](https://docs.oracle.com/javase/8/docs/api/java/lang/Math.html#PI)）。|`acos(0.345)` は 1.218557541697832。|
|`asin(n)`|アークサイン（-PI/2〜PI/2）。|`asin(0.345)` は 0.35223878509706474。|
|`atan(n)`|アークタンジェント（-PI/2〜PI/2）。|`atan(0.345)` は 0.3322135507465967。|
|`atan2(n1, n2)`|直交座標から極座標（θ）を返します。|`atan2(0.345,0.6)` は 0.5218342798144103。|
|`ceil(n)`|天井関数（切り上げ）。|`3.7.ceil()` は 4、`-3.7.ceil()` は -3。|
|`combin(n1, n2)`|n2 個から n1 個選ぶ組合せ数。|`combin(20,2)` は 190。|
|`cos(n)`|コサイン。|`cos(5)` は 0.28366218546322625。|
|`cosh(n)`|ハイパボリックコサイン。|`cosh(5)` は 74.20994852478785。|
|`degrees(n)`|ラジアンを度に変換。|`degrees(5)` は 286.4788975654116。|
|`even(n)`|最も近い偶数に切り上げ。|`even(5)` は 6。|
|`exp(n)`|e の n 乗。|`exp(5)` は 148.4131591025766。|
|`fact(n)`|階乗（1 から）。|`fact(5)` は 120。|
|`factn(n1, n2)`|n1 の階乗を n2 から始めて計算。|`factn(10,3)` は 280。|
|`floor(n)`|床関数（切り捨て）。|`3.7.floor()` は 3、`-3.7.floor()` は -4。|
|`gcd(n1, n2)`|最大公約数（Greatest Common Divisor）。|`gcd(95,135)` は 5。|
|`lcm(n1, n2)`|最小公倍数（Least Common Multiple）。|`lcm(95,135)` は 2565。|
|`ln(n)`|自然対数。|`ln(5)` は 1.6094379124341003。|
|`log(n)`|常用対数。|`log(5)` は 0.6989700043360189。|
|`max(n1, n2)`|大きい方の数。|`max(3,10)` は 10。|
|`min(n1, n2)`|小さい方の数。|`min(3,10)` は 3。|
|`mod(n1, n2)`|剰余（`value.mod(9)` は動くが `74.mod(9)` は動かない）。|`mod(74, 9)` は 2。|
|`multinomial(n1, n2 …(optional))`|多項分布。|`multinomial(2,3)` は 10。|
|`odd(n)`|最も近い奇数に切り上げ。|`odd(10)` は 11。|
|`pow(n1, n2)`|n1 の n2 乗（`value.pow(3)` は動くが `2.pow(3)` は動かない）。|`pow(2,3)` は 8、`pow(3,2)` は 9。平方根は `value.pow(0.5)` で得られます。|
|`quotient(n1, n2)`|割り算の整数部分（切り捨て）。|`quotient(9,2)` は 4。|
|`radians(n)`|度をラジアンに。|`radians(10)` は 0.17453292519943295。|
|`random(n lowerBound, n upperBound)`|指定範囲（両端含む）の乱数。各セルごとに異なる結果。引数なしなら `0.0 <= x < 1.0`。|
|`round(n)`|四捨五入。|`3.7.round()` は 4、`-3.7.round()` は -4。|
|`sin(n)`|サイン。|`sin(10)` は -0.5440211108893698。|
|`sinh(n)`|ハイパボリックサイン。|`sinh(10)` は 11013.232874703393。|
|`sum(a)`|配列内の数値を合計。非数値は無視し、数値がなければ 0。|`sum([ 10, 2, three ])` は 12。|
|`tan(n)`|タンジェント。|`tan(10)` は 0.6483608274590866。|
|`tanh(n)`|ハイパボリックタンジェント。|`tanh(10)` は 0.9999999958776927。|
## Other functions {#other-functions}

###### type(o) {#typeo}

o のデータ型（undefined、string、number、boolean など）を文字列で返します。例: [Transform](cellediting#transform) で `value.type()` を使うと、列内のセルがデータ型名の文字列に変換されます。

###### facetCount(choiceValue, s facetExpression, s columnName) {#facetcountchoicevalue-s-facetexpression-s-columnname}

columnName 列で facetExpression に一致する choiceValue のカウントを返します。たとえば下の表で “Gift” を基準に新しい列を作り `value.facetCount("value", "Gift")` を使うと、“Count” 列にカウントが追加されます。

| Gift | Recipient | Price | Count |
|-|-|-|-|
| lamp | Mary | 20 | 1 |
| clock | John | 57 | 2 |
| watch | Amit | 80 | 1 |
| clock | Claire | 62 | 2 |

facetExpression は引用符で囲むと値の前処理（例: fingerprint()）も可能です。例: `(value.fingerprint()).facetCount(value.fingerprint(), "Gift")`。

###### hasField(o, s name) {#hasfieldo-s-name}

o が `name` という member field を持っているかどうかを真偽値で返します。例: `cell.recon.hasField("match")` は、リコンシリエーションがまだ選択されていなければ false、選択済みなら true です。ドット付きのフィールド（例: `cell.hasField("recon.match")`）は正しく動作しません。

###### coalesce(o1, o2, o3, ...) {#coalesceo1-o2-o3-}

最初の null でない値を返します。例: `coalesce(value, "")` は `value` が null のときに空文字を返します。

###### cross(cell, s projectName (optional), s columnName (optional)) {#crosscell-s-projectname-optional-s-columnname-optional}

他プロジェクト projectName の columnName 列と現在のセルの内容が一致する行をすべて配列で返します。たとえば “People” プロジェクトの “Name” 列を参照して住所を取得したいときは、名前列で次の式を使います:
```
cell.cross("People","Name")[0].cells["Address"].value
```
この式は現在の列と “People” の “Name” を照合し、それに対応する “Address” を取得します。

cross() を使う前にキー列を trim() したり、重複を整理したりすると結果が安定します。

第 1 引数に `cell` を渡すと `cell.value` として扱われます。projectName と columnName を省略すると、現在のプロジェクトとインデックス列（0 番）を使います。

cross() のレシピや例は [Wiki](https://github.com/OpenRefine/OpenRefine/wiki/Recipes#combining-datasets) を参照してください。
