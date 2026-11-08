<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import site from './site.js'

const route = useRoute()
const isHeimo = computed(() => route.path === '/')
</script>

<template>
  <div class="layout" :class="{ 'layout-heimo': isHeimo }">
    <div v-if="isHeimo" class="heimo-sky" aria-hidden="true">
      <span class="heimo-photo"></span>
      <span class="stars stars-1"></span>
      <span class="stars stars-2"></span>
      <span class="stars stars-3"></span>
      <span class="storm storm-a"></span>
      <span class="storm storm-b"></span>
      <span class="flash flash-a"></span>
      <span class="flash flash-b"></span>
      <svg class="bolt bolt-a" viewBox="0 0 100 260"><path d="M60 0 L14 120 L44 120 L26 260 L88 100 L52 100 Z" /></svg>
      <svg class="bolt bolt-b" viewBox="0 0 100 260"><path d="M60 0 L14 120 L44 120 L26 260 L88 100 L52 100 Z" /></svg>
    </div>
    <header v-if="!$route.meta.standalone" class="site-header">
      <div class="wrap header-inner">
        <router-link to="/" class="logo"><img class="logo-mark" src="/smerry-icon.png" alt="" aria-hidden="true">{{ site.name }}</router-link>
        <nav>
          <router-link to="/" exact>主页</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
      </div>
    </header>
    <main :class="$route.meta.wide ? 'main-wide' : 'wrap'">
      <router-view />
    </main>
    <footer v-if="!$route.meta.standalone" class="site-footer">
      <div class="wrap">&copy; {{ new Date().getFullYear() }} {{ site.owner }} &middot; 用 Vue 搭建 &middot; 托管在 GitHub Pages</div>
    </footer>
  </div>
</template>
