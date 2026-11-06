<script setup>
import site from '../site.js'

const demos = [
  ['birthday-paper.html', '纸艺手作风 · 生日祝福卡'],
  ['birthday-doodle.html', '手绘涂鸦风 · 生日祝福卡'],
  ['birthday-clay.html', '粘土拟态风 · 生日祝福卡'],
]
</script>

<template>
  <article class="post">
    <header class="post-head">
      <h1>关于</h1>
    </header>
    <div class="markdown">
      <p>你好，我是 {{ site.owner }}。这里是我的个人小站，记一些笔记和日常。</p>
      <h2>本站怎么搭的</h2>
      <p>Vue 3 + Vite 写的，代码放在 GitHub 仓库里，每次推送后 GitHub 自动构建发布，全程免费。</p>
      <h2>小彩蛋</h2>
      <p>三个不同风格的生日祝福小页面，点开可以玩：</p>
      <ul>
        <li v-for="d in demos" :key="d[0]">
          <a :href="'/demos/' + d[0]" target="_blank" rel="noopener">{{ d[1] }}</a>
        </li>
      </ul>
    </div>
  </article>
</template>
