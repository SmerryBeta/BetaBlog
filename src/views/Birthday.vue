<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { asset } from '../site.js'

const memories = [
  { src: asset('/gallery/memory-01.webp'), date: '2024.02.09', title: '我们', tag: '相聚' },
  { src: asset('/gallery/memory-02.webp'), date: '2024.02.27', title: '闷骚的灵', tag: '相聚' },
  { src: asset('/gallery/memory-03.webp'), date: '2024.03.10', title: '躺平拉拉', tag: '日常' },
  { src: asset('/gallery/memory-04.webp'), date: '2024.03.10', title: '月光与晚风', tag: '风景' },
  { src: asset('/gallery/memory-05.webp'), date: '2024.03.13', title: '就这样温柔的靠着我 =￣ω￣=', tag: '日常' },
  { src: asset('/gallery/memory-06.webp'), date: '2024.03.14', title: '哦我的天', tag: '相聚' },
  { src: asset('/gallery/memory-07.webp'), date: '2024.03.14', title: '看你', tag: '风景' },
  { src: asset('/gallery/memory-08.webp'), date: '2024.03.14', title: '雄姿英发', tag: '风景' },
  { src: asset('/gallery/memory-09.webp'), date: '2024.03.24', title: '大狗瞪小狗', tag: '日常' },
  { src: asset('/gallery/memory-10.webp'), date: '2024.03.24', title: '夜色里的“小英雄”', tag: '风景' },
  { src: asset('/gallery/memory-11.webp'), date: '2024.05.18', title: '你送我的祝福，我还记得', tag: '相聚' },
  { src: asset('/gallery/memory-12.webp'), date: '2024.05.24', title: '最忙三人组', tag: '相聚' },
  { src: asset('/gallery/memory-13.webp'), date: '2024.05.31', title: '星光落在钦灵の草窝', tag: '风景' },
  { src: asset('/gallery/memory-14.webp'), date: '2024.05.31', title: '别打我啦 ￣へ￣', tag: '日常' },
  { src: asset('/gallery/memory-15.webp'), date: '2024.06.21', title: '一起去看星星', tag: '风景' },
  { src: asset('/gallery/memory-16.webp'), date: '2024.07.11', title: '晴空下的我们', tag: '相聚' },
  { src: asset('/gallery/memory-17.webp'), date: '2024.10.01', title: '兰州云合影的三小只特写', tag: '相聚' },
  { src: asset('/gallery/memory-18.webp'), date: '2024.10.10', title: '我的武器太弱小', tag: '日常' },
  { src: asset('/gallery/memory-19.webp'), date: '2024.10.12', title: '我是媒婆~', tag: '日常' },
  { src: asset('/gallery/memory-20.webp'), date: '2024.10.12', title: '搭小jio~', tag: '日常' },
  { src: asset('/gallery/memory-21.webp'), date: '2024.10.14', title: '看着正在设计豌豆射手的你', tag: '风景' },
  { src: asset('/gallery/memory-22.webp'), date: '2024.10.19', title: '植物们排排站', tag: '风景' },
  { src: asset('/gallery/memory-23.webp'), date: '2024.12.08', title: '我的肚子是什么味道', tag: '日常' },
  { src: asset('/gallery/memory-24.webp'), date: '2024.12.08', title: '软软的小狗灵', tag: '日常' },
  { src: asset('/gallery/memory-25.webp'), date: '2025.01.01', title: '一起走进 2025', tag: '相聚' },
  { src: asset('/gallery/memory-27.webp'), date: '2026.07.07', title: '我是僵尸，我要吃牢灵', tag: '日常' },
  { src: asset('/gallery/memory-28.webp'), date: '2026.08.10', title: '召唤小狗！', tag: '日常' },
  { src: asset('/gallery/memory-26.webp'), date: '2026.08.18', title: '钦灵养的小杯杯', tag: '相聚' }, // 这里顺序换了一些
  { src: asset('/gallery/memory-29.webp'), date: '2026.08.18', title: '《灭世魔狼钦灵》', tag: '日常' },
]

const petals = [
  ['7%', '6%', '-4s', '13s'], ['18%', '17%', '-9s', '16s'], ['31%', '4%', '-1s', '15s'],
  ['46%', '13%', '-12s', '18s'], ['61%', '3%', '-6s', '14s'], ['76%', '15%', '-15s', '19s'],
  ['91%', '5%', '-8s', '17s'], ['84%', '33%', '-3s', '16s'], ['3%', '39%', '-11s', '18s'],
]
const filters = ['全部', '相聚', '日常', '风景']
const activeFilter = ref('全部')
const selectedIndex = ref(-1)
const surpriseOpen = ref(false)
const slideDirection = ref('slide-left')
const musicAudio = ref(null)
const isMusicPlaying = ref(false)
const closeButton = ref(null)
const surpriseClose = ref(null)
const toast = ref('')
let toastTimer
let previousFocus
let musicWanted = true

const uiSounds = {
  click: new Audio(asset('/gallery/sounds/ui-click.mp3')),
  pop: new Audio(asset('/gallery/sounds/ui-pop.mp3')),
  wood: new Audio(asset('/gallery/sounds/ui-wood-click.mp3')),
  turn: new Audio(asset('/gallery/sounds/ui-turn.mp3')),
  fireworks: new Audio(asset('/gallery/sounds/ui-fireworks.mp3')),
  giftClose: new Audio(asset('/gallery/sounds/ui-leather-off.mp3')),
}

function playUiSound(name) {
  const sound = uiSounds[name]
  if (!sound) return
  sound.volume = 0.8
  sound.currentTime = 0
  sound.play().catch(() => {})
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
  if (event.target.closest?.('.music-player') || !musicWanted) return
  if (await startMusic()) removeMusicUnlock()
}

async function toggleMusic() {
  playUiSound('click')
  if (isMusicPlaying.value) {
    musicWanted = false
    musicAudio.value.pause()
    removeMusicUnlock()
    return
  }
  musicWanted = true
  await startMusic()
}

const visibleMemories = computed(() => activeFilter.value === '全部'
  ? memories
  : memories.filter(memory => memory.tag === activeFilter.value))
const selectedMemory = computed(() => memories[selectedIndex.value])

