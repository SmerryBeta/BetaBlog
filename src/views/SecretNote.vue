<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { enc, dec } from '../utils/aes.js'
import notes from '../notes/index.js'

const route = useRoute()
const mode = ref('read')
const key = ref('')
const showKey = ref(false)
const statusText = ref('')
const statusType = ref('')

const pickedSlug = ref('')
const ciphertext = ref('')
const revealed = ref('')

const draft = ref('')
const linkUrl = ref('')
const cipherOut = ref('')
const linkEl = ref(null)
const cipherEl = ref(null)

function setStatus(text, type = '') {
  statusText.value = text
  statusType.value = type
}

// 链接里的 ?d= 直接是要拆的纸条；watch 兼容同页打开新链接（不重新挂载）
watch(
  () => route.query.d,
  (d) => {
    if (typeof d !== 'string' || !d) return
    mode.value = 'read'
    pickedSlug.value = ''
    ciphertext.value = d
    revealed.value = ''
    setStatus('')
  },
  { immediate: true }
)

function pickNote(n) {
  pickedSlug.value = n.slug
  ciphertext.value = n.ciphertext
  revealed.value = ''
  setStatus('')
}

async function unlock() {
  // 容许直接粘贴整条链接
  let ct = ciphertext.value.trim()
  const fromLink = ct.match(/[?&]d=([A-Za-z0-9_.-]+)/)
  if (fromLink) ct = fromLink[1]

  if (!ct) {
    setStatus('先选一张纸条，或把密文 / 链接粘进来。', 'error')
    return
  }
  try {
    setStatus('正在拆纸条…')
    revealed.value = ''
    revealed.value = await dec(ct, key.value)
    setStatus('纸条展开了。', 'ok')
  } catch (e) {
    setStatus(e?.message || String(e), 'error')
  }
}

async function seal() {
  if (!draft.value.trim()) {
    setStatus('先写点想说的话吧。', 'error')
    return
  }
  try {
    setStatus('正在封纸条…')
    cipherOut.value = await enc(draft.value, key.value)
    linkUrl.value = location.origin + location.pathname + '#/tools/note?d=' + cipherOut.value
    setStatus('纸条封好了，快把链接发给 TA。', 'ok')
  } catch (e) {
    setStatus(e?.message || String(e), 'error')
  }
}

async function copyText(text, el, okLabel) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    el?.focus()
    el?.select()
    document.execCommand('copy')
  }
  setStatus(okLabel, 'ok')
}
</script>

<template>
  <article class="post note-page">
    <header class="post-head">
      <span class="badge">小工具 · 悄悄话信箱</span>
      <h1>加密小纸条</h1>
      <p class="t-sub">想说又不想让所有人看见的话，锁进纸条里：拿到链接的人，还需要 Key 才能拆开。</p>
    </header>

    <div class="note-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        class="note-tab"
        :class="{ active: mode === 'read' }"
        :aria-selected="mode === 'read'"
        @click="mode = 'read'; setStatus('')"
      >读纸条</button>
      <button
        type="button"
        role="tab"
        class="note-tab"
        :class="{ active: mode === 'write' }"
        :aria-selected="mode === 'write'"
        @click="mode = 'write'; setStatus('')"
      >写纸条</button>
    </div>

    <template v-if="mode === 'read'">
      <div v-if="notes.length" class="note-shelf">
        <button
          v-for="n in notes"
          :key="n.slug"
          type="button"
          class="note-chip"
          :class="{ active: pickedSlug === n.slug }"
          @click="pickNote(n)"
        >
          <b>{{ n.title }}</b>
          <small>{{ n.date }} · {{ n.hint }}</small>
        </button>
      </div>

      <label class="t-label" for="note-ct">纸条（密文或链接）</label>
      <textarea
        id="note-ct"
        v-model="ciphertext"
        class="t-input t-area t-mono"
        placeholder="A1.... 格式密文，或直接把拿到的纸条链接整条粘进来"
        @input="pickedSlug = ''"
      ></textarea>

      <label class="t-label" for="note-key">Key</label>
      <div class="note-key-row">
        <input
          id="note-key"
          v-model="key"
          class="t-input"
          :type="showKey ? 'text' : 'password'"
          autocomplete="off"
          spellcheck="false"
          placeholder="拿到纸条的人才知道的暗号"
        >
        <button type="button" class="t-btn t-btn-ghost note-key-toggle" @click="showKey = !showKey">
          {{ showKey ? '隐藏' : '显示' }}
        </button>
      </div>

      <div class="note-single">
        <button type="button" class="t-btn t-btn-teal" @click="unlock">🔓 拆开纸条</button>
      </div>

      <p class="t-status" :class="statusType">{{ statusText }}</p>

      <Transition name="unveil">
        <div v-if="revealed" class="note-revealed">
          <span class="tape tape-l" aria-hidden="true"></span>
          <span class="tape tape-r" aria-hidden="true"></span>
          <p>{{ revealed }}</p>
        </div>
      </Transition>
    </template>

    <template v-else>
      <label class="t-label" for="note-draft">想说的话</label>
      <textarea
        id="note-draft"
        v-model="draft"
        class="t-input t-area"
        placeholder="写下只想让一个人（或几个人）看到的话"
      ></textarea>

      <label class="t-label" for="note-wkey">Key（拆纸条的暗号）</label>
      <input
        id="note-wkey"
        v-model="key"
        class="t-input"
        :type="showKey ? 'text' : 'password'"
        autocomplete="off"
        spellcheck="false"
        placeholder="数字，或 0x 开头的十六进制"
      >
      <p class="t-hint">
        不带 <code>0x</code> 且全为数字 → 按十进制解析；带 <code>0x</code> → 按十六进制解析。
      </p>

      <div class="note-single">
        <button type="button" class="t-btn t-btn-red" @click="seal">🔒 封一张纸条</button>
      </div>

      <p class="t-status" :class="statusType">{{ statusText }}</p>

      <template v-if="linkUrl">
        <label class="t-label" for="note-link">纸条链接（发给 TA）</label>
        <input
          id="note-link"
          ref="linkEl"
          class="t-input t-mono note-link"
          :value="linkUrl"
          readonly
          @focus="$event.target.select()"
        >

        <div class="note-actions">
          <button type="button" class="t-btn t-btn-ghost" @click="copyText(linkUrl, linkEl, '链接已复制。')">复制链接</button>
          <button type="button" class="t-btn t-btn-ghost" @click="copyText(cipherOut, cipherEl, '密文已复制。')">复制密文</button>
        </div>

        <label class="t-label" for="note-cipher">密文</label>
        <textarea
          id="note-cipher"
          ref="cipherEl"
          class="t-input t-mono note-cipher"
          :value="cipherOut"
          readonly
        ></textarea>
        <p class="t-hint">想让纸条常驻小站？把这段密文粘进 <code>src/notes/index.js</code>，配好标题和提示语推送即可。</p>
      </template>
    </template>
  </article>
