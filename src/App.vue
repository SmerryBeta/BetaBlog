<script setup>
import site from './site.js'
</script>

<template>
  <div class="layout">
    <header class="site-header">
      <div class="wrap header-inner">
        <router-link to="/" class="logo"><span class="logo-mark" aria-hidden="true"></span>{{ site.name }}</router-link>
        <nav>
          <router-link to="/">主页</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
      </div>
    </header>
    <main class="wrap">
      <router-view />
    </main>
    <footer class="site-footer">
      <div class="wrap">&copy; {{ new Date().getFullYear() }} {{ site.owner }} &middot; 用 Vue 搭建 &middot; 托管在 GitHub Pages</div>
    </footer>
  </div>
</template>
