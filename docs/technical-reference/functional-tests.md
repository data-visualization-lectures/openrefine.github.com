---
id: functional-tests
title: 機能テスト
sidebar_label: 機能テスト
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## 概要 {#introduction}

OpenRefine の Web インターフェースは [Cypress](https://www.cypress.io/) でテストしています。Cypress は実際のブラウザーを使ってアサーションを行うため、実ユーザーと同じ操作感でテストできます。バックエンド（サーバー）も含めて検証する **E2E（End-to-End）テスト** です。

Cypress テストの実行方法は 2 つあります。

- Cypress Test Runner（開発モード）
- コマンドライン（CI/CD モード）

テストを作成・調整する際は Test Runner で十分です。CI/CD モードは主に GitHub Actions などの自動実行で利用されます。

## Cypress の概要 {#cypress-brief-overview}

Cypress はブラウザー内で動作し、内部的に Node.js を使用します。これは Selenium などとの大きな違いです。

**Cypress ドキュメントより:**

> テストコードは **ブラウザー内で評価されます**。Node やサーバー側の言語ではありません。サポートする言語は Web の言語、すなわち JavaScript だけです。

おすすめの読み物:
- [Getting started guide](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Write-your-first-test)
- [Trade-offs](https://docs.cypress.io/guides/references/trade-offs.html#Permanent-trade-offs-1)

一般的な Cypress テストの流れ:

1. ブラウザーを起動（`yarn run cypress open`）
2. URL にアクセス
3. ユーザーアクションをトリガー
4. セレクターで DOM のテキストや要素を検証

## はじめ方 {#getting-started}

初めて Cypress を使う場合は、以下の資料で仕組みを把握しておくとスムーズです。

- [Cypress overview](https://docs.cypress.io/guides/overview/why-cypress.html)
- [サンプルとシンタックス](https://example.cypress.io/)

### 1. Cypress のインストール {#1-install-cypress}

- [公式インストールガイド](https://docs.cypress.io/app/get-started/install-cypress)

必要なもの:

- [Node.js 20.x/22.x 以上](https://nodejs.org)
- [Yarn または NPM](https://yarnpkg.com/)
- Unix/Linux シェル、または Windows コマンドライン

依存関係を含めてインストール:

```shell
cd ./main/tests/cypress
yarn install
```

### 2. テストランナーを起動 {#2-start-the-test-runner}

テストランナーは OpenRefine がローカルで起動していることを前提にします（テスト側で起動・再起動はしません）。

リポジトリルートで OpenRefine を起動:

```shell
cd ../../..
./refine
```

続いて Cypress を起動:

```shell
yarn --cwd ./main/tests/cypress run cypress open
```

### 3. 既存テストの実行 {#3-run-the-existing-tests}

Cypress Launchpad が開いたら「E2E Testing」を選び、実行したいテストをクリックします。複数選択も可能です。

### 4. 最初のテストを追加 {#4-add-your-first-test}

- `main/tests/cypress/cypress/e2e` に `test.spec.js` を作成
- すぐにリストへ反映されます
- テスト名をクリックし、コードを追加

## テスト技術ドキュメント {#tests-technical-documentation}

### 代表的なテスト {#a-typical-test}

```javascript
it('Ensure cells are blanked down', function () {
  cy.loadAndVisitProject('food.mini');
  cy.get('.viewpanel-sorting a').contains('Sort').click();
  cy.get('.viewpanel').should('to.contain', 'Something');
});
```

冒頭の説明文（`Ensure cells are blanked down`）でテスト内容を明示します。行頭の `cy.` が Cypress のコマンドです。

例:
- `cy.get('a.my-class')`: `<a class="my-class" />` 要素を取得
- `cy.click()`: 要素をクリック
- `cy.should('to.contains', 'my text')`: アサーション

OpenRefine 独自のヘルパーもいくつか用意しています。
- `cy.loadAndVisitProject`: 指定データで新規プロジェクトを作成
- `cy.assertCellEquals`: セル内容を検証

詳細は後述の「テストユーティリティ」を参照してください。

### テストのガイドライン {#testing-guidelines}

- `cy.wait` は最後の手段（基本的にアンチパターン）
- テスト同士は独立させ、1 つの機能に集中する
- 毎回新しい OpenRefine プロジェクトで開始する
- ファイル名は UI 上の位置に合わせる
- Facet など hover で表示される要素は `.invoke('trigger', 'mouseover')` を利用（jQuery を使用）
- jQuery メソッドをアサートしたい場合も `.invoke` が便利

### テストユーティリティ {#testing-utilities}

`main/tests/cypress/cypress/support/commands.js` に共通処理が定義されています。

最重要なのは `loadAndVisitProject` で、パラメータに応じて新規プロジェクトを作成します。

- 任意の配列を渡す: 最初の行が列名、それ以降がデータ。
  特定のグリッドを明示的に用意したい場合のみ使用してください。
  ```javascript
  const fixture = [
    ['Column A', 'Column B', 'Column C'],
    ['0A', '0B', '0C'],
    ['1A', '1B', '1C'],
    ['2A', '2B', '2C'],
  ];
  cy.loadAndVisitProject(fixture);
  ```
- 既存フィクスチャを渡す: `food.mini`（2 行・少列）、`food.small`（数百行）。基本的には `food.mini` を使い、特別な理由がある場合のみ `food.small` を選びます。
  フィクスチャは `main/tests/cypress/cypress/fixtures` にあります。

### 対応ブラウザー {#browsers}

利用できるブラウザーは OS にインストールされているものに依存します。対応一覧は [Cypress ドキュメント](https://docs.cypress.io/guides/guides/launching-browsers.html#Browsers) を参照してください。

### ディレクトリ構成 {#folder-organization}

テストは `main/tests/cypress/cypress` 配下にあります。

- `/fixtures`: CSV や OpenRefine プロジェクト
- `/integration`: テストコード（※ Cypress v10 以降は `e2e` フォルダを使用）
- `/plugins`: プロジェクト用のカスタムプラグイン
- `/screenshots`, `/videos`: 実行記録（Git 無視）
- `/support`: アサーションや操作の共通ライブラリ

### 設定 {#configuration}

実行時の設定は環境変数で行えます（OS レベルまたはコマンドライン）。主なもの:

- `OPENREFINE_URL`: 接続先（デフォルト `http://localhost:3333`）
- `DISABLE_PROJECT_CLEANUP`: 1 にするとテスト後のプロジェクト削除を無効化（デフォルト 0）

詳しくは [Cypress の環境変数ガイド](https://docs.cypress.io/guides/guides/environment-variables.html#Setting) を参照してください。簡単な方法は次の通りです。

#### `cypress.env.json` を使う {#overriding-with-a-cypressenvjson-file}

このファイルは Git で無視され、ローカル設定に利用できます。

```json
{
  "OPENREFINE_URL": "http://localhost:3334"
}
```

#### コマンドラインで上書き {#command-line}

実行時に `CYPRESS_` プレフィックス付きで渡します。

```shell
CYPRESS_OPENREFINE_URL=http://localhost:3334 \
yarn --cwd ./main/tests/cypress run cypress open
```
