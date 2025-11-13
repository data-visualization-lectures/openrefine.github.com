---
id: clustering-in-depth
title: クラスタリング手法の詳細
sidebar_label: クラスタリング手法の詳細
---

*OpenRefine のクラスタリング機能における手法と理論的背景をまとめています。*

# はじめに

OpenRefine では、[クラスタリング](https://docs.openrefine.org/manual/cellediting#cluster-and-edit)とは「同じものを別の表記で示している可能性がある値のグループを探す」操作を指します。

クラスタリングはセル値の文字構成という**構文レベル**でのみ機能することに注意してください。誤記・タイプミス・表記揺れを見つけるには非常に役立ちますが、意味的な類似性まで把握するには不十分です。そのため OpenRefine では、[Wikidata など外部の意味情報を持つリコンサイルサービス](https://docs.openrefine.org/manual/reconciling)を利用し、構文レベルだけでは補えない部分をカバーします。

# 手法の概要

汎用性と実用性のバランスを取るため、OpenRefine には厳選されたクラスタリング手法／アルゴリズムが同梱されています。多くの状況で十分な精度と速度が確認されているものです。

OpenRefine が提供する手法は大きく 2 つのカテゴリに分かれます。
1. トークンベース（n-gram、キー衝突など）
2. 文字ベース、すなわち編集距離（レーベンシュタイン距離、PPM など）

**注意:** どのアルゴリズムが高速かは文字列の長さに大きく依存します。短い文字列なら処理が重くても精度の高い編集距離系（例: レーベンシュタイン）を使うのが有効で、長い文字列なら n-gram、バッグ距離、ジャッカード係数、ダイス係数などのトークンベース手法が向いています（OpenRefine で提供していないものもあります）。

## キー衝突（Key Collision）系

キー衝突手法では、文字列から意味分解に寄与する部分だけを取り出した「キー」を生成し、そのキーが同じものを同じバケツ（bin）にまとめます。キーが衝突する（= 同じキーになる）ことからこの名称です。

### Fingerprint

Fingerprint（指紋）方式は誤検出が最も少なく、OpenRefine のデフォルト手法です。文字列からキーを生成する手順は次の通りです（順番は重要）。

- 文字列の前後の空白を除去
- 全文字を小文字化
- 句読点や制御文字を削除
- 拡張ラテン文字を ASCII に正規化（例: "gödel" → "godel"）
- 空白区切りでトークン化
- トークンをソートして重複を削除
- トークンを再び連結

実装は[こちら](https://github.com/OpenRefine/OpenRefine/blob/master/modules/core/src/main/java/com/google/refine/clustering/binning/FingerprintKeyer.java)。

この手法では:

- 空白を正規化し、小文字化し、句読点を削るため、これらの違いは指紋に影響しません。意味の差異にあまり寄与しない部分を落とすことで、クラスタが浮かび上がりやすくなります。
- トークンをソートするため、順序が違っても同じ指紋になります（"Cruise, Tom" と "Tom Cruise" → "cruise tom"）。
- 拡張文字の正規化は ASCII キーボード入力時のうっかりミスを吸収するのに有効ですが、本来別の文字を区別できなくなる副作用もあります。

### N-Gram Fingerprint

[n-gram](http://en.wikipedia.org/wiki/N-gram) 指紋は次の処理を行います。

- 全文字を小文字化
- 句読点・空白・制御文字を除去
- 文字列から n-gram をすべて取り出す
- n-gram をソートして重複を削除
- 連結
- 拡張ラテン文字を ASCII に正規化

たとえば "Paris" の 2-gram 指紋は "arispari"、1-gram 指紋は "aiprs" です。[実装はこちら](http://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/clustering/binning/NGramFingerprintKeyer.java)。

n を大きくすると前述 Fingerprint と大差ありませんが、2-gram/1-gram では誤検出が多い代わりに微妙な違いのクラスタを拾えます（"Krzysztof" など綴り違いでも同じ文字集合なら一致）。

### Phonetic Fingerprint

音韻指紋ではトークンを発音に基づいて変換し、聞き間違いや綴りの勘違いによるエラーを検出します。似た発音の語が同じキーになり、同じクラスタに入ります。

例: "Reuben Gevorkiantz" と "Ruben Gevorkyants" は通常の指紋では揃いませんが、英語発音の音韻指紋では一致します。

OpenRefine がサポートする主なアルゴリズム:

#### Metaphone3

英語だけでなく米国で一般的な非英語圏の名前にも対応した改良版です。OpenRefine 2.1.3 における 'approximate' エンコードのルールは:

- 母音はすべて 'A' にマップ
- `encodeVowels=false` なら語頭のみ、true なら発音される位置すべてで 'A'
- 'W' や 'Y' も母音として扱う
- 有声/無声のペアを同じ値に統一（D/T→T 等）
- 'CH' と 'SH' は 'X'（-SH-/ -CH- 音）に、"TH" は '0'（ゼロ）に

#### Cologne Phonetics

ドイツ語に最適化されたアルゴリズムで、語を数字列（音声コード）に変換します。手順は以下の通りです。

**ステップ1**: 前処理（大文字化、ウムラウト転写、非英字削除）→下表に従って文字を数字へ置換します。

<table>
   <thead>
      <tr>
         <th>文字</th>
         <th>条件</th>
         <th>コード</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>A, E, I, O, U</td>
         <td></td>
         <td>0</td>
      </tr>
      <tr>
         <td>H</td>
         <td></td>
         <td>-</td>
      </tr>
      <tr>
         <td>B</td>
         <td></td>
         <td rowspan="2">1</td>
      </tr>
      <tr>
         <td>P</td>
         <td>H の前以外</td>
      </tr>
      <tr>
         <td>D, T</td>
         <td>C/S/Z の前以外</td>
         <td>2</td>
      </tr>
      <tr>
         <td>F, V, W</td>
         <td></td>
         <td rowspan="2">3</td>
      </tr>
      <tr>
         <td>P</td>
         <td>H の前</td>
      </tr>
      <tr>
         <td>G, K, Q</td>
         <td></td>
         <td rowspan="3">4</td>
      </tr>
      <tr>
         <td rowspan="2">C</td>
         <td>語頭で A/H/K/L/O/Q/R/U/X の前</td>
      </tr>
      <tr>
         <td>S/Z の後を除き A/H/K/O/Q/U/X の前</td>
      </tr>
      <tr>
         <td>X</td>
         <td>C/K/Q 以外の後</td>
         <td>48</td>
      </tr>
      <tr>
         <td>L</td>
         <td></td>
         <td>5</td>
      </tr>
      <tr>
         <td>M, N</td>
         <td></td>
         <td>6</td>
      </tr>
      <tr>
         <td>R</td>
         <td></td>
         <td>7</td>
      </tr>
      <tr>
         <td>S, Z</td>
         <td></td>
         <td rowspan="6">8</td>
      </tr>
      <tr>
         <td rowspan="3">C</td>
         <td>S/Z の後</td>
      </tr>
      <tr>
         <td>語頭で A/H/K/L/O/Q/R/U/X 以外の前</td>
      </tr>
      <tr>
         <td>A/H/K/O/Q/U/X 以外の前</td>
      </tr>
      <tr>
         <td>D, T</td>
         <td>C/S/Z の前</td>
      </tr>
      <tr>
         <td>X</td>
         <td>C/K/Q の後</td>
      </tr>
   </tbody>
</table>

**例:** "Guten Morgen" → "GUTENMORGEN" → 40206607406

**ステップ2**: 連続する同一数字を 1 つに

4020**66**07406 → 4020607406

**ステップ3**: 先頭以外の "0" を削除

4**0**2**0**6**0**74**0**6 → 426746

#### Daitch-Moktoff

ユダヤ系姓のマッチング精度向上のための Soundex 派生です。6 桁のコードを生成し、足りない場合は 0 で埋めます。母音や H の扱い、隣接音の結合、複数語姓の扱いなど独自ルールがあります。いくつかの文字／連続文字は 2 通りのコードを持ちます。

#### Beider-Morse

[Beider-Morse Phonetic Matching](https://stevemorse.org/phonetics/bmpm.htm) は発音だけでなく言語特性も考慮する高度な手法です。手順は:

1. 綴りから言語を推定（例: "tsch" や "mann" はドイツ語、"cz" はポーランド語など）
2. 音韻規則を適用し、発音アルファベットへ変換
3. 近似音声値を計算
4. ヘブライ語音声値を計算

詳細は[公式ドキュメント](https://stevemorse.org/phonetics/bmpm.htm)を参照してください。

## 近傍探索（kNN）系

キー衝突系は高速ですが、閾値調整ができないため厳しすぎたり緩すぎたりします。これに対し [k 最近傍法](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)では距離の閾値（半径）を設定し、一定以下の距離にある文字列を同じクラスタにまとめます。

ただし n 個の文字列に対して比較すべき組み合わせは `n(n-1)/2` と膨大で、小さなデータセットでも遅くなります。そこで OpenRefine では「ブロッキング」という手法を用い、あらかじめ共通部分文字列（デフォルト 6 文字）ごとにグループ化してから距離を計算します。実際にはブロック数を n、各ブロックの平均サイズを m とすると、必要な距離計算回数は `n * m(m-1)/2` まで減り、大幅な高速化が見込めます。

ブロックサイズは設定可能ですが、3 未満に下げると時間だけかかって有用な結果が増えない傾向があります（ただしケースバイケース）。

kNN の各距離手法では、距離計算自体が異なるだけでブロッキング部分は共通です。

### レーベンシュタイン距離

[Levenshtein 距離](http://en.wikipedia.org/wiki/Levenshtein_distance)（編集距離）は最も直感的な距離指標で、ある文字列を別の文字列に変換するための最小編集回数を測ります。派生として [Damerau-Levenshtein](http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) などもありますが、クラスタリングでは閾値さえ調整できれば実用上ほぼ同等です。

### PPM

[Kolmogorov 複雑性](http://en.wikipedia.org/wiki/Kolmogorov_complexity)を用いて文字列の類似性を推定する[論文](http://arxiv.org/abs/cs/0111054)に基づく手法です。圧縮器が文字列の情報量を推定する性質を利用し、文字列 A と B が似ていれば A と A+B を圧縮した長さがほぼ同じになります。OpenRefine では以下の正規化距離を用います。

```
d(A,B) = (comp(A+B) + comp(B+A)) / (comp(A+A) + comp(B+B))
```

`comp(s)` は文字列 `s` を圧縮したバイト長（`+` は連結）。Kolmogorov 最適に近い圧縮器ほど精度が高いため、テキスト圧縮で強力な [Prediction by Partial Matching](http://en.wikipedia.org/wiki/Prediction_by_Partial_Matching) を使用しています。

PPM は短い半径でも緩めで誤検出が多い反面、文字単位では捉えにくい下位構造を検出できます。統計的圧縮が十分にウォームアップする必要があるため、長い文字列ほど真価を発揮します。最終手段的に使うのが良いでしょう。

# 置換候補の決定

各クラスタでは 1 つの値が「新しいセル値」として提案され、クラスタ内の全セルをその値に統一できます。初期値はクラスタ内の最初の要素で、[`ClusteringDialog.prototype._updateData`](https://github.com/OpenRefine/OpenRefine/blob/master/main/webapp/modules/core/scripts/dialogs/clustering-dialog.js) にて決まります。

クラスタ内の順番は:

1. クラスタ構築時の順序（`Collections.sort` は安定ソート）
2. 値の出現回数でソート（Key Collision では `TreeMap` による自然順序、Nearest Neighbor では別手法で、テスト結果から逆順の可能性あり）

# コントリビュート歓迎

- 現状は英語／英語化データを主に対象としており、手法にもそのバイアスがあります。コミュニティから知見が集まれば追加手法の導入を検討します。
- 内部的にはより多くの手法をサポートしていますが、効果が薄かったものは無効化しています。もし有用そうな方法があれば提案してください。見落としている可能性があります。

# 参考文献

OpenRefine のクラスタリングコードは MIT の [SIMILE Project](http://simile.mit.edu/) での研究をベースにし、後に [Vicino project](http://code.google.com/p/simile-vicino/) として発展しました（"vicino" はイタリア語で「近い」の意）。

より詳しい情報や研究は、[Vicino の参考文献リスト](https://github.com/OpenRefine/simile-vicino/tree/master/papers)、Wikiversity の [重複レコード検出](https://en.wikiversity.org/wiki/Duplicate_record_detection)、および [Similarity measures - Felix Naumann, 2013](https://hpi.de/fileadmin/user_upload/fachgebiete/naumann/folien/SS13/DPDC/DPDC_12_Similarity.pdf) などを参照してください。
