<script setup>
import posts from '../posts/index.js'
import site from '../site.js'

function excerpt(body) {
  return body.replace(/[#>*`~\-\[\]()!]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90)
}
</script>

<template>
  <section class="hero">
    <span class="float-piece fp1" aria-hidden="true"></span>
    <span class="float-piece fp2" aria-hidden="true"></span>
    <span class="badge">手作小站 · 持续装订中</span>
    <h1>{{ site.name }}</h1>
    <p>{{ site.intro }}</p>
  </section>
  <section class="post-list">
    <router-link
      v-for="p in posts"
      :key="p.slug"
      :to="'/post/' + p.slug"
      class="post-card"
    >
      <div class="post-meta">
        <span class="post-date">{{ p.date }}</span>
        <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
      </div>
      <h2>{{ p.title }}</h2>
      <p class="post-excerpt">{{ excerpt(p.body) }}……</p>
    </router-link>
    <p v-if="!posts.length" class="empty">还没有文章，去 src/posts 里放第一篇吧</p>
  </section>
</template>
