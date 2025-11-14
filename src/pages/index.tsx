import React from 'react';
import clsx from 'clsx';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';

import Layout from '@theme/Layout';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import styles from './styles.module.css';

function HeaderSection() {
    return (
    <div className="container text--center margin-bottom--xl">
      <div className="row" style={{textAlign: 'left', flexWrap: 'wrap-reverse' }}>
        <div className="col" style={{marginTop: '2em' }}>
          <h1>OpenRefine</h1>
         <p>OpenRefine は散らかったデータを整え、形式を変換し、外部サービスと連携させるための強力な無償オープンソースツールです。</p>
         <p>アクセシブルなツールと多様で支え合うコミュニティを通じて、誰もがデータに向き合う力を得られるようにすることが私たちの目標です。</p>
          <Link className="button button--primary" to="download" style={{fontSize: '1.5em'}}>ダウンロード</Link>
        </div>
        <div className="col" style={{marginTop: '1em', display: 'flex'}}>
          <img src="img/openrefine_logo.svg" alt="OpenRefine logo" style={{maxWidth: "min(250px, 20vw)", display: 'block', margin: 'auto'}}/>
        </div>
      </div>
            <div>
      <Link className="button button--primary" to="/2025-fundraising" style={{fontSize: '1.5em'}}>2025 年の資金調達キャンペーンを支援する</Link>
  </div>
      <div className="row">
        <div style={{textAlign: 'center', width: '100%', marginTop: '2em'}}>
        <h2>主な機能</h2>
        </div>
        <div className="featureCardList">
        <FeatureCard title="ファセット" link="docs/manual/facets" logo="feature_logo_facetting.svg">ファセットで大規模データを絞り込み、フィルター結果に対して操作を適用できます。</FeatureCard>
        <FeatureCard title="クラスタリング" link="docs/manual/cellediting#cluster-and-edit" logo="feature_logo_clustering.svg">強力なヒューリスティックで似た値をまとめ、不整合を解消します。</FeatureCard>
        <FeatureCard title="リコンシリエーション" link="docs/manual/reconciling" logo="feature_logo_reconciliation.svg">外部データベースと照合してデータを結び付けます。</FeatureCard>
        <FeatureCard title="無制限の取り消し／やり直し" link="docs/manual/running#history-undoredo" logo="feature_logo_undo.svg">任意の履歴に戻り、操作ログを別のプロジェクトへ再適用できます。</FeatureCard>
        <FeatureCard title="プライバシー" link="privacy" logo="feature_logo_privacy.svg">データの処理はあなたのマシン上のみで行われ、クラウドに送信されません。</FeatureCard>
        <FeatureCard title="Wikibase 連携" link="docs/manual/wikibase/overview" logo="feature_logo_wikibase.svg">誰でも編集できるフリー知識ベース Wikidata やその他の Wikibase に貢献できます。</FeatureCard>
        </div>
        <div style={{textAlign: 'center', width: '100%', marginTop: '1em'}}>
           <p>詳細は <a href="docs">ドキュメント</a> でご覧ください。</p>
        </div>
      </div>
    </div>);
}


function FeatureCard(props) {
    let {title, children, link, logo} = props;
    return <Link to={link} className="featureCard card">
            <img className="featureLogo" src={"img/" + logo} alt={title + " feature logo"} />
            <h4 className="featureCardTitle" title={title}>{title}</h4>
            <p>{children}</p>
        </Link>;
}


export default function Home(): JSX.Element {
  const {
    siteConfig: {customFields, tagline},
  } = useDocusaurusContext();
  const {description} = customFields as {description: string};
  return (
    <Layout description={description}>
      <main>
        <HeaderSection />
      </main>
    </Layout>
  );
}
