import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"

const axios = require("axios").default;
axios.defaults.withCredentials = true;

//route konfiguráció importálása
import RouteConfig from './config/routes.js'

//route indítása
const router = new VueRouter({
    routes: RouteConfig
});

//A VueResource, VueRouter használatba vétele
Vue.use(VueRouter);


Vue.config.productionTip = false

Vue.mixin({
    data() {
        return {
            url: "http://localhost/zarovizsga_2021/backend/index.php",
        }
    },
});

new Vue({
    router: router,
    render: h => h(App),
    data: {
        loginAccessLevel: 0,
        loginId: 0,
        loginUserName: null,
        loginProfilePicture: "",
        loginEmail: "",
    },
    created() {
        router.beforeEach((to, from, next) => {
            if (to.name !== 'bejelentkezes' && to.name !== 'regisztracio' && to.name != 'home' && this.loginAccessLevel == 0) next({
                name: 'bejelentkezes'
            })
            else next()
        });
    },
}).$mount('#app')