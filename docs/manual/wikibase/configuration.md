---
id: configuration
title: OpenRefine を Wikibase インスタンスへ接続する
sidebar_label: Wikibase への接続
---

このページでは OpenRefine を任意の Wikibase インスタンスに接続する方法を説明します。[Wikidata](https://www.wikidata.org/) だけを利用する場合は、OpenRefine に標準設定済みなのでこのページを読む必要はありません。

## Wikibase 利用者の場合 {#for-wikibase-end-users}

OpenRefine を特定の Wikibase と連携させるために必要なのは、そのインスタンスを記述した *マニフェスト* です。マニフェストには連携に必要なメタデータや各種 URL が含まれます。

[wikibase-manifests](https://github.com/OpenRefine/wikibase-manifests) リポジトリでは、いくつかの公開インスタンス向けマニフェストを提供しています。ただし最も新しい設定はインスタンスの管理者が持っているはずなので、まずは管理者に提供を依頼してください。

## Wikibase 管理者の場合 {#for-wikibase-administrators}

利用者が OpenRefine からあなたの Wikibase に編集できるようにするには、上記のマニフェストを用意する必要があります。ホスティング場所に正式な決まりはありませんが、利用者が簡単に見つけられる場所に置いてください。以下でマニフェストの構造を説明します。

### 要件 {#requirements}

OpenRefine と連携するには、編集対象となる各エンティティタイプごとにリコンサイルサービスが必要です。

* アイテム（Q で始まる ID）を編集するには、[Python 製ラッパー](https://gitlab.com/nfdi4culture/ta1-data-enrichment/openrefine-wikibase) をデプロイし、Wikibase API と Query Service の上にリコンサイルサービスを構築します。利用には [UniversalLanguageSelector 拡張](https://www.mediawiki.org/wiki/Special:MyLanguage/Extension:UniversalLanguageSelector) が必要です。

* ファイルアップロードを受け付ける場合は、[別の Python ラッパー](https://github.com/wikimedia/labs-tools-commons-recon-service) を利用してメディアファイル用リコンサイルサービスを公開します。

* プロパティやその他のエンティティタイプの編集は現時点ではサポートされていません。

これらの追加サービスを運用するのが難しい場合があることは把握しており、将来的には MediaWiki 拡張としてリコンサイルエンドポイントを提供する形に置き換えたいと考えていますが、現時点で着手予定はありません。

### マニフェストの形式 {#the-format-of-the-manifest}

マニフェストは JSON オブジェクトで、OpenRefine と Wikibase を連携させるための設定をすべて記述します。以下は Wikimedia Commons の例です。

```json
{
  "version": "2.0",
  "mediawiki": {
    "name": "Wikimedia Commons",
    "root": "https://commons.wikimedia.org/wiki/",
    "main_page": "https://commons.wikimedia.org/wiki/Main_Page",
    "api": "https://commons.wikimedia.org/w/api.php"
  },
  "wikibase": {
    "site_iri": "https://commons.wikimedia.org/entity/",
    "maxlag": 5,
    "max_edits_per_minute": 60,
    "tag": "openrefine-${version}",
    "properties": {
      "instance_of": "P31",
      "subclass_of": "P279"
    },
    "constraints": {
      "property_constraint_pid": "P2302",
      "exception_to_constraint_pid": "P2303",
      "constraint_status_pid": "P2316",
      "mandatory_constraint_qid": "Q21502408",
      "suggestion_constraint_qid": "Q62026391",
      "distinct_values_constraint_qid": "Q21502410"
    }
  },
  "oauth": {
    "registration_page": "https://commons.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose"
  },
  "entity_types": {
    "item": {
       "site_iri": "http://www.wikidata.org/entity/",
       "reconciliation_endpoint": "https://wikidata.reconci.link/${lang}/api",
       "mediawiki_api": "https://www.wikidata.org/w/api.php"
    },
    "property": {
       "site_iri": "http://www.wikidata.org/entity/",
       "mediawiki_api": "https://www.wikidata.org/w/api.php"
    },
    "mediainfo": {
       "site_iri": "https://commons.wikimedia.org/entity/",
       "reconciliation_endpoint": "https://commonsreconcile.toolforge.org/${lang}/api"
    }
  },
  "hide_structured_fields_in_mediainfo": false,
  "editgroups": {
    "url_schema": "([[:toollabs:editgroups-commons/b/OR/${batch_id}|details]])"
  }
}
```

マニフェストは大まかに `version`、`mediawiki`、`wikibase`、`oauth`、`entity_types`、`editgroups` の各セクションに分かれています。

#### version {#version}

バージョンは `"2.x"` の形式を取り、後方互換の変更を加えたときにマイナーバージョンを上げます。フォーマットが [wikibase-manifest-schema-v2.json](https://github.com/afkbrb/wikibase-manifest/blob/master/wikibase-manifest-schema-v2.json) に準拠していればメジャーバージョンは 2 にします。

OpenRefine 3.6 以前に作成したマニフェストは version 1 形式です。OpenRefine 3.6 からは複数のエンティティタイプを編集できるように仕様が拡張されたため、version 2 形式に移行することを推奨します。移行手順は本頁末尾を参照してください。

#### mediawiki {#mediawiki}

This part contains some basic information of the Wikibase.

##### name {#name}

The name of the Wikibase, should be unique for different Wikibase instances.

##### root {#root}

The root of the Wikibase. Typically in the form "https://foo.bar/wiki/". The trailing slash cannot be omitted.

##### main_page {#main_page}

The main page of the Wikibase. Typically in the form "https://foo.bar/wiki/Main_Page".

##### api {#api}

The MediaWiki API endpoint of the Wikibase. Typically in the form "https://foo.bar/w/api.php".

#### wikibase {#wikibase}

This part contains configurations of the Wikibase extension.

##### site_iri {#site_iri}

The IRI of the Wikibase, in the form  'http://foo.bar/entity/'. This should match the IRI prefixes used in RDF serialization. Be careful about using "http" or "https", because any variation will break comparisons at various places. The trailing slash cannot be omitted.

##### maxlag {#maxlag}

Maxlag is a parameter that controls how aggressive a mass-editing tool should be when uploading edits to a Wikibase instance. See https://www.mediawiki.org/wiki/Manual:Maxlag_parameter for more details. The value should be adapted according to the actual traffic of the Wikibase.

##### tag {#tag}

Specifies a [tag](https://www.mediawiki.org/wiki/Help:Tags) which should be applied to all edits made via the tool. The `${version}` variable will be replaced by the "major.minor" OpenRefine version before making edits.

##### max_edits_per_minute {#max_edits_per_minute}

Determines the editing speed expressed as the maximum number of edits to perform per minute, as an integer. The editing can still be slower than this rate if the performance of the Wikibase instance degrades. If set to 0, this will disable this cap.

##### properties {#properties}

Some special properties of the Wikibase.

###### instance_of {#instance_of}

The ID of the property "instance of".

###### subclass_of {#subclass_of}

The ID of the property "subclass of".

##### constraints {#constraints}

Not required. Should be configured if the Wikibase has the [WikibaseQualityConstraints extension](https://www.mediawiki.org/wiki/Extension:WikibaseQualityConstraints) installed. Configurations of constraints consists of IDs of constraints related properties and items. For Wikidata, these IDs are retrieved from [extension.json](https://github.com/wikimedia/mediawiki-extensions-WikibaseQualityConstraints/blob/master/extension.json). To configure this for another Wikibase instance, you should contact an admin of the Wikibase instance to get the content of `extension.json`.

#### oauth {#oauth}

Not required. Should be configured if the Wikibase has the [OAuth extension](https://www.mediawiki.org/wiki/Extension:OAuth) installed.

##### registration_page {#registration_page}

The page to register an OAuth consumer of the Wikibase. Typically in the form "https://foo.bar/wiki/Special:OAuthConsumerRegistration/propose".

#### entity_types {#entity_types}

The Wikibase instance can support several entity types (such as `item`, `property` or `lexeme`), and this section stores parameters which are specific to those entity types.

The Wikibase instance must have at least a reconciliation service endpoint linked to it. 

##### reconciliation_endpoint {#reconciliation_endpoint}

The default reconciliation service endpoint for entities of this type. The endpoint must contain the `${lang}` variable such as `https://wikidata.reconci.link/${lang}/api`, since the reconciliation service is expected to work for different languages. For the `item` entity type, you can get such a reconciliation service with [openrefine-wikibase](https://gitlab.com/nfdi4culture/ta1-data-enrichment/openrefine-wikibase). For the `mediainfo` entity type, you can use the [commons-recon-service](https://gerrit.wikimedia.org/g/labs/tools/commons-recon-service) which can be configured to run for other Wikibase instances.

This parameter is optional: you do not need to run a reconciliation for all entity types available in your Wikibase instance. However, it is a prerequisite for being able to do edits to those entity types via OpenRefine.

##### site_iri {#site_iri}

The base IRI for the entities of this type. This property is required. By default, this is expected to be the same as the site IRI for the Wikibase instance (see above), but if entities of this type are federated from another instance, then this should be set to the site IRI of that Wikibase instance.

##### mediawiki_api {#mediawiki_api}

このエンティティタイプで利用する MediaWiki API の URL。省略するとインスタンス全体の API エンドポイントが使われますが、他インスタンスからフェデレーションされている場合はそちらの API エンドポイントを指定します。

#### hide_structured_fields_in_mediainfo

任意。ファイルアップロードには対応しているが、Wikimedia Commons のようにファイルに直接キャプションやステートメントを付ける機能はない場合に `true` を設定します。

#### editgroups {#editgroups}

Not required. Should be configured if the Wikibase instance has [EditGroups](https://github.com/Wikidata/editgroups) service(s).

##### url_schema {#url_schema}

The URL schema used in edits summary. This is used for EditGroups to extract the batch id from a batch of edits and for linking to the EditGroups page of the batch. The URL schema must contains the variable `${batch_id}`, such as `([[:toollabs:editgroups/b/OR/${batch_id}|details]])` for Wikidata.

#### Check the format of the manifest {#check-the-format-of-the-manifest}

マニフェストは [wikibase-manifest-schema-v2.json](https://github.com/afkbrb/wikibase-manifest/blob/master/wikibase-manifest-schema-v2.json) に沿っている必要があります。OpenRefine にマニフェストを追加すると、自動的に形式が検証され、不正な場合はエラーが表示されます。

![test-validate-manifest-format](https://user-images.githubusercontent.com/29347603/90506110-52d85d00-e186-11ea-8077-683d2f234c46.gif)

#### マニフェストを version 1 から version 2 へ移行する

OpenRefine 3.6 以前に作成したマニフェストは version 1 形式です。3.6 で複数エンティティタイプを扱えるよう仕様が一般化されたため、アイテム以外（メディアファイルなど）も編集させたい場合は version 2 へ移行してください。

手順:

* `version` フィールドを `2.0` に変更

* `entity_types` フィールドを追加し、既存のリコンサイルサービスの URL を `item` セクションに記述

* [メディアファイル用リコンサイルサービス](https://github.com/wikimedia/labs-tools-commons-recon-service) をデプロイし、`entity_types` に追記

* ファイルをアップロードできるが構造化データを利用しない場合は `hide_structured_fields_in_mediainfo` を追加

変更後は、利用者にマニフェストを再登録してもらうことで新しい設定が反映されます。