</template>

<style scoped>
.note-tabs { display: flex; gap: 10px; margin: 6px 0 20px; }
.note-tab {
  padding: 9px 22px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--ink-soft);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out,
    background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out;
}
.note-tab:hover { transform: translateY(-2px); box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1); }
.note-tab:focus-visible { outline: 3px solid rgba(107, 127, 181, 0.45); outline-offset: 2px; }
.note-tab.active {
  background: var(--yellow);
  border-color: var(--ink);
  color: var(--ink);
  transform: rotate(-1deg);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
}

/* 站内常驻纸条的小抽屉 */
.note-shelf { display: flex; flex-direction: column; gap: 10px; }
.note-chip {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: 2px dashed var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  font: inherit;
  color: var(--ink);
  cursor: pointer;
  transition: transform 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out;
}
.note-chip b { display: block; }
.note-chip small { color: var(--ink-faint); font-size: 12px; }
.note-chip:hover { transform: translateY(-2px) rotate(-0.4deg); border-color: rgba(232, 93, 117, 0.5); }
.note-chip.active {
  border-style: solid;
  border-color: rgba(92, 184, 165, 0.65);
  background: rgba(92, 184, 165, 0.1);
  transform: rotate(-0.4deg);
}
.note-chip.active small { color: #3f8f7b; }

.note-key-row { display: flex; gap: 10px; }
.note-key-row .t-input { flex: 1; }
.note-key-toggle { flex: 0 0 auto; padding: 0 18px; }

.note-single { display: grid; grid-template-columns: 1fr; margin-top: 18px; }

/* 拆开的纸条：贴着两条和纸胶带 */
.note-revealed {
  position: relative;
  margin-top: 26px;
  padding: 28px 24px 22px;
  background: #fffdf7;
  border: 2px solid var(--line);
  border-radius: 12px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.08);
  transform: rotate(-0.6deg);
  line-height: 2;
}
.note-revealed p { white-space: pre-wrap; word-break: break-word; }
.note-revealed .tape {
  position: absolute;
  top: -12px;
  width: 76px;
  height: 24px;
  border-radius: 2px;
  opacity: 0.75;
}
.tape-l { left: 26px; background: rgba(245, 192, 64, 0.5); transform: rotate(-5deg); }
.tape-r { right: 26px; background: rgba(92, 184, 165, 0.45); transform: rotate(6deg); }

.unveil-enter-active { transition: opacity 0.3s ease-out, transform 0.3s ease-out; }
.unveil-enter-from { opacity: 0; transform: rotate(-0.6deg) translateY(10px) scale(0.98); }

.note-link { cursor: text; }
.note-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.note-cipher { min-height: 96px; resize: none; }

@media (max-width: 560px) {
  .note-actions { grid-template-columns: 1fr; }
  .note-tab { flex: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .note-tab, .note-chip { transition: none; }
  .unveil-enter-active { transition-property: opacity; }
  .unveil-enter-from { transform: rotate(-0.6deg); }
}
</style>
