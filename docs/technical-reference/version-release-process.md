---
id: version-release-process
title: OpenRefine リリース手順
sidebar_label: OpenRefine リリース手順
---

## メジャー／マイナーリリース

1. `master` ブランチが安定しているか確認し、数日間テストしてもらう。
2. パッチ番号なしでリリース対象のブランチを作成（例: `3.9`）。
3. [RefineServlet.java](http://github.com/OpenRefine/OpenRefine/blob/master/main/src/com/google/refine/RefineServlet.java#L62) と POM のバージョンを新番号に更新（例: `mvn versions:set -DgenerateBackupPoms=false -DnewVersion=3.9-beta`）。コミット。
4. Markdown でチェンジログを作成（Issue にマイルストーンが付いていれば参考に）。
5. リリース候補にタグを付けて push。
   ```bash
   git tag -a -m "Second beta" 2.6-beta.2
   git push origin --tags
   ```
6. GitHub Release を作成し要約を記入。公開するとビルド済みアーティファクトが添付される。
7. openrefine.org リポジトリの [`releases.json`](https://github.com/OpenRefine/openrefine.org/blob/master/releases.json) を更新し、[ダウンロードページ](/download) を確認。
8. [フォーラムのアナウンス](https://forum.openrefine.org/c/news/13) や [ブログ](/blog) で告知。
9. `master` のバージョンを次期 `-SNAPSHOT`（例: `4.3-SNAPSHOT`）に更新。

## パッチリリース

1. 対象マイナーブランチ（例: `3.9`）をチェックアウト。
2. RefineServlet と POM のバージョンをパッチ番号に更新（例: `3.9.3`）。
3. 含めたい PR のマージコミットを `git cherry-pick` で取り込む（競合は手動解決）。
4. タグ付けして push。
   ```bash
   git tag -a -m "Version 3.9.3" 3.9.3
   git push origin --tags
   ```
5. GitHub Release を作成し、生成されたアーティファクトを確認。
6. `releases.json` 更新とダウンロードページ確認。
7. フォーラム／ブログで告知。
8. ブランチのバージョンを `3.9-SNAPSHOT` のように戻す。

## Apple コード署名

ビルド環境に証明書を配置済みですが、問題があればローカルに取り込んでデバッグできます。
- advisory.committee@openrefine.org に Apple Team 参加を依頼（AppleID メールを伝える）。
- [CSR を作成](https://help.apple.com/developer-account/#/devbfa00fef7)。
- [Apple Developer](https://developer.apple.com/account/resources/certificates/add) で "Apple Distribution" を選び CSR をアップロード。
- 証明書をダウンロードし Keychain Access にインポート。
- 署名ワークフローは `.github/workflows/snapshot_release.yml` 参照。

## Maven アーティファクト公開

Maven Central の [`org.openrefine`](https://central.sonatype.com/artifact/org.openrefine/openrefine/overview) は一部のリリースマネージャーが管理します。アクセス権の調整は Sonatype サポートへのメールのみで行います。`openrefinedev@gmail.com` にアクセスできるメンバーが対応可能です。
