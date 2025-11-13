---
id: exporting
title: 作業のエクスポート
sidebar_label: エクスポート
---

## 概要 {#overview}

データセットの準備が整ったら、OpenRefine から取り出して好きなシステムに移す必要があります。OpenRefine は複数のファイル形式を出力でき、Google Sheets への直接アップロードや Wikidata へのステートメント作成・更新にも対応しています。

また [プロジェクト全体をエクスポート](#export-a-project) して、ほかの OpenRefine ユーザー（あるいは別のマシンの自分）に渡せるようにすることも可能です。

## データをエクスポートする {#export-data}

![A screenshot of the Export dropdown.](/img/export-menu.png)

多くのオプションは現在の表示（適用済みのフィルターやファセット）に含まれるデータのみをエクスポートします。一部のオプションでは、データセット全体と現在表示中の行だけを選べるものもあります。

プロジェクトからデータをエクスポートするには、画面右上の <span class="menuItems">Export</span> ドロップダウンをクリックして形式を選択します。選択肢は以下です:

* タブ区切り値 (TSV) / カンマ区切り値 (CSV)
* HTML 形式の表
* Excel スプレッドシート (XLS/XLSX)
* Open Document Format (ODS)
* Google Sheets へのアップロード（[Google アカウントの認証](starting#google-sheet-from-drive) が必要）
* [カスタムタブ区切りエクスポーター](#custom-tabular-exporter)
* [SQL ステートメントエクスポーター](#sql-exporter)
* デフォルトで JSON を生成する [テンプレートエクスポーター](#templating-exporter)

リコンシリエーション済みデータを Wikidata にエクスポートしたり、別の OpenRefine プロジェクトで再利用するための Wikidata スキーマを書き出すこともできます:

* [Wikidata に編集をアップロード](wikibase/uploading#uploading-with-openrefine)
* [QuickStatements 形式でエクスポート](wikibase/uploading#uploading-with-quickstatements)（v1）
* [Wikidata スキーマをエクスポート](wikibase/overview#import-and-export-schema)

### カスタムタブ区切りエクスポーター {#custom-tabular-exporter}

![A screenshot of the custom tabular content tab.](/img/custom-tabular-exporter.png)

カスタムタブ区切りエクスポーターでは、出力するデータ・区切り文字・ダウンロード先（ローカルまたは Google Sheet）の選択が可能です。

<span class="tabLabels">Content</span> タブでは、列リストをドラッグ＆ドロップして出力順を入れ替えられます。リコンシリエーションや日付データの設定は列ごとに適用されます。

リコンシリエーション済みデータの出力も便利で、セルの元値・マッチした値・マッチ先 ID のいずれを出力するか自由に選べます。例えば “match entity's name”“matched entity's ID”“cell's content” を選べば、それぞれ `cell.recon.match.name`、`cell.recon.match.id`、`cell.value` の内容を出力します。

「一致しないセルは何も出力しない」を選ぶと、新しく生成されたマッチやマッチなしセルは空として出力されます。「Link to matched entity's page」は HTML 形式での出力時にハイパーリンクを生成しますが、他形式には影響しません。

現時点ではこのウィンドウ内の日付書式オプションは機能していません。[GitHub でこの issue を追跡](https://github.com/OpenRefine/OpenRefine/issues/3368) できます。将来的には [日付形式のセルを出力する方法](exploring#dates) を選べるようになる予定で、[SimpleDateFormat 解析キー](grelfunctions#todateo-b-monthfirst-s-format1-s-format2-) に従ったカスタム日付出力を作成できます。

![A screenshot of the custom tabular file download tab.](/img/custom-tabular-exporter2.png)

<span class="tabLabels">Download</span> タブでは、データセットの先頭 10 行がどのように出力されるかをプレビューできます。右側のファイル形式を選択していなければ、<span class="buttonLabels">Download</span> ボタンはテキストファイルを生成します。<span class="tabLabels">Upload</span> タブでは新しい Google Sheet を作成できます。

<span class="tabLabels">Option Code</span> タブでは、現在の設定を JSON としてコピーして別プロジェクトで再利用したり、既存の JSON 設定を貼り付けて現在のプロジェクトに適用できます。

### SQL エクスポーター {#sql-exporter}

エクスポートしたデータを含む SQL ステートメントを生成でき、既存データベースの上書きや追加に使えます。<span class="menuItems">Export</span> → <span class="menuItems">SQL exporter</span> を選ぶと、2 つのタブを持つウィンドウが開き、出力内容を定義するタブと SQL の構成を変更するタブ（プレビュー・ダウンロード付き）に分かれています。

![A screenshot of the SQL statement content window.](/img/sql-exporter.png)

<span class="tabLabels">Content</span> タブでは、出力する列・各列のデータ型（または「VARCHAR」）・最大文字長（データ型に応じて）を指定できます。「Allow null」のチェックを外した列は、空セルにデフォルト値を設定できます。

この出力ツールでは、現在表示中の行のみ出力するか全行を出力するか、空行を含めるかどうかを選べます。「Trim column names」をオンにすると列名の空白が削除されます。

![A screenshot of the SQL statement download window.](/img/sql-exporter2.png)

<span class="tabLabels">Download</span> タブで最終的な SQL ステートメントを確定できます。

<span class="fieldLabels">Include schema</span> により CREATE TABLE 文から始めるかどうかを決められ、チェックを外すと INSERT 文のみになります。

<span class="fieldLabels">Include content</span> を有効にするとデータ付きの INSERT 文も含まれます。これを無効にすると空の列定義だけになります。

必要であれば DROP や IF EXISTS を含められ、ステートメントが参照するテーブル名も指定できます。

プレビューでは、データを含む場合は最初の 10 行の内容を表示したステートメントが別ウィンドウで開きます。`.sql` ファイルを保存することもできます。

### テンプレートエクスポーター {#templating-exporter}

<span class="menuItems">Export</span> ドロップダウンで <span class="menuItems">Templating…</span> を選ぶと、自作のエクスポーターを構築できます。サポートされていない形式や今後もサポートしない形式を扱う場合に便利です。テンプレートエクスポーターはデフォルトで JSON を生成します。

![A screenshot of the Templating exporter generating JSON by default.](/img/templating-exporter.png)

テンプレートエクスポート画面では、自分で区切り文字・プレフィックス・サフィックスを指定して任意の言語で完全なデータセットを作成できます。<span class="fieldLabels">Row template</span> では、[変数](expressions#variables) を呼び出して各行から出力する列を選べます。

この機能でできること:
* `cells["ColumnName"].recon.match.name` のような [リコンシリエーションデータ](expressions#reconciliation) を出力
* 1 つの列の [member fields](expressions#variables) から複数列を出力
* `cells["ColumnName"].value.toUppercase()` のような [expressions](expressions) で出力データを変換

二重中括弧 `({{ }})` の内側は GREL 式として解釈され、それ以外の部分は直に文字列として出力されます。冒頭で言語を宣言すれば Jython や Clojure を使えます:

```json
{{jython:return cells["ColumnName"].value}}
```

:::caution
この機能ではほかの OpenRefine 画面よりも構文が異なる箇所があります。スラッシュ `/` や 右中括弧 `}` はバックスラッシュでエスケープする必要がありますが、それ以外はエスケープ不要です。
:::

通常どおり [正規表現](expressions#regular-expressions) も使用できます（スラッシュで囲み、GREL 式に渡します）。たとえば句読点を削除したデータを出力するには、次のように書けます:

```json
{{jsonize(cells["ColumnName"].value.replaceChars("/[.!?$&,/]/",""))}}
```

プロジェクトのデータを文章に埋め込んだプレーンテキスト文書を出力することも可能です。例: `In {{cells["Year"].value}} we received {{cells["RequestCount"].value}} requests.`。

`${ColumnName}` という省略形（引用符不要）で列の値を直接差し込むこともできます。ただしこれは式の中では使えません（中括弧の閉じがあるため）。

レコードモードのプロジェクトでは、<span class="fieldLabels">Row separator</span> に指定した文字列がレコード間の区切りとなり、1 つのレコード内の行は <span class="fieldLabels">Row template</span> に従ってそのまま連結されます。

テンプレートを作成したら、各フィールドの内容を保存して再利用することをおすすめします。<span class="buttonLabels">Export</span> をクリックすると `.txt` ファイルが出力され、テンプレートは破棄されます。

テンプレートエクスポーターを使って [複数の形式を生成するレシピ](https://github.com/OpenRefine/OpenRefine/wiki/Recipes#12-templating-exporter) も公開しています。

## プロジェクトをエクスポートする {#export-a-project}

進行中のプロジェクトを別のマシンや同僚、履歴を確認したい人と共有できます。これによりデータのクリーンアップが内容を劣化させていないことを証明できます。エクスポートしたプロジェクトは別の OpenRefine インストールで [新しいプロジェクトとしてインポート](starting#import-a-project) できます。

ローカルに保存するか、Google Drive にアップロードできます（Google アカウントの認証が必要です）。

:::caution
OpenRefine のプロジェクトアーカイブには過去の操作やデータの内容が含まれます。匿名化などで元データを秘匿したい場合、そのままアーカイブを共有しないでください。
:::

ローカルにプロジェクトアーカイブを保存するには、<span class="menuItems">Export</span> ドロップダウンから <span class="menuItems">OpenRefine project archive to file</span> を選びます。OpenRefine は操作履歴すべてを含んだプロジェクトをエクスポートし、現在のビューやファセットは含みません。既存のリコンシリエーション情報も保持されますが、受け取った側は同じリコンシリエーションサービスを追加する必要があります。

OpenRefine は `.tar.gz` 形式でファイルを書き出します。保存時に名前を変更できますが、設定しない場合はプロジェクト名がファイル名になります。

Google Drive に保存するには、<span class="menuItems">Export</span> → <span class="menuItems">OpenRefine project archive to Google Drive...</span> を選びます。OpenRefine はリンクを共有せず、アップロード完了を通知するだけです。

## 操作履歴をエクスポートする {#export-operations}

Undo/Redo タブに表示されたすべての操作履歴を [保存して別プロジェクトに再適用](running#reusing-operations) できます。これにより JSON が生成され、別の OpenRefine プロジェクトで再利用できます。
