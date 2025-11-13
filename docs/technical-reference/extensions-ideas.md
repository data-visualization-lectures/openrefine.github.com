---
id: extension-ideas
title: 拡張機能のアイデア
sidebar_label: 拡張機能のアイデア
---

過去にリクエストのあった拡張機能のアイデアをまとめています。特定ドメイン向けの機能は、OpenRefine 本体に組み込むよりも拡張として実装する方が望ましい場合があります。アイデアの追加も歓迎です。

### OAI-PMH インポート

[OAI-PMH](https://www.openarchives.org/pmh/) は図書館・アーカイブなどがコレクションを公開する標準プロトコルで、文書一覧と標準化されたメタデータを取得できます。[多様な分野の数千のリポジトリ](http://www.openarchives.org/Register/BrowseSites) で採用されています。現在、OpenRefine からこれらのリポジトリを簡単に取り込む方法はありません。OAI-PMH 拡張では、エンドポイントや OAI セットなどを指定してプロジェクトを作成し、ページネーションやデータ変換を自動で処理できるようにします。

**未解決の課題**
* OAI-PMH では複数のメタデータフォーマットが利用できます。OpenRefine プロジェクトにどう変換するべきでしょうか？
* 利用用途は何が想定されるでしょう？OpenRefine レッスンを提供している Library Carpentry コミュニティにニーズを聞く価値がありそうです。

**関連議論**
* https://mamot.fr/@pintoch/111841610572874330

### IIIF インポート

[IIIF](https://en.wikipedia.org/wiki/International_Image_Interoperability_Framework)（トリプル I F）は、高度なメタデータ付きで画像を公開する標準で、文化機関が収蔵資料のデジタル化を共有する際に用いられています。IIIF コレクションを OpenRefine に取り込み、メタデータを整備したり、Wikimedia Commons 拡張と組み合わせてアップロードしたりできると便利です。IIIF ルート URL を入力してプロジェクトを生成する専用インポートフローが必要で、クロールの深さなどを設定できる UI が求められます。[Commons extension](https://github.com/OpenRefine/CommonsExtension) に組み込むか、新たな拡張として実装する案があります。

**未解決の課題**
* IIIF が許容する豊富なメタデータを、OpenRefine の表構造にどのように写像するべきでしょうか？
* Wikimedia Commons 連携と組み合わせる場合、IIIF から Commons へのアップロードの間にユーザーはどんなデータ整形を行うでしょう？例となるコレクションで実際に試すと要件が見えてきそうです。人手を介さず済むケースが多ければ、OpenRefine ではなく専用の IIIF→Commons エクスポーターを検討する余地もあります。

**関連議論**
* https://github.com/OpenRefine/CommonsExtension/issues/90
* https://github.com/OpenRefine/CommonsExtension/issues/19

### OFX インポート

OFX 形式は金融データのストリームを表現するために使われ、多くの銀行が口座取引のエクスポートに対応しています。OpenRefine で簡単に OFX ファイルを読み込めると、大量の取引履歴をファセットで検索したり、条件ごとに分類したりできるでしょう。Java 実装として https://github.com/stoicflame/ofx4j などが参考になります。

**未解決の課題**
* OFX が最優先で対応すべき形式でしょうか？他に戦略的なフォーマットはありますか？
* クリーニング後のデータは通常どのような形式に出力されますか？
* 単に OFX→CSV 変換ツールを使うのと比べて十分な価値がありますか？

### Wikidata レキシームのアップロード

Wikidata では語彙データ用のレキシーム型エンティティが導入されましたが、現状の Wikibase 拡張では Items/Mediainfo のみ扱え、レキシーム編集や作成はできません。対応を求める声が多くあります。

**未解決の課題**
* どのようなデータセットでの利用が想定されるでしょう？
* フォームやセンスを内包する入れ子構造を、OpenRefine の表形式でどう扱うべきでしょう？
* Wikibase 拡張自体を拡張可能にし、追加エンティティ型（レキシーム等）を別拡張でサポートできるでしょうか？メディアアップロード機能を Commons 拡張へ移すことも可能かもしれません。ただし各所でエンティティ型ごとの特別扱いがあり、実現は容易ではなさそうです。

**関連議論**
* https://github.com/OpenRefine/OpenRefine/issues/2240
* https://forum.openrefine.org/t/openrefine-support-for-lexemes-in-wikidata-how-would-you-use-this/216

### データの匿名化

PII を含むデータセットのリスクを可視化し、削除（無効化）や匿名化を行える拡張を構想しています。リスク評価や匿名化・仮名化を支援するライブラリとして以下が参考になります（仮名化は GDPR などの規制に十分適合しない場合もあります）。

https://github.com/arx-deidentifier/arx
https://github.com/realrolfje/anonimatron

**関連議論**
* https://github.com/OpenRefine/OpenRefine/issues/5642
