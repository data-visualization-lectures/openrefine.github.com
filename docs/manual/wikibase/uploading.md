---
id: uploading
title: Wikibase へのアップロード
sidebar_label: 編集のアップロード
---

ここでは、作成したスキーマをもとに Wikibase へ編集内容をアップロードする方法を説明します。OpenRefine 側でスキーマが完成していることを前提とします。

## OpenRefine から直接アップロードする {#uploading-with-openrefine}

1. <span class=\"menuItems\">Wikidata</span> → <span class=\"menuItems\">Upload edits to Wikidata</span> を選択します（他の Wikibase を利用している場合でもメニュー名は同じです）。
2. 編集に利用する個人アカウントまたはボットアカウントでログインします。[Bot password](https://www.mediawiki.org/wiki/Manual:Bot_passwords/ja) を使うと安全です。
3. 編集サマリーを入力します。OpenRefine は同一アイテムへの変更を 1 回の編集にまとめるため、分かりやすいサマリーを付けることが重要です。Wikibase が対応していれば、[EditGroups](https://editgroups.toolforge.org/) へのリンクが自動的に追記されます。
4. <span class=\"buttonLabels\">Perform edits</span> を押して完了を待ちます。進捗は Wiki 側の投稿記録や EditGroups で確認できます。

アップロード自体も OpenRefine の「操作」として記録されるため、操作の抽出・再適用が可能です。その場合はスキーマ保存の操作（最後の 1 件で可）も含め、スキーマ内の列名が適用先のプロジェクトと一致していることを確認してください。

## QuickStatements でアップロードする {#uploading-with-quickstatements}

[QuickStatements](https://meta.wikimedia.org/wiki/QuickStatements/ja) が利用可能な Wikibase であれば、OpenRefine から QuickStatements 形式をエクスポートして実行することもできます。

1. <span class=\"menuItems\">Wikibase</span> → <span class=\"menuItems\">Export to QuickStatements</span> を選択し、生成されたファイルの内容をコピーします。
2. QuickStatements（Wikidata では https://quickstatements.toolforge.org/）にアクセスし、アカウント認証を行います。
3. <span class=\"buttonLabels\">Version 1 format</span> を選択します。
4. 先ほどのテキストを貼り付けます。
5. <span class=\"buttonLabels\">Run</span> もしくは <span class=\"buttonLabels\">Run in background</span> で実行します。

## 2 つの方法の違い {#notable-differences-between-the-two-methods}

### Merging strategy for terms and statements {#merging-strategy-for-terms-and-statements}

OpenRefine ではラベルやステートメントのマージ戦略を細かく制御できますが、QuickStatements は単一の方式しか持ちません。スキーマで指定した戦略はエクスポート時に無視されるため、意図しない結果になることがあります。

### New item creation {#new-item-creation}

OpenRefine は相互にリンクした新規アイテムの作成に対応しています。

QuickStatements では <code>CREATE</code> と <code>LAST</code> を使って新規アイテムを参照します。OpenRefine は可能な限りこの構文を利用できるように命令を並べ替えますが、相互参照が複雑な場合は QuickStatements で表現できず、その場合はスクリプトを生成しません。

### Speed and number of edits {#speed-and-number-of-edits}

OpenRefine は原則として 1 アイテムにつき 1 編集（新規アイテム同士を結ぶ場合でも 2 編集まで）を行います。これによりサーバー負荷と履歴の煩雑さを抑えていますが、編集サマリーが簡略になりやすいため、ユーザー側で分かりやすいサマリーを記入することが重要です。速度は 1 分あたり最大 60 編集程度です。

QuickStatements はステートメント・修飾子・参照を段階的に追加するため、1 つの変更に複数の編集が発生します。速度は落ちますが、アイテム履歴はより詳細になります。
