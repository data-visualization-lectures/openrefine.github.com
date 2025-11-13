---
id: writing-extensions
title: 拡張機能の作成
sidebar_label: 拡張機能の作成
---

## はじめに {#introduction}

OpenRefine 拡張の構造を手短に紹介します。詳細な手順は以下の資料を参照してください。

* Giuliano Tortoreto による [OpenRefine 拡張ビルド手順](https://github.com/giTorto/OpenRefineExtensionDoc/raw/master/main.pdf)
* Owen Stephens による [GREL 関数を追加する拡張ガイド](http://www.meanboyfriend.com/overdue_ideas/2017/05/writing-an-extension-to-add-new-grel-functions-to-openrefine/)

OpenRefine は改良版 [Butterfly フレームワーク](https://github.com/OpenRefine/simile-butterfly/tree/openrefine) を利用して拡張を提供しています。拡張は Butterfly のモジュールとして実装し、設定で参照します。

コアに同梱の拡張は [`extensions/`](https://github.com/OpenRefine/OpenRefine/tree/master/extensions) 配下にありますが、自作拡張は任意の場所に置けます。以下のいずれかでパスを指定してください。

- `main/webapp/WEB-INF/butterfly.properties` の `butterfly.modules.path` にディレクトリを追加
- OpenRefine 起動時に `-Dbutterfly.modules.path=modules,../../extensions,/path/to/ext` を指定（プロパティを上書きするため既定値も含める）

依存ライブラリは各自で同梱し、OpenRefine のパッケージ変更に左右されないようにしてください。

### ディレクトリ構成 {#directory-layout}

```
pom.xml
src/... Java ソース
module/
  *.html, *.vt
  scripts/*.js
  styles/*.css
  images/**
  MOD-INF/
    lib/*.jar
    classes/**
    module.properties
    controller.js
```

`module.properties`（[例](https://github.com/OpenRefine/sample-extension/blob/master/module/MOD-INF/module.properties)）にはメタデータを記述します。

```
name = my-extension-name
requires = core
```

`module/` 以下のリソースは `http://127.0.0.1:3333/extension/my-extension-name/` から参照されます。`controller.js` に `init()` を実装し、OpenRefine へのフック登録を行います（[サンプル](https://github.com/OpenRefine/sample-extension/blob/master/module/MOD-INF/controller.js)）。

`pom.xml` は Maven ビルド定義で、Java コードと依存ライブラリを `module/MOD-INF/lib` に出力します。OpenRefine の Java クラスを参照するため、Maven で適切に依存を追加してください。

## サンプル拡張 {#sample-extension}

[サンプル拡張](https://github.com/OpenRefine/sample-extension) を複製して開始できます。`module/MOD-INF/controller.js` 内の名称を変更してください。

### 基本構成 {#basic-structure}

```
sample-extension/
  pom.xml
  src/main/java/com/google/refine/sampleExtension/**
  module/
    MOD-INF/module.properties
    MOD-INF/controller.js
    ...
```

`controller.js` は以下のように記述します。

```javascript
function init() {
  Refine.actionAreas.push({
    id: 'gdata',
    label: 'Google Data',
    uiClass: GDataExtension.CreateProjectUI
  });
}
```

OpenRefine 起動時にモジュールが読み込まれます。

### サンプル拡張の利用 {#using-the-sample-extension}

1. リポジトリを clone
2. サンプル拡張を `extensions/` にコピー
3. `cd sample-extension && mvn package`
4. OpenRefine を起動し、新メニューを確認

## リモート API エンドポイント {#remote-api-endpoints}

多くの UI は OpenRefine の JSON API を叩きます。`module.properties` の `endpoints` でエンドポイントを追加し、`controller.js` でルーティングします。

```properties
endpoints = extension
```

```javascript
module.exports = {
  init() {},
  process(req, res) {
    if (req.path === '/extension/my-extension-name/do-something') {
      // 処理
    }
  }
};
```

## GitHub Action で CI とリリース {#github-actions}

サンプル拡張には Maven テストを実行する [workflow](https://github.com/OpenRefine/sample-extension/blob/master/.github/workflows/maven.yml) と、タグ作成で GitHub Release を生成する [workflow](https://github.com/OpenRefine/sample-extension/blob/master/.github/workflows/release.yml) が含まれています。`GITHUB_TOKEN` に `WRITE` 権限が必要です。

## 外部リファレンス {#external-references}

- [OpenRefine Extension Doc](https://github.com/giTorto/OpenRefineExtensionDoc/raw/master/main.pdf)
- [GREL 関数拡張の例](http://www.meanboyfriend.com/overdue_ideas/2017/05/writing-an-extension-to-add-new-grel-functions-to-openrefine/)
