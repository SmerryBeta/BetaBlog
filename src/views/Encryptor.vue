<script setup>
import { onMounted, ref } from 'vue'
import { enc, dec } from '../utils/aes.js'

const key = ref('')
const input = ref('')
const output = ref('')
const statusText = ref('')
const statusType = ref('')
const showKey = ref(false)
const outputEl = ref(null)

function setStatus(text, type = '') {
  statusText.value = text
  statusType.value = type
}

async function onEncrypt() {
  try {
    setStatus('正在加密…')
    output.value = await enc(input.value, key.value)
    setStatus('加密完成。', 'ok')
  } catch (e) {
    setStatus(e?.message || String(e), 'error')
  }
}

async function onDecrypt() {
  try {
    setStatus('正在解密…')
    output.value = await dec(input.value, key.value)
    setStatus('解密完成。', 'ok')
  } catch (e) {
    setStatus(e?.message || String(e), 'error')
  }
}

async function copyOutput() {
  try {
    await navigator.clipboard.writeText(output.value)
  } catch {
    outputEl.value?.focus()
    outputEl.value?.select()
    document.execCommand('copy')
  }
  setStatus('已复制到剪贴板。', 'ok')
}

function swapOutput() {
  input.value = output.value
  output.value = ''
  setStatus('已将输出放回输入框。')
}

function clearAll() {
  key.value = ''
  input.value = ''
  output.value = ''
  setStatus('')
}

onMounted(() => {
  if (!window.crypto?.subtle) {
    setStatus('当前浏览器环境没有可用的 Web Crypto API。请换现代浏览器，或通过 localhost/HTTPS 打开本页面。', 'error')
  }
})
</script>

<template>
  <div class="encrypt-page">
    <article class="post">
      <header class="post-head">
        <span class="badge">小工具 · 纸上保险箱</span>
        <h1>AES-256-GCM 加密器 / 解密器</h1>
        <p class="t-sub">
          完全在浏览器本地运行，不上传消息和 Key。支持十进制 Key 和 16 进制 Key。
          密文格式：<code>A1.salt.iv.ciphertext</code>
        </p>
      </header>

      <label class="t-label" for="enc-key">Key</label>
      <div class="enc-key-row">
        <input
          id="enc-key"
          v-model="key"
          class="t-input"
          :type="showKey ? 'text' : 'password'"
          autocomplete="off"
          spellcheck="false"
          placeholder="请输入 Key"
        >
        <button type="button" class="t-btn t-btn-ghost enc-key-toggle" @click="showKey = !showKey">
          {{ showKey ? '隐藏' : '显示' }}
        </button>
      </div>
      <p class="t-hint">
        不带 <code>0x</code> 且全为数字 → 按十进制解析；带 <code>0x</code> → 按十六进制解析。
      </p>

      <label class="t-label" for="enc-input">输入</label>
      <textarea
        id="enc-input"
        v-model="input"
        class="t-input t-area"
        placeholder="加密时输入原文；解密时输入 A1.... 格式密文"
      ></textarea>

      <div class="enc-row">
        <button type="button" class="t-btn t-btn-red" @click="onEncrypt">🔒 加密</button>
        <button type="button" class="t-btn t-btn-teal" @click="onDecrypt">🔓 解密</button>
      </div>

      <label class="t-label" for="enc-output">输出</label>
      <textarea
        id="enc-output"
        ref="outputEl"
        v-model="output"
        class="t-input t-area t-mono"
        readonly
        placeholder="结果会显示在这里"
      ></textarea>

      <div class="enc-row enc-toolbar">
        <button type="button" class="t-btn t-btn-ghost" @click="copyOutput">复制输出</button>
        <button type="button" class="t-btn t-btn-ghost" @click="swapOutput">将输出放回输入</button>
        <button type="button" class="t-btn t-btn-ghost" @click="clearAll">清空</button>
      </div>

      <p class="t-status" :class="statusType">{{ statusText }}</p>
    </article>

    <aside class="enc-note">
      <b>安全提示：</b>
      <br>1. 使用 AES-256-GCM；GCM 自带完整性校验，篡改密文会导致解密失败。
      <br>2. 每次加密都会随机生成 salt 和 nonce，所以同一原文 + 同一 Key 得到的密文也不同。
      <br>3. Key 本身必须保密。若攻击者同时拿到 Key，就能正常解密；若 Key 很短或很容易猜测，PBKDF2 也救不了低熵 Key。
      <br>4. “连续 AES 多加密几次”通常没有必要；正确使用 AES-256-GCM + 强 Key 已经足够。
    </aside>
  </div>
</template>

<style scoped>
.encrypt-page { display: flex; flex-direction: column; gap: 24px; }

.enc-key-row { display: flex; gap: 10px; }
.enc-key-row .t-input { flex: 1; }
.enc-key-toggle { flex: 0 0 auto; padding: 0 18px; }

.enc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
.enc-toolbar { grid-template-columns: repeat(3, 1fr); }

/* 卡片旁贴的便签纸 */
.enc-note {
  background: rgba(245, 192, 64, 0.16);
  border: 2px dashed rgba(214, 164, 35, 0.55);
  border-radius: 12px;
  padding: 14px 18px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.9;
  transform: rotate(-0.5deg);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.06);
}
.enc-note b { color: var(--ink); }

@media (max-width: 560px) {
  .enc-row, .enc-toolbar { grid-template-columns: 1fr; }
}
</style>
