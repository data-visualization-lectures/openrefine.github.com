---
id: maintainer-guidelines
title: メンテナー向けガイドライン
sidebar_label: メンテナーガイドライン
---

OpenRefine で Issue や Pull Request をレビューする際のルールをまとめています。

## Issue のレビュー {#reviewing-issues}

新しい Issue には自動的に ["to be reviewed" ラベル](https://github.com/OpenRefine/OpenRefine/issues?q=is%3Aissue+is%3Aopen+label%3A%22to+be+reviewed%22) が付きます。開発者でなくても構わないので、OpenRefine に詳しい人が内容を確認し、本当のバグや妥当な改善提案かどうかを判断してください。妥当であればラベルを外して残します。そうでなければ礼儀正しくクローズしましょう。

### バグ {#bugs}

期待動作の誤解ではなく、本当に想定外の挙動かを確認します（ドキュメント改善が必要な場合もあります）。問題が正しそうなら master ブランチで再現できるかを確かめます。Issue に再現情報が不足している場合は "not reproducible" を付けて追加情報を依頼し、一定期間返答がなければクローズします。

### 改善要望 {#enhancement-requests}

提案された機能がプロジェクトの範囲に収まるかを判断します。明確な基準はないので、自分の感覚を信じて「ツールが良くなるか」「プロジェクトの精神に合うか」を考えてください。意見が分かれたら Issue 上で議論できます。

### good first issue の付与 {#tagging-good-first-issues}

["good first issue" ラベル](https://github.com/OpenRefine/OpenRefine/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) は、開発プロセスに慣れた人が付けるべきです。GitHub や我々から新規貢献者への入口として紹介するため、取り組みやすい Issue であることが重要です。

開発者は「数時間以内で良質な PR を出せる」「難しい設計判断が不要」「チームが受け入れることが明らかな内容」と判断できる場合にこのラベルを付与してください。

## Pull Request のレビュー {#reviewing-pull-requests}

### プロセス {#process}

1. PR は作者以外のコミッターがレビューし、下記要件を満たしているか確認しテストします。PR と関連 Issue が正しく紐付いているかを確認し、影響が大きい場合は他の貢献者の意見も募ります。
2. レビュアーは PR を squash merge します（Weblate PR は例外で、そのままマージ）。
3. 対応した Issue を次回リリースのマイルストーン（例: [3.5 マイルストーン](https://github.com/OpenRefine/OpenRefine/milestone/17)）へ追加します。
4. ユーザーや開発者にとって重要な変更は、次回リリースの changelog（例: [Changes for 3.5](https://github.com/OpenRefine/OpenRefine/wiki/Changes-for-3.5)）へ追記します。

### 要件 {#requirements}

#### コードスタイル {#code-style}

現状、自動チェックがあるのは Cypress を使った統合テストのみです。その他は周辺コードに合わせてください。[ツール全体でスタイルを決めて CI で検証したい](https://github.com/OpenRefine/OpenRefine/issues/2338) という課題もあります。

#### テスト {#testing}

- Java（TestNG）によるバックエンドテスト
- JavaScript（Cypress）による UI テスト

バックエンド変更には TestNG テストを、UI 機能変更には可能な限り Cypress テストを追加し、同じ PR に含めます。

#### ドキュメント {#documentation}

ユーザー向け機能が変わる場合は、ドキュメントも同じ PR で更新してください。

#### UI スタイル {#ui-style}

正式なガイドラインはないため、既存スタイルを踏襲してください。

#### ライセンスと依存関係 {#licensing-and-dependencies}

依存ライブラリは BSD-3-Clause と両立するライセンスである必要があります。またバンドルサイズに影響するため、依存追加は慎重に検討します。

#### CI {#continuous-integration}

CI のチェックはすべて緑であることが条件です。

### 特別な PR {#special-pull-requests}

#### Weblate PR {#weblate-prs}

Weblate PR は squash すると Weblate 側で取り込みが検出できなくなるため、squash せずにマージします。言語チェックは簡単な目視のみで構いません。修正が必要なら Weblate 上で行います。

#### Dependabot PR {#dependabot-prs}

Dependabot PR では以下を確認すると良いでしょう。
- バージョン変更の種類（多くは semver に従う）
- ライブラリの changelog（特にマイナー以上の更新）
