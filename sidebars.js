module.exports = {
  docs: {
    'ユーザーマニュアル': [
      'index',
      'manual/installing',
      'manual/running',
      'manual/starting',
	        {
      type: 'category',
      label: 'データの探索',
      items: ['manual/exploring', 'manual/facets', 'manual/sortview'],
    },
	    {
      type: 'category',
      label: 'データの変換',
      items: ['manual/transforming', 'manual/cellediting','manual/columnediting','manual/transposing'],
    },
      'manual/reconciling',
      {
        type: 'category',
        label: 'Wikibase・Wikidata・Wikimedia Commons',
        items: ['manual/wikibase/overview', 'manual/wikibase/configuration', 'manual/wikibase/reconciling', 'manual/wikibase/schema-alignment',
                'manual/wikibase/new-entities', 'manual/wikibase/quality-assurance', 'manual/wikibase/uploading'],
      },
	    {
      type: 'category',
      label: '式とスクリプト',
      items: ['manual/expressions', 'manual/grel', 'manual/grelfunctions', 'manual/jythonclojure'],
    },
      'manual/exporting',
      'manual/troubleshooting'
    ],
  'OpenRefine への貢献': [
    'technical-reference/contributing',
    'technical-reference/why-get-involved',
    'technical-reference/github',
    {
    type: 'category',
    label: '開発者としての貢献',
    items: [
        'technical-reference/code-contributions',
        'technical-reference/translating-ui',
        'technical-reference/build-test-run',
        'technical-reference/functional-tests',
        {
            type: 'category',
            label: 'アーキテクチャ',
            items: [
                'technical-reference/architecture-before-4',
                'technical-reference/architecture-4',
                'technical-reference/clustering-in-depth',
                'technical-reference/openrefine-api',
                'technical-reference/reconciliation-api',
            ]
        },
        {
            type: 'category',
            label: '拡張機能',
            items: [
            'technical-reference/writing-extensions',
            'technical-reference/migrating-older-extensions',
            'technical-reference/wikibase/architecture'
            ]
        },
        {
            type: 'category',
            label: 'OpenRefine の保守',
            items: [
            'technical-reference/maintainer-guidelines',
            'technical-reference/version-release-process',
            'technical-reference/homebrew-cask-process'
            ]
        }      
    ]
    },
    {
      type: 'category',
      label: 'デザイナーとしての貢献',
      items: [
          'technical-reference/introduction',
          'technical-reference/get-involved',
          'technical-reference/openRefine-design-system',
          'technical-reference/design-contribution-workflows',
          'technical-reference/creating-an-issue',
          'technical-reference/brainstorming-and-ideation',
          'technical-reference/providing-design-assets-and-implementation',
          'technical-reference/feedback-and-prioritization',
          'technical-reference/resources',
      ]
      },
      {
      type: 'category',
      label: 'OpenRefine ロードマップ',
      items: [
          'technical-reference/development-roadmap',
          'technical-reference/about-goal-posts',
          'technical-reference/goal-posts',
          'technical-reference/extension-ideas',
          'technical-reference/wikimedia-goal-posts',
      ]
      },
  ],
  },
};
