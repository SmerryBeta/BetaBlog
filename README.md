# Smerry 的小站

用 Vue 3 + Vite 搭的个人博客，托管在 GitHub Pages（SmerryBeta.github.io）。

## 本地运行

```
npm install
npm run dev
```

浏览器打开终端里提示的地址（一般是 http://localhost:5173）。

## 怎么发新文章

1. 在 `src/posts` 里新建一个 `.md` 文件，文件名用英文（就是文章网址）
2. 开头照抄下面的格式块，改好内容：

```
---
title: 文章标题
date: 2026-12-01
tags: 标签1, 标签2
---
正文从这里开始……
```

3. 文章会自动出现在主页列表，不需要改别的代码

## 怎么发布

把改动提交并推送到 `main` 分支，GitHub 会自动构建并发布（仓库 Actions 页能看到进度），一两分钟后 https://smerrybeta.github.io 就更新了。

仓库 Settings → Pages 里的 Source 需要选 **GitHub Actions**（只用设置一次）。

## 小彩蛋

`public/demos/` 里有三个不同风格的生日祝福小页面，发布后可通过「关于」页进入。
