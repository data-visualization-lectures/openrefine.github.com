---
id: sortview
title: 並べ替えと表示
sidebar_label: 並べ替えと表示
---

## Sort {#sort}

各列で一時的に行の並べ替えができます。対象となるデータ型（[data type](exploring#data-types)）に応じて次のように並べ替えられます:
*   テキスト: 昇順 / 降順（大文字小文字の区別も可能で、小文字で始まる値が先頭に来ます）
*   数値: 大きい順 / 小さい順
*   日付: 古い順 / 新しい順
*   真偽値: false を先頭 / true を先頭

エラーや null 値をどの位置に置くかも指定可能です。

![A screenshot of the Sort window.](/img/sort.png)

並べ替えを適用した後は一時的に維持したり、削除・反転・さらに別の並べ替えを追加できます。適用中はプロジェクトグリッドヘッダーの行数表示右側にある <span class="menuItems">Sort</span> で設定が一覧表示されます。

複数の並べ替えを行った場合は、<span class="menuItems">Sort</span> メニューに表示された順番（適用順）に評価されます。たとえば “authors” 列をアルファベット順に並べ、そのあと各著者について出版日順に並べれば、著者内でのソート順が保持されます。逆に日付でまず並べてから著者で並べると表示が異なります。

![Temporarily sorted rows.](/img/sort2.png)

追加した並べ替えが一時的（temporary）な状態では、行番号は元のままです。<span class="menuItems">Reorder rows permanently</span> を実行して並べ替えを恒久化すると行番号が変わり、グリッドヘッダーの <span class="menuItems">Sort</span> メニューが消えます。これにより現在の並べ替え順がすべて適用されます。

## View {#view}

グリッドに表示する列を制御できます。各列には <span class="menuItems">View</span> メニューがあり、特定の列・他の全列・左の列・右の列を折りたたむ（collapse）ことができます。<span class="menuItems">All</span> 列の <span class="menuItems">View</span> からはすべて折りたたんだり、過去に折りたたんだ列をすべて展開したりできます。

### “null” の表示/非表示 {#showhide-null}

<span class="menuItems">All</span> → <span class="menuItems">View</span> の中に、[“null” 値](exploring#data-types) を表示/非表示にするオプションがあります。対象セルには小さな灰色の “null” が表示されます。null は空文字とは異なる特別な値です。

![A screenshot of what a null value looks like.](/img/null.png)

## ページ移動 {#page-navigation}

画面右側のページ番号入力欄に直接数値を入力すると任意のページに移動できます。上下キーを使うと前後のページを移動でき、表示行数/レコード数はビューの左側で変更できます。

![A screenshot of the Page Navigation Feature.](/img/goto.png)
