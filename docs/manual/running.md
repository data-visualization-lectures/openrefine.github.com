---
id: running
title: OpenRefine の起動と終了
sidebar_label: Running
---

## 起動と終了 {#starting-and-exiting}

OpenRefine は基本機能においてインターネット接続を必要としません。一度ダウンロードしてインストールすると、ローカルに小さなウェブサーバーとして動作し、ブラウザからアクセスします。

OpenRefine を起動するとコマンドラインウィンドウが開きますが、ブラウザで作業している間はそのウィンドウは無視してかまいません。

起動方法にかかわらず、OpenRefine の UI はお使いの OS のデフォルトブラウザで表示されます。別のブラウザを使いたい場合は OpenRefine を起動した後、[http://127.0.0.1:3333/](http://127.0.0.1:3333/) をそのブラウザで開いてください。

OpenRefine は WebKit ベースのブラウザで最適に動作します。たとえば:
*   [Google Chrome](https://www.google.com/chrome/)
*   [Chromium](https://ungoogled-software.github.io/)
*   [Opera](https://www.opera.com/)
*   [Microsoft Edge](https://www.microsoft.com/edge)
*   [Safari](https://www.apple.com/safari/)

Firefox などではレンダリングやパフォーマンスの差が報告されています。Internet Explorer はサポート対象外です。

複数のプロジェクトを同時に扱いたい場合は、複数のタブやウィンドウで OpenRefine を開くだけです。<span class="menuItems">Open Project</span> 画面でプロジェクト名を右クリックすれば別タブ／別ウィンドウで開けます。

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

#### openrefine.exe で起動 {#with-openrefineexe}

`openrefine.exe` をダブルクリックするか、コマンドラインから実行できます。

設定を変更したい場合は `openrefine.l4j.ini` を編集してください（<a href="#starting-with-modifications">後述</a>）。

#### refine.bat で起動 {#with-refinebat}

Windows では `refine.bat` を使って起動することもできます。ダブルクリックするかコマンドラインで呼び出してください。

コマンドラインから `refine.bat` を起動する場合、<a href="#starting-with-modifications">起動オプション</a>を付けて実行できます。ショートカットやダブルクリック時の動作を変えたい場合は `refine.ini` を編集してください。

#### 終了方法 {#exiting}

OpenRefine を終了するには、開いているブラウザタブ／ウィンドウをすべて閉じ、コマンドラインウィンドウに戻ります。`Control + C` を押すと OpenRefine が正常終了し、最後の変更が保存されます。

</TabItem>

<TabItem value="mac">

Applications フォルダにある OpenRefine を実行するか、ターミナルから起動できます。

ターミナルから起動する手順:
*   “移動”メニューから Utilities を開く
*   Utilities 内の Terminal を起動
*   ターミナル内で `/Applications/OpenRefine.app/Contents/MacOS/JavaAppLauncher` を実行

終了するには、OpenRefine のブラウザタブをすべて閉じ、“JavaAppLauncher” アプリを `Command + Q` で終了し、ターミナルも終了します。

:::caution 起動トラブル？
古いバージョンの OpenRefine や macOS を利用している場合は、[Mac のインストール問題に関する Wiki](https://github.com/OpenRefine/OpenRefine/wiki/Installation-Instructions#macos) を確認してください。
:::

</TabItem>

<TabItem value="linux">

ターミナルからインストールディレクトリに移動し、次のように実行します:
```
cd openrefine-3.4.1
./refine
```

起動後はブラウザがホーム画面を表示します。終了するときはブラウザを閉じ、ターミナルで `Control + C` を押してください。

:::caution JAVA_HOME エラー?
“Error: Could not find the ‘java’ executable at ‘’, are you sure your JAVA_HOME environment variable is pointing to a proper java installation?” と表示される場合は、[JDK のインストールと JAVA_HOME の設定](installing#linux) を行ってください。
:::

</TabItem>

</Tabs>

---

### トラブルシューティング {#troubleshooting}

ブラウザで OpenRefine に接続できない場合は、[Wiki のブラウザ/OS 設定ガイド](https://github.com/OpenRefine/OpenRefine/wiki/FAQ#i-am-having-trouble-connecting-to-openrefine-with-my-browser) を確認してください。

### オプション付き起動 {#starting-with-modifications}

コマンドラインから起動するときには複数の設定を変更できます。

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

Windows ではスラッシュ形式でオプションを指定します:
```
C:>refine /i 127.0.0.2 /p 3334
```

`refine /?` で利用可能なすべてのコマンドを表示できます。

| コマンド | 用途 | 例 |
|---|---|---|
| /w | webapp へのパス | `refine /w /path/to/openrefine` |
| /m | 最大ヒープサイズ（MB） | `refine /m 6000M` |
| /p | ポート | `refine /p 3334` |
| /i | インターフェース（IP または IP:Port） | `refine /i 127.0.0.2:3334` |
| /H | 受信要求に期待する HTTP ホスト | `refine /H openrefine.internal` |
| /d | ワークスペース | `refine /d /where/you/want/the/workspace` |
| /v | ログレベル（error→trace） | `refine /v info` |
| /x | 追加の Java 設定 | `refine /x refine.autosave=5` など |
| /debug | デバッグを有効化（ポート 8000） | `refine /debug` |
| /jmx | JMX 監視を有効化 | `refine /x` |

</TabItem>

<TabItem value="mac">

Mac ではターミナルからオプション付き起動を直接行えませんが、[設定ファイルを編集](#modifications-set-within-files)して起動方法を変更できます。

</TabItem>

<TabItem value="linux">

フルオプション一覧は `./refine -h` で確認できます。

| コマンド | 用途 | 例 |
|---|---|---|
| -w | webapp へのパス | `./refine -w /path/to/openrefine` |
| -d | ワークスペース | `./refine -d /where/you/want/the/workspace` |
| -m | 最大ヒープサイズ | `./refine -m 6000M` |
| -p | ポート | `./refine -p 3334` |
| -i | インターフェース | `./refine -i 127.0.0.2` |
| -H | HTTP ホスト | `./refine -H openrefine.internal` |
| -k | Google API キー | `./refine -k YOUR_API_KEY` |
| -v | ログレベル | `./refine -v info` |
| -x | Java 設定 | `./refine -x refine.autosave=5` など |
| --debug | デバッグ（ポート 8000） | `./refine --debug` |
| --jmx | JMX 監視 | `./refine --jmx` |

</TabItem>

</Tabs>

---

#### 設定ファイル内の変更 {#modifications-set-within-files}

Windows では `openrefine.exe` の動作を `openrefine.l4j.ini` で、`refine.bat` の動作を `refine.ini` で制御できます。

Mac では `Info.plist`、Linux では `refine.ini` を編集します。

多くの設定（メモリ割り当てなど）はすでにファイル内に書かれているため、値を変更するだけです。コメントアウトされている行は `#` を外して有効化してください。

たとえば `refine.ini` には次のような記述があります:
```
no_proxy="localhost,127.0.0.1"
#REFINE_PORT=3334
#REFINE_INTERFACE=127.0.0.1
#REFINE_HOST=mymachine.local
#REFINE_WEBAPP=main\webapp

# Memory and max form size allocations
#REFINE_MAX_FORM_CONTENT_SIZE=1048576
REFINE_MEMORY=1400M

# Set initial java heap space (default: 256M) for better performance with large datasets
REFINE_MIN_MEMORY=1400M
...
```

##### JVM 設定 {#jvm-preferences}

さらに細かい JVM 設定を追加することもできます。コマンドラインで利用する key/value とは異なる構文です。

主要なキー（デフォルト値）例:

| 説明 | 引数 | 例 |
|---|---|---|
| プロキシホスト | `-Dhttp.proxyHost` | proxy.example.org |
| プロキシポート | `-Dhttp.proxyPort` | 8080 |
| [自動保存](starting#autosaving) 間隔（分） | `-Drefine.autosave` | 5 |
| ワークスペース | `-Drefine.data_dir` | /user/data |
| 開発モード | `-Drefine.development` | false |
| ヘッドレス | `-Drefine.headless` | false |
| IP | `-Drefine.interface` | 127.0.0.1 |
| ドメイン | `-Drefine.host` | mymachine.local |
| ポート | `-Drefine.port` | 3333 |
| アプリフォルダ | `-Drefine.webapp` | main/webapp |
| 新バージョン通知 | `-Drefine.display.new.version.notice` | true |
| Google Data Client ID | `-Dext.gdata.clientid` | 000... |
| Google Data Client secret | `-Dext.gdata.clientsecret` | **** |
| Google Data API Key | `-Dext.gdata.apikey` | *** |

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

`refine.l4j.ini` に次のような行を追加できます:
```
-Drefine.port=3334
-Drefine.interface=127.0.0.2
-Drefine.host=mymachine.local
-Drefine.webapp=broker/core
-Dhttp.proxyHost=yourproxyhost
-Dhttp.proxyPort=8080
```

`refine.ini` では `JAVA_OPTIONS=` 行にスペース区切りで複数指定します:
```
JAVA_OPTIONS=-Drefine.data_dir=C:\Users\user\Documents\OpenRefine\ -Drefine.port=3334
```

</TabItem>

<TabItem value="mac">

`Info.plist` の `JVMOptions` セクションを編集します。例:
```
<key>JVMOptions</key>
<array>
<string>-Xms256M</string>
<string>-Xmx1024M</string>
<string>-Drefine.version=3.8.4</string>
<string>-Drefine.webapp=$APP_ROOT/Contents/Resource/webapp</string>
</array>
```

追加するコマンド例:
```
<string>-Drefine.autosave=2</string>
<string>-Dhttp.proxyHost=yourproxyhost</string>
...
```

ターミナルで以下を実行すれば追加できます:
```
export OR_INFO="/Applications/OpenRefine.app/Contents/Info.plist"
defaults write $OR_INFO JVMOptions -array-add "-Drefine.interface=192.168.0.10"
```

すでに同じ値がある場合は追加されないのでご注意ください。

</TabItem>

<TabItem value="linux">

`refine.ini` に `JAVA_OPTIONS=` を追加します。コメントアウトされた行を利用したり、次のように追記できます:
```
JAVA_OPTIONS=-Drefine.autosave=2
JAVA_OPTIONS=-Drefine.port=3334
JAVA_OPTIONS=-Drefine.interface=192.168.0.10
JAVA_OPTIONS=-Drefine.host=mymachine.local
JAVA_OPTIONS=-Drefine.data_dir=/usr/lib/OpenRefineWorkspace
JAVA_OPTIONS=-Dhttp.proxyHost=yourproxyhost
JAVA_OPTIONS=-Dhttp.proxyPort=8080
JAVA_OPTIONS=-Dext.gdata.clientid=000...
...
```

</TabItem>

</Tabs>

---

## ホーム画面 {#the-home-screen}

初回起動時に表示される画面には左側に <span class="menuItems">Create Project</span>、<span class="menuItems">Open Project</span>、<span class="menuItems">Import Project</span>、<span class="menuItems">Language Settings</span> が並びます。これが“ホーム画面”で、プロジェクトの管理や設定を行う入口です。

左下には <span class="menuItems">Preferences</span>、<span class="menuItems">Help</span>、<span class="menuItems">About</span> があります。

### 言語設定 {#language-settings}

ホーム画面左の <span class="menuItems">Language Settings</span> から使用インターフェース言語を選べます。選択内容は変更するまで保持されます。翻訳はコミュニティによるため、一部の言語は未完了で英語にフォールバックします。現在 75% 以上翻訳済みの言語:

* Cebuano
* German
* English (UK)
* English (US)
* Spanish
* Filipino
* French
* Hebrew
* Magyar
* Italian
* Japanese (日本語)
* Portuguese (Brazil)
* Tagalog
* Chinese (简体中文)

言語設定画面から離れるには、ダイヤモンドの OpenRefine ロゴをクリックしてください。

:::info 翻訳への参加
OpenRefine の翻訳は Weblate を使っており、[Weblate のプロジェクトページ](https://hosted.weblate.org/projects/openrefine/translations/) で支援状況を確認できます。翻訳に貢献したい場合は、[技術リファレンスの翻訳ページ](../technical-reference/translating-ui) をご覧ください。
:::

### Preferences {#preferences}

画面左下の <span class="menuItems">Preferences</span> ではキー/バリュー方式で設定できます。

| 設定項目 | キー | 値の形式 | デフォルト | 例 | バージョン |
|---|---|---|---|---|---|
| インターフェース言語 | userLang | ISO 639-1 2 桁コード | en | fr | — |
| 最大ファセット数 | ui.browsing.listFacet.limit | 数値 | 2000 | 5000 | — |
| Google Drive 読み込みタイムアウト | googleReadTimeOut | マイクロ秒 | 180000 | 500000 | — |
| Google Drive 認証タイムアウト | googleConnectTimeOut | マイクロ秒 | 180000 | 500000 | — |
| Wikibase 編集再試行ラグ | wikibase.upload.maxLag | 秒 | 5 | 10 | — |
| リコンシリエーションプレビュー表示 | cell-ui.previewMatchedCells | 真偽値 | true | false | v3.2 |
| 表示行数設定 | ui.browsing.pageSize | 数値配列 | [ 5, 10, 25, 50 ] | [ 100, 500, 1000 ] | v3.5 |
| ファセット/履歴パネル幅 | ui.browsing.facetsHistoryPanelWidth | ピクセル | 300 | 500 | v3.5 |
| リコンシリエーションの自動マッチ | ui.reconciliation.automatch | 真偽値 | true | false | v3.8 |
| クラスタリングの選択上限 | ui.clustering.choices.limit | 数値 | 5000 | 8000 | v3.8 |
| 次バージョン通知 | notification.status | 文字列 | enabled | disabled | v3.7 |

Preferences 画面からはダイヤモンドロゴをクリックして戻ります。

ここに目的の設定がない場合は、[コマンドラインや `.ini` ファイル](#starting-with-modifications) で変更できるオプションを確認してください。

## プロジェクト画面 {#the-project-screen}

プロジェクト画面（作業画面）は [プロジェクトを開いた後](starting) に最も頻繁に使う画面です。主要な UI パーツを以下で説明します。

![プロジェクト画面のスクリーンショット](/img/projectscreen.png)

### プロジェクトバー {#the-project-bar}

画面上部のバーには OpenRefine ロゴ、プロジェクト名、右側に操作ボタンが並びます。

ロゴをクリックすればいつでも現在のプロジェクトを閉じてホーム画面に戻れます。ロゴを右クリックして「新しいタブで開く」を選べば別タブで開けます。プロジェクトを閉じると [ファセット・ビュー設定](#facetfilter) は失いますが、[History](#history-undoredo) には操作履歴が残ります。

:::caution
ブラウザの“戻る”ボタンを押すと現在のプロジェクトが閉じられ、ファセットや表示設定を失うことがあります。
:::

プロジェクト名はいつでも編集可能で、クリックするとテキスト入力に切り替わります。名前は重複しても構いません（内部では一意 ID で管理）。

<span class="menuItems">Permalink</span> を使えば、現在のファセット/フィルター状態をそのまま URL に埋め込めます。クリックすると現在のビューが同じタブで再読み込みされ、右クリックで URL をコピーすると他の場所で同じ状態を再現できます。

<span class="menuItems">Open…</span> ボタンを押すと新しいタブが開き、<span class="menuItems">Create Project</span> 画面に移動します。ここから新規作成や既存プロジェクトの切り替え、設定変更ができます。

<span class="menuItems">Export</span> ドロップダウンではフォーマットを選んでエクスポートできます。多くのオプションは現在表示中の行（ファセット/フィルターで絞った subset）だけを出力し、すべての行ではありません。

<span class="menuItems">Help</span> はこのマニュアルの該当ページを新しいタブで開きます。

### グリッドヘッダー {#the-grid-header}

プロジェクトバーの下にあるグリッドヘッダーには、プロジェクトの行数・レコード数が表示され、[行モード/レコードモード](exploring#rows-vs-records) の状態が確認できます。

フィルターが適用された状態では “67 matching rows (180 total)” のように一致行数が表示されます。

行/レコードボタンの下には表示行数切替オプションがあり、画面右端にはページ送りのナビゲーションがあります。

### 拡張機能 {#extensions}

<span class="menuItems">Extensions</span> ドロップダウンから Wikidata などへのアップロードやスキーマのインポート・エクスポートなどを呼び出せます。詳細は [Wikibase セクション](wikibase/overview) をご覧ください。拡張機能によって他の機能がこのメニューに追加されることもあります。

### グリッド {#the-grid}

データが表示される中央の領域は「グリッド」（またはデータグリッド、プロジェクトグリッド）です。スプレッドシートのような表示で列幅は自動調整され、一部の見出しはマウスオーバーで全体を確認できます。

各列見出しには小さな矢印があり、クリックするとその列固有の操作（探索や変換）を含むドロップダウンメニューが開きます。詳細は [Exploring data](exploring) / [Transforming data](transforming) を参照してください。

すべてのプロジェクトで最初の列は <span class="menuItems">All</span> で、フラグ/スター付けなど列横断の操作を含みます。ここで行番号／レコード番号も表示されます。番号は一時的なソートやファセットの影響を受けず、元の識別子を示します。

グリッドは表示列数・幅・行数に応じてスクロールバーが現れます。[Sort and View options](exploring#sort-and-view) で表示を調整できます。

マウスをオーバーすると情報が表示され、...（以下省略）
