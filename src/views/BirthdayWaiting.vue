<script setup>
const petals = [
  ['6%', '8%', '-4s', '14s'], ['17%', '22%', '-9s', '17s'], ['29%', '5%', '-1s', '15s'],
  ['43%', '15%', '-12s', '19s'], ['58%', '4%', '-6s', '14s'], ['72%', '18%', '-15s', '18s'],
  ['88%', '7%', '-8s', '16s'], ['81%', '36%', '-3s', '17s'], ['4%', '42%', '-11s', '19s'],
]
</script>

<template>
  <div class="waiting-page">
    <header class="waiting-nav">
      <div class="waiting-shell nav-inner">
        <router-link to="/" class="waiting-brand" aria-label="返回小站首页">
          <span class="brand-flower" aria-hidden="true">✿</span>
          <span><b>樱花生日手账</b><small>SAKURA BIRTHDAY ALBUM</small></span>
        </router-link>
        <nav aria-label="生日手账导航">
          <router-link to="/" class="back-link"><span aria-hidden="true">←</span> 返回小站</router-link>
        </nav>
      </div>
    </header>

    <span
      v-for="(petal, index) in petals"
      :key="index"
      class="falling-petal"
      :style="{ left: petal[0], top: petal[1], animationDelay: petal[2], animationDuration: petal[3] }"
      aria-hidden="true"
    ></span>

    <main class="waiting-shell waiting-main">
      <section class="waiting-card" aria-labelledby="waiting-title">
        <span class="tape tape-left" aria-hidden="true"></span>
        <span class="tape tape-right" aria-hidden="true"></span>

        <div class="envelope" aria-hidden="true">
          <span class="envelope-body"></span>
          <span class="envelope-flap"></span>
          <span class="wax-seal">✿</span>
        </div>

        <p class="waiting-kicker">The next chapter is on its way</p>
        <h1 id="waiting-title">这一页手账，<br><em>正在等待新的主角</em></h1>
        <p class="waiting-copy">上一本已经好好收进樱花树下，新的一页还留着淡淡的花香。<br>等到下一位寿星出现，这里会重新亮起烛光。</p>
        <p class="waiting-status"><span aria-hidden="true">✦</span> 等待下一位新的寿星 <span aria-hidden="true">✦</span></p>
        <div class="waiting-actions">
          <router-link to="/" class="waiting-button">先回小站逛逛 <span aria-hidden="true">→</span></router-link>
        </div>
      </section>
    </main>

    <footer class="waiting-footer">樱花生日手账 · 每一页都为特别的人留着</footer>
  </div>
</template>

