id: transforming
title: データの変換
sidebar_label: 概要
---

## 概要 {#overview}

OpenRefine にはデータをクリーンアップ・正規化・コード化・拡張する強力な手段があり、セル内部を直接編集しなくても誤字の修正や型の変換、信頼できる外部データからの補完などが可能です。

このセクションではメニュー順に機能を並べ、以下のような操作を扱います:

*   [行](#edit-rows) や [列](columnediting#rename-remove-and-move) の順序変更
*   特定の列内の [セル編集](cellediting)
*   行と列の [変換](transposing)
*   [列の分割・結合](columnediting#split-or-join)
*   既存データを元に [列を追加](columnediting)（フェッチや [リコンシリエーション](reconciling) を併用）
*   [複数行のレコード](exploring#rows-vs-records) への変換

## 行の編集 {#edit-rows}

行を移動する操作はデータに恒久的な変更を加えることになります。

1 列の値に基づいて [データを並べ替える](sortview#sort) ことは、まず一時的な表示設定として行われますが、その順序を恒久化できます。

![ソートメニューの位置 (「Reorder rows permanently」)](/img/sortPermanent.png)

ソートを適用するとプロジェクトグリッドヘッダーに“Sort”が表示され、そのドロップダウンで <span class="menuItems">Reorder rows permanently</span> を選ぶと、<span class="menuItems">All</span> 列の行番号が変化します。

:::info 行の順序を確定する場合
行の順序を恒久化すると現在のファセット/フィルター下だけでなく、データセット全体の行順が対象になります（[facets](facets) を適用した行のみではありません）。
:::

この操作は [<span class="fieldLabels">History</span> タブ](running#history-undoredo) から取り消せます。
