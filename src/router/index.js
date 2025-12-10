import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Home from '../views/Home.vue'
import ZoneDetail from '../views/ZoneDetail.vue'   // ⭐ Thêm dòng này
import Order from '../views/Order.vue'


const routes = [
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/home', component: Home },
    { path: '/zone/:id', component: ZoneDetail, name: 'ZoneDetail' },
    { path: '/order',name: 'order',component: Order,props: true},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
