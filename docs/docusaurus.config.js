// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Study Python',
  tagline: '从入门到精通的 Python 系统学习之旅',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // 生产环境 URL（Vercel 部署后可在此修改为自定义域名）
  url: 'https://study-python.vercel.app',
  // Vercel 部署在根路径下
  baseUrl: '/',

  // GitHub 仓库信息（用于 editUrl 等）
  organizationName: 'Destiny-GPU',
  projectName: 'study-python',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // 即使不使用国际化，也可以用此字段设置 html lang
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // 编辑链接指向本仓库
          editUrl: 'https://github.com/Destiny-GPU/study-python/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/Destiny-GPU/study-python/tree/main/docs/',
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
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
        copyright: `Copyright © ${new Date().getFullYear()} Study Python. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'toml', 'ini', 'bash'],
      },
    }),
};

export default config;