function rememberFocus() {
  previousFocus = document.activeElement
}

function restoreFocus() {
  nextTick(() => previousFocus?.focus())
}

function openImage(memory) {
  playUiSound('pop')
  rememberFocus()
  selectedIndex.value = memories.indexOf(memory)
}

function closeImage() {
  playUiSound('wood')
  selectedIndex.value = -1
  restoreFocus()
}

function turnImage(direction) {
  playUiSound('turn')
  slideDirection.value = direction > 0 ? 'slide-left' : 'slide-right'
  selectedIndex.value = (selectedIndex.value + direction + memories.length) % memories.length
}

let touchStartX = 0
function onTouchStart(event) {
  touchStartX = event.changedTouches[0].clientX
}

function onTouchEnd(event) {
  const distance = event.changedTouches[0].clientX - touchStartX
  if (Math.abs(distance) > 45) turnImage(distance < 0 ? 1 : -1)
}

function openSurprise() {
  playUiSound('fireworks')
  rememberFocus()
  surpriseOpen.value = true
}

function scrollToMemories() {
  playUiSound('click')
  document.getElementById('memory-wall')?.scrollIntoView({ behavior: 'smooth' })
}

function closeSurprise() {
  uiSounds.fireworks.pause()
  uiSounds.fireworks.currentTime = 0
  playUiSound('giftClose')
  surpriseOpen.value = false
  restoreFocus()
}

function selectFilter(filter) {
  if (filter === activeFilter.value) return
  playUiSound('click')
  activeFilter.value = filter
}

async function saveWish() {
  playUiSound('click')
  const text = '钦灵，即使我们不会再一起玩了，但是我还是愿你往后的每一天，都能舒舒服服的奖励自己的身体，做自己喜欢的事情。在研究生的这几年里，能收获一个爱你的对象，每天都能收获美好的陪伴，做事都顺顺利利。嗯..就酱紫，生日快乐啦~ 小灵灵；我永远都记得那句“你这个reload指令”哈哈哈，感谢你教我插件哈~ 客观上来说，你真真切切的改变了我，谢谢你呀。'
  try {
    await navigator.clipboard.writeText(text)
    toast.value = '这句祝福已经复制好啦'
  } catch {
    toast.value = text
  }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3500)
}

watch(selectedIndex, async value => {
  if (value >= 0) {
    await nextTick()
    closeButton.value?.focus()
  }
})

watch(surpriseOpen, async value => {
  if (value) {
    await nextTick()
    surpriseClose.value?.focus()
  }
})

watch([selectedIndex, surpriseOpen], ([imageIndex, isSurpriseOpen]) => {
  document.body.style.overflow = imageIndex >= 0 || isSurpriseOpen ? 'hidden' : ''
})

function onKeydown(event) {
  if (event.key === 'Escape') {
    if (surpriseOpen.value) closeSurprise()
    else if (selectedIndex.value >= 0) closeImage()
  }
  if (selectedIndex.value >= 0 && !surpriseOpen.value) {
    if (event.key === 'ArrowLeft') turnImage(-1)
    if (event.key === 'ArrowRight') turnImage(1)
  }
}