<style scoped>
.waiting-page {
  --pink: #ffb7c5;
  --pearl: #fff5f7;
  --gold: #fde68a;
  --ink: #4a3f49;
  --soft-ink: #746572;
  --deep-rose: #9d4862;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  color: var(--ink);
  background-color: var(--pearl);
  background-image: radial-gradient(circle, rgba(255, 183, 197, .16) .7px, transparent .8px);
  background-size: 12px 12px;
}
.waiting-shell { width: min(1160px, calc(100% - 64px)); margin-inline: auto; }
.waiting-nav { position: sticky; top: 0; z-index: 50; border-bottom: 2px solid rgba(255, 183, 197, .22); background: #fff8fa; box-shadow: 0 3px 16px rgba(255, 183, 197, .13); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 76px; }
.waiting-brand { display: flex; align-items: center; gap: 12px; color: var(--ink); }
.waiting-brand:hover { text-decoration: none; }
.brand-flower { display: grid; place-items: center; width: 46px; height: 46px; border: 2px solid #ffd4df; border-radius: 50%; background: #fff; color: #d97f98; font-size: 21px; box-shadow: 0 3px 12px rgba(255, 183, 197, .28); transition: transform .3s ease-in-out; }
.waiting-brand:hover .brand-flower { transform: rotate(-8deg) scale(1.06); }
.waiting-brand span:last-child { display: flex; flex-direction: column; }
.waiting-brand b { color: var(--deep-rose); font-size: 16px; letter-spacing: 1px; }
.waiting-brand small { color: #aa7c8b; font-family: "Segoe Print", cursive; font-size: 8px; letter-spacing: 1px; }
.back-link { display: inline-block; padding: 8px 17px; border: 1px solid #f2cbd6; border-radius: 999px; background: #fff; color: #875468; font-size: 13px; transition: all .3s ease-in-out; }
.back-link:hover { background: #ffe8ee; color: var(--deep-rose); text-decoration: none; }

.waiting-main { flex: 1; display: grid; place-items: center; padding-block: 72px 82px; }
.waiting-card { position: relative; width: min(640px, 100%); padding: 62px 64px 54px; border: 2px solid rgba(255, 183, 197, .32); border-radius: 30px; background: #fffdfd; box-shadow: 0 18px 55px rgba(185, 121, 142, .18); text-align: center; }
.waiting-card::before { content: ""; position: absolute; inset: 12px; border: 1px dashed rgba(230, 183, 196, .7); border-radius: 22px; pointer-events: none; }
.tape { position: absolute; z-index: 2; width: 96px; height: 27px; background: rgba(253, 230, 138, .58); box-shadow: inset 0 0 8px rgba(255, 255, 255, .5); }
.tape-left { top: -11px; left: 46px; transform: rotate(-6deg); }
.tape-right { top: -9px; right: 48px; transform: rotate(5deg); }

.envelope { position: relative; width: 128px; height: 88px; margin: 6px auto 30px; filter: drop-shadow(0 10px 18px rgba(185, 121, 142, .18)); }
.envelope-body { position: absolute; inset: 0; border: 2px solid #f2cbd6; border-radius: 10px; background: #fff; }
.envelope-body::after { content: ""; position: absolute; left: 8px; right: 8px; bottom: 9px; height: 1px; background: repeating-linear-gradient(90deg, #f6d4dd 0 8px, transparent 8px 15px); }
.envelope-flap { position: absolute; top: 1px; left: 1px; right: 1px; height: 58%; background: #ffeaf0; border-radius: 9px 9px 0 0; clip-path: polygon(0 0, 100% 0, 50% 100%); }
.wax-seal { position: absolute; left: 50%; top: 55%; display: grid; place-items: center; width: 42px; height: 42px; border: 2px solid #f7c6d3; border-radius: 50%; background: radial-gradient(circle at 34% 28%, #e888a0, #c95d7c); color: #fff2f6; font-size: 18px; transform: translate(-50%, -50%); box-shadow: 0 4px 10px rgba(157, 72, 98, .28); }

.waiting-kicker { color: #b16c82; font-family: "Segoe Print", "Comic Sans MS", cursive; font-size: 12px; letter-spacing: 1px; transform: rotate(-1deg); }
.waiting-card h1 { margin-top: 14px; font-size: clamp(32px, 4.4vw, 46px); line-height: 1.34; letter-spacing: .03em; font-weight: 800; }
.waiting-card h1 em { color: var(--deep-rose); font-style: normal; position: relative; }
.waiting-card h1 em::after { content: ""; position: absolute; left: 1%; right: 1%; bottom: -5px; height: 10px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='10' viewBox='0 0 300 10'%3E%3Cpath d='M2 7c73-7 177 2 296-4' fill='none' stroke='%23ffb7c5' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") center / 100% 100% no-repeat; opacity: .7; }
.waiting-copy { margin-top: 24px; color: var(--soft-ink); font-size: 15px; line-height: 2.1; }
.waiting-status { display: inline-flex; align-items: center; gap: 12px; margin-top: 26px; padding: 9px 24px; border: 1px solid rgba(255, 183, 197, .55); border-radius: 999px; background: #fff5f8; color: var(--deep-rose); font-size: 14px; font-weight: 700; letter-spacing: 1px; box-shadow: 0 4px 16px rgba(255, 183, 197, .2); }
.waiting-status span { color: #e39aaf; font-size: 12px; }
.waiting-actions { margin-top: 28px; }
.waiting-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 11px 28px; border-radius: 999px; background: var(--pink); color: #74364b; font-size: 14px; font-weight: 600; box-shadow: 0 5px 18px rgba(255, 183, 197, .48); transition: all .3s ease-in-out; }
.waiting-button:hover { text-decoration: none; transform: scale(1.04); box-shadow: 0 7px 28px rgba(255, 183, 197, .55); }
.waiting-button:active { transform: scale(.96); }
.waiting-footer { position: relative; z-index: 1; padding: 22px 17px 28px; border-top: 1px dashed #e6b7c4; color: #a17b88; font-size: 12px; text-align: center; }
.falling-petal { position: absolute; z-index: 1; width: 13px; height: 18px; border-radius: 50% 0 50% 50%; background: #ffc9d5; opacity: .7; pointer-events: none; animation: petal-drift 16s ease-in-out infinite; }
.waiting-page a:focus-visible { outline: 3px solid #b46b82; outline-offset: 4px; }
@keyframes petal-drift { 0%, 100% { transform: translate(0, -8px) rotate(15deg); } 50% { transform: translate(22px, 25px) rotate(145deg); } }
@media (max-width: 760px) {
  .waiting-shell { width: min(100% - 34px, 620px); }
  .nav-inner { min-height: 68px; gap: 10px; }
  .brand-flower { width: 40px; height: 40px; font-size: 18px; }
  .waiting-brand b { font-size: 14px; }
  .waiting-brand small { display: none; }
  .back-link { padding: 7px 12px; font-size: 12px; }
  .waiting-main { padding-block: 46px 60px; }
  .waiting-card { padding: 46px 26px 40px; border-radius: 24px; }
  .waiting-copy br { display: none; }
  .tape { width: 74px; }
  .tape-left { left: 18px; }
  .tape-right { right: 20px; }
}
@media (max-width: 480px) {
  .waiting-brand { gap: 8px; }
  .waiting-brand b { font-size: 13px; letter-spacing: 0; }
  .waiting-card h1 { font-size: 31px; }
}
@media (prefers-reduced-motion: reduce) {
  .falling-petal { animation: none; }
  .waiting-page *, .waiting-page *::before, .waiting-page *::after { transition-duration: .01ms; }
}
</style>
