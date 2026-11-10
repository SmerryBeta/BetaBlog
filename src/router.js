import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Post from './views/Post.vue'
import About from './views/About.vue'
import Birthday from './views/Birthday.vue'
import BirthdayWaiting from './views/BirthdayWaiting.vue'
import Tools from './views/Tools.vue'
import Encryptor from './views/Encryptor.vue'
import SecretNote from './views/SecretNote.vue'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    // 等旧页面先淡出再回顶，避免淡出过程中内容先跳走
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return new Promise((resolve) => setTimeout(() => resolve({ top: 0 }), reduced ? 0 : 250))
  },
  routes: [
    { path: '/', component: Home },
    { path: '/post/:slug', component: Post },
    { path: '/about', component: About },
    { path: '/tools', component: Tools },
    { path: '/tools/encrypt', component: Encryptor },
    { path: '/tools/note', component: SecretNote },
    { path: '/birthday', component: BirthdayWaiting, meta: { wide: true, standalone: true } },
    { path: '/birthday261109', component: Birthday, meta: { wide: true, standalone: true } },
    { path: '/:pathMatch(.*)*', component: Home },
  ],
})

export default router
