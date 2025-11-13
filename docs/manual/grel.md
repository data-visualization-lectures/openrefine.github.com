---
id: grel
title: GREL（General Refine Expression Language）
sidebar_label: GREL の基礎
---

## Basics {#basics}

GREL（General Refine Expression Language）は JavaScript 風の構文が特徴です。式では変数とデータ型を活用して文字列操作や数値計算を行います。

|Example|Output|
|---|---|
| `value + " (approved)"` | 2 つの文字列を連結。セル内の値はいったん文字列に変換されます。 |
| `value + 2.239`    | 数値なら 2.239 を足し、文字列なら末尾に "2.239" を連結します。 |
| `value.trim().length()` | 前後の空白を除去したうえで文字数を返します。 |
| `value.substring(7, 10)` | 文字列のインデックス 7〜9 の部分列を返します（10 は含まない）。 |
| `value.substring(13)` | インデックス 13 以降の部分列を返します。 |

文字列の連結演算子は `+`（Excel の `&` ではない）です。

条件判定には `<` や `>`、`*`、`/` などの記号を使い、`value=="true"` のように `==` を使って等価性を比較します。

[GREL 関数ページ](grelfunctions) には各関数の入力と出力の説明があります。以降では GREL 式の一般的な性質を見ていきます。

## Operators {#operators}

#### Arithmetic Operators {#arithmetic-operators}

