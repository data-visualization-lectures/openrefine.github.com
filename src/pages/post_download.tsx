import React from 'react';
import clsx from 'clsx';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';

import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
// import {styles as docCardStyles} from '@theme/DocCard/styles.module.css';
import Card from '../card.tsx';

import styles from '../custom.css';
import {releases, platformDetails, platformOrder, getDownloadLink} from '../releases.js';

function PostDownload() {
    let latestRelease = releases[0];
    return (
   <div className="container margin-bottom--xl">
      <div className="row" style={{maxWidth: '800px', margin: 'auto', textAlign: 'left'}}>
        <div className="col">
          <BrowserOnly fallback={<DownloadSection version={latestRelease.version} platform="win-with-java" />}>{
             () => {
                const urlParams = new URLSearchParams(window.location.search);
                return <DownloadSection version={urlParams.get('version')} platform={urlParams.get('platform')} autoDownload={true} />
             }}
          </BrowserOnly>
          <h2>次のステップ</h2>
          <div className="cardList">
            <Card href="docs" title="はじめに" description="ドキュメントを読んで使い方を確認しましょう。" />
            <Card href="external_resources" title="チュートリアル" description="OpenRefine に関するチュートリアルやオンラインコースなどの教材をチェック。" />
            <Card href="extensions" title="拡張機能" description="コミュニティ製の拡張で OpenRefine をさらに便利に。" />
            <Card href="community" title="コミュニティに参加" description="サポートやリソースを得て、プロジェクトに貢献しましょう。OpenRefine はあなたのような人々によって作られています。" />
          </div>
        </div>
      </div>
    </div>);
}

function DownloadSection(props) {
   let {version, platform, autoDownload} = props;
   let details = platformDetails[platform];
   let instructions = getRunningInstructions(platform);
   let explanations = <div></div>;
   if (details !== undefined && instructions !== undefined) {
        explanations = <div>
                <h2>{platformDetails[platform].name} での OpenRefine 実行方法</h2>
                {instructions}
           </div>;
   }
   return <div>
        <DownloadLink version={version} platform={platform} autoDownload={autoDownload} />
        {explanations}
        <p>以前のバージョンからアップグレードする場合は、まず <Link to="docs/manual/installing#back-up-your-data">ワークスペースディレクトリをバックアップ</Link> してください。</p>
        <p>詳しい手順は <a href="docs/manual/installing#installing-or-upgrading">OpenRefine のインストールガイド</a> をご覧ください。</p>
    </div>;
}

function DownloadLink(props) {
    let {version, platform, autoDownload} = props;
    let matchingReleases = releases.filter(r => r.version === version);
    if (matchingReleases.length !== 1) {
       return <p>指定されたリリースが見つかりませんでした。<Link to="download">ダウンロードページ</Link> からお選びください。</p>
    }
    let release = matchingReleases[0];
    let link = getDownloadLink(release, platform);
    if (autoDownload) {
       const domLink = document.createElement('a');
       domLink.href = link;
       domLink.click();
       return <div>
          <p>自動的にダウンロードが始まらない場合は <a href={link}>こちらのリンク</a> をクリックしてください。</p>
              </div>;
    } else {
       return <div><p><a href={link}>こちらのリンク</a> から OpenRefine をダウンロードできます。</p></div>
    }
    
}

function LatestVersionDownloadSection(props) {
    let {platform, release} = props;
    let otherArtifacts = release.artifacts.filter(variant => variant.platform !== platform);
    return (<div style={{width: '100%'}}>
                <div className="col" style={{textAlign: 'center', margin: 'auto'}}>
                    <BigDownloadButton release={release} platform={platform} />
                </div>
    </div>);
}

export function getRunningInstructions(platform) {
    if (platform === 'win') {
       return <p>まず <a href="https://adoptium.net/download/">Java</a> がインストールされているか確認してください。その後、アーカイブを展開し、<code>openrefine.exe</code>（または動作しない場合は <code>refine.bat</code>）をダブルクリックします。</p>
    } else if (platform === 'win-with-java') {
       return <p>アーカイブを展開し、<code>openrefine.exe</code>（または動作しない場合は <code>refine.bat</code>）をダブルクリックしてください。</p>
    } else if (platform === 'mac') {
      return (
        <p>ダウンロードした DMG を開き、アイコンを <code>Applications</code> フォルダにドラッグしてからダブルクリックします。 
          <Admonition className='margin-top--md' type='info' title='Important'> 
           DMG を開く際に表示されるセキュリティ警告の回避方法は{' '}
          <a href="docs/manual/installing#install-or-upgrade-openrefine">
            ドキュメント
          </a> を参照してください。
          </Admonition>
        </p>
      )
    } else if (platform === 'linux') {
       return <p>アーカイブをダウンロードして展開し、ターミナルで <code>./refine</code> を実行してください。Java のインストールが必要です。</p>
    }
}


export default function Home(): JSX.Element {
  const {
    siteConfig: {customFields, tagline},
  } = useDocusaurusContext();
  const {description} = customFields as {description: string};
  return (
    <Layout title="ダウンロードありがとうございます" description={description}>
      <main>
        <div className="container text--center margin-top--xl">
          <div className="row" style={{maxWidth: '800px', margin: 'auto', textAlign: 'left'}}>
            <div className="col">
              <h1>OpenRefine をダウンロードいただきありがとうございます</h1>
            </div>
          </div>
        </div>
        <PostDownload />
      </main>
    </Layout>
  );
}
