<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import posts from '../posts/index.js'

const route = useRoute()
const post = computed(() => posts.find((p) => p.slug === route.params.slug))
const html = computed(() => (post.value ? marked.parse(post.value.body) : ''))
</script>

<template>
  <article v-if="post" class="post">
    <header class="post-head">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <span class="post-date">{{ post.date }}</span>
        <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
      </div>
    </header>
    <div class="markdown" v-html="html"></div>
    <router-link to="/" class="back">&larr; 回主页</router-link>
  </article>
  <div v-else class="empty">
    <p>没有找到这篇文章，它可能被改名或删除了。</p>
    <router-link to="/">&larr; 回主页</router-link>
  </div>
</template>
