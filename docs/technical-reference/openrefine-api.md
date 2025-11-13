---
id: openrefine-api
title: OpenRefine API
sidebar_label: OpenRefine API
---

OpenRefine の HTTP API とやり取りするためのリファレンスです。

**注意:** プロトコルは予告なく変更される可能性があり、バージョニングもありません。利用は自己責任でお願いします。

OpenRefine 3.3 以降では、すべての POST リクエストに [リリースノート](https://github.com/OpenRefine/OpenRefine/wiki/Changes-for-3.3#csrf-protection-changes) に記載の CSRF トークンが必要です。

## プロジェクト作成 {#create-project}

> **コマンド:** _POST /command/core/create-project-from-upload_

ファイルアップロード時は `multipart/form-data` で送信します。他の API はクエリ文字列や通常の POST パラメータを使います。

multipart form-data:

```
'project-file' : ファイルの内容
'project-name' : プロジェクト名
'format' : ファイル形式（例: 'text/line-based/*sv'）[任意]
'options' : ファイル形式に応じたオプションを含む JSON オブジェクト [任意。ただし JSON/XML など一部インポーターでは必須]
```

利用できる形式は OpenRefine のバージョンや拡張機能によって異なります。一般的なもの:

- 'text/line-based': 行ベーステキスト
- 'text/line-based/*sv': CSV/TSV/区切り文字形式（区切り文字は `options` の JSON で指定）
- 'text/line-based/fixed-width': 固定長テキスト
- 'binary/text/xml/xls/xlsx': Excel
- 'text/json': JSON
- 'text/xml': XML

`format` を省略すると拡張子や MIME タイプから推測します。`options` の JSON に指定できる値は形式によって異なり、未指定の場合は推測またはデフォルト値が使われます。GUI で該当形式をインポートする際の画面が参考になります。

成功すると以下のような URL にリダイレクトされます。
```
http://127.0.0.1:3333/project?project=<project id>
```
`project` パラメータからプロジェクト ID を取得し、以降の API で利用します。レスポンス本体はプロジェクトを表示する OpenRefine の HTML です。

### プロジェクトモデル取得 {#get-project-models}

> **コマンド:** _GET /command/core/get-models?_

```
'project' : プロジェクト ID
```

列やレコード、オーバーレイモデル、スクリプト情報などを取得します。`columnModel` には列リスト（位置・元名・表示名）とキー列情報、グループが含まれます。

### レスポンス例 {#response}
```json
{"columnModel":{...},"recordModel":{"hasRecords":false},...}
```

## プロジェクト名・メタデータ変更

> **コマンド:** _POST /command/core/set-project-metadata_

[プロジェクト管理](../manual/starting#project-management) の通り、プロジェクト名やメタデータを変更します。

```
'project' : プロジェクト ID
'name' : name/creator/contributors/.../customMetadata
'value' : 新しい値
```

- 名前変更は `name` フィールド
- カスタムメタデータは `customMetadata` に JSON を指定

## プロジェクトタグ変更

> **コマンド:** _POST /command/core/set-project-tags_

```
'project' : プロジェクト ID
'old' : 削除するタグ（カンマ区切り）
'new' : 追加するタグ（カンマ区切り）
```

## 操作の適用 {#apply-operations}

> **コマンド:** _POST /command/core/apply-operations?_

```
'project' : プロジェクト ID
```

フォームデータ:
```
'operations' : OpenRefine 操作の JSON 配列
```

例:
```json
[
  {"op":"core/column-addition",...},
  {"op":"core/column-addition",...}
]
```

成功すると `{ "code" : "ok" }` を返します。

## 行のエクスポート {#export-rows}

> **コマンド:** _POST /command/core/export-rows_

```
'project' : プロジェクト ID
'format' : 'tsv' や 'csv' など
```

フォームデータ:
```json
"engine" : {"facets":[],"mode":"row-based"}
```

指定フォーマットでデータを返します。共通フォーマット: csv, tsv, xls, xlsx, ods, html。

## プロジェクト削除 {#delete-project}

> **コマンド:** _POST /command/core/delete-project_

```
'project' : プロジェクト ID
```

## 非同期プロセスの状態確認 {#check-status-of-async-processes}

> **コマンド:** _GET /command/core/get-processes_

```
'project' : プロジェクト ID
```

## 全プロジェクトのメタデータ取得 {#get-all-projects-metadata}

> **コマンド:** _GET /command/core/get-all-project-metadata_

全プロジェクトの ID・名称・作成日時・更新日時を返します。

```json
{"projects":{"123":{"name":"proj","created":"..."}}}
```

## 式プレビュー {#expression-preview}

> **コマンド:** _POST /command/core/preview-expression_

指定の列と行に式（GREL/Jython/Clojure）を適用し、結果を返します。

主なパラメータ:
- `cellIndex`: 対象列
- `rowIndices`: 行インデックス配列（例: `[0,1]`）
- `expression`: `grel:value.toLowercase()` のように `<言語>:<式>`
- `project`: プロジェクト ID
- `repeat`, `repeatCount`: 同じ計算を繰り返す場合に指定

成功レスポンス:
```json
{"code":"ok","results":["foo","bar"]}
```

## サードパーティライブラリ {#third-party-software-libraries}

API クライアントライブラリは [Extensions](/extensions#client-libraries) にまとめられています。
