---
id: migrating-older-extensions
title: 旧拡張機能の移行
sidebar_label: 旧拡張機能の移行
---

## Ant から Maven への移行 {#migrating-from-ant-to-maven}

### なぜこの変更をするのか {#why-are-we-doing-this-change}

Ant は依存管理を備えない古いビルドシステムです。Maven に移行することで、開発者が OpenRefine に新しいライブラリを組み込みやすくなり、リポジトリに大量の .jar ファイルを同梱する必要がなくなります。Maven リポジトリを使うことで、更新しづらい独自スナップショットではなく、公開済みライブラリへの依存を推奨できる点もメリットです。

### いつ変更されたか {#when-was-this-change-made}

3.0 から 3.1-beta の間で以下のコミットにより移行しました。
https://github.com/OpenRefine/OpenRefine/commit/47323a9e750a3bc9d43af606006b5eb20ca397b8

### 拡張を移行するには {#how-to-migrate-an-extension}

拡張のルートに `pom.xml` を配置し、Maven 用のビルド設定を記述します。OpenRefine 同梱拡張（`gdata`、`database`、`jython`、`pc-axis`、`wikidata`）やサンプル拡張（`sample`）の `pom.xml` が参考になります。

依存ライブラリは可能な限り Maven Central から取得し、`.jar` を削除して `pom.xml` に依存を追加します。見つからない場合は `maven-install-plugin` を使って手元の `.jar` を取り込めます。

```
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-install-plugin</artifactId>
        <version>2.5.2</version>
        <executions>
            <execution>
                <id>install-wdtk-datamodel</id>
                <phase>process-resources</phase>
                <configuration>
                    <file>${basedir}/lib/my-proprietary-library.jar</file>
                    <repositoryLayout>default</repositoryLayout>
                    <groupId>com.my.company</groupId>
                    <artifactId>my-library</artifactId>
                    <version>0.5.3-SNAPSHOT</version>
                    <packaging>jar</packaging>
                    <generatePom>true</generatePom>
                </configuration>
                <goals>
                    <goal>install-file</goal>
                </goals>
            </execution>
        </executions>
      </plugin>
```

依存セクションに通常どおり追加します。

```
<dependency>
  <groupId>com.my.company</groupId>
  <artifactId>my-library</artifactId>
  <version>0.5.3-SNAPSHOT</version>
</dependency>
```

## Wikimedia の i18n jQuery プラグインへの移行 {#migrating-to-wikimedias-i18n-jquery-plugin}

### なぜこの変更をするのか {#why-are-we-doing-this-change-1}

複数形や文字列補間などの重要なローカリゼーション機能を利用できるようにするためです。また、翻訳が存在しない場合に英語にフォールバックする機能も復活します。

### いつ移行したか {#when-was-the-migration-made}

3.1-beta から 3.1 の間に以下のコミットで移行しました。
https://github.com/OpenRefine/OpenRefine/commit/22322bd0272e99869ab8381b1f28696cc7a26721

### 拡張を移行するには {#how-to-migrate-an-extension-1}

翻訳ファイル内のネストされたオブジェクトを 1 つのオブジェクトに統合し、キーを連結します。以下の Python スクリプトを各 JSON に適用してください。

```python
import json
import sys

with open(sys.argv[1], 'r') as f:
    j = json.loads(f.read())

result = {}

def translate(obj, path):
    if isinstance(obj, str):
        result['/'.join(path)] = obj
    else:
        for k, v in obj.items():
            translate(v, path + [k])

translate(j, [])

with open(sys.argv[1], 'w') as f:
    f.write(json.dumps(result, ensure_ascii=False, indent=4))
```

JavaScript での取得方法は `$.i18n._('core-dialogs')['cancel']` から `$.i18n('core-dialogs/cancel')` に変わります。次の `sed` スクリプトで置換可能です。

```
sed -i "s/\$\.i18n._(['"]\([A-Za-z0-9/_\\-]*\)['"])\[['"]\([A-Za-z0-9\-_]*\)["']\]/$.i18n('\1\/\2')/g" my_javascript_file.js
```