詳細は [GREL functions の Division Operator](grelfunctions#math-functions) を参照してください。

###### Modulus {#modulus}

`%` 演算子は、両方のオペランドが整数なら整数の結果を返します（例: `1 % 2` は 1）。どちらかが浮動小数点（例: `1.0 % 2`）だと浮動小数点に昇格し、そのまま浮動小数点の結果になります。浮動小数点の精度により期待した値とならないことがある点に注意してください。

###### Multiplication {#multiplication}

`*` 演算子はオペランドのデータ型に応じて挙動が変わります。両方とも整数なら結果は整数、どちらかが浮動小数点なら浮動小数点になります。`3.5 * 2` のような単純な計算も可能です。

#### Relational Operators {#relational-operators}

`==`/`!=` は等価・非等価を評価します。たとえば `"a" == "b"` は false、`"a" != "b"` は true を返します。整数なら `5 == 5` は true、`3 != 3` は false です。

`<` は左オペランドが小さいか、`<=` は小なりイコールかを確認し、`>`/`>=` も同様に動作します。これらは数値・文字列・日付に適用できます。

#### References {#references}

- [String Concatenation](/docs/manual/grel#basic)
- [Logical Functions](/docs/manual/grelfunctions#boolean-functions)

## Syntax {#syntax}

GREL の関数は次のいずれかの形式で記述できます:
*   `functionName(arg0, arg1, ...)`
*   `arg0.functionName(arg1, ...)`

後者は読みやすさのための省略記法で、最初の引数を先頭に出してドットでつなぎます。

|Dot notation |Full notation |
|-|-|
| `value.trim().length()` | `length(trim(value))` |
| `value.substring(7, 10)` | `substring(value, 7, 10)` |

ドット記法では、関数は左から順に呼び出され、括弧の内側を逆順にたどる必要がありません。複数の関数を連結して読みやすくできます。

ドット記法は [variables](expressions#variables) の member field にも使えます。空白を含む列名の参照にはドットの代わりに角括弧を使います。

|Example |Description |
|-|-|
| `cells.FirstName` | 現在の行の “FirstName” 列のセルを取得 |
| `cells["First Name"]` | 空白を含む “First Name” 列のセルを取得 |

角括弧は部分列や部分配列、配列から特定要素を取り出すのにも使えます。

|Example |Description |
|-|-|
| `value[1,3]` | インデックス 1 から 3 未満までの部分列 |
| `"internationalization"[1,-2]` | 終端から数えて 2 文字前までの部分列 “nternationalizati” |
| `row.columnNames[5]` | 5 番目の列名 |

配列を返す関数であれば角括弧で特定要素だけを選んで文字列として出力できます（配列のインデックスは 0 始まり）。

たとえば [partition()](grelfunctions#partitions-s-or-p-fragment-b-omitfragment-optional) は前方・一致部分・後方の 3 要素を持つ配列を返しますが、`"internationalization".partition("nation")[2]` または `[-1]` を使えば “alization” を取り出せます。

## Controls {#controls}

GREL の control は分岐・繰り返しを提供する構文で、すべての引数を事前に評価する関数とは異なり、何を実行するかを制御できます。control は評価対象の引数を選び出し、評価環境を変更することもあります。

control 名は大文字小文字を区別します（例: `isError()` は `iserror()` では動きません）。

#### if(e, eTrue, eFalse) {#ife-etrue-efalse}

式 e を評価し true なら eTrue、false なら eFalse を評価した結果を返します。

| Example expression                                                            | Result    |
| ------------------------------------------------------------------------ | ------------ |
| `if("internationalization".length() > 10, "big string", "small string")` | “big string” |
| `if(mod(37, 2) == 0, "even", "odd")`                                  | “odd”     |

ネストした if（switch 相当）の例:

```
if(value == 'Place', 'http://www.example.com/Location',
  if(value == 'Person', 'http://www.example.com/Agent',
    if(value == 'Book', 'http://www.example.com/Publication',
      null)))
```

#### with(e1, variable v, e2) {#withe1-variable-v-e2}

式 e1 を評価して変数 v に束縛し、e2 を評価して結果を返します。

| Example expression                                                                        | Result |
| ------------------------------------------------------------------------------------ | ---------- |
| `with("european union".split(" "), a, a.length())`                                | 2    |
| `with("european union".split(" "), a, forEach(a, v, v.length()))`                 | [ 8, 5 ] |
| `with("european union".split(" "), a, forEach(a, v, v.length()).sum() / a.length())` | 6.5 |

#### filter(e1, v, e test) {#filtere1-v-e-test}

式 e1 を配列として評価し、各要素を変数 v に束縛して test（真偽値）を評価します。true なら v を結果に含めます。

| Expression                                  | Result     |
| ---------------------------------------------- | ------------- |
| `filter([ 3, 4, 8, 7, 9 ], v, mod(v, 2) == 1)` | [ 3, 7, 9 ] |

#### forEach(e1, v, e2) {#foreache1-v-e2}

式 e1 を配列として評価し、各要素を変数 v に束縛して e2 を評価し、結果配列に追加します。e1 が JSON オブジェクトならキーごとに反復します。

| Expression                              | Result           |
| ------------------------------------------ | ------------------- |
| `forEach([ 3, 4, 8, 7, 9 ], v, mod(v, 2))` | [ 1, 0, 0, 1, 1 ] |

#### forEachIndex(e1, i, v, e2) {#foreachindexe1-i-v-e2}

式 e1 を配列として評価し、各要素のインデックスを i、値を v に束縛して e2 を評価します。

| Expression                                                                   | Result                   |
| ------------------------------------------------------------------------------- | --------------------------- |
| `forEachIndex([ "anne", "ben", "cindy" ], i, v, (i + 1) + ". " + v).join(", ")` | 1. anne, 2. ben, 3. cindy |

#### forRange(n from, n to, n step, v, e) {#forrangen-from-n-to-n-step-v-e}

変数 v を from から to 未満まで step ずつ増やしながら繰り返し、各イテレーションで e を評価して結果配列に追加します。

#### forNonBlank(e, v, eNonBlank, eBlank) {#fornonblanke-v-enonblank-eblank}

式 e を評価し、非空ならその値を v に束縛して eNonBlank を評価して返します。空なら eBlank を評価して返します。

ほかの “for” 系とは異なり繰り返し処理ではなく、`isNonBlank()` を使った if 文の簡潔な構文です。

#### isBlank(e), isNonBlank(e), isNull(e), isNotNull(e), isNumeric(e), isError(e) {#isblanke-isnonblanke-isnulle-isnotnulle-isnumerice-iserrore}

式 e を評価し、名前が示す条件を満たすかどうかを真偽値で返します。

| Expression       | Result  |
| ------------------- | ------- |
| `isBlank("abc")` | false |
| `isNonBlank("abc")` | true |
| `isNull("abc")` | false |
| `isNotNull("abc")` | true |
| `isNumeric(2)` | true  |
| `isError(1)` | false |
| `isError("abc")` | false |
| `isError(1 / 0)` | true  |

これらは dot 記法で呼べない「制御構文」である点に注意してください（`e.isX()` の形式は使えません）。

## Constants {#constants}

|Name |Meaning |
|-|-|
| true | 真（boolean）定数 |
| false | 偽（boolean）定数 |
| PI | [Java の Math.PI](https://docs.oracle.com/javase/8/docs/api/java/lang/Math.html#PI) から取得した円周率（3.1415...） |
