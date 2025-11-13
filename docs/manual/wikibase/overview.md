---
id: overview
title: Wikibase 連携の概要
sidebar_label: 概要
---

[Wikibase](https://wikiba.se/) は MediaWiki の拡張群で、Linked Open Data を保存・公開するために世界中の組織で採用されています。[Wikidata](https://www.wikidata.org/) や [Wikimedia Commons](https://commons.wikimedia.org/) の Structured Data も Wikibase 上で動作しています。

OpenRefine には Wikibase とデータをやり取りするための拡張が標準搭載されており、Wikidata や Wikimedia Commons からデータを取得したり、一括で追加したりできます。[任意の Wikibase インスタンスを OpenRefine に登録する](./configuration) ことも可能です。

## OpenRefine で Wikidata を編集する {#editing-wikidata-with-openrefine}

Wikidata は誰でも編集できるユーザー主導のデータソースです。OpenRefine を使えば、整形済みのデータを一括でアップロードできます。アップロード前に、既存データとの重複や矛盾がないことを確認しましょう。リコンサイルだけであればアカウントは不要ですが、アップロードするには [Autoconfirmed](https://www.wikidata.org/wiki/Wikidata:Autoconfirmed_users) 権限を持つアカウントを [OpenRefine に認可](#manage-wikidata-account) する必要があります。

Wikidata は Q で始まるアイテム（人物・組織・場所など）と、P で始まるプロパティを組み合わせて構築されます。例えば地域の作家と作品を登録したい場合、作家は職業 [author (Q482980)](https://www.wikidata.org/wiki/Q482980) を持つアイテム、作品は “instance of” ([P31](https://www.wikidata.org/wiki/Property:P31)) で [literary work (Q7725634)](https://www.wikidata.org/wiki/Q7725634) に結びついたアイテムになり、[author (P50)](https://www.wikidata.org/wiki/Property:P50) で互いを関連付けます。舞台は [narrative location (P840)](https://www.wikidata.org/wiki/Property:P840) で表現できます。

OpenRefine ではタイトルをリコンサイルした列と、舞台をリコンサイルした列を用意し、必要に応じて新規アイテムを作成します。プロパティは後述の [スキーマ](#wikidata-schema) で指定します。作業全体の流れは [Wikidata のチュートリアル集](https://www.wikidata.org/wiki/Wikidata:Tools/OpenRefine/Editing) にまとまっています。スキーマやドラフトは OpenRefine に保存しておき、準備が整ったらアップロードできます。

OpenRefine で作成した編集バッチは取り消し可能です。以下のサンドボックス用アイテムでアップロード手順を試せます。

* https://www.wikidata.org/wiki/Q4115189
* https://www.wikidata.org/wiki/Q13406268
* https://www.wikidata.org/wiki/Q15397819
* https://www.wikidata.org/wiki/Q64768399

冗長なステートメントをアップロードしても何も変わりません。既存と矛盾する場合は 2 つ目のステートメントとして追加されます。OpenRefine は重複や矛盾を検出しないため、必要に応じてリコンサイルプレビューで対象アイテムの内容や過去の履歴を確認してください。

### Wikidata スキーマ {#wikidata-schema}

スキーマは「表形式のデータをどのように Wikidata のステートメントへ変換するか」を定義するテンプレートです。<span class="menuItems">Wikidata</span> → <span class="menuItems">Manage schema</span> から編集します。

![Wikidata schema layout.](/img/wikidata-schema.png)

1. プロジェクト内の列一覧
2. アイテム・ステートメントのプレビュー
3. スキーマの編集領域（ドラッグ＆ドロップで列を割り当てる）
4. スキーマの JSON 表現

スキーマで指定できるのは以下の要素です。

#### Editing terms with your schema {#editing-terms-with-your-schema}

ラベル、説明、別名などの「用語」は、列から値を取得して各言語ごとに追加できます。複数のテキスト列を対象に `{{lang}}` 形式で言語コードを付けることも可能です。すでに値が存在する場合は上書きになります。

#### Unsupported field types

リスト、数量、地理座標、一部のモノリンガルテキストなど、現在サポートしていないフィールド型が存在します。対応していない型はアップロード前の検証で警告されます。

### Wikidata アカウント認証 {#manage-wikidata-account}

Wikidata へアップロードするにはアカウントの OAuth 認証が必要です。OpenRefine の <span class="menuItems">Wikidata</span> → <span class="menuItems">Manage Wikidata account</span> から認可し、ブラウザーで表示される指示に従ってログインしてください。認可後は OpenRefine 上に「authorized」と表示されます。

### スキーマのインポート／エクスポート {#import-and-export-schema}

作成したスキーマは JSON ファイルとしてエクスポート／インポートできます。チームで共有したり、別プロジェクトに流用するときに便利です。

### Wikidata へのアップロード {#upload-edits-to-wikidata}

編集内容をアップロードするには、<span class="menuItems">Wikidata</span> → <span class="menuItems">Upload edits</span> を選び、OAuth 認証が済んでいることを確認します。アップロード前にスキーマのチェックが行われ、重大な問題は修正が求められます。必要に応じて編集サマリーを入力し、アップロードを開始します。進捗はダイアログ上に表示され、完了後は [自分の投稿一覧](https://www.wikidata.org/wiki/Special:Contributions/) や [EditGroups](https://editgroups.toolforge.org/) で確認できます。

### QuickStatements へのエクスポート {#quickstatements-export}

OpenRefine のデータは [QuickStatements](https://www.wikidata.org/wiki/Help:QuickStatements) 形式でも書き出せます。<span class="menuItems">Export</span> → <span class="menuItems">QuickStatements file</span> もしくは <span class="menuItems">Extensions</span> → <span class="menuItems">Export to QuickStatements</span> で `statements.txt` を生成し、その内容を QuickStatements（バージョン 1）に貼り付けて実行してください。QuickStatements を利用する場合も Autoconfirmed アカウントで認証が必要です。

### 問題検出と警告 {#issue-detection}

OpenRefine はスキーマを解析して推奨事項を提示します。冗長性や矛盾の検出は行いませんが、文献情報（[P248](https://www.wikidata.org/wiki/Property:P248) や [P854](https://www.wikidata.org/wiki/Property:P854) など）を付与するように勧められることがよくあります。詳細は [品質保証](./quality-assurance) を参照してください。

## OpenRefine で Wikimedia Commons を編集する {#editing-wikimedia-commons-with-openrefine}

:::caution OpenRefine 3.6 以降が必要です
Wikimedia Commons の編集機能は OpenRefine 3.6 以降で利用できます。
:::

[Wikimedia Commons](https://commons.wikimedia.org) は Wikipedia などが利用するメディアリポジトリで、自由に再利用できる 8,500 万件以上のファイルが登録されています。OpenRefine 3.6 以降では、Commons のファイルに多言語・リンク化された Structured Data を一括追加できます。詳しいチュートリアルは [Commons:OpenRefine](https://commons.wikimedia.org/wiki/Commons:OpenRefine) にまとまっています。

:::info Structured data on Wikimedia Commons
Structured Data はファイルを多言語かつ機械可読な形で記述する仕組みです。Wikidata の概念を用いてファイルを説明できます。

<iframe width="480" height="270" src="https://www.youtube.com/embed/lmWmMIuCJVM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
:::

### Commons のマニフェストを追加する {#add-the-wikimedia-commons-manifest-to-openrefine}

Commons に接続するには、[マニフェスト](./configuration) を OpenRefine に登録します。<span class="menuItems">Wikidata</span> → <span class="menuItems">Add Wikibase</span> から Wikimedia Commons を追加してください。以後はリストから Commons を選択できるようになります。

### ファイル名をリコンサイルする {#reconcile-file-names-from-wikimedia-commons}

Commons のファイルを対象にする場合は、ファイル名の列をリコンサイルします。リコンサイルサービスはマニフェスト経由で提供されます。ファイルが存在しない場合は新規 Mediainfo アイテムとしてマークできます。

### Wikitext を抽出して再利用する {#extract-wikitext-to-process-it-further-in-openrefine}

既存ファイルの Wikitext から情報を抽出したい場合は、API を利用して Wikitext を列として取得し、正規表現や分割関数で必要な情報を取り出します。取得した値を Structured Data にマッピングできます。

### 構造化データ用の列を準備する {#prepare-columns-with-structured-data}

Commons の Structured Data では、キャプション（モノリンガルテキスト）やステートメント（主語が Mediainfo アイテム）を追加します。OpenRefine ではそれぞれの値を列に用意し、必要に応じて Wikidata の Qid を含む列を作成します。

### Commons へアップロードする {#upload-to-commons}

Wikidata と同様に、<span class="menuItems">Wikidata</span> → <span class="menuItems">Upload edits</span> からアップロードします（Commons 用マニフェストを選択していることを確認）。キャプションやステートメントが不足している場合は警告されます。アップロード後の変更は [Special:Contributions](https://commons.wikimedia.org/wiki/Special:MyContributions) や [EditGroups-commons](https://editgroups-commons.toolforge.org/?tool=OR) で確認できます。

### EditGroups で誤りを取り消す {#commons-editgroups}

OpenRefine で行った Commons の編集には、編集要約の末尾に _(details)_ リンクが付きます。これをクリックすると [EditGroups](https://editgroups-commons.toolforge.org/) の該当バッチが開き、バッチ単位で簡単に差し戻せます。全バッチは https://editgroups-commons.toolforge.org/?tool=OR に一覧表示されています。
