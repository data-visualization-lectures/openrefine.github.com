---
id: installing
title: OpenRefine のインストール
sidebar_label: Installing
---

## System requirements {#system-requirements}

OpenRefine は基本機能においてインターネット接続を必要としません。一度ダウンロードしてローカルにインストールすると、小さなウェブサーバーとして動作し、ブラウザからそのローカルサーバーへアクセスする形になります。インターネット接続は、Web からデータを読み込む、リコンシリエーションサービスを使う、あるいは Web にエクスポートする場合だけに必要です。

OpenRefine を動作させるには次の3つが必要です。

#### 対応 OS {#compatible-operating-system}

OpenRefine は **Windows**、**Mac**、**Linux** 向けに設計されています。[各 OS 向けのパッケージを提供しています](/download)。

#### Java {#java}

OpenRefine を動かすには Java がインストールされている必要があります。Mac 版には Java を同梱しており、OpenRefine 3.4 以降では Java 同梱の Windows パッケージも用意されています。

Java をご自身でインストールしたい場合は、[Adoptium.net](https://adoptium.net/releases.html) から事前ビルド済みの Java Runtime Environment (JRE) を取得できます。OpenRefine 3.7 では Java 11～17 をサポートしています。

Java を持たずに Windows で OpenRefine を起動すると、このページが自動的にブラウザに表示されます。

#### 対応ブラウザ {#compatible-browser}

OpenRefine は WebKit ベースのブラウザで最適に動作します。たとえば:

*   [Google Chrome](https://www.google.com/chrome/)
*   [Chromium](https://ungoogled-software.github.io/)
*   [Opera](https://www.opera.com/)
*   [Microsoft Edge](https://www.microsoft.com/edge)
*   [Safari](https://www.apple.com/safari/)

Firefox などでは軽微なレンダリングやパフォーマンスの差が報告されています。Internet Explorer はサポート対象外です。問題がある場合は [Running セクションのトラブルシューティング](running.md#troubleshooting) をご覧ください。

### リリースバージョン {#release-versions}

OpenRefine には常に [最新版の安定リリース](https://github.com/OpenRefine/OpenRefine/releases/latest) があり、さらに beta・release candidate・[スナップショット](https://github.com/OpenRefine/OpenRefine?tab=readme-ov-file#snapshot-releases) などの先行版も用意されています。はじめてインストールする場合は [最新版の安定リリース](https://github.com/OpenRefine/OpenRefine/releases/latest) をおすすめします。

旧バージョン専用の拡張機能など最新機能が不要な場合は、[古い安定版リリース](https://github.com/OpenRefine/OpenRefine/releases) を選んでも構いません。後続のリリースでどの脆弱性が修正されているかをチェックし、リスク許容度を踏まえて選んでください。"beta" や "release candidate" ではなく "final release" 表記を優先してください。

#### 不安定なバージョン {#unstable-versions}

新しい機能を今すぐ使いたい、かつ多少の未検証コードに耐えられる場合は、[最新のリリース一覧](https://github.com/OpenRefine/OpenRefine/releases) を参照して変更点を確認できます。

“Beta” や “release candidate” には未報告のバグが含まれがちで、積極的にバグ報告を行ってくださる方（[issue を作成する](https://github.com/OpenRefine/OpenRefine/issues) など）が向いています。

さらに進んだ開発版の更新を追いたい場合は、[snapshot リリース](https://github.com/OpenRefine/OpenRefine-snapshot-releases/releases) をご覧ください。各コミットごとに作成されます。

## インストールまたはアップグレード {#installing-or-upgrading}
### データをバックアップする {#back-up-your-data}

古いバージョンからアップグレードする場合、既存のプロジェクトを新バージョン導入前にバックアップしてください。

まず [ワークスペースディレクトリを見つけ](#set-where-data-is-stored)、そこにあるすべてのファイルをコピーして別のフォルダに保存します。

さらに安全性を高めたい場合は、[既存プロジェクトをエクスポート](exporting#export-a-project) しておくとよいでしょう。

:::caution
現在インストール済みの [拡張機能](#installing-extensions) を控えておいてください。アップグレード先の OpenRefine で互換性がない場合があります。拡張機能はワークスペースとインストール先に両方存在し得るため、両方の場所を確認してください。
:::

### OpenRefine のインストールまたはアップグレード {#install-or-upgrade-openrefine}

既存のインストールをアップグレードする場合、旧ファイルを削除して新しいファイルを同じ場所に展開してください。古いファイルを上書きすると不要なファイルが残ることがあります。

:::caution
拡張機能を `webapp\extensions` フォルダに入れている場合、そのフォルダは削除しないでください。拡張機能はプログラムディレクトリではなくワークスペースディレクトリに入れることもできます。新しいバージョンでの互換性は保証されていません。
:::

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

Windows では ZIP や MSI などのパッケージの展開を行うため、次のようなコマンドを使って手動インストールできます。

```
user@machine:~/Downloads$ tar xzf openrefine-3.6.2-linux.tar.gz
```

展開されたディレクトリに移動し:
```
user@machine:~/Downloads$ cd openrefine-3.6.2
```

最後に実行して起動します:
```
user@machine:~/Downloads/openrefine-3.6.2$ ./refine
```

</TabItem>

<TabItem value="mac">

...  ※ ここには Mac 用の手順が続く（内容は原文に準拠）。

</TabItem>

<TabItem value="linux">

...  ※ ここには Linux 用の手順が続く（原文に準拠）。

</TabItem>

</Tabs>

---

### データの保存場所を設定する {#set-where-data-is-stored}

OpenRefine はデータを 2 箇所に保存します。

*   プログラムディレクトリ（インストール先）にあるアプリケーションファイル
*   “ワークスペースディレクトリ” と呼ぶプロジェクトファイル

ワークスペースには、
*   OpenRefine を起動してサイドバーの <span class="menuItems">Open Project</span> をクリック
*   画面下部の <span class="menuItems">Browse workspace directory</span> をクリック
*   ファイルエクスプローラー（Finder）が開きます。

デフォルトの場所は以下の通りです。

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

Windows ではバージョンによって以下のディレクトリになります。
*   `%appdata%\OpenRefine`
*   `%localappdata%\OpenRefine`
*   `C:\Documents and Settings\(user id)\Local Settings\Application Data\OpenRefine`
*   `C:\Users\(user id)\AppData\Roaming\OpenRefine`
*   `C:\Users\(user id)\AppData\Local\OpenRefine`
*   `C:\Users\(user id)\OpenRefine`

古い Google Refine では `OpenRefine` を `Google\Refine` に置き換えてください。

`openrefine.l4j.ini` に次の行を追加することで任意のドライブ/フォルダを指定できます。

```
-Drefine.data_dir=D:\MyDesiredFolder
```

パスに空白がある場合は引用符で囲みます。

```
-Drefine.data_dir="D:\My Desired Folder"
```

存在しないフォルダ名でも OpenRefine が自動的に作成します。

</TabItem>

<TabItem value="mac">

```
~/Library/Application\ Support/OpenRefine/
```

古いバージョン（Google Refine）の場合は:

```
~/Library/Application\ Support/Google/Refine/
```

ログは `/var/log/daemon.log` に記録されます。`com.google.refine.Refine` を grep してください。

</TabItem>

<TabItem value="linux">

```
~/.local/share/openrefine/
```

ターミナルから起動する場合は `-d` パラメータでワークスペースを指定できます。

```
./refine -p 3333 -i 0.0.0.0 -m 6000M -d /My/Desired/Folder
```

</TabItem>

</Tabs>

---

### ログ {#logs}

OpenRefine は専用のエラーログを出力しませんが、Linux・Windows では OpenRefine コンソールが常に開いており、エラーが発生した場合はそこから情報をコピーできます。

Mac では [ターミナル経由で OpenRefine を起動](running#starting-and-exiting)してエラーを収集できます。

---

## メモリ割り当てを増やす {#increasing-memory-allocation}

OpenRefine は十分なメモリを利用することで効率よく動作します。大規模データ（目安: 100 万セル超、ファイルサイズ 50MB 超、レコードモードで 1 レコードあたり 50 行超）を扱う場合はあらかじめメモリを増やすことを検討してください。

初期設定では 1GB（1024MB）のメモリが割り当てられています。動作が遅い、`java.lang.OutOfMemoryError` などのエラーが出る場合はメモリ割り当てを増やしてください。

OS の使用状況を踏まえて、空きメモリの 50% 以内に収めるのが理想です。

以下の設定では MB（厳密には [mebibyte](https://en.wikipedia.org/wiki/Mebibyte)）単位の 4 桁の数字を使います。デフォルトは 1024MB ですが、新しい値は 1024 の倍数である必要はありません。

:::info 大規模データ対応
十分なメモリが必要な場合はインポート時に <span class="fieldLabels">Parse cell text into numbers, dates, ...</span> をオフにすることも考えてください。便利ですが「文字列」以外の型が不要な列にだけ型変換を行う方が効率的です。
:::

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

#### openrefine.exe を使う {#using-openrefineexe}

`openrefine.exe` を使う場合、プログラムディレクトリ内の `openrefine.l4j.ini` を編集してください。

```
# max memory heap size
-Xmx1024M
```

`-Xmx1024M` はメモリ（MB）を指定しています。"1024" を "2048" などに変えると 2048MB（2GB）になります。

:::caution openrefine.exe が動かない？
メモリを増やしたあと `openrefine.exe` が起動できなくなる場合、64bit Java が必要です（[Java JDK](#install-or-upgrade-java) とは別）。[Java ダウンロードページ](https://www.java.com/en/download/help/index_installing.xml) から “Windows Offline (64-bit)” をインストールし、[Java 設定](https://www.java.com/en/download/help/update_runtime_settings.xml) で 64bit Java を使うよう設定してください。
:::

#### refine.bat を使う {#using-refinebat}

Windows では `refine.bat` でも OpenRefine を起動できます。この場合、コマンドラインオプションまたは `refine.ini` でメモリを指定できます。

コマンドラインで最大メモリを指定するにはプログラムディレクトリで:

```
refine.bat /m 2048m
```

`refine.ini` を編集する場合:

```
REFINE_MEMORY=1024M
```

`refine.bat` 使用時のみ読み込まれるファイルなので `openrefine.exe` では変更されません。

</TabItem>
<TabItem value="mac">

:::caution 
変更前に前述のインストール手順が完了していることを確認してください。次に説明する `Info.plist` 編集時に読み取り専用ボリュームのエラーになることがあります。
:::

`.dmg` パッケージをダブルクリックして起動した場合:

*   OpenRefine を終了
*   OpenRefine アイコンを control+クリックしてコンテキストメニューを表示
*   “package content を表示” を選択（Finder が開く）
*   “Contents” フォルダを開く
*   `Info.plist` を任意のテキストエディタで開く（Mac 標準の TextEdit など）
*   `-Xmx1024M` を `-Xmx2048M` や `-Xmx8G` に変更
*   ファイルを保存
*   OpenRefine を再起動

</TabItem>
<TabItem value="linux">

`.tar.gz` パッケージをコマンドラインから起動する場合は `-m` オプションを追加します:

```
./refine -m 2048m
```

</TabItem>
</Tabs>

#### デフォルト値を設定する {#setting-a-default}

毎回コマンドラインで指定したくない場合、`refine.ini` の設定を変更します。

```
REFINE_MEMORY=1024M
```

行頭に `#` が付いていない（コメント化されていない）ことを確認し、1024 を大きい値に変えて保存すれば次回起動時に適用されます。

</TabItem>

</Tabs>

---

## 拡張機能のインストール {#installing-extensions}

コミュニティが提供する拡張機能を使うと機能追加や便利なショートカットが手に入ります。[把握している拡張機能は拡張機能ページ](/extensions) で紹介しています。

:::info 拡張機能を作る
拡張機能の作成・変更をしたい場合は [開発者ドキュメント](https://github.com/OpenRefine/OpenRefine/wiki/Documentation-For-Developers) をご覧ください。問題があれば [拡張機能ページ](/extensions) からそのプロジェクトに移動し issue を報告してください。
:::

### インストール先は2通り {#two-ways-to-install-extensions}

拡張機能は次の 2 箇所のいずれかにインストールできます:

*   プログラムフォルダ内（そのバージョンでのみ有効。アップグレード後は手動で再インストールが必要）
*   ワークスペース内（どのバージョンの OpenRefine でも利用可能）

バージョンをアップグレードするたび再インストールしたい場合など、好みに応じて選択できます。

### 適切なインストール先を見極める {#find-the-right-place-to-install}

プログラムフォルダに入れるなら、`webapp\extensions` ディレクトリ（存在しない場合は作成）に展開します。

ワークスペースに入れるなら:
*   [ワークスペースディレクトリを特定](#set-where-data-is-stored)
*   “extensions” フォルダがなければ作成

各 OS でのワークスペースの見つけ方も [こちら](#set-where-data-is-stored) にあります。

### インストール手順 {#install-the-extension}

拡張機能によって独自の手順があるため、説明をよく読んでから始めてください。

バージョンごとの互換性を確認し、必要なら [ダウンロードページ](/download) から対応するリリースを入手して issue を投稿してください。

一般的な手順:
*   拡張機能をダウンロード（通常 GitHub から ZIP 形式）
*   `webapp\extensions` へ展開し、拡張機能名のフォルダにまとめる
*   OpenRefine を起動または再起動

拡張機能ごとに UI 上の表示方法が異なるため、説明に従って配置場所（メニューなど）を確認してください。
