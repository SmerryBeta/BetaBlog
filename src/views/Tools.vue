<script setup>
const tools = [
  {
    to: '/tools/encrypt',
    icon: '🔒',
    name: 'AES-256-GCM 加密器',
    desc: '完全在浏览器本地加解密，支持十进制 / 十六进制 Key，密文格式 A1.salt.iv.ciphertext。',
  },
  {
    to: '/tools/note',
    icon: '💌',
    name: '加密小纸条',
    desc: '把悄悄话锁进纸条：链接随手发，Key 用别的渠道说，拆开才看得见。',
  },
]
</script>

<template>
  <div class="tools-page">
    <header class="hero">
      <span class="badge">工具箱 · 纸袋里的小玩意儿</span>
      <h1>工具箱</h1>
      <p>想用哪个，抽哪个。</p>
    </header>

    <div class="tool-grid">
      <router-link
        v-for="(t, i) in tools"
        :key="t.to"
        :to="t.to"
        class="tool-card"
        :class="{ 'tool-card-r': i % 2 }"
      >
        <span class="tool-icon" aria-hidden="true">{{ t.icon }}</span>
        <h2>{{ t.name }}</h2>
        <p class="tool-desc">{{ t.desc }}</p>
        <span class="tool-go">去用 →</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }

.tool-card {
  display: flex;
  flex-direction: column;
  background: var(--paper);
  border: 2px solid var(--line);
  border-radius: 14px;
  padding: 24px 26px;
  color: inherit;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.08);
  transform: rotate(-0.6deg);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.tool-card-r { transform: rotate(0.6deg); }
.tool-card:hover {
  transform: rotate(0deg) translateY(-3px);
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.12);
  text-decoration: none;
}
.tool-card:focus-visible { outline: 3px solid rgba(107, 127, 181, 0.45); outline-offset: 2px; }

.tool-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: var(--yellow);
  border-radius: 12px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.08);
  font-size: 26px;
  transform: rotate(-4deg);
  margin-bottom: 14px;
}
.tool-card-r .tool-icon {
  background: rgba(92, 184, 165, 0.35);
  transform: rotate(3deg);
}

.tool-card h2 { font-size: 20px; margin: 0 0 6px; color: var(--ink); }
.tool-desc { color: var(--ink-soft); font-size: 14px; flex: 1; }
.tool-go { margin-top: 16px; color: var(--red-deep); font-weight: 700; font-size: 14px; }

@media (max-width: 560px) {
  .tool-grid { grid-template-columns: 1fr; }
}
</style>
