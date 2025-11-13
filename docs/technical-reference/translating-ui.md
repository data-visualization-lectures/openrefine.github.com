---
id: translating-ui
title: OpenRefine の翻訳
sidebar_label: OpenRefine の翻訳
---

OpenRefine を自分の言語に翻訳するには [Weblate](https://hosted.weblate.org/engage/openrefine/?utm_source=widget) を利用します。ブラウザ上で翻訳を編集でき、完了すると自動的に Pull Request が送信されます。

![Translation status](https://hosted.weblate.org/widgets/openrefine/-/287x66-grey.png)

→ [Weblate で翻訳に参加](https://hosted.weblate.org/engage/openrefine/?utm_source=widget)

## 手動で翻訳する {#manual-translation-process}

各言語の文字列は `main/webapp/modules/core/langs/translation-xx.json` に格納されています（`xx` は言語コード、例: `fr`）。

### 単純な例 {#simple-case-of-localized-string}
```json
{
    "name": "Français",
    "core-index/help": "Aide"
}
```

`core-index/help` というキーに対し、フランス語では "Aide" が表示されます。

### 変数を含む例 {#localization-with-a-parameterized-value}
列名などのパラメータは `$1` のように表現します。

```
"core-facets/edit-facet-title": "Cliquez ici ...\nColonne : $1"
```

### 単数・複数形 {#localization-with-a-singularplural-value}
`{{plural:$2|page|pages}}` のようにして値に応じた語形を選択します。

## フロントエンド開発 {#front-end-development}

OpenRefine のフロントエンドは [Wikimedia jquery.i18n](https://github.com/wikimedia/jquery.i18n) でローカライズされています。新しい文字列が必要な場合は既存のキーを再利用できないか確認し、適切なキーで文章全体を国際化してください。以下のように `$.i18n('section/key')` で取得し、`text()` か `html()` を使って DOM に挿入します。

```javascript
$('#element').text($.i18n('section/key'));
```

文字列の連結は行わず、パラメータを含む完全な文章として翻訳対象に含めます。

## 新しい言語の追加 {#adding-a-new-language}

最も簡単なのは Weblate で翻訳を追加する方法です。手動の場合は `translation-en.json` をコピーして `translation-<locale>.json` を作成し、値を翻訳します。

- コア UI: `main/webapp/modules/core/langs`
- database 拡張: `extensions/database/module/langs`
- Wikibase 拡張: `extensions/wikibase/module/langs`

マスターブランチで OpenRefine を動かしてレイアウトに収まるか確認してください。未翻訳のテキストが残る場合は Issue を作成して報告してください。

### 拡張 {#extensions}

拡張も Weblate で翻訳できます。Wikibase 拡張では専門用語が多いため、[Wikidata glossary](https://www.wikidata.org/wiki/Wikidata:Glossary) を参照するとよいでしょう。新言語をメニューに表示するには `/main/webapp/modules/core/scripts/index/lang-settings-ui.html` のドロップダウンに `<option value="<locale>">言語名</option>` を追加します。

## サーバー側ローカライズ {#server--backend-coding}

バックエンドの一部も Weblate で翻訳され、`.properties` ファイルに保存されています。ビルド時に Java クラスへ生成されます。例: 操作説明は [`main/resources/com/google/refine/operations`](https://github.com/OpenRefine/OpenRefine/tree/master/main/resources/com/google/refine/operations/) にあります。
