---
id: jythonclojure
title: Jython & Clojure
sidebar_label: Jython & Clojure
---

## Jython {#jython}

OpenRefine 3.4.1 以降の標準インストールには Jython 2.7.2 が同梱されています。[このチュートリアル](https://github.com/OpenRefine/OpenRefine/wiki/Extending-Jython-with-pypi-modules) に従えばライブラリやコードを追加できます。多くの Python ファイル（`.py`, `.pyc`）に対応しています。

C 言語のバインディングに依存する Python コードは、Java / Jython 環境の OpenRefine では動作しません。Jython は実質的に Java なので、Java ライブラリをインポートして利用することもできます。

新たな Jython/Python ライブラリを使うには OpenRefine を再起動し、起動時に初期化されるようにしてください。

現在 OpenRefine には HTML/XML を扱うための [Jsoup.org ライブラリの大部分](grelfunctions#jsoup-xml-and-html-parsing-functions) が GREL 関数として組み込まれています。

### Syntax {#syntax}

Jython 式では `return` 文を使う必要があります:

```
  return value[1:-1]
```

```
  return rowIndex % 2
```

フィールドにはドット記法ではなく角括弧でアクセスします:

```
  return cells["col1"]["value"]
```

たとえば [リコンシリエーション変数](expressions#reconciliation) を使って一致距離（[edit distance](reconciling#reconciliation-facets)）を取得するには:

```
  return cell["recon"]["features"]["nameLevenshtein"]
```

`value` が null でなければ小文字化して返す例:

```
  if value is not None:
    return value.lower()
  else:
    return None
```

### Tutorials {#tutorials}

*   [Extending Jython with pypi modules](https://github.com/OpenRefine/OpenRefine/wiki/Extending-Jython-with-pypi-modules)
*   [Java ライブラリを Python 内で使って電話番号を扱う](https://github.com/OpenRefine/OpenRefine/wiki/Jython#tutorial---working-with-phone-numbers-using-java-libraries-inside-python)

Jython 言語の詳細は公式サイト [http://www.jython.org](http://www.jython.org) をご覧ください。

## Clojure {#clojure}

OpenRefine 3.4.1 の標準インストールには Clojure 1.10.1 が同梱されています。現時点で [variables](expressions#variables) のうち Jython で利用できるのは `value`, `row`, `rowIndex`, `cell`, `cells` です。

たとえば次のような形式が使えます:

```
(.. value (toUpperCase) )
```

または:

```
(-> value (str/split #" ") last )
```

これは GREL の `value.split(" ")` と同等の動作です。

構文に関するヘルプは [Clojure 公式の構文ガイド](https://clojure.org/guides/learn/syntax) を参照してください。

Clojure のユーザー提供レシピは [https://github.com/OpenRefine/OpenRefine/wiki/Recipes#11-clojure](https://github.com/OpenRefine/OpenRefine/wiki/Recipes#11-clojure) にまとめられています。

Clojure 言語のドキュメントは公式サイト [https://clojure.org/](https://clojure.org/) にあります。
