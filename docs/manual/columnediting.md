---
id: columnediting
title: 列編集
sidebar_label: 列編集
---

## Overview {#overview}

列編集では OpenRefine の中でも最も強力なデータ改善手法がいくつも提供されています。<span class="menuItems">Edit column</span> メニューに含まれる操作は、1 列のデータを活用して新しい列やフィールドをデータセットに追加する内容です。

## Splitting or joining {#splitting-or-joining}

多くのユーザーはデータをさらに細かく扱いたい場面に直面します。たとえば「姓名」列を「名」と「姓」の 2 つの列に分割したいことがあります。逆に複数のカテゴリ列をまとめて 1 つの「カテゴリ」列に統合したいケースもよくあります。

### Split into several columns {#split-into-several-columns}

![A screenshot of the settings window for splitting columns.](/img/columnsplit.png)

この操作は <span class="menuItems">Edit column</span> → <span class="menuItems">Split into several columns...</span> から利用できます。1 列を複数列に分割するには、区切り文字や文字列の長さ、あるいは評価式で分割ポイントを指定します。[複数値セルを行に分割する](cellediting#split-multi-valued-cells) と同様に、指定した区切り文字や文字列は削除されます。長さで分割した場合には、指定した合計長さを超える情報は失われます。

新しく作成される列は元の列名に番号が付き、「Location 1」「Location 2」のようになります。元の列を削除するかどうかや、可能なら [データ型](exploring#data-types) を付与するかも選択できます。文字列を数値に変換するケースでは特に効果的で、[日付](exploring#dates) には対応しないことがあります。

最大で何列に分割するかを指定することもできます。この上限を超える区切り文字は無視され、残った文字列は最後の列に入ります。

### Join columns {#join-columns}

![A screenshot of the settings window for joining columns.](/img/columnjoin.png)

列を統合するには <span class="menuItems">Edit column</span> → <span class="menuItems">Join columns...</span> を選びます。現在のデータセット内のすべての列がポップアップに表示され、結合対象の列を選択・解除したり、ドラッグして順序を指定したりできます。区切り文字（任意）や空セル（null）の代替文字列も設定します。

統合結果は元の列に上書きされるか、新しい列を作って名前をつけるかを選べます。また、この操作で使用したすべての列を削除できます。

## Add column based on this column {#add-column-based-on-this-column}

<span class="menuItems">Edit column</span> → <span class="menuItems">Add column based on this column...</span> を選ぶと、式を入力できる [expressions](expressions) ウィンドウが開きます。ここで `value` を使って現在の列のデータを変換したり、他の複数列や外部データを参照するより複雑な式を記述できます。

この操作では変数に関する知識が必要になります。[変数に関する Expressions セクション](expressions#variables) を参照してください。

最も簡単な使い方は、式欄に既定の `value` を残して列をそのままコピーする方法です。[リコンシリエーションデータ](reconciling) を含む列に対しては変数 `cell` を使うと、元の文字列と一致候補、マッチした値、新しいアイテムなどの情報もコピーできます。

2 つの列を連結して新しい列を作成する例としては、元になる列のどちらかを選び <span class="menuItems">Edit column</span> → <span class="menuItems">Add column based on this column...</span> を開き、新しい列名を入力した後、式欄に次のように記述します:

```
cells["Column 1"].value + cells["Column 2"].value
```

列名にスペースが含まれないなら、次のように書けます:

```
cells.Column1.value + cells.Column2.value
```

行モードではなくレコードモードの場合は、次の形式を使って連結します:

```
row.record.cells.Column1.value + row.record.cells.Column2.value
```

必要に応じて区切り文字やスペースを挟んだり、さらに高度な式で入力内容に手を加えたりできます。

## Add column by fetching URLs {#add-column-by-fetching-urls}

<span class="menuItems">Add column by fetching URLs</span> 機能を使うと、OpenRefine は Web ページやサービスから HTML やデータを取得できます。この操作では、`value` を用いて列のデータから URL 文字列を組み立てます。対象の列には有効な HTML ページやファイルのパスの一部が含まれている必要があります。

URL が格納された列を持っているなら、式を `value` のまま実行するとその URL に対するデータを取得できます。たとえば Wikidata エンティティを示す識別子（Q から始まる数値）が入っている場合、次のように JSON メタデータをダウンロードできます:

```
"https://www.wikidata.org/wiki/Special:EntityData/" + value + ".json"
```

ほかのメタデータ形式を選ぶこともできます。Wikidata で利用できるフォーマットの一覧は [こちら](https://www.wikidata.org/wiki/Wikidata:Data_access) にあり、利用する Web サービスにも類似のドキュメントがあるはずです。

![A screenshot of the settings window for fetching URLs.](/img/fetchingURLs.png)

HTML ではなくメタデータファイルを取得する場面で特に役立ちますが、取得した HTML 全体を解析して必要な情報を抽出することもできます。

:::caution
フェッチ処理には時間がかかるうえ、1 秒間に数百・数千件のリクエストを受け取ってくれないサーバーもあります。デフォルトでは 1 行あたり 5 秒（5000 ミリ秒）の「スロットル遅延」が設定されており、必要に応じて変更可能です。1000 ミリ秒以上に設定することを推奨します。
:::

次の点に注意してください:
*「OK」を押す前にプレビューから 1～2 個の URL をコピーして別のブラウザタブで開き、実際に動作するか確認してください。
* 場合によっては [HTTP リクエストヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) を設定する必要があります。設定ウィンドウ内の「HTTP headers to be used when fetching URLs」の横にある小さな「Show」ボタンを押すと入力欄が表示されます。認証情報はプレーンテキストで履歴に記録されるため、セキュリティ上の懸念があることに留意してください。設定可能なヘッダーは以下の通りです:
  * [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
  * [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
  * [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

### Common errors {#common-errors}

Web サービスから情報を取得する際にはさまざまな失敗が起こります。以下はこの操作中に遭遇した問題をトラブルシュートするためのヒントです。

まず「store error」を有効にしてエラーを記録したうえでフェッチを実行し、表示されたエラーメッセージを確認してください。

**“HTTP error 403 : Forbidden”** はアクセス権限がないか、OpenRefine のリクエストが正規のものと認識されていないことを意味します。同じ URL をブラウザで開けるなら、サイト側が OpenRefine のリクエストを拒否している可能性があります。[User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) ヘッダーを変更すると改善することがあります。アクセス権があるはずなのに拒否される場合は管理者に連絡してください。

**“HTTP error 404 : Not Found”** は、対象の URL に情報が存在しないことを示します。特定の行でのみ発生する場合は、セル値に問題があるかもしれません。

**“HTTP error 500 : Internal Server Error”** はリモートサーバーの障害を示します。時間を置いて再試行するか、URL を再確認してください。

**“error: javax.net.ssl.SSLHandshakeException: Received fatal alert: handshake_failure”** は HTTPS 接続で、OpenRefine の Java 仮想マシンが対応しない暗号化方式を使っているときに発生します。

使用している OpenRefine/Java 環境が対応する暗号スイートを確認するには、**How's my SSL** などのサービスを利用します。`https://www.howsmyssl.com/a/check` を OpenRefine のセルに入れて「Add column by fetching URLs」を実行すると、使用中の SSL クライアントの説明が得られます。

追加の暗号化方式を導入するには [Java Cryptography Extension](https://www.oracle.com/java/technologies/javase-jce8-downloads.html) をインストールします。Mac およびバンドルされた JRE を含む Windows インストーラーを利用している場合は、更新した暗号スイートを OpenRefine 内の Java インストール先へ配置する必要があります:

* Mac の場合: `/Applications/OpenRefine.app/Contents/PlugIns/jdk1.8.0_60.jdk/Contents/Home/jre/lib/security`
* Windows の場合: `\server\target\jre\lib\security`

**“javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed”** は、リモートサイトがローカル Java で信頼されていない証明書（多くはルート証明書）を使っているときに発生します。証明書またはルート証明書が信頼されていることを確認してください。

信頼された証明書の一覧はローカル Java インストールの暗号化された `cacerts` ファイルに格納されています。これは “keytool” というツールで読み書きできます。Java インストールにセキュリティ証明書を追加する手順は [こちら](http://magicmonster.com/kb/prg/java/ssl/pkix_path_building_failed.html) および [こちら](http://javarevisited.blogspot.co.uk/2012/03/add-list-certficates-java-keystore.html) を参照してください。

Mac およびバンドル JRE を含む Windows の OpenRefine では、アプリケーション内の `cacerts` ファイルも更新する必要があります。

* Mac の場合: `/Applications/OpenRefine.app/Contents/PlugIns/jdk1.8.0_60.jdk/Contents/Home/jre/lib/security/cacerts`
* Windows の場合: `\server\target\jre\lib\security\`

## Renaming, removing, and moving {#renaming-removing-and-moving}

すべての列の <span class="menuItems">Edit column</span> ドロップダウンには、列を先頭・末尾・左・右に移動する、名前を変更する、または削除するオプションが含まれています。
これらの操作は取り消せますが、列を削除したあとにさらに変更を重ねると元に戻せなくなります。列を一時的に非表示にしたい場合は、<span class="menuItems">[View](sortview#view)</span> → <span class="menuItems">Collapse this column</span> を使ってください。

[records mode](cellediting#rows-vs-records) で列を移動する際には注意が必要です。データセットの最初の列（キー列）を変更すると、レコードの構造が意図せず変化することがあります。
