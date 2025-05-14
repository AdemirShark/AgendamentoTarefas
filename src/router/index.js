// JavaScript source code
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListaUsers from '../views/ListaUsers.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/lista', component: ListaUsers },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
