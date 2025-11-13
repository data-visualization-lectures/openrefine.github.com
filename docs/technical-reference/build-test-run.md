---
id: build-test-run
title: ビルド・テスト・実行方法
sidebar_label: ビルド・テスト・実行方法
---

import useBaseUrl from '@docusaurus/useBaseUrl';

このページでは、OpenRefine をソースから実行・開発するために必要なツールのインストール手順を説明します。必要なものは次のとおりです。
* Unix/Linux シェル環境、または Windows コマンドライン（どちらも OS に付属）
* [OpenRefine のソースコード](#get-openrefine-source-code)
* [JDK](#set-up-jdk)（11 以上）
* [Apache Maven](#maven)
* [Node.js と npm](#nodejs)（20 以上）

### OpenRefine のソースコードを取得 {#get-openrefine-source-code}

Git がインストールされていれば、`git clone` で [リポジトリ](https://github.com/OpenRefine/OpenRefine) を任意のディレクトリにクローンします。

### JDK のセットアップ {#set-up-jdk}

[JDK をインストール](https://adoptium.net/)し、`JAVA_HOME` 環境変数を設定してください（JRE ではなく JDK を指す必要があります）。OpenRefine は Java 11〜21 で動作確認済みです。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  groupId="operating-systems"
  defaultValue="win"
  values={[
    {label: 'Windows', value: 'win'},
    {label: 'Mac', value: 'mac'},
    {label: 'Linux', value: 'linux'}
  ]
}>

<TabItem value="win">

1. Windows 10 ではスタートメニューを開いて `env` と入力し、検索結果から <span class="buttonLabels">環境変数を編集</span> をクリックします（古いバージョンはスタートメニューの「検索」ボックスを使います）。

![A screenshot of the search results for 'env'.](/img/env.png "A screenshot of the search results for 'env'.")

2. <span class="tabLabels">詳細設定</span> タブ下部の <span class="buttonLabels">環境変数...</span> をクリックします。
3. 表示された <span class="tabLabels">環境変数</span> ウィンドウで <span class="buttonLabels">新規...</span> を押し、キーを `JAVA_HOME` にします。ユーザー環境変数でもシステム環境変数でも構いません。

![A screenshot of 'Environment Variables'.](/img/javahome.png "A screenshot of 'Environment Variables'.")

4. `値` には JDK をインストールしたフォルダー（例: `D:\Programs\OpenJDK`）を設定します。<span class="buttonLabels">ディレクトリの参照...</span> で辿れます。

</TabItem>

<TabItem value="mac">

まず Homebrew で `brew install java` するか、[Adoptium からダウンロードして手動インストール](https://adoptium.net/)します。
その後、`JAVA_HOME` が正しく設定されているか確認します。

```
$JAVA_HOME/bin/java --version
```
  
バージョンが表示されれば設定済みです。エラーの場合は次のいずれかを実行します。

```
export JAVA_HOME="$(/usr/libexec/java_home)"
```

Java 13 系など特定バージョンを指定したい場合:

```
export JAVA_HOME="$(/usr/libexec/java_home -v 13)"
```

</TabItem>

<TabItem value="linux">

Debian/Ubuntu 系なら:

```
sudo apt install default-jdk
```

Fedora/CentOS なら:
```
sudo dnf install java-devel
```

ArchLinux なら:
```
sudo pacman -S jdk-openjdk
```

その他のディストリビューションでもリポジトリから JDK を入手できます。

</TabItem>

</Tabs>

---

### Maven {#maven}
OpenRefine のビルド・テスト・パッケージ化には Apache Maven が必須です。最新バージョンの利用を推奨します。古い Maven だと IDE 上で POM や依存関係の不整合が表示されることがあります。

<Tabs
  groupId="operating-systems"
  defaultValue="win"
  values={[
    {label: 'Windows', value: 'win'},
    {label: 'Mac', value: 'mac'},
    {label: 'Linux', value: 'linux'}
  ]
}>

<TabItem value="win">

[公式手順](https://maven.apache.org/install.html)で Maven をインストールし、`M2_HOME` または `MAVEN_HOME` を設定するか、`mvn` が `PATH` に入っていることを確認します。
```shell
MAVEN_HOME=E:\Downloads\apache-maven-3.8.4-bin\apache-maven-3.8.4\
```
</TabItem>
<TabItem value="mac">
Homebrew なら `brew install maven` です。

他の方法で [Maven をインストール](https://maven.apache.org/install.html)した場合も、`M2_HOME` / `MAVEN_HOME` か `PATH` の設定を忘れずに。
```shell
MAVEN_HOME=/opt/apache-maven-3.8.7
```

</TabItem>
<TabItem value="linux">
ディストリビューションのパッケージマネージャーでインストールします。

* Debian/Ubuntu 系: `sudo apt install maven`
* Fedora/CentOS: `sudo dnf install maven`
* ArchLinux: `sudo pacman -S maven`

</TabItem>
</Tabs>

### Node.js と npm {#nodejs}

OpenRefine の webapp 依存をインストールするために [Node.js](https://nodejs.org/en/download/) と npm が必要です。Node.js 20 以上を入れてください（Windows では [nvm-windows](https://github.com/coreybutler/nvm-windows) も便利です）。
インストール後、次でバージョン確認ができます。
```
node -v
npm -v
```
npm を最新に更新したい場合は:
```
npm install -g npm@latest
```

### ビルド {#building}

サポートされるコマンドを確認するには:
```shell
./refine -h
```

ソースから OpenRefine をビルドするには:
```shell
./refine clean
./refine build
```

`refine` スクリプトは Maven のラッパーです。Maven のゴールを直接実行しても構いませんが、ゴール単体だと失敗することがあります。その場合は `compile test-compile` を付けるなどしてください。

### テスト {#testing}
OpenRefine はサーバーとブラウザー UI の 2 つの部分で構成されるため、テストも次のように分かれます。

* サーバー側: [TestNG](http://testng.org/) を用いた Java のユニットテスト
* クライアント側: [Cypress](https://www.cypress.io/) を用いた JavaScript テスト

サーバーテストを実行するには:
```shell
./refine test
```

Cypress テストを初めて実行する前に、[インストール手順](functional-tests)を完了させてください。その後は 2 つのプロセスを並行して起動します。
* OpenRefine 本体（可能なら空のワークスペースを使用）: `./refine -d /tmp/openrefine_workspace`
* Cypress: `yarn --cwd ./main/tests/cypress run cypress open`

ローカルでは必要なテストスイートだけを選んで実行し、全スイートは CI に任せることを推奨します（時間がかかるため）。

## 実行 {#running}
リポジトリのルートで `./refine` シェルスクリプト（Windows は `refine.bat`）を使えばビルド・テスト・実行ができます。`refine.bat` は一部の機能しかサポートしない点に注意してください。以下の例では `./refine` を前提にしています（Windows は `refine.bat` に置き換えてください）。

ビルド済みの OpenRefine を起動するには:
```shell
./refine
```
デフォルトでは [refine.ini](https://github.com/OpenRefine/OpenRefine/blob/master/refine.ini) の設定を読みます。これをコピーして `refine-dev.ini` にリネームすると、そちらの設定が優先されます。`refine-dev.ini` は Git 管理外なので自由にカスタマイズできます。

`refine` スクリプトを使わずに手動で実行したい場合は、`mvn exec:java` を実行し、エントリーポイント `com.google.refine.Refine` を起動します。

## 配布物（パッケージ版）をビルド {#building-distributions-kits}

Refine のビルドシステムは Apache Maven で各 OS 向けインストーラを自動生成します。すべての OS 向けパッケージを作成できるのは macOS のみです。

配布物を作成するには:

```shell
./refine dist <version>
```
`<version>` にはリリースバージョンを指定します。

## Eclipse での開発 {#building-testing-and-running-openrefine-from-eclipse}
OpenRefine には Maven 設定が含まれており、[Eclipse](http://www.eclipse.org/) に Maven プラグイン（m2e）が入っていれば認識されます。

まず Eclipse ワークスペース外のディレクトリでソースを取得します。

```shell
git clone https://github.com/OpenRefine/OpenRefine.git
```

Eclipse で `Import...` → `Existing Maven Projects` を選び、クローンしたリポジトリを指定します。

![Screenshot of Import a Maven project option](/img/eclipse-import-maven-project-1.png)

取り込むモジュールを選択できます。Linux/Windows/macOS 向け配布物のみを生成する `packaging` モジュールは省略して構いません。

<img alt="Screenshot of Select maven projects to import" src={useBaseUrl('img/eclipse-import-maven-project-2.png')} />

OpenRefine を Eclipse から実行・デバッグするには `server` サブプロジェクトに実行設定を追加します。`server` を右クリック → `Run as...` → `Run configurations...` で新規 `Maven Build` を作成し、名前を `OpenRefine`、`Base directory` にリポジトリルート、ゴールに `exec:java` を指定します。

![Screenshot of Add a run configuration with the exec:java goal](/img/eclipse-exec-config.png)

これで Eclipse から OpenRefine を実行できます。

### コードスタイル

`IDEs/eclipse/Refine.style.xml` に Eclipse 用のコードスタイルがあるので、`Window -> Preferences -> Java Code Style -> Formatter` でプロジェクト固有のフォーマッターを有効にし、XML をインポートしてください。

`Window -> Preferences -> Java -> Code Style -> Organize imports` で以下の順序になるよう import 整列も設定できます。
* `java`
* `javax`
* `*`
* `com.google.refine`
* `org.openrefine`

設定画面は次のようになります。
![Screenshot of the dialog to configure import order in Eclipse](/img/eclipse-import-order.png)

スタイルから逸脱した Pull Request は CI で失敗します。IDE に関わらず `./refine lint`（Windows は `refine.bat lint`）でスタイルを適用できます。

### テスト {#testing-in-eclipse}

Eclipse からサーバーテストを実行するには TestNG ランチャープラグインと TestNG M2E プラグインが必要です。未インストールの場合は [インストール手順](https://help.eclipse.org/2020-03/index.jsp?topic=/org.eclipse.platform.doc.user/tasks/tasks-129.htm)に従い、更新サイト https://testng.org/doc/download.html を追加してください。

インストール後、`main/tests/server/src` を右クリック→`Run As`→`TestNG Test` で TestNG ランチャーが開き、テストが実行されます。

### テストカバレッジ {#test-coverage-in-eclipse}

`EclEmma Java Code Coverage` プラグインを使えばカバレッジ解析が可能です。`Coverage as...` メニューから実行すると、エディタ上でカバレッジ結果を確認できます。

### デバッグ {#debug-with-eclipse}
Eclipse でのデバッグ設定例（Google データ拡張の設定値など）です。他にもメモリサイズや Wikidata ログイン情報などを設定できます。

![Screenshot of Eclipse debug configuration](/img/eclipse-debug-config.png)

## IntelliJ IDEA での開発 {#building-testing-and-running-openrefine-from-intellij-idea}

任意のディレクトリで次を実行してリポジトリを取得します。

```shell
git clone https://github.com/OpenRefine/OpenRefine.git
```

IntelliJ IDEA を開き、`File -> Open` でクローンしたディレクトリを指定します。

![Screenshot of Open option on the IntelliJ File menu](/img/intellij-setup-1.png)

pom.xml があるため Maven プロジェクトとして追加するか聞かれます。`auto-import` を許可すると依存関係が自動解決されます。表示されない場合は右側の Maven タブで `reimport all the maven projects` をクリックしてください。

![Screenshot of Maven project controls in IntelliJ](/img/intellij-maven.png)

この時点で端末からのビルド・テスト・実行は可能ですが、モジュール設定をしないとテストフォルダなどで import エラーが表示される場合があります。`extensions/wikidata` や `main` など各モジュールを開き、プロジェクトとして設定します。プロジェクトフォルダーを右クリックし、`Module Settings` を開いてソースフォルダーとテストフォルダーを指定します。

![Screenshot of open module settings menu in IntelliJ](/img/intellij-open-module-settings.png)

![Screenshot of module settings in IntelliJ](/img/intellij-module-settings.png)

メインプロジェクトについても同様に設定すれば準備完了です。

### コードスタイル

IntelliJ は Eclipse スタイルファイルをインポートできるので、`Settings -> Editor -> Code style -> Java` で `IDEs/eclipse/Refine.style.xml` を読み込みます（Eclipse の設定には import 順序が含まれない点に注意）。

その上で import 順序を次の通りに設定し、ワイルドカード import を抑制するため閾値を 99 にします。
* `java`
* `javax`
* `*`
* `com.google.refine`
* `org.openrefine`

![Screenshot of import order settings in IntelliJ](/img/intellij-import-order.png)

コマンドラインから自動整形したい場合は `./refine lint`（Windows は `refine.bat lint`）を実行してください。
