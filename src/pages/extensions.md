---
title: 拡張機能
description: コミュニティが作った拡張機能で OpenRefine を強化しましょう。
hide_table_of_contents: true
---

# OpenRefine の拡張機能

以下の拡張機能をインストールすると OpenRefine に機能を追加できます。ここに掲載しているからといって動作を保証するものではなく、旧バージョンや独自ディストリビューションでのみ動くものもあります。[拡張機能のインストール方法](https://docs.openrefine.org/manual/installing#installing-extensions) もご確認ください。

| Extension Name | 説明 | 作者 | 対応バージョン |
|--------------|-------------|----------|----------|
| [AI Extension](https://github.com/sunilnatraj/llm-extension) | 最新の言語モデルと OpenRefine の変換機能を連携させる拡張。 | [Sunil Natraj](https://github.com/sunilnatraj) | 3.8.7+ |
| [Files Extension](https://github.com/OpenRefine/FilesExtension) | ローカルファイルの詳細情報を使ってプロジェクトを作成するツール。 | [Sunil Natraj](https://github.com/sunilnatraj) | 3.8.7+ |
| [gdata extension](https://github.com/OpenRefine/refine-gdata-extension) | Google Drive / Google Sheets へのインポート＆エクスポートを提供。 | Tom Morris | 3.9 |
| [RDF Transform](https://github.com/AtesComp/rdf-transform) | データを RDF 形式へ変換する拡張。旧 [RDF extension](https://github.com/stkenny/grefine-rdf-extension) を最新の Java / JavaScript 技術で全面的に書き換えたもの。 | [AtesComp](https://github.com/AtesComp) | 3.8+ |
| [Commons extension](https://github.com/OpenRefine/CommonsExtension) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/) 既存ファイルから構造化データを抽出する作業を支援。 | [Joey Salazar](https://github.com/j-sal), [Sandra Fauconnier](https://github.com/trnstlntk) | 3.6 |
| [Refine JS](https://github.com/wetneb/refine-js) | 式言語として JavaScript を利用できるようにする拡張。 | [wetneb](https://github.com/wetneb) | 3.6+ |
| [OpenRefine Command Palette](https://codeberg.org/abbe98/openrefine-command-palette) | コマンドパレットとキーボードショートカットを追加。 | [Albin Larsson](https://codeberg.org/abbe98) | 3.7+ |
| [OpenRefine Hex Colors](https://codeberg.org/abbe98/openrefine-hex-colors) | セル内の 16 進カラーコードを検出し表示。 | [Albin Larsson](https://codeberg.org/abbe98) | 3.7+ |
| [GEO Extension](https://github.com/OpenRefine/openrefine-geo-extension) | 地理座標処理の関数を追加。decToGMS() で度分秒へ変換、geoDistance() でハーサイン公式による大円距離を算出。 | [SashankBhamidi](https://github.com/SashankBhamidi) | 3.8+ |
| [OSM Extractor](https://gitlab.com/labiangashi/osm-extractor) | [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) を使って [OpenStreetMap](https://www.openstreetmap.org/) データを取り込む import オプションと、図形の [interior point](https://locationtech.github.io/jts/javadoc/org/locationtech/jts/algorithm/InteriorPoint.html) を得る GREL 関数 interiorPoint() を追加。 | [Labian Gashi](https://gitlab.com/labiangashi) | 3.5.0 |
| [GeoJSON Export](https://gitlab.com/labiangashi/geojson-export) | [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) 形式でエクスポートする GUI を提供。緯度経度と [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) をサポート。 | [Labian Gashi](https://gitlab.com/labiangashi) | 3.5.0 |
| [SNAC extension](https://github.com/snac-cooperative/snac-openrefine-extension) | OpenRefine から [SNAC](https://snaccooperative.org/) を編集できるようにする拡張。 | [Joseph Glass](https://github.com/glassjoseph), [Robbie Hott](https://github.com/deternitydx), [Jason Jordan](https://github.com/jlj5aj) | 3.4.1 |
| [FAIR metadata](https://github.com/FAIRDataTeam/OpenRefine-metadata-extension) | [FAIR Data Point](https://github.com/FAIRDataTeam/FAIRDataPoint) と連携し、[FAIR 原則](https://www.go-fair.org/fair-principles/) に沿ったメタデータ管理・出力を支援。旧 [FAIRifier](https://github.com/FAIRDataTeam/FAIRifier) の後継。 | [FAIRDataTeam](https://github.com/FAIRDataTeam/OpenRefine-metadata-extension/graphs/contributors) | 3.4.1 |
| [VIB-Bits](http://web.archive.org/web/20210817193059/https://www.bits.vib.be/index.php/software-overview/openrefine) | 履歴／ピボット／cross() GUI／散布図などのツールを追加。[マニュアル PDF](http://web.archive.org/web/20210817193059/http://data.bits.vib.be/hidden/g7dt6RjuUTU421dY2CwrGePGX/OpenRefine%20VIB-BITS%20plugin.pdf) | VIB-Bits | 3.4.1 |
| [Named-Entity Recognition](https://github.com/stkenny/Refine-NER-Extension) | テキストから固有名やリコンシリエーション可能なエンティティを抽出。AlchemyAPI / DBpedia Lookup / Zemanta をサポート。[マニュアル](http://freeyourmetadata.org/named-entity-extraction/)。 |  [Ruben Verborgh](https://freeyourmetadata.org/)、Stuart Kenny | 3.4.1 |
| [String-Transformers](https://github.com/RBGKew/String-Transformers) | Jython で使える Java 文字列変換関数をまとめた拡張。汎用的なものと植物学・分類学向けのものが含まれます。必要な JAR をダウンロードし [手順](https://github.com/RBGKew/String-Transformers) に従ってください。 | RBGKew | 3.4.1 |
| [RDF extension](https://github.com/stkenny/grefine-rdf-extension) | RDF Refine。RDF 出力向けに改良されたフォークで、RDF エクスポート用 GUI を追加。  |  [stkenny](https://github.com/stkenny) & [DRI](https://github.com/Digital-Repository-of-Ireland) | 3.4.1 |
| [GOKb Utilities](https://github.com/ostephens/refine-gokbutils) | 新しい 3 つの機能を追加: 行の先頭に空行を挿入、全セルの前後空白を削除、URL からホスト名を抜き出す extractHost()。 | [GOKb](http://www.gokb.org) & [Owen Stephens](https://github.com/ostephens/) | 3.1 |
| [Stats extension for Google Refine 2.5+](https://github.com/sparkica/refine-stats) | 列データの基本統計を計算。  | sparkica  | 3.1 |
| [CKAN Storage Extension](https://github.com/Ontodia/openrefine-ckan-storage-extension) | CKAN Storage API を使い、CKAN Storage 2.2+ へデータをエクスポート。 | Ontodia | 3.1 |
| [GeoRefine](https://github.com/ryanfb/georefine) | 地理処理向けの GREL 関数を追加。 |  Ryan Baumann | 2.8 |
| [D2Refine](https://github.com/caCDE-QA/D2Refine) | 臨床研究のメタデータ統合・検証のためのワークベンチ。1) スプレッドシート形式で指定した制約を臨床モデルへ変換し、2) Common Terminology Services 2 (CTS2) を使ったリコンシリエーションを提供。[マニュアル](https://github.com/caCDE-QA/D2Refine/wiki)。 |  [Deepak K. Sharma](https://github.com/dksharma) | 2.7 |

### レガシー拡張

過去に作られた拡張ですが、OpenRefine の活用例として意義があるため載せています。将来引き継いでくれる人が現れることも期待しています。

| Extension Name | 説明 | 作者 | 推奨バージョン |
|--------------|-------------|----------|----------|
| [LODRefine](https://github.com/sparkica/LODRefine)    | RDF・DBpedia・CrowdFlower・Stats などの拡張を統合し、表データから Linked Data への移行を楽にする OpenRefine ベースの配布物。 | Sparkica |
| [VIB-BITS Diff plugin](https://web.archive.org/web/20190412064426/https://www.bits.vib.be/index.php/software-overview/openrefine) | テキスト値を比較する diff ツールを追加。[マニュアル PDF](https://web.archive.org/web/20210203090522/https://data.bits.vib.be/hidden/g7dt6RjuUTU421dY2CwrGePGX/OpenRefine%20VIB-BITS%20diff%20plugin.pdf)。 |   VIB-Bits  | 3.4.1（サイト上では 3.4 向け再配布を検討中とのこと）。 |
| [VIB-BITS Save facets plugin](https://web.archive.org/web/20190412064426/https://www.bits.vib.be/index.php/software-overview/openrefine) | ファセット設定を保存して後で再適用する機能を追加。[マニュアル PDF](https://web.archive.org/web/20150325214740/http://data.bits.vib.be/hidden/g7dt6RjuUTU421dY2CwrGePGX/OpenRefine%20VIB-BITS%20save%20facets%20plugin.pdf)。  |   VIB-Bits  | 不明（diff プラグイン同様 3.4 向けを検討中）。 |
|[refine-fuzzymatch-extension](https://github.com/yatszhash/refine-fuzzymatch-extension)|曖昧マッチ／リコンシリエーション用拡張。|[yatszhash](https://github.com/yatszhash)|2.8|
| [geoXtension](https://github.com/giTorto/geoXtension) | GDAL / Proj / GEOS に依存。導入に時間がかかるため Docker 利用が推奨。 |  giTorto  | (約 2.6) |
| [extraCTU-plugin](https://github.com/giTorto/extraCTU-plugin) | テキストからメール・電話・URL・識別番号を抽出。 | giTorto | (約 2.7) |
| [Opentree](https://github.com/nickynicolson/refine-opentree) | Open Tree of Life の系統樹を表示。[マニュアル](https://github.com/nickynicolson/refine-opentree/wiki)。 |  nickynicolson  | 2.5 |
| [BioVeL](https://github.com/BioVeL/refine-ext)  | 生物多様性データのクレンジング／クラスタリング機能を提供。ローカル／専用サーバーで実行可能。 |  Botanic Garden and Botanical Museum Berlin-Dahlem | 2.5 |
| [DBpedia extension](https://github.com/sparkica/dbpedia-extension) | DBpedia でリコンシリエーションしたデータに列を追加。DBpedia もしくは DBpedia 型を返す SPARQL エンドポイントでの照合が必要。 |  Zemanta | 2.5 |
| [Stats extension for Google Refine 2.1](https://github.com/newsapps/refine-stats)  | 列データの基本統計を計算。 | The Chicago Tribune | 2.1 |

## リコンシリエーションサービス

OpenRefine は複数のリコンシリエーションサービスと連携できます。情報は次をご覧ください。
* Wiki の [Reconcilable Data Sources](https://github.com/OpenRefine/OpenRefine/wiki/Reconcilable-Data-Sources)
* Reconciliation API Census の [Reconciliation Software](https://reconciliation-api.github.io/census/services/)
* Reconciliation API testbench の [Reconciliation Services](https://reconciliation-api.github.io/testbench/#/)（[Wikidata の SPARQL クエリ](https://w.wiki/5agG) で生成）

## クライアントライブラリ

既存のライブラリを使うと、[OpenRefine API](/docs/technical-reference/openrefine-api) 経由で操作を自動化できます。

| 言語  | ライブラリ名 |
|-----------|------|
| bash      | [orcli](https://github.com/opencultureconsulting/orcli) |
| C# / .NET | [OpenRefine.Net](https://github.com/ADelRosarioH/OpenRefine.Net) |
| java      | [refine-java](https://github.com/ancore/refine-java) |
| python    | [openrefine-client](https://github.com/opencultureconsulting/openrefine-client) |
| R         | [rrefine](https://cran.r-project.org/web/packages/rrefine/index.html) |

### 旧クライアントライブラリ

OpenRefine 3.3 で [CSRF トークン](https://github.com/OpenRefine/OpenRefine/wiki/Changes-for-3.3#csrf-protection-changes) が導入されました。以下のライブラリはまだ対応していません。

| 言語   | ライブラリ名 | 対応バージョン |
|------------|------|--------------------------------------|
| javascript | [node-openrefine](https://github.com/pm5/node-openrefine) | 3.2 |
| python     | [refine-client-py](https://github.com/PaulMakepeace/refine-client-py/) | 3.2 |
| python     | [refine-python](https://github.com/maxogden/refine-python) | 3.2 |
| ruby       | [refine-ruby](https://github.com/distillytics/refine-ruby) (fork) | 3.2 |
| ruby       | [refine-ruby](https://github.com/maxogden/refine-ruby) | 3.2 |
