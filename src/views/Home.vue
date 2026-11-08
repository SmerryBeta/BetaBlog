<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import posts from '../posts/index.js'
import site from '../site.js'

// 0~24.75s 是变身前奏，之后每 57.63s 循环一次，播完回到循环起点
const LOOP_START = 24.75

const musicAudio = ref(null)
const isMusicPlaying = ref(false)
let musicWanted = true

function excerpt(body) {
  return body.replace(/[#>*`~\-\[\]()!]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90)
}

async function startMusic() {
  try {
    await musicAudio.value.play()
    return true
  } catch {
    return false
  }
}

function removeMusicUnlock() {
  document.removeEventListener('pointerdown', unlockMusic)
  document.removeEventListener('keydown', unlockMusic)
}

async function unlockMusic(event) {
  if (event.target.closest?.('.heimo-player') || !musicWanted) return
  if (await startMusic()) removeMusicUnlock()
}

async function toggleMusic() {
  if (isMusicPlaying.value) {
    musicWanted = false
    musicAudio.value.pause()
    removeMusicUnlock()
    return
  }
  musicWanted = true
  await startMusic()
}

function onAudioEnded() {
  musicAudio.value.currentTime = LOOP_START
  musicAudio.value.play().catch(() => {})
}

onMounted(async () => {
  if (!await startMusic()) {
    document.addEventListener('pointerdown', unlockMusic)
    document.addEventListener('keydown', unlockMusic)
  }
})

onBeforeUnmount(() => {
  removeMusicUnlock()
  musicAudio.value?.pause()
})
</script>

<template>
  <section class="heimo-hero">
    <span class="magic-sparkle ms1" aria-hidden="true"></span>
    <span class="magic-sparkle ms2" aria-hidden="true"></span>
    <span class="magic-sparkle ms3" aria-hidden="true"></span>
    <div class="heimo-copy">
      <span class="heimo-badge">古娜拉黑暗之神 · 呜呼啦呼 · 黑魔变身！</span>
      <h1>{{ site.name }}</h1>
      <p class="heimo-spell">黑魔仙的魔法小册子 · 持续装订中</p>
      <p class="heimo-intro">{{ site.intro }}</p>
    </div>
    <div class="heimo-avatar">
      <span class="avatar-ring" aria-hidden="true"></span>
      <img src="/smerry-avatar.webp" alt="站长 SmerryBeta 的头像">
      <span class="avatar-badge" aria-hidden="true"><img src="/heimo-box.webp" alt=""></span>
      <span class="avatar-chip"><small>中二病晚期</small><b>{{ site.owner }}</b></span>
    </div>
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
  <button
    class="heimo-player"
    :class="{ playing: isMusicPlaying }"
    type="button"
    :aria-label="isMusicPlaying ? '暂停背景音乐：黑魔变身' : '播放背景音乐：黑魔变身'"
    :aria-pressed="isMusicPlaying"
    @click="toggleMusic"
  >
    <span class="disc" aria-hidden="true"><img src="/smerry-avatar.webp" alt=""></span>
    <span class="meta"><b>黑魔变身</b><small>{{ isMusicPlaying ? '正在播放 · 呜呼啦呼' : '点击播放' }}</small></span>
  </button>
  <audio ref="musicAudio" src="/bgm/heimo-transform.mp3" preload="auto" @play="isMusicPlaying = true" @pause="isMusicPlaying = false" @ended="onAudioEnded"></audio>
</template>

<style scoped>
.heimo-hero {
  --magic: #c084fc;
  --magic-soft: #e9d5ff;
  --magic-deep: #7c3aed;
  position: relative;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
  padding: 34px 8px 8px;
}
.magic-sparkle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--magic-soft);
  clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
  filter: drop-shadow(0 0 7px rgba(216, 180, 254, 0.95));
  animation: sparkle-twinkle 3s ease-in-out infinite;
  pointer-events: none;
}
.ms1 { top: 14%; right: 9%; }
.ms2 { width: 13px; height: 13px; bottom: 17%; left: 40%; animation-delay: -1.1s; }
.ms3 { width: 16px; height: 16px; top: 52%; left: 4%; animation-delay: -2s; }
@keyframes sparkle-twinkle {
  0%, 100% { transform: scale(0.7) rotate(0); opacity: 0.5; }
  50% { transform: scale(1.15) rotate(24deg); opacity: 1; }
}
.heimo-copy { position: relative; z-index: 2; }
.heimo-badge {
  display: inline-block;
  padding: 4px 16px;
  border: 1px solid rgba(216, 180, 254, 0.45);
  border-radius: 10px;
  background: rgba(167, 139, 250, 0.16);
  color: var(--magic-soft);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  transform: rotate(-2deg);
  box-shadow: 0 0 18px rgba(139, 92, 246, 0.35);
  margin-bottom: 18px;
}
.heimo-copy h1 {
  font-size: clamp(30px, 6vw, 46px);
  letter-spacing: 2px;
  background: linear-gradient(180deg, #ffffff 12%, #e9d5ff 55%, #d0a2fb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 16px rgba(192, 132, 252, 0.55));
}
.heimo-spell {
  margin-top: 10px;
  color: var(--magic);
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(192, 132, 252, 0.6);
}
.heimo-intro { margin-top: 8px; color: #b3a4d6; font-size: 14px; }
.heimo-avatar {
  position: relative;
  z-index: 2;
  justify-self: center;
  text-align: center;
}
.heimo-avatar img {
  position: relative;
  z-index: 1;
  display: block;
  width: 188px;
  height: 188px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(216, 180, 254, 0.6);
  box-shadow: 0 0 32px rgba(147, 51, 234, 0.6), 0 0 80px rgba(217, 70, 239, 0.28);
}
.avatar-ring {
  position: absolute;
  inset: -16px;
  border: 2px dashed rgba(216, 180, 254, 0.5);
  border-radius: 50%;
  animation: ring-spin 16s linear infinite;
}
.avatar-ring::after {
  content: "✦";
  position: absolute;
  top: -11px;
  left: 50%;
  color: var(--magic-soft);
  font-size: 17px;
  text-shadow: 0 0 10px rgba(216, 180, 254, 0.95);
}
@keyframes ring-spin { to { transform: rotate(360deg); } }
.avatar-badge {
  position: absolute;
  z-index: 2;
  right: -12px;
  bottom: -6px;
  transform: rotate(30deg);
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.55));
}
.avatar-badge img { display: block; width: 54px; height: auto; }
.avatar-chip {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: -14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 15px;
  border: 1px solid rgba(216, 180, 254, 0.45);
  border-radius: 999px;
  background: rgba(24, 10, 44, 0.92);
  color: var(--magic-soft);
  white-space: nowrap;
  transform: translateX(-50%);
  box-shadow: 0 4px 16px rgba(88, 28, 135, 0.5);
}
.avatar-chip small { color: #a893cf; font-size: 10px; }
.avatar-chip b { font-size: 13px; }

.heimo-player {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 15px 6px 6px;
  border: 1px solid rgba(196, 181, 253, 0.4);
  border-radius: 999px;
  background: rgba(24, 10, 44, 0.85);
  backdrop-filter: blur(6px);
  color: var(--magic-soft, #e9d5ff);
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(88, 28, 135, 0.5);
  transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
}
.heimo-player:hover { transform: scale(1.05); box-shadow: 0 10px 34px rgba(139, 92, 246, 0.6); text-decoration: none; }
.heimo-player .disc {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border: 2px solid rgba(216, 180, 254, 0.35);
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #2b1a4a 0 2px, #1c1033 3px 4px, #3a235e 5px 6px);
  box-shadow: 0 0 14px rgba(139, 92, 246, 0.45);
}
.heimo-player .disc img { width: 20px; height: 20px; border: 1px solid rgba(233, 213, 255, 0.7); border-radius: 50%; object-fit: cover; }
.heimo-player.playing .disc { animation: ring-spin 5s linear infinite; box-shadow: 0 0 22px rgba(192, 132, 252, 0.8); }
.heimo-player .meta { display: flex; flex-direction: column; min-width: 88px; text-align: left; line-height: 1.6; }
.heimo-player .meta b { font-size: 12px; color: #e9d5ff; }
.heimo-player .meta small { font-size: 10px; color: #a893cf; }
.heimo-player.playing .meta small { color: #d0a2fb; }

@media (max-width: 640px) {
  .heimo-hero { grid-template-columns: 1fr; gap: 34px; padding: 22px 6px 4px; text-align: center; }
  .heimo-copy h1 { font-size: clamp(30px, 9vw, 40px); }
  .heimo-avatar img { width: 156px; height: 156px; }
  .avatar-badge { right: -9px; bottom: -4px; }
  .avatar-badge img { width: 44px; }
  .heimo-player .meta { display: none; }
  .heimo-player { padding: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .magic-sparkle, .avatar-ring, .heimo-player.playing .disc { animation: none; }
}
</style>