翻訳文字列を連結している箇所は、プラグインの機能を使った柔軟なパターンに置き換えてください。

## org.json から Jackson への移行 {#migrating-from-orgjson-to-jackson}

### なぜこの変更をするのか {#why-are-we-doing-this-change-2}

org.json はライセンス上の問題や機能不足があり、Jackson に移行して統一的なシリアライズ/デシリアライズ処理を行うためです。

### いつ移行したか {#when-was-the-migration-made-1}

3.1 で実施されました。

### 拡張を移行するには {#how-to-migrate-an-extension-2}

`ParsingUtilities.mapper` を活用して Jackson で JSON を扱います。org.json の `JSONObject`/`JSONArray` は以下のメソッドで置き換えます。

- `ParsingUtilities.mapper.createObjectNode()`（`new JSONObject()` の代替）
- `ParsingUtilities.mapper.createArrayNode()`（`new JSONArray()` の代替）

移行前に、オブジェクトのシリアライズ／デシリアライズを行うテストを書き、JSON 形式が保持されることを確認してください。[`TestUtils`](https://github.com/OpenRefine/OpenRefine/blob/master/main/tests/server/src/com/google/refine/tests/util/TestUtils.java) のユーティリティも活用できます。

#### Function の場合 {#for-functions}

従来は `write` メソッドで JSON を明示的に定義していましたが、移行後は各種ドキュメント用の getter を上書きします。例: `Cos` 関数の [移行前](https://github.com/OpenRefine/OpenRefine/blob/3.1/main/src/com/google/refine/expr/functions/math/Cos.java) / [移行後](https://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/expr/functions/math/Cos.java)。

#### Operation の場合 {#for-operations}

エンジン依存の Operation では、`JSONObject` の代わりに `EngineConfig` を使用するようリファクタ済みです。コンストラクターで `EngineConfig` を受け取り、デシリアライズ用のアノテーションを追加してください。Operation type は `AbstractOperation` が自動でシリアライズします。例: `ColumnRemovalOperation` の [前](https://github.com/OpenRefine/OpenRefine/blob/3.1/main/src/com/google/refine/operations/column/ColumnRemovalOperation.java) / [後](https://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/operations/column/ColumnRemovalOperation.java)。

#### Change の場合 {#for-changes}

Change はテキストでシリアライズされますが、一部で JSON を使うことがあります。`ParsingUtilities.mapper` 経由で Jackson を利用してください（例: `ReconChange`）。

#### Importer の場合 {#for-importers}

インポートオプションは `JSONObject` から `ObjectNode` に移行しました。コンパイラの警告に従って変換できます。`JSONUtilities` も Jackson に対応済みです。例: `TabularImportingParserBase` の [前](https://github.com/OpenRefine/OpenRefine/blob/3.1/main/src/com/google/refine/importers/TabularImportingParserBase.java) / [後](https://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/importers/TabularImportingParserBase.java)。

#### Overlay Model の場合 {#for-overlay-models}

他オブジェクト同様にシリアライズ／デシリアライズを移行します。例: `WikibaseSchema` の [前](https://github.com/OpenRefine/OpenRefine/blob/3.1/extensions/wikidata/src/org/openrefine/wikidata/schema/WikibaseSchema.java#L203) / [後](https://github.com/OpenRefine/OpenRefine/blob/master/extensions/wikidata/src/org/openrefine/wikidata/schema/WikibaseSchema.java#L60)。

#### Preference 値の場合 {#for-preference-values}

Preferences に保存するクラスは `com.google.refine.preferences.PreferenceValue` を実装し、従来の static `load` / `write` メソッドは削除して Jackson の標準的なシリアライズに置き換えます。クラス名のシリアライズはインターフェースが自動で処理します。例: `TopList` の [前](https://github.com/OpenRefine/OpenRefine/blob/3.1/main/src/com/google/refine/preference/TopList.java) / [後](https://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/preference/TopList.java)。