window.addEventListener('keydown', onKeydown)
onMounted(async () => {
  if (!await startMusic()) {
    document.addEventListener('pointerdown', unlockMusic)
    document.addEventListener('keydown', unlockMusic)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  removeMusicUnlock()
  musicAudio.value?.pause()
  uiSounds.fireworks.pause()
  document.body.style.overflow = ''
  clearTimeout(toastTimer)
})
</script>

<template>
  <div class="birthday-page">
    <header class="birthday-nav">
      <div class="birthday-shell nav-inner">
        <router-link to="/birthday" class="birthday-brand" aria-label="钦灵的生日手账首页">
          <img :src="asset('/gallery/qingling-avatar.webp')" alt="钦灵的头像">
          <span><b>钦灵的生日手账</b><small>QINGLING'S LITTLE ALBUM</small></span>
        </router-link>
        <button
          class="music-player"
          :class="{ playing: isMusicPlaying }"
          type="button"
          :aria-label="isMusicPlaying ? '暂停背景音乐：那个夏天' : '播放背景音乐：那个夏天'"
          :aria-pressed="isMusicPlaying"
          @click="toggleMusic"
        >
          <span class="vinyl-wrap" aria-hidden="true">
            <span class="vinyl-record"><img :src="asset('/gallery/qingling-avatar.webp')" alt=""></span>
            <span class="tonearm"></span>
          </span>
          <span class="music-meta"><b>那个夏天</b><small>{{ isMusicPlaying ? '正在播放' : '点击播放' }} · 久石让</small></span>
        </button>
        <nav class="birthday-nav-links" aria-label="生日手账导航">
          <a href="#memory-wall" @click.prevent="scrollToMemories">回忆相册</a>
          <router-link to="/"><span aria-hidden="true">←</span> 返回小站</router-link>
        </nav>
      </div>
    </header>
    <audio ref="musicAudio" :src="asset('/gallery/one-summers-day.mp3')" preload="auto" loop @play="isMusicPlaying = true" @pause="isMusicPlaying = false"></audio>
    <span
      v-for="(petal, index) in petals"
      :key="index"
      class="falling-petal"
      :style="{ left: petal[0], top: petal[1], animationDelay: petal[2], animationDuration: petal[3] }"
      aria-hidden="true"
    ></span>

    <section class="birthday-hero birthday-shell" aria-labelledby="birthday-title">
      <div class="hero-copy">
        <div class="recipient-line">
          <div class="recipient-chip"><img :src="asset('/gallery/qingling-avatar.webp')" alt="钦灵"><span><small>今天的主角</small><b>钦灵</b></span></div>
          <span class="birthday-date">11 · 09</span>
        </div>
        <p class="handwritten">A little birthday archive, made with love.</p>
        <h1 id="birthday-title">立冬之时，<br><em>钦灵，生日快乐</em></h1>
        <p class="hero-intro">把一起看过的风景、笑过的瞬间，都夹进这本冬日手账。新的一岁，也要被温柔和好消息包围。</p>
        <div class="hero-actions">
          <button class="pill-button primary-button" type="button" @click="openSurprise">
            <span aria-hidden="true">✦</span> 拆开生日惊喜
          </button>
          <a class="pill-button secondary-button" href="#memory-wall" @click.prevent="scrollToMemories">看看我们的回忆 <span aria-hidden="true">↓</span></a>
        </div>
        <p class="archive-count"><span>{{ memories.length }}</span> 张照片 <i>·</i> <span>1</span> 段动画 <i>·</i> 好多祝福</p>
      </div>

      <div class="hero-scrapbook">
        <span class="tape tape-top" aria-hidden="true"></span>
        <button class="main-photo" type="button" @click="openImage(memories[0])" aria-label="放大查看樱花树下的相聚">
          <img :src="asset('/gallery/memory-01.webp')" alt="樱花与彩灯装点的生日场景中，大家聚在一起合影">
          <span class="photo-caption"><b>樱花盛开的那一页</b><small>our little wonderful world</small></span>
        </button>
        <span class="gold-sparkle sparkle-one" aria-hidden="true"></span>
        <span class="gold-sparkle sparkle-two" aria-hidden="true"></span>
        <button class="gif-teaser" type="button" @click="openSurprise" aria-label="打开白发猫耳少女的生日惊喜动画">
          <img :src="asset('/gallery/birthday-surprise-poster.webp')" alt="生日惊喜动画的静态封面">
          <span>藏着一个小惊喜 <b>点我拆开</b></span>
        </button>
      </div>
    </section>

    <section class="wish-ribbon-section" aria-label="生日祝愿">
      <div class="lace-edge lace-top" aria-hidden="true"></div>
      <div class="birthday-shell wish-content">
        <span class="section-ribbon">TO MY DEAR</span>
        <p>愿你拥有拆开礼物的期待，也拥有平凡日子里的安心。</p>
        <div class="wish-keywords" aria-label="三个生日愿望">
          <span>有爱可做</span><i>✿</i><span>友爱相伴</span><i>✿</i><span>追寻热爱</span>
        </div>
      </div>
      <div class="lace-edge lace-bottom" aria-hidden="true"></div>
    </section>

    <section id="memory-wall" class="memory-section birthday-shell" aria-labelledby="memory-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">MEMORIES IN BLOOM</span>
          <h2 id="memory-title">把回忆贴在这里</h2>
          <p>每一张都很普通，拼在一起就很有感觉。</p>
        </div>
        <svg class="heading-flower" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2c-1.8-5.5-8.2-3.7-6.2 1.1-5.4-1.5-6.4 5.3-1.1 5.5-3.6 4.4 2.2 8.7 5.2 3.9 1.1 5.5 8.3 4.5 7.1-.7 5.1 2.1 8.3-4.2 3.1-6.3 4.7-3.1.7-8.6-4-6.3.2-5.5-6.5-5.7-6.2-.2Z"/><circle cx="12" cy="12" r="2.3"/></svg>
      </div>
      <div class="memory-toolbar">
        <div class="filter-list" aria-label="筛选照片">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            :class="{ active: activeFilter === filter }"
            :aria-pressed="activeFilter === filter"
            @click="selectFilter(filter)"
          >{{ filter === '全部' ? '全部回忆' : filter }}</button>
        </div>
        <span>{{ visibleMemories.length }} 张回忆</span>
      </div>

      <div class="memory-grid">
        <button
          v-for="(memory, index) in visibleMemories"
          :key="memory.src"
          class="memory-card"
          :class="{ featured: activeFilter === '全部' && (index === 0 || index === 9 || index === 15 || index === 21 || index === 24) }"
          type="button"
          @click="openImage(memory)"
          :aria-label="`放大查看：${memory.title}`"
        >
          <span class="memory-image"><img :src="memory.src" :alt="memory.title" loading="lazy"></span>
          <span class="memory-info"><span><small>{{ memory.date }}</small><b>{{ memory.title }}</b></span><i aria-hidden="true">↗</i></span>
        </button>
      </div>
    </section>

    <section class="birthday-letter birthday-shell" aria-labelledby="letter-title">
      <div class="letter-card">
        <span class="letter-stamp" aria-hidden="true">✿<small>FOR YOU</small></span>
        <div class="letter-copy">
          <span class="section-kicker">A LETTER FOR YOUR NEW CHAPTER</span>
          <h2 id="letter-title">致新一岁的钦灵</h2>
          <p>这首歌曲是我挑了一个下午的，感觉钢琴声阵阵入心，嗯..随着旋律的流淌，看着一张一张的旧照片，真的挺感动的，就感觉，那眼泪不知不觉间就...唔</p>
          <p>当然，之所以没有放传统的生日歌曲，是因为我并不喜欢那种俗套的感觉，我这个人嘛..有时候就是这样总想搞点特别的</p>
          <p>其次呀，恭喜你暂时脱离了一段十分匆忙的时光，虽然这段时光我也暂时失去了跟你的联系。当然我也一直在想，一方面，多接触点现实的人或许也是你的选择呢？</p>
          <p>其实我还想到，既然你都那么忙了我还打扰你感觉真的不是很好，刚刚好火花也灭了，所以我就不太想打扰你了</p>
          <p>当然..那个时候我也在赶项目，被愚蠢的GLM5.3折腾的呀..我..唉，今天是11.7，我翻看了和你的私聊面板，最后一条来自你的消息被定格在了9月30日</p>
          <p>说实话，感觉今年都没怎么跟你一起玩了，今年七月份暑期的农场物语，我还是比较后期的时候来的，你的上线时间刚刚好是我的下线时间，毕竟嘛我也不是夜行动物，蛮遗憾的，但是也跟你接触了那么一小段时间</p>
          <p>哦！还有呢，记得今年MC出的快照有个官方联机，我们就在聊了一段时间，可惜我蛮健忘了，又忘了聊了啥</p>
          <p>你看我这几个月你在忙的时候，你不是一直没空理我嘛，就跟你闹了几次矛盾，唉...</p>
          <figure class="letter-photo tiny">
            <span class="photo-tape" aria-hidden="true"></span>
            <img :src="asset('/gallery/huggy.webp')" alt="跟你和解后的第一个抱，太喜欢了！" loading="lazy">
            <figcaption>跟你和解后的第一个抱，太喜欢了！</figcaption>
          </figure>
          <p>或许Lingchat真的有某种神奇的意义呢..现在的人们都太寂寞了，我那边也有猛兽的群聊，天天都跟他们聊天，但是永远都没有那种亲密的感觉，现代的AI或许能带来这项情感上的陪伴，我从45那边听说了你受到了企业的邀请，恭喜你呀！</p>
          <p>不过呀，11月5日那天我以恋爱雪咪的身份混了进去...一个圈子毕竟有一个圈子的文化吧，我看到有管理员称号的机器人我就想试试他能不能管的住自己的神权</p>
          <p>于是呀...感觉我那样测试你们的小钦灵,给你们群搞得，感觉我就像被绑在行刑车上罪恶多端的恶魔，下面是“天杀的萝莉”，“喵哒子”这些人的谩骂，“禁言她！踢了她！”</p>
          <p>蛮抱歉给你惹的麻烦，不过我自己一直在反思，也在跟45、ACE讨论这个事情，跨圈子还是要了解一个圈子的文化，毕竟Lingchat的用户们是一个对AI有深刻感情的群体，我或许还是太冒犯了 : _</p>
          <p>我退群了，应该是我第二次离开了，虽然我离开了，但是也感谢你在我退出群里后还为我说话</p>
          <p>一年又过去了，亲爱的牢灵呀，现在我们都是22岁了，你也一天一天的在进步，45跟着你也学习了不少团队合作方面的课外知识，虽然很遗憾没能融入你的新圈子，或许就像你融入不了我在猛兽的新圈子</p>
          <p>但是呢！如果以后还有什么MC联机的活动的话，一起玩吧！哈哈，你看我暑假还设计了一台一个游戏日180w的游戏币的超级生产资料，成功拿下了1e财富的任务，拿下了创造马达</p>
          <figure class="letter-photo narrow">
            <span class="photo-tape" aria-hidden="true"></span>
            <img :src="asset('/gallery/letter-dolls.webp')" alt="钦灵和我的棉花娃娃依偎在一起，身后是写给你的生日贺卡" loading="lazy">
            <figcaption>两个小家伙已经约好了，下次一起玩</figcaption>
          </figure>
          <p>记得2024年的暑假，应该是我们在一起玩最快乐的一段时光了，一起聊天一起拍五周年，不过呢..未来是未知的，永远都不知道什么时候才会像当年那样在一起玩，就像这首歌，那个暑假..也将永远定格在回忆里了</p>
          <p>感谢你与我做朋友的每一天呀！</p>
          <p>如果生活偶尔下起雨，就记得这里还存着许多晴天。生日快乐，今天和以后的每一天都要快乐 ^ _ ^ ~</p>
          <p>小兔子玩偶，你送我的，香香的软软的真可爱！快看：</p>
          <figure class="letter-photo">
            <span class="photo-tape" aria-hidden="true"></span>
            <img :src="asset('/gallery/letter-bunny.webp')" alt="你送我的小兔子玩偶，正坐在屏幕前看我们的回忆相册" loading="lazy">
            <figcaption>它呀，正盯着屏幕里我们的回忆看呢</figcaption>
          </figure>
          <div class="letter-signature">—— SmerryBeta <span>♡</span></div>
        </div>
        <div class="letter-action">
          <span class="tiny-note">一句祝福，送给今天的你</span>
          <button class="pill-button primary-button" type="button" @click="saveWish">收下这句祝福 <span aria-hidden="true">♡</span></button>
        </div>
      </div>
    </section>

    <footer class="birthday-footer">
      <img :src="asset('/gallery/qingling-avatar.webp')" alt="">
      <p>光阴易逝，往事铭心。</p>
      <span>这本小小的手账，送给独一无二的小骚灵。</span>
    </footer>

    <Transition name="modal-fade">
      <div v-if="selectedMemory" class="photo-modal" role="dialog" aria-modal="true" :aria-label="selectedMemory.title" @click.self="closeImage" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <button ref="closeButton" class="modal-close" type="button" aria-label="关闭照片" @click="closeImage">×</button>
        <button class="modal-arrow previous" type="button" aria-label="上一张照片" @click="turnImage(-1)">‹</button>
        <Transition :name="slideDirection" mode="out-in">
          <figure :key="selectedIndex">
            <img :src="selectedMemory.src" :alt="selectedMemory.title">
            <figcaption><span>{{ selectedMemory.date }}</span><b>{{ selectedMemory.title }}</b><small>{{ selectedIndex + 1 }} / {{ memories.length }}</small></figcaption>
          </figure>
        </Transition>
        <button class="modal-arrow next" type="button" aria-label="下一张照片" @click="turnImage(1)">›</button>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="surpriseOpen" class="surprise-modal" role="dialog" aria-modal="true" aria-labelledby="surprise-title" @click.self="closeSurprise">
        <div class="surprise-card">
          <button ref="surpriseClose" class="surprise-close" type="button" aria-label="关闭生日惊喜" @click="closeSurprise">×</button>
          <span class="section-ribbon">SPECIAL FOR YOU</span>
          <div class="animation-frame">
            <img :src="asset('/gallery/birthday-surprise.gif')" alt="白发猫耳少女捧着生日蛋糕，送来生日快乐祝福">
          </div>
          <h2 id="surprise-title">钦灵，你的生日惊喜到啦！</h2>
          <p>蛋糕上的烛光、交织着三年的回忆，还有这句最郑重的祝福：<br><strong>愿你所求皆如愿，所行皆坦途。</strong></p>
          <span class="surprise-date">11 · 09 &nbsp; HAPPY BIRTHDAY</span>
          <span class="gold-sparkle surprise-sparkle" aria-hidden="true"></span>
        </div>
      </div>
    </Transition>

    <Transition name="toast-slide">
      <div v-if="toast" class="birthday-toast" role="status">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.birthday-page {
  --pink: #ffb7c5;
  --pearl: #fff5f7;
  --lavender: #c4b5fd;
  --gold: #fde68a;
  --rose: #fecdd3;
  --ink: #4a3f49;
  --soft-ink: #746572;
  --deep-rose: #9d4862;
  position: relative;
  overflow: hidden;
  color: var(--ink);
  background-color: var(--pearl);
  background-image: radial-gradient(circle, rgba(255, 183, 197, .16) .7px, transparent .8px);
  background-size: 12px 12px;
}
.birthday-shell { width: min(1160px, calc(100% - 64px)); margin-inline: auto; }
.birthday-nav { position: sticky; top: 0; z-index: 50; border-bottom: 2px solid rgba(255, 183, 197, .22); background: #fff8fa; box-shadow: 0 3px 16px rgba(255, 183, 197, .13); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 76px; }
.birthday-brand { display: flex; align-items: center; gap: 12px; color: var(--ink); }
.birthday-brand:hover { text-decoration: none; }
.birthday-brand img { width: 46px; height: 46px; padding: 2px; border: 2px solid #ffd4df; border-radius: 50%; background: #fff; object-fit: cover; box-shadow: 0 3px 12px rgba(255, 183, 197, .28); transition: transform .3s ease-in-out; }
.birthday-brand:hover img { transform: rotate(-5deg) scale(1.06); }
.birthday-brand span { display: flex; flex-direction: column; }
.birthday-brand b { color: var(--deep-rose); font-size: 16px; letter-spacing: 1px; }
.birthday-brand small { color: #aa7c8b; font-family: "Segoe Print", cursive; font-size: 8px; letter-spacing: 1px; }
.music-player { display: flex; align-items: center; gap: 10px; padding: 4px 8px; border: 0; border-radius: 999px; background: transparent; color: var(--ink); cursor: pointer; transition: all .3s ease-in-out; }
.music-player:hover { background: #ffedf2; transform: scale(1.03); }
.vinyl-wrap { position: relative; display: block; width: 52px; height: 50px; flex-shrink: 0; }
.vinyl-record { position: absolute; left: 0; bottom: 1px; display: grid; place-items: center; width: 46px; height: 46px; border: 2px solid #554b54; border-radius: 50%; background: repeating-radial-gradient(circle, #39323a 0 2px, #29252b 3px 4px, #484049 5px 6px); box-shadow: 0 4px 10px rgba(87, 61, 74, .2); }
.vinyl-record::before { content: ""; position: absolute; width: 25px; height: 25px; border-radius: 50%; background: var(--pink); }
.vinyl-record img { position: relative; width: 20px; height: 20px; border: 1px solid #fff; border-radius: 50%; object-fit: cover; }
.tonearm { position: absolute; z-index: 2; top: 0; right: 1px; width: 3px; height: 29px; border-radius: 999px; background: #b5a6b0; box-shadow: 1px 1px 2px rgba(87, 61, 74, .15); transform: rotate(-9deg); transform-origin: 2px 4px; transition: transform .5s ease-in-out; }
.tonearm::before { content: ""; position: absolute; top: -2px; left: -3px; width: 9px; height: 9px; border: 2px solid #a3939e; border-radius: 50%; background: #fff; }
.tonearm::after { content: ""; position: absolute; bottom: -2px; left: -2px; width: 7px; height: 6px; border-radius: 2px; background: #8e7b86; }
.music-player.playing .vinyl-record { animation: record-spin 6s linear infinite; }
.music-player.playing .tonearm { transform: rotate(23deg); }
.music-meta { display: flex; flex-direction: column; min-width: 96px; text-align: left; line-height: 1.6; }
.music-meta b { color: #875468; font-size: 12px; }
.music-meta small { color: #a17b88; font-size: 9px; }
.birthday-nav-links { display: flex; align-items: center; gap: 10px; }
.birthday-nav-links a { padding: 8px 17px; border-radius: 999px; color: #875468; font-size: 13px; transition: all .3s ease-in-out; }
.birthday-nav-links a:hover { background: #ffe8ee; color: var(--deep-rose); text-decoration: none; }
.birthday-nav-links a:last-child { border: 1px solid #f2cbd6; background: #fff; }
.birthday-hero { min-height: 660px; display: grid; grid-template-columns: .93fr 1.07fr; align-items: center; gap: 64px; padding-block: 72px 94px; }
.hero-copy { position: relative; z-index: 2; }
.recipient-line { display: flex; align-items: center; gap: 15px; }
.recipient-chip { display: inline-flex; align-items: center; gap: 9px; padding: 5px 15px 5px 5px; border: 1px solid rgba(157, 72, 98, .18); border-radius: 999px; background: #fff; box-shadow: 0 4px 16px rgba(255, 183, 197, .2); }
.recipient-chip img { width: 39px; height: 39px; border-radius: 50%; object-fit: cover; }
.recipient-chip span { display: flex; flex-direction: column; line-height: 1.4; }
.recipient-chip small { color: #a17b88; font-size: 9px; }
.recipient-chip b { color: var(--deep-rose); font-size: 14px; }
.birthday-date { color: #ad7184; font: 16px Georgia, serif; letter-spacing: 2px; }
.handwritten { margin-top: 25px; color: #a16a7d; font-family: "Segoe Print", "Comic Sans MS", cursive; font-size: 14px; transform: rotate(-1deg); }
.hero-copy h1 { margin-top: 12px; font-size: clamp(43px, 5vw, 67px); line-height: 1.24; letter-spacing: .03em; font-weight: 800; }
.hero-copy h1 em { color: var(--deep-rose); font-size: .92em; font-style: normal; position: relative; }
.hero-copy h1 em::after { content: ""; position: absolute; height: 10px; left: 1%; right: 1%; bottom: -4px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='10' viewBox='0 0 300 10'%3E%3Cpath d='M2 7c73-7 177 2 296-4' fill='none' stroke='%23ffb7c5' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") center / 100% 100% no-repeat; opacity: .7; }
.hero-intro { max-width: 31em; margin-top: 26px; color: var(--soft-ink); font-size: 16px; line-height: 2; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 13px; margin-top: 30px; }
.pill-button { display: inline-flex; justify-content: center; align-items: center; gap: 8px; min-height: 46px; padding: 11px 24px; border: 1px solid transparent; border-radius: 999px; font: 600 14px/1.5 "YouYuan", "幼圆", "PingFang SC", "Microsoft YaHei", sans-serif; cursor: pointer; transition: all .3s ease-in-out; }
.primary-button { color: #74364b; background: var(--pink); box-shadow: 0 5px 18px rgba(255, 183, 197, .48); }
.secondary-button { color: var(--deep-rose); background: rgba(255, 255, 255, .8); border-color: rgba(255, 183, 197, .55); }
.pill-button:hover { transform: scale(1.04); box-shadow: 0 7px 28px rgba(255, 183, 197, .55); text-decoration: none; }
.pill-button:active { transform: scale(.96); }
.archive-count { margin-top: 23px; font-size: 12px; color: #806e79; }
.archive-count span { color: var(--deep-rose); font-family: Georgia, serif; font-size: 17px; }
.archive-count i { margin-inline: 7px; color: #c695a5; font-style: normal; }
.hero-scrapbook { position: relative; padding: 15px 15px 45px; transform: rotate(1.4deg); }
.main-photo { display: block; width: 100%; padding: 13px 13px 0; border: 2px solid rgba(255, 183, 197, .23); border-radius: 7px 7px 25px 7px; background: #fff; box-shadow: 0 18px 50px rgba(185, 121, 142, .2); cursor: zoom-in; transition: all .3s ease-in-out; }
.main-photo:hover { transform: scale(1.015); box-shadow: 0 20px 60px rgba(255, 183, 197, .4); }
.main-photo img { display: block; width: 100%; border-radius: 3px 3px 15px 3px; }
.photo-caption { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 17px 9px 20px; text-align: left; }
.photo-caption b { color: var(--ink); font-size: 16px; }
.photo-caption small { color: #a77988; font-family: "Segoe Print", cursive; font-size: 11px; }
.tape { position: absolute; z-index: 3; width: 112px; height: 30px; background: rgba(253, 230, 138, .55); box-shadow: inset 0 0 8px rgba(255, 255, 255, .5); }
.tape-top { top: 1px; left: 40%; transform: rotate(-4deg); }
.gif-teaser { position: absolute; z-index: 4; right: -20px; bottom: -13px; display: flex; align-items: center; gap: 11px; width: 290px; padding: 9px 14px 9px 9px; border: 2px solid #fff; border-radius: 20px; background: #fff8fa; color: var(--ink); box-shadow: 0 8px 28px rgba(157, 72, 98, .2); text-align: left; cursor: pointer; transform: rotate(-4deg); transition: all .3s ease-in-out; }
.gif-teaser:hover { transform: rotate(-1deg) scale(1.05); box-shadow: 0 8px 32px rgba(255, 183, 197, .55); }
.gif-teaser img { width: 92px; height: 67px; object-fit: cover; border-radius: 12px; }
.gif-teaser span { font-size: 11px; line-height: 1.8; }
.gif-teaser b { display: block; color: var(--deep-rose); font-size: 13px; }
.gold-sparkle { position: absolute; width: 23px; height: 23px; background: var(--gold); clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); filter: drop-shadow(0 0 6px #fde68a); animation: twinkle 2.8s ease-in-out infinite; }
.sparkle-one { top: -8px; right: 4%; }
.sparkle-two { width: 14px; height: 14px; bottom: 24px; left: -14px; animation-delay: -1s; }
.wish-ribbon-section { position: relative; padding: 40px 0 36px; background: #ffe4eb; text-align: center; }
.lace-edge { position: absolute; left: 0; right: 0; height: 12px; background-image: radial-gradient(circle at 12px 12px, #ffe4eb 7px, transparent 7.5px); background-size: 24px 12px; background-repeat: repeat-x; }
.lace-top { top: -11px; }
.lace-bottom { bottom: -11px; transform: rotate(180deg); }
.section-ribbon { display: inline-block; padding: 7px 36px; background: var(--pink); color: #7d3d51; clip-path: polygon(0 50%, 5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%); font-size: 12px; font-weight: 800; letter-spacing: 2px; filter: drop-shadow(0 4px 8px rgba(255, 183, 197, .45)); }
.wish-content > p { margin: 20px auto 10px; font-size: clamp(17px, 2vw, 22px); font-weight: 700; }
.wish-keywords { display: flex; justify-content: center; align-items: center; gap: 20px; color: #8a5969; font-size: 13px; }
.wish-keywords i { color: #d77f98; font-style: normal; }
.memory-section { padding-block: 105px 90px; scroll-margin-top: 90px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 30px; }
.section-kicker { color: #b16c82; font-family: "Segoe Print", "Comic Sans MS", cursive; font-size: 12px; letter-spacing: 1px; }
.section-heading h2, .letter-copy h2 { margin-top: 8px; font-size: clamp(30px, 4vw, 43px); line-height: 1.35; }
.section-heading p { margin-top: 9px; color: var(--soft-ink); font-size: 14px; }
.heading-flower { width: 64px; height: 64px; fill: #ffe0e8; stroke: #dd8ca3; stroke-width: .8; transform: rotate(12deg); }
.memory-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 32px 0 24px; padding-bottom: 14px; border-bottom: 1px dashed #e6b7c4; }
.filter-list { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-list button { padding: 7px 17px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: #806471; font: 500 13px "YouYuan", "幼圆", "Microsoft YaHei", sans-serif; cursor: pointer; transition: all .3s ease-in-out; }
.filter-list button:hover { background: #ffe6ed; }
.filter-list button.active { border-color: rgba(255, 183, 197, .55); background: #fff; color: var(--deep-rose); box-shadow: 0 3px 12px rgba(255, 183, 197, .25); }
.memory-toolbar > span { flex-shrink: 0; color: #987482; font-size: 12px; }
.memory-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 22px; }
.memory-card { grid-column: span 4; align-self: start; display: block; padding: 9px; overflow: hidden; border: 2px solid rgba(255, 183, 197, .2); border-radius: 20px; background: #fff; box-shadow: 0 5px 20px rgba(255, 183, 197, .15); color: var(--ink); text-align: left; cursor: zoom-in; transition: all .3s ease-in-out; }
.memory-card.featured { grid-column: span 8; }
.memory-card:hover { transform: scale(1.025) rotate(-.35deg); border-color: rgba(255, 183, 197, .5); box-shadow: 0 9px 32px rgba(255, 183, 197, .35); }
.memory-image { display: block; overflow: hidden; border-radius: 12px; background: #ffeef2; }
.memory-image img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: contain; transition: transform .5s ease-in-out; }
.memory-card:hover img { transform: scale(1.025); }
.memory-info { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 7px 5px; }
.memory-info small { display: block; color: #b07c8c; font-family: Georgia, serif; font-size: 10px; letter-spacing: 1px; }
.memory-info b { display: block; margin-top: 2px; font-size: 14px; }
.memory-info i { display: grid; place-items: center; width: 29px; height: 29px; flex-shrink: 0; border-radius: 50%; background: #fff0f4; color: var(--deep-rose); font-style: normal; transition: all .3s ease-in-out; }
.memory-card:hover .memory-info i { background: var(--pink); transform: rotate(10deg); }
.birthday-letter { padding-bottom: 110px; }
.letter-card { position: relative; display: grid; grid-template-columns: 1fr; align-items: start; gap: 0; padding: 48px 54px 44px; border: 2px solid rgba(255, 183, 197, .24); border-radius: 30px; background-color: #fff; background-image: radial-gradient(circle, rgba(255, 183, 197, .17) .6px, transparent .8px); background-size: 11px 11px; box-shadow: 0 10px 40px rgba(255, 183, 197, .22); }
.letter-card::before, .letter-card::after { content: "✿"; position: absolute; color: #e3a0b2; font-size: 26px; }
.letter-card::before { top: 13px; left: 16px; }
.letter-card::after { right: 16px; bottom: 13px; }
.letter-stamp { position: absolute; top: 29px; right: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 68px; height: 78px; border: 2px dashed #e7a8b9; border-radius: 7px; background: #fff3f6; color: #d58299; font-size: 31px; transform: rotate(6deg); }
.letter-stamp small { font-size: 8px; letter-spacing: 1px; }
.letter-copy { max-width: 740px; margin-inline: auto; }
.letter-copy h2 { color: var(--deep-rose); }
.letter-copy p { margin-top: 18px; color: var(--soft-ink); font-size: 15px; line-height: 2.15; }
.letter-photo { position: relative; width: min(720px, 100%); margin: 34px auto 8px; padding: 12px 12px 10px; border: 2px solid rgba(255, 183, 197, .35); border-radius: 16px; background: #fff; box-shadow: 0 10px 32px rgba(255, 183, 197, .3); transform: rotate(-1.2deg); }
.letter-photo.narrow { width: min(460px, 92%); transform: rotate(1.4deg); }
.letter-photo.tiny { width: min(400px, 62%); transform: rotate(1.8deg); }
.letter-photo img { display: block; width: 100%; border-radius: 9px; background: #fff5f7; }
.letter-photo figcaption { margin-top: 10px; color: #a77988; font-family: "Segoe Print", "Comic Sans MS", cursive; font-size: 12px; text-align: center; }
.photo-tape { position: absolute; z-index: 2; top: -13px; left: 50%; width: 116px; height: 27px; background: rgba(253, 230, 138, .55); box-shadow: inset 0 0 8px rgba(255, 255, 255, .5); transform: translateX(-50%) rotate(-3deg); }
.letter-signature { margin-top: 19px; color: #a75d74; font-size: 13px; text-align: right; }
.letter-signature span { margin-left: 8px; font-size: 20px; }
.letter-action { display: flex; flex-direction: column; align-items: center; gap: 11px; margin-top: 30px; padding-bottom: 10px; }
.tiny-note { color: #9f7c88; font-size: 11px; }
.birthday-footer { display: flex; flex-direction: column; align-items: center; padding: 35px 24px 38px; border-top: 2px solid rgba(255, 183, 197, .2); background: #ffe8ee; text-align: center; }
.birthday-footer img { width: 45px; height: 45px; padding: 2px; border: 2px solid #fff; border-radius: 50%; object-fit: cover; box-shadow: 0 3px 14px rgba(255, 183, 197, .35); }
.birthday-footer p { margin-top: 9px; color: var(--deep-rose); font-size: 14px; font-weight: 700; }
.birthday-footer span { margin-top: 3px; color: #946878; font-size: 11px; }
.photo-modal, .surprise-modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 60px 100px; overflow: hidden; background: rgba(91, 61, 72, .65); backdrop-filter: blur(7px); }
.photo-modal figure { width: min(1100px, 100%); max-height: calc(100vh - 120px); margin: 0; padding: 12px; border-radius: 22px; background: #fff; box-shadow: 0 10px 50px rgba(91, 61, 72, .25); }
.photo-modal figure img { display: block; width: 100%; max-height: calc(100vh - 205px); object-fit: contain; border-radius: 13px; background: #fff5f7; }
.photo-modal figcaption { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; padding: 13px 9px 2px; color: #8f6977; }
.photo-modal figcaption span { font: 12px Georgia, serif; }
.photo-modal figcaption b { color: var(--ink); font-size: 15px; }
.photo-modal figcaption small { text-align: right; }
.modal-close, .surprise-close { position: absolute; display: grid; place-items: center; width: 42px; height: 42px; border: 2px solid rgba(255, 255, 255, .7); border-radius: 50%; background: #fff0f4; color: #88485d; font-size: 27px; line-height: 1; cursor: pointer; transition: all .3s ease-in-out; }
.modal-close { top: 20px; right: 24px; }
.modal-close:hover, .surprise-close:hover { transform: rotate(8deg) scale(1.08); box-shadow: 0 0 20px rgba(255, 183, 197, .5); }
.modal-arrow { position: absolute; top: 50%; display: grid; place-items: center; width: 52px; height: 64px; border: 2px solid rgba(255, 255, 255, .6); border-radius: 999px; background: #fff0f4; color: #88485d; font-size: 38px; cursor: pointer; transform: translateY(-50%); transition: all .3s ease-in-out; }
.modal-arrow:hover { transform: translateY(-50%) scale(1.06); background: var(--pink); }
.modal-arrow.previous { left: 25px; }
.modal-arrow.next { right: 25px; }
.surprise-card { position: relative; width: min(610px, 100%); max-height: calc(100vh - 60px); overflow-y: auto; padding: 30px 40px 32px; border: 2px solid rgba(255, 183, 197, .3); border-radius: 30px; background-color: var(--pearl); background-image: radial-gradient(circle, rgba(255, 183, 197, .22) .7px, transparent .8px); background-size: 11px 11px; box-shadow: 0 15px 60px rgba(91, 61, 72, .25); text-align: center; }
.surprise-close { top: 13px; right: 13px; z-index: 2; width: 36px; height: 36px; border-color: #f1c7d2; }
.animation-frame { width: min(440px, 100%); margin: 22px auto 20px; padding: 9px; border: 2px solid #fff; border-radius: 23px; background: #fff; box-shadow: 0 7px 25px rgba(255, 183, 197, .35); transform: rotate(-1deg); }
.animation-frame img { display: block; width: 100%; border-radius: 15px; }
.surprise-card h2 { color: var(--deep-rose); font-size: 26px; }
.surprise-card p { margin-top: 10px; color: var(--soft-ink); font-size: 14px; line-height: 2; }
.surprise-card strong { color: #a54b66; }
.surprise-date { display: inline-block; margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e2aabc; color: #b06f83; font: 12px Georgia, serif; letter-spacing: 2px; }
.surprise-sparkle { right: 25px; bottom: 26px; }
.birthday-toast { position: fixed; z-index: 120; left: 50%; bottom: 28px; width: max-content; max-width: calc(100% - 32px); padding: 12px 24px; border: 2px solid rgba(255, 183, 197, .4); border-radius: 999px; background: #fff; color: var(--deep-rose); box-shadow: 0 6px 25px rgba(157, 72, 98, .2); font-size: 13px; text-align: center; transform: translateX(-50%); }
.falling-petal { position: absolute; z-index: 1; width: 13px; height: 18px; border-radius: 50% 0 50% 50%; background: #ffc9d5; opacity: .7; pointer-events: none; animation: petal-drift 15s ease-in-out infinite; }
.birthday-page button:focus-visible, .birthday-page a:focus-visible { outline: 3px solid #b46b82; outline-offset: 4px; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .3s ease-in-out; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active { transition: transform .38s ease-in-out, opacity .38s ease-in-out; }
.slide-left-enter-from { transform: translateX(70px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-70px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-70px); opacity: 0; }
.slide-right-leave-to { transform: translateX(70px); opacity: 0; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all .3s ease-in-out; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translate(-50%, 10px); }
@keyframes petal-drift { 0%, 100% { transform: translate(0, -8px) rotate(15deg); } 50% { transform: translate(22px, 25px) rotate(145deg); } }
@keyframes record-spin { to { transform: rotate(360deg); } }
@keyframes twinkle { 0%, 100% { transform: scale(.75) rotate(0); opacity: .65; } 50% { transform: scale(1.12) rotate(20deg); opacity: 1; } }
@media (max-width: 1000px) {
  .birthday-hero { gap: 35px; }
  .hero-copy h1 { font-size: 47px; }
  .gif-teaser { right: -5px; width: 260px; }
  .memory-card { grid-column: span 6; }
  .memory-card.featured { grid-column: span 12; }
}
@media (max-width: 760px) {
  .birthday-shell { width: min(100% - 34px, 620px); }
  .nav-inner { min-height: 68px; }
  .birthday-brand img { width: 40px; height: 40px; }
  .birthday-brand b { font-size: 14px; }
  .birthday-brand small { display: none; }
  .music-player { padding: 2px; }
  .music-meta { display: none; }
  .birthday-nav-links { gap: 4px; }
  .birthday-nav-links a { padding: 7px 12px; font-size: 12px; }
  .birthday-hero { grid-template-columns: 1fr; gap: 45px; padding-block: 52px 85px; }
  .hero-copy { text-align: center; }
  .recipient-line { justify-content: center; }
  .hero-copy h1 { font-size: clamp(39px, 10vw, 54px); }
  .hero-intro { margin-inline: auto; }
  .hero-actions { justify-content: center; }
  .hero-scrapbook { width: min(560px, 96%); margin-inline: auto; }
  .gif-teaser { right: -8px; }
  .wish-content > p { font-size: 16px; }
  .wish-keywords { gap: 10px; font-size: 12px; }
  .memory-section { padding-block: 90px 65px; }
  .letter-card { padding: 45px 28px 35px; }
  .letter-stamp { top: 22px; right: 24px; width: 55px; height: 65px; }
  .photo-modal { padding: 70px 18px; }
  .modal-arrow { top: auto; bottom: 17px; width: 48px; height: 48px; font-size: 30px; }
  .modal-arrow.previous { left: calc(50% - 62px); }
  .modal-arrow.next { right: calc(50% - 62px); }
  .photo-modal figure { max-height: calc(100vh - 150px); }
  .photo-modal figure img { max-height: calc(100vh - 240px); }
  .photo-modal figcaption { grid-template-columns: 1fr auto; }
  .photo-modal figcaption b { grid-column: 1 / -1; grid-row: 1; text-align: center; }
  .surprise-modal { padding: 22px 16px; }
  .surprise-card { padding: 28px 20px; }
  .surprise-card h2 { font-size: 23px; }
}
@media (max-width: 480px) {
  .nav-inner { gap: 8px; }
  .birthday-brand { gap: 8px; }
  .birthday-brand b { font-size: 13px; letter-spacing: 0; }
  .birthday-nav-links a:first-child { display: none; }
  .birthday-nav-links a:last-child { padding-inline: 10px; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .pill-button { width: 100%; }
  .hero-scrapbook { padding-inline: 3px; }
  .main-photo { padding: 8px 8px 0; }
  .photo-caption { padding: 13px 5px 17px; }
  .photo-caption small { display: none; }
  .gif-teaser { width: 240px; bottom: -25px; }
  .gif-teaser img { width: 77px; height: 58px; }
  .memory-toolbar { align-items: flex-end; }
  .filter-list { gap: 3px; }
  .filter-list button { padding: 7px 11px; font-size: 12px; }
  .memory-grid { gap: 14px; }
  .memory-card, .memory-card.featured { grid-column: span 12; }
  .section-heading { align-items: flex-start; }
  .heading-flower { width: 48px; height: 48px; }
  .letter-copy h2 { font-size: 30px; }
  .letter-stamp { opacity: .55; }
  .surprise-card p br { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .falling-petal, .gold-sparkle, .music-player.playing .vinyl-record { animation: none; }
  .birthday-page *, .birthday-page *::before, .birthday-page *::after { scroll-behavior: auto; transition-duration: .01ms; }
}
</style>
