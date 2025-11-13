---
id: code-contributions
title: コード貢献
sidebar_label: コード貢献
---

## 最初のコード PR {#your-first-code-pull-request}

OpenRefine に初めてコードを貢献するまでの流れをまとめました。各ステップで困ったら [開発者フォーラム](https://forum.openrefine.org/c/dev/8) や [Gitter](https://gitter.im/OpenRefine/OpenRefine) で気軽に相談してください。

まず、なぜ OpenRefine に貢献したいのかを整理しましょう。
- OpenRefine 利用者としてツールの改善やバグ修正をしたいなら、手を動かす前にコミュニティと話し合うのが大切です。同じテーマの [GitHub Issue](https://github.com/OpenRefine/OpenRefine/issues) があるか探し、合意形成が済んでいるか確認してください。なければ新しく Issue を立てたり、[開発者フォーラム](https://forum.openrefine.org/c/dev/8) で計画を共有しましょう。
- OSS への貢献先として OpenRefine を選んだ場合は、まずツールの使い方を知ることから始めるとスムーズです。[OpenRefine をインストール](docs/manual/installing.md)し、[チュートリアル](/external_resources) や [動画](https://www.youtube.com/watch?v=B70J_H_zAWM&list=PLYMbXPIhZRlVgxgljjZu6rsFl1yeXXLvp) を参考に操作に慣れましょう。基本的なユースケースを理解したら、[Issue 一覧](https://github.com/OpenRefine/OpenRefine/issues) から興味のあるものを選びます。ユーザーとして問題点が分かり、修正がどのように役立つか想像できるものを選ぶのが理想です。技術スキル（Java のバックエンドか、JavaScript のフロントエンドか、両方か）に合った Issue を選びましょう。難易度が低めで設計判断の少ない [good first issue](https://github.com/OpenRefine/OpenRefine/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) も用意しています。

### 開発環境のセットアップ

作業内容が決まったら、開発環境を用意して OpenRefine を改造・テストできるようにします。[手順はこちら](technical-reference/build-test-run.md)。

既知のバグに取り組む場合は、まず開発環境で再現してください。特定のダイアログやインポーター、ワークフローが必要かもしれません。Issue 記載の手順を踏んでも再現できなければ、その旨をコメントして共有しましょう（他の修正で直っている可能性があります）。

### 該当コードの探し方

OpenRefine は Web アプリなので、Java のバックエンドと jQuery ベースのフロントエンドで構成されています。Issue によって編集する箇所が変わりますが、ディレクトリ構造を覚える必要はなく、全文検索で十分場所を特定できます。

例: 「Columnize by key/values」ダイアログに関する Issue なら、比較的固有な語である "columnize" をリポジトリ全体で検索します。[GitHub の検索](https://github.com/OpenRefine/OpenRefine/search?q=columnize)や、ローカルで `grep -iR "columnize" .`（内容検索）や `find . | grep columnize`（ファイル名検索）を使うと、以下のような結果が得られます（2023 年 1 月時点）。

* `main/webapp/modules/core/scripts/views/data-table/key-value-columnize.html`: ダイアログの HTML。レイアウト変更やボタン追加など UI 調整に使います。
* `main/webapp/modules/core/scripts/views/data-table/menu-edit-cells.js`: 各列の "Edit cells" メニューを定義し、columnize 操作のダイアログロジックも含みます。
* `main/webapp/modules/core/langs/translation-en.json`: フロントエンドで表示する文字列（英語）を定義します。メニュー項目やダイアログ内テキストの翻訳先です。
* `main/tests/cypress/cypress/e2e/project/grid/column/transpose/columnize.cy.js`: Cypress で書かれた統合テスト。UI の操作と期待結果を検証します。
* `main/src/com/google/refine/operations/cell/KeyValueColumnizeOperation.java`: バックエンドの実装本体。特定ケースでの動作を変えたいならここを修正します。
* `main/tests/server/src/com/google/refine/operations/cell/KeyValueColumnizeTests.java`: Java の単体テスト。さまざまなシナリオで操作が期待通りか検証します。
* `main/resources/com/google/refine/operations/OperationDescription.properties`: バックエンド用のローカライズ文字列（操作の説明など）。
* `main/webapp/modules/core/MOD-INF/controller.js`: フロント／バックエンドの各コンポーネントを登録するハブです。columnize 操作もここで紐づけられています。

### テスト方法

変更後は必ずテストします。ユーザー体験を確かめる手動テストも重要ですが、受け入れの際には自動テストが求められることが多いです。自動テストは主に 2 種類あります。
* [Cypress 統合テスト](technical-reference/functional-tests.md): フロントエンドの変更時に使います。実行に時間がかかるため、既存テストにアサーションを追加できるならそれが望ましいです。
* Java 単体テスト: バックエンド変更時に使います。高速で信頼性が高く、ほとんどのクラスに対応するテストクラスがあります。対応クラスがなければ新規作成してください。既存テストを参考にすると書きやすいです。

### 変更の提出

動作確認ができたらレビューに進みます。

- 作業用の git ブランチを作成します。ブランチ名には Issue 番号と簡単な説明（例: `issue-1234-columnize-layout`）。
- Java の変更があれば `./refine lint` でコードスタイルを確認します。
- コミットメッセージには `closes #1234` や `fixes #1234` のように Issue 番号を含めます（GitHub が自動リンク）。
- ブランチを自分の fork に push し、Pull Request を作成します。その際、採ったアプローチや設計判断も説明してください。

レビューで修正提案があれば同じブランチにコミットを追加します。マージ時にはコミットが squash されるのが一般的です。貢献に感謝します！
