---
id: architecture-before-4
title: バージョン 4 以前のアーキテクチャ
sidebar_label: バージョン 4 以前のアーキテクチャ
---

OpenRefine は Web アプリケーションですが、自分のマシン上でローカルに動かす前提で設計されています。サーバー側はデータの状態（Undo/Redo の履歴や長時間実行プロセスなど）を保持し、クライアント側は UI の状態（ファセットとその選択内容、ページングなど）を保持します。クライアントは GET/POST の Ajax 呼び出しでサーバーにアクセスし、データの更新や取得を行います。

このアーキテクチャによって、データと UI の責務をきれいに分離し、HTML/CSS/JavaScript といった身近な Web 技術で UI 機能を実装でき、さらに標準的な GET/POST でサードパーティのソフトウェアがサーバー側機能を呼び出せるようになります。

## 技術スタック {#technology-stack}

OpenRefine のサーバー側（バックエンド）は単一の Java サーブレットとして実装され、[Jetty](http://jetty.codehaus.org/jetty/) Web サーバー／サーブレットコンテナ上で実行されます。Java を採用することで、各 OS 間で性能と移植性のバランスを保てます（OS 固有コードはアプリ起動まわりにごく少量あるだけです）。

OpenRefine の機能拡張性は、[SIMILE Butterfly](https://github.com/OpenRefine/simile-butterfly) というモジュラー Web アプリケーションフレームワークのフォークによって支えられています。これにより拡張はサーバー側・クライアント側の双方に新機能を提供できます。[既知の拡張一覧](/extensions) は公式サイトで管理しており、拡張開発者向けの[専用ドキュメント](technical-reference/writing-extensions.md)も用意しています。

クライアント側は HTML/CSS/プレーン JavaScript で実装され、主に次のライブラリを利用します。
* [jQuery](http://jquery.com/)
* [Wikimedia jQuery.i18n](https://github.com/wikimedia/jquery.i18n)
フロントエンドの依存モジュールはビルド時に [NPM](https://www.npmjs.com/) で取得します。

サーバー側も多数のライブラリに依存しており、さまざまなフォーマットでのインポート／エクスポート実装などに利用しています。これらは [Apache Maven](https://maven.apache.org/) でビルド時に取得します。

データ保存と処理のアーキテクチャは移行中です。3.x まではプロジェクト全体のグリッドを Java ヒープに読み込むインメモリ構造で、各操作が直接その状態を書き換えていました。4.x 以降は基本的にディスク上にデータを置き、プロジェクトが十分小さい場合だけメモリにキャッシュする新アーキテクチャへ移行します。

## サーバー側アーキテクチャ {#server-side-architecture}

サーバー側コードはすべて Java（`main/src/`）で書かれ、エントリーポイントは `com.google.refine.RefineServlet` です。デフォルトでは `server/src/com.google.refine.Refine` がインスタンス化する軽量 Jetty 上でホストされます。サーバークラス本体は `main/src/` ではなく `server/src/` にあり、`RefineServlet` を別のサーブレットコンテナで動かす余地を残しています。

Web サーバーの設定は `main/webapp/WEB-INF/web.xml` にあり、ここで `RefineServlet` が紐づけられます。`RefineServlet` 自体はシンプルで、クライアントからのリクエストを `com.google.refine.commands.**` パッケージの適切な `Command` クラスに振り分けるだけです。

前述のとおりサーバー側はデータ状態を保持しており、その中心となるクラスが `com.google.refine.ProjectManager` です。

### プロジェクト {#projects}

OpenRefine には [Eclipse IDE](https://www.eclipse.org/ide) のようなワークスペースの概念があります。OpenRefine を起動すると 1 つのワークスペース内で複数プロジェクトを管理し、ワークスペースはサブディレクトリを含むディレクトリ構造で表現されます。デフォルトのワークスペースパスや変更方法は[マニュアル](manual/installing.md#set-where-data-is-stored)に記載されています。

`ProjectManager` クラスがワークスペースを管理します。`ProjectMetadata` として各プロジェクトのメタデータ（名前、最終更新日時、UI に必要な付随情報など）をメモリに保持し、ユーザーがデータを閲覧／編集しようとした時だけ実データを読み込みます。メタデータと実データを分離することで、メモリ使用量を抑えています。

実データには列・行・セル・リコンサイル情報・履歴エントリが含まれます。

プロジェクトは表示または編集が必要になった時点で読み込まれ、最後に変更されてから 1 時間はメモリ上に残ります。`ProjectManager` は定期的に変更されたプロジェクトの保存を試み、30 秒以内に可能な限り多くのプロジェクトを保存します。

### データモデル {#data-model}

プロジェクトデータは次の要素で構成されます。

- _生データ_: 行のリスト（各行はセルのリスト）
- _モデル_: 生データの上に載る解釈・表示レイヤー。モデルを変えても生データを書き換える必要がない設計になっており、同じ生データでも複数のモデルで違う見方を提供できます。

#### カラムモデル {#column-model}

行内のセルには名前がなく、リストのインデックスでしかアクセスできません。そのため各位置に名前を付ける _カラムモデル_ が必要です。カラムモデルは、列に含まれるセルがリコンサイル済みかどうか、その結果の型や統計といったメタデータも保持します。

各列はその列に関連する計算結果のキャッシュとしても機能します。

カラムモデル上の列は、生データ（行やセル）を変更せずに削除や並べ替えができます。これにより列操作を高速に行えます。

##### カラムグループ {#column-groups}

:::caution
この機能は部分的な実装であり、バグも多く非推奨です。OpenRefine 4.0 で削除される予定です。詳細は以下を参照してください。

- [Issue #5122](https://github.com/OpenRefine/OpenRefine/issues/5122)（有用性の議論から非推奨への合意まで）
- ディスカッション [Who uses column groups?](https://groups.google.com/g/openrefine/c/A8RhOwlulRs/m/NFR8LDBmBwAJ)
- ディスカッション [The future of the records mode](https://groups.google.com/g/openrefine/c/X9O8NBC1UKQ)（OpenRefine におけるグルーピング／階層モデルの将来案）

この機能は [Rows vs Records](../manual/exploring#rows-vs-records) と関連しますが、Rows vs Records 自体は引き続きサポートされます。
:::

次のデータを考えてみます。

![Illustration of row groups in OpenRefine](https://raw.github.com/OpenRefine/OpenRefine/2.0/graphics/row-groups.png)

データはグリッド状ですが、人間はそれを木構造として理解できます。全行が最終的には映画「Austin Powers」に紐づいていること、1 行だけが「movie title」列にタイトルを持つこと、"USA" や "Germany" は俳優の国籍ではなく映画の公開国を指していること、Mike Myers が "Austin Powers" と "Dr. Evil" の両方を演じ、後者で 2 つの賞を受けたことなどを、レイアウトやドメイン知識から読み取れます。

OpenRefine ではこのグリッド→ツリーの知識をカラムモデル内の _カラムグループ_ として表現できます。上図の青い括弧が列をまとめ、青三角がそのグループのキー列を示します。カラムグループは互いに入れ子になれるため、グループの包含関係が階層を形作ります。これにより 2 次元の表を階層的なレコードの集合として解釈できます。

空セルも重要です。キー列が空の行（例: 行 4 の "character"）は、その列が埋まっている直前の行（行 3）に _依存_ します。つまり行 4 の "Best Comedy Perf" は行 3 の "Dr. Evil" に適用され、行 3 は行 4 の _コンテキスト行_ です。同様に行 2〜6 は第 1 列が空なので行 1 に依存し、すべてのデータが映画 Austin Powers に最終的に紐づきます。行 1 は他行に依存せず _レコード行_ と呼びます。行 1〜6 が 1 つのレコードを形成します。

2024 年現在、カラムグループを生成するのは XML/JSON インポーターのみです。データテーブルビューには表示されますが、編集はできません。

### 変更・履歴・プロセス・操作 {#changes-history-processes-and-operations}

プロジェクトデータへのすべての変更が追跡されます（プロジェクト名などメタデータの変更は対象外）。

変更は `com.google.refine.history.Change` オブジェクトとして保存されます。`Change` はインターフェースで、実装は `com.google.refine.model.changes.**` にあります。各 Change は `apply()` 呼び出しでデータを更新するのに十分な情報と、`revert()` で元に戻すのに必要な情報を保持します。変更内容を _計算_ するのではなく、あくまで差分を _保存_ する点で、コードベースに対する diff パッチのような存在です。

Change オブジェクトはプロジェクトと同程度に巨大になることもあります。そのため適用／復元時以外はメモリに保持しません。ただし履歴パネルでユーザーに情報を表示する必要があるため、メタデータは別に保存します。各 Change には `com.google.refine.history.HistoryEntry` が 1 つ対応し、人が読める説明やタイムスタンプなどを記録します。

各プロジェクトには `com.google.refine.history.History` があり、すべての `HistoryEntry` を順番に保持します。実際には 2 つのリストがあり、1 つは適用済みで Undo 可能な変更、もう 1 つは Undo 済みで Redo 可能な変更です。各変更は適用前後の状態に前提条件を持つため、リストの順序通りにしか Undo/Redo できません。どこかの変更が戻せないと、その変更以前の状態には戻れなくなります（[#2](https://github.com/OpenRefine/OpenRefine/issues/2) 参照）。

Change は差分だけを持ち、差分の計算自体は行いません。計算は `com.google.refine.process.Process` が担当し、すべての Change は何らかの Process から生成されます。Process には短時間で同期的に完了するもの（行のスター付与など）と、時間や計算量（ネットワーク呼び出し含む）が大きいもの（列のリコンサイルなど）があります。

クライアント側の UI 操作は Ajax 呼び出しでサーバーに到達し、プロジェクトを変更するリクエストは Process を生成する Command によって処理されます。Process は FIFO キューに積まれ、先頭の Process が完了するまで他は待機します。

Process は 1 つの要素だけを変更する場合もあれば（特定セルの編集、特定行へのスター付与など）、条件に合う多数の要素を変更する場合もあります（同じ内容のセルを一括編集、ファセットで絞った行すべてにスター付与など）。後者のように他プロジェクトにも適用可能な Process には、再構築に必要な情報を保持する _抽象オペレーション_ `com.google.refine.model.AbstractOperation` が紐づきます。履歴パネルで「抽出」を押すと抽象オペレーションが JSON にシリアライズされ、「適用」で貼り付けた JSON から再構築され、Process が順番に実行されて Change/HistoryEntry のペアが生成されます。

まとめると、

- Change オブジェクトは差分を保持する
- HistoryEntry は Change のメタデータを保持する
- Process は差分を計算し、Change/HistoryEntry のペアを生成する
- Process には即時と長時間のものがあり、FIFO で順番に実行される
- 抽象オペレーションから再構築できる Process も存在する

## クライアント側アーキテクチャ {#client-side-architecture}

クライアント側は HTML/CSS/JavaScript で実装され、次のライブラリを利用します。
* [jQuery](http://jquery.com/)
* [jQueryUI](http://jqueryui.com/)
* [recurser/jquery-i18n](https://github.com/recurser/jquery-i18n)

### インポートアーキテクチャ {#importing-architecture}

OpenRefine には多様で拡張可能なファイル形式・ワークフローを扱うインポート基盤があります。CSV/TSV や固定長フィールド、行単位レコード、階層構造の XML/JSON まで幅広く対応し、プロジェクト作成前に設定をプレビュー・調整できます。XML/JSON のように、インポートする要素を選択する必要がある形式もあります。データファイル自体が複数ファイルを含むアーカイブ（zip など）の場合も、取り込むファイルを選択できます。さらに拡張からこのアーキテクチャの任意の箇所に機能を差し込めます。

### インデックスページとアクション領域 {#the-index-page-and-action-areas}

OpenRefine の起動画面は `main/webapp/modules/core/index.vt` で実装され、ここではインデックスページと呼びます。デフォルトでは「Create Project」「Open Project」「Import Project」の 3 つのタブ（アクション領域）があり、それぞれ新規作成・既存プロジェクトのオープン・`.tar` からのインポートに対応します。

拡張は JavaScript でアクション領域を追加できます。たとえば Create Project 領域は次のように登録されています（`main/webapp/modules/core/scripts/index/create-project-ui.js`）。

```javascript
Refine.actionAreas.push({
  id: "create-project",
  label: "Create Project",
  uiClass: Refine.CreateProjectUI
});
```

`uiClass` はコンストラクター関数で、タブの本体をレンダリングする jQuery ラップ済み要素を 1 つ受け取ります。

拡張で独自のインポートフローや新機能をインデックスページに露出させたい場合は、新しいアクション領域を追加してください。既存フローで代替できる場合はそちらを利用するのが推奨です。

### Create Project アクション領域 {#the-create-project-action-area}

Create Project 領域自体も拡張可能です。初期状態では複数の「データソース選択 UI」（ローカルファイル／URL／クリップボード貼り付けなど）に対応するタブを内包しています。

この領域には 3 つの拡張ポイントがあり、そのうち 1 つは UI 上では見えません。

#### インポートコントローラー {#importing-controllers}

Create Project 領域は複数の「インポートコントローラー」を管理します。各コントローラーは特定のワークフロー（ウィザードに近い UI）を実装します。OpenRefine には「デフォルトインポートコントローラー」があり（`main/webapp/modules/core/scripts/index/default-importing-controller/controller.js`）、データ全体を取得・キャッシュしてからプレビューを生成できる前提で動作します（取得・キャッシュできない場合は別コントローラーが必要）。

インポートコントローラーはロジックですが、Create Project 領域にデータソース UI やカスタムパネルを登録することで視覚的に現れます。デフォルトコントローラーは 3 つのカスタムパネルを登録し、ウィザードのページのように振る舞います。

拡張は任意の数のコントローラーを登録できます。各コントローラーにはクライアント側とサーバー側があり、クライアント側は Create Project 領域（通常 `createProjectUI`）を表すオブジェクトを 1 つ受け取るコンストラクター関数です。そのオブジェクトを使ってデータソース UI を登録したりカスタムパネルを作成したりします。特定のインターフェース実装は要求されません。デフォルトコントローラーのクライアント側コードは次の通りです。

```javascript
Refine.DefaultImportingController = function(createProjectUI) {
  this._createProjectUI = createProjectUI; // アクション領域への参照を保持

  this._progressPanel = createProjectUI.addCustomPanel(); // カスタムパネルを作成
  this._progressPanel.html('...'); // パネルをレンダリング
  ... do other stuff ...
};
Refine.CreateProjectUI.controllers.push(Refine.DefaultImportingController); // コントローラーを登録
```

サーバー側のコードについては[後述](#importingcontroller)します。

#### データソース選択 UI {#data-source-selection-uis}

Create Project 領域のもう 1 つの拡張ポイントがデータソース選択 UI です。デフォルトでは 3 種類の UI があり、いずれもデフォルトコントローラーが追加します。

拡張も独自のデータソース選択 UI を追加できます。登録は次のように行います。

```javascript
createProjectUI.addSourceSelectionUI({
  label: "This Computer",
  id: "local-computer-source",
  ui: theDataSourceSelectionUIObject
});
```

`theDataSourceSelectionUIObject` は次のメソッドを持つオブジェクトです。

- `attachUI(bodyDiv)`
- `focus()`

デフォルトコントローラー管理下のデータソース UI を追加したい場合は、次のように UI クラスを登録します（`main/webapp/modules/core/scripts/index/default-importing-sources/sources.js`）。

```javascript
Refine.DefaultImportingController.sources.push({
    "label": "This Computer",
    "id": "upload",
    "uiClass": ThisComputerImportingSourceUI
});
```

デフォルトコントローラーは `uiClass` をコンストラクター関数とみなし、自身のインスタンスを引数に呼び出します。UI 側はその参照を保持し、次のようにコントローラー経由でデータ取得／キャッシュを開始できます。

```javascript
controller.startImportJob(form, "... status message ...");
```

`form` はコマンド `/command/core/create-importing-job` に送信される jQuery ラップ済みの FORM 要素です。このコマンドとデフォルトコントローラーがアップロード／ダウンロード、キャッシュ、進捗更新、次ステップ表示を担います。

具体例は `main/webapp/modules/core/scripts/index/default-importing-sources/sources.js` を参照してください。多くの拡張では独自のインポートコントローラーとデータソース UI をセットで実装するでしょう。

#### ファイル選択パネル {#file-selection-panel}

Zip など複数ファイルを含むアップロード後、どのファイルを取り込むか選ぶ画面です。OpenRefine は現在 1 プロジェクト 1 テーブルですが、複数ファイルを選択すると内容を連結して 1 つのテーブルにします。

#### パース UI パネル {#parsing-ui-panel}

新規プロジェクトにデータを取り込む際に表示されるパネルです。主にデータのフォーマットを選択し、それに応じた読み込み／変換方法を指定します。バックエンドは[フォーマット推定器](#formatguesser)で形式を推測しますが、ユーザーが上書きするケースも珍しくありません。

フォーマット選択に加えて、各インポーター専用の設定パネルを表示します。入力形式ごとに relevant なオプションが異なるため、UI も個別です。たとえば「Text file」を選ぶと `LinedBasedImporter` 用 UI が表示されます（`main/webapp/modules/core/scripts/index/parser-interfaces/line-based-parser-ui.html` および `.js`）。その他のインポーターも独自の設定 UI を定義します。

フォーマットの識別子（MIME type）、インポーター（パースを実装する Java クラス）、設定 UI（オプション領域を描画する JavaScript クラス）の関連付けは `main/webapp/modules/core/MOD-INF/controller.js` の `ImportingManager` に登録されています。

### サーバー側コンポーネント {#server-side-components}

#### ImportingController {#importingcontroller}

インポートコントローラーは、前述のワークフロー全体（生データの受け取りから設定、プレビュー、プロジェクト作成まで）を担うバックエンドコンポーネントです。OpenRefine には次のデータソース向けのデフォルト実装があります。

* Web UI からのファイルアップロード
* クリップボード入力フォームによるテキスト投稿
* URL 指定によるファイルのダウンロード

これらのデータソースでは、まず入力ファイルをワークスペース内の一時ディレクトリに保存します。デフォルトコントローラーは HTTP API を提供し、フロントエンドからファイル選択、[フォーマット推定](#formatguesser)、形式ごとの既定オプション提示、プレビュー生成、最終的なプロジェクト作成を行えるようにします。

既存プロジェクトの読み込みや OpenRefine プロジェクトアーカイブの取り込みはインポートコントローラーではなく ProjectManager が担当します。

拡張はデータソースに応じた固有のインポートコントローラーを定義できます。たとえば SQL データベースからの取り込みでは接続先選択やクエリ入力が必要になるため、`database` 拡張が独自のコントローラーを提供しています。

#### FormatGuesser {#formatguesser}

フォーマット推定器は、ファイル内容を見て MIME type を推測するクラスです。`FormatGuesser` インターフェースには複数の実装があり、バイナリ／テキストなど基本種別に応じて使い分けます。テキストファイルではヒューリスティックに頼っており脆弱です。バイナリでは先頭のマジックナンバーを見れば判定できる形式も多いものの、現状はほぼ対応していません。

さらに悪いことに、推測した形式で実際にファイルをパースしてみないため、インポート直後にパースエラー（JavaScript の警告）を目にするケースもあります。推定後すぐにそのインポーターで読み込みを試し、少なくとも例外が出ないことを確認してからユーザーに提示するのが望ましいでしょう。

#### ImportingParser {#importingparser}

`ImportingParser` はファイルを OpenRefine のプロジェクトモデルに変換する役割を持つクラスです。ユーザーが UI で入力した形式固有のオプションがフロントエンドから渡されます。

可能な限り、入力ファイル全体をメモリに読み込まなくても最初の数行を取り込めるように設計されており、設定変更時のプレビューレスポンスを高速に保ちます（自動プレビューをオフにしない限り、設定変更のたびに再パースします）。

## ファセットブラウジングのアーキテクチャ {#faceted-browsing-architecture}

ファセットブラウジングは OpenRefine の中核機能で、処理対象の行を絞り込み一括処理する唯一の手段です。これがなければ 1 セル／1 行ずつ操作するか、全行まとめて操作するしかなく、大規模データの整備が現実的ではありません。

さまざまなコンポーネントがファセットの状態（どの条件で絞り込まれているか）を参照して処理対象の行を決めます。たとえばファセットで絞ってからエクスポートすると、エクスポーターは該当行のみを書き出します。つまりファセットブラウジングはデータビューだけでなく、システムのほぼすべての部分に結びついています。

### エンジン設定 {#engine-configuration}

Web アプリである OpenRefine では、同じプロジェクトを異なるブラウザーウィンドウで開き、それぞれが異なるファセット状態を持つことがあります。ファセット状態はブラウザーごとに保持しつつ、サーバー側はステートレスに保つのがよい設計です。クライアントがサーバーに処理を依頼する際、現在のファセット状態を丸ごと JSON（エンジン設定）として渡します。SQL で言えば `WHERE` 句に相当し、処理すべき行を指定します。

実際、ファセット状態（= クエリ）は SQL のようにシステム内を流通します。クライアントとサーバー間で JSON シリアライズされ、抽象オペレーションにも保存されます。クライアント側のファセットサブシステムはユーザーがこの「ファセットクエリ」を編集できるようにし、サーバー側サブシステムはそれを解決する役割を持ちます。

コード上ではファセット状態を *エンジン設定* （engine config）と呼びます。主にファセット設定の配列で構成され、各ファセットは基になる列名（または空文字）を保持します。テキスト検索ファセットはクエリ・大文字小文字設定・正規表現フラグを持ち、テキストファセット（リスト型）や数値レンジファセットは式を持ちます。リストファセットには選択項目・反転フラグ・空セルやエラーセルの選択設定があり、数値レンジファセットには `from`/`to` などが含まれます。実際の AJAX では次のような JSON がやり取りされます。

```json
{
    "mode": "rows",
    "facets" : [
      {
        "type": "text",
        "name": "Shrt_Desc",
        "columnName": "Shrt_Desc",
        "mode": "text",
        "caseSensitive": false,
        "query": "cheese"
      },
      {
        "type": "list",
        "name": "Shrt_Desc",
        "columnName": "Shrt_Desc",
        "expression": "grel:value.toLowercase().split(\",\")",
        "omitBlank": false,
        "omitError": false,
        "selection": [],
        "selectBlank":false,
        "selectError":false,
        "invert":false
      },
      {
        "type": "range",
        "name": "Water",
        "expression": "value",
        "columnName": "Water",
        "selectNumeric": true,
        "selectNonNumeric": true,
        "selectBlank": true,
        "selectError": true,
        "from": 0,
        "to": 53
      }
    ]
}
```

### サーバー側サブシステム {#server-side-subsystem}

上記のようなエンジン設定から、サーバー側のファセットブラウジングサブシステムは次を生成します。

- ファセット条件を満たす行の反復処理
- ファセットの描画情報（リストファセットなら選択肢と件数、数値レンジファセットならヒストグラムなど）

HTTP リクエストでエンジン設定 JSON を受け取ると、`com.google.refine.browsing.Engine` が生成され初期化されます。このエンジンが 0 個以上の `com.google.refine.browsing.facets.Facet` を構築し、各ファセットの `getRowFilter()` を呼び出します。制約がない場合は `null`、制約がある場合は `com.google.refine.browsing.filters.RowFilter` が返り、行を走査するときに `filterRow()` をすべて呼びます。全てのフィルターが `true` を返した場合のみ、行が条件を満たすと見なされます。

特定ファセットの表示情報を計算する際は、そのファセットだけをスキップし、他ファセットの条件で行を走査します。その結果を該当ファセットの `computeChoices()` に渡し、クライアント UI 用のデータを生成させます。すべてのファセットが計算を終えると、それぞれの情報を JSON にシリアライズして返します。全ファセットの更新に必要な HTTP 呼び出しは 1 回です。

### クライアント側サブシステム {#client-side-subsystem}

クライアント側にも JavaScript 実装のエンジンとファセットオブジェクト（0 個以上）があり、サーバーが計算した描画情報を適切なファセットに配布します。ユーザーがファセットを操作すると、ファセットがエンジンに UI 全体の更新を依頼します。その際エンジンは各ファセットの設定を集めて 1 つのエンジン設定 JSON を組み立て、2 本の Ajax 呼び出しを行います。1 本は描画する行を取得するため、もう 1 本は他のファセットに影響するため再計算された描画情報を取得するためです。
