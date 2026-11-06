import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Post from './views/Post.vue'
import About from './views/About.vue'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', component: Home },
    { path: '/post/:slug', component: Post },
    { path: '/about', component: About },
    { path: '/:pathMatch(.*)*', component: Home },
  ],
})

export default router
