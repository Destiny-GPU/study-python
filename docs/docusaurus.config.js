// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

const editUrl = 'https://github.com/Destiny-GPU/study-python/tree/main/docs/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Destiny',
  tagline: '代码示例 + 实战项目 + 学习笔记',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: false,
      siteStorageNamespacing: true,
      fasterByDefault: true,
      mdx1CompatDisabledByDefault: false,
    },
    faster: true,
  },

  // 生产环境 URL（Vercel 部署后可在此修改为自定义域名）
  url: 'https://study-python-zj.pages.dev/',
  // Vercel 部署在根路径下
  baseUrl: '/',

  // GitHub 仓库信息（用于 editUrl 等）
  organizationName: 'Destiny-GPU',
  projectName: 'study-python',
  trailingSlash: false,

  titleDelimiter: ' · ',

  plugins: [
    [require.resolve('./src/plugins/docs-index-plugin.js'), {}],
  ],

  onBrokenLinks: 'warn',

  // 即使不使用国际化，也可以用此字段设置 html lang
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    format: 'mdx',
    mermaid: true,
    mdx1Compat: {
      admonitions: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl,
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          // 博客路由改为 /notes（学习笔记）
          routeBasePath: 'notes',
          blogTitle: 'Python 学习笔记',
          blogDescription: '记录 Python 学习过程中的心得与进阶技巧',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    ['@easyops-cn/docusaurus-search-local', {
      hashed: true,
      language: ['zh', 'en'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
    }],
  ],

  clientModules: [
    require.resolve('./src/clientModules/progressBar.js'),
    require.resolve('./src/clientModules/constellation.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      metadata: [
        {name: 'author', content: 'Destiny - 自动控制 + 强化学习博士'},
        {name: 'keywords', content: 'Python, 强化学习, 飞行控制, 深度学习, 自动控制, 智能决策'},
        {property: 'og:type', content: 'website'},
        {property: 'og:title', content: 'Python 系统学习指南 · Destiny'},
        {property: 'og:description', content: '从入门到精通的 Python 系统学习之旅~'},
        {property: 'og:image', content: '/img/docusaurus-social-card.jpg'},
        {property: 'og:image:width', content: '1200'},
        {property: 'og:image:height', content: '630'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:site', content: '@Destiny_GPU'},
        {name: 'twitter:title', content: 'Python 系统学习指南 · Destiny'},
        {name: 'twitter:description', content: '从入门到精通的 Python 系统学习之旅~'},
        {name: 'twitter:image', content: '/img/docusaurus-social-card.jpg'},
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: {
          light: 'base',
          dark: 'dark',
        },
        options: {
          fontSize: 14,
          themeVariables: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          },
          flowchart: {
            nodePadding: 8,
            nodeSpacing: 30,
            rankSpacing: 40,
            diagramPadding: 15,
            subGraphTitleMargin: { top: 4, bottom: 12 },
          },
        },
      },
      navbar: {
        title: 'Study Python',
        logo: {
          alt: 'Study Python Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '教程',
          },
          {to: '/notes', label: '学习笔记', position: 'left'},
          {to: '/docs/about', label: '关于', position: 'left'},
          {to: '/ai-chat', label: 'AI 助手', position: 'right'},
          {
            href: 'https://github.com/Destiny-GPU/study-python',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '教程',
            items: [
              {
                label: '入门指南',
                to: '/docs/intro',
              },
              {
                label: '基础语法',
                to: '/docs/basics/variables',
              },
              {
                label: '面向对象',
                to: '/docs/oop/classes',
              },
            ],
          },
          {
            title: '学习资源',
            items: [
              {
                label: 'Python 官方文档',
                href: 'https://docs.python.org/zh-cn/3/',
              },
              {
                label: 'Python 官网',
                href: 'https://www.python.org/',
              },
              {
                label: 'PyPI 包索引',
                href: 'https://pypi.org/',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '学习笔记',
                to: '/notes',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Destiny-GPU/study-python',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Destiny. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.nightOwl,
        additionalLanguages: ['python', 'toml', 'ini', 'bash'],
      },
    }),
};

export default config;
