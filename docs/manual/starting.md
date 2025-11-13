---
id: starting
title: プロジェクトの開始
sidebar_label: プロジェクトの開始
---

## Overview {#overview}

OpenRefine では既存データを取り込むことでプロジェクトを開始します。ゼロからデータを作成する機能はありません。

どこから取り込んだデータであっても、OpenRefine は元のファイルやシステムには手を入れず、入力をコピーして独自のプロジェクトファイルを生成し、[ワークスペースディレクトリ](installing#set-where-data-is-stored)に保存します。

データと編集内容はプロジェクトファイル内に[自動的に保存](#autosaving)されます。編集後に必要であれば、お好みの形式で[エクスポート](exporting)できます。

他人のプロジェクトを受け取って開いたり、あなたのプロジェクトを共有したりするには、[プロジェクトアーカイブをエクスポート](exporting#export-a-project) → [インポート](#import-a-project)します。

## データを読み込んでプロジェクトを作成する {#create-a-project-by-importing-data}

起動すると <span class="menuItems">Create Project</span> 画面が表示され、次の入力方法から選べます:

*   PC 内のファイル
*   Web 上のファイル（URL）
*   クリップボードへの貼り付け
*   データベース（SQL）接続
*   Google Drive 上のシート

読み込める形式:

*   CSV/TSV
*   テキスト
*   固定幅
*   JSON
*   XML
*   ODS
*   XLS/XLSX
*   PC-Axis (PX)
*   MARC
*   RDF（JSON-LD/N3/N-Triples/Turtle/RDF/XML）
*   Wikitext

拡張機能を導入するとさらに多くの形式に対応できます（[拡張機能ページ](/extensions)参照）。

複数ファイルを指定すると入力順で読み込まれ、先頭列にソースの URL やファイル名が追加されます。共通列名はそのまま共有され、異なる列名は後ろに追加されます。

|File|Fruit|Quantity|Berry|Berry source|
|---|---|---|---|---|
|fruits.csv|Orange|4|||
|fruits.csv|Apple|6|||
|berries.csv|||9|Mulberry|Greece|
|berries.csv|||2|Blueberry|Canada|

行をまたいでデータを追加する形で 2 つのファイルをつなげることはできませんが、後から [cross()](grelfunctions/#crosscell-s-projectname-s-columnname) や [追加フェッチ](columnediting) などで結合できます。

どの方法を選んでも、<span class="menuItems">Next >></span> をクリックするとプレビューとデータの解釈設定が表示されます。

### このコンピュータから {#get-data-from-this-computer}

<span class="menuItems">Browse…</span> を押して、ハードディスク上のファイルを選択します。すべてのファイルが表示され、多形式に対応しています。

`.zip`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.gz`, `.bz2` などの圧縮ファイルを選ぶと中身を解析し、選択して読み込めます（`.rar` は非対応）。複数の圧縮アーカイブを取り込む際は「`Store archive file`」をチェックすると抽出元の名前を保持できます。

### Web アドレス (URL) {#web-addresses-urls}

データファイルの URL を入力欄に貼り付けて追加できます。複数行追加できます。OpenRefine がダウンロードしてプレビューを表示します。

2 つ以上の URL を指定する場合は個別に読み込むかすべて選ぶかを問い、読み込み対象を選択できます。

Google シートはここではなく、[Google 連携フォーム](#google-data) を使って読み込んでください。

### クリップボード {#clipboard}

ワードプロセッサ・スプレッドシート・PDF の表・任意のリストからコピー＆ペーストできます。OpenRefine は CSV/TSV/テーブル形式を判断し、改行ごとに行を分割します。

特定の行を先にピックアップしたり、異なるソースから貼り合わせたりするのに便利です。また URL のリストを貼り付けて後から[フェッチ](columnediting)することも可能です。

### データベース (SQL) {#database-sql}

SQL 接続で最新データを直接取得できます。オンラインカタログや管理データベースなどが該当します。同じデータベースで複数のクエリを実行する例や、単一クエリで複数列を連結する例（`SELECT ... UNION`）はドキュメント内で紹介されています。

## オプション {#options}

詳細なインポート設定には次のタブがあります:

### Original data {#original-data}

インポート対象の元データを確認できます。ファイルや URL でデータを増やしたい場合はこのタブに戻って追加します。

### Parsing options {#parsing-options}

テキストの区切り文字や quoting 文字、ヘッダ行の有無、エラーハンドリング（10 行までのプレビューで表示）を設定します。

### Preview {#preview}

実際に取り込まれるスニペットとデータ型候補が表示されます。認識された型を確認し、必要があれば手動で `text`, `number`, `boolean`, `date` などに切り替えます。

## Google データ {#google-data}

Google アカウントを認証すると Drive 上の Sheets を取り込めます。追加欄に複数のシート ID を入力可能です（例: `https://docs.google.com/spreadsheets/d/.../edit#gid=0`）。

## スナップショット {#snapshot}

一度プロジェクトを開いてから [Snapshots](#snapshots) を使うと、編集差分を保存して元の状態に戻したり、他人にスナップショットを共有できます。

## データの例 {#example-data}

以下のようなデータを貼り付けたりインポートして学習用途に使えます。詳細な例は付属ドキュメントや Wiki にあります。

## Project history {#project-history}

プロジェクトの Undo/Redo と操作履歴は [History](running#history-undoredo) に記録され、いつでも再適用できます。
