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

const app = new Vue({
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
        this.getUser();
    },
    methods: {
        getUser() {
            axios
                .get(this.url, {
                    params: {
                        query: "getUser",
                    },
                })
                .then((res) => {
                    this.loginAccessLevel = res.data.loginAccessLevel;
                    this.loginUserName = res.data.loginUserName;
                    this.loginId = res.data.loginId;
                    this.loginProfilePicture = res.data.loginProfilePicture;
                    this.loginEmail = res.data.loginEmail;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }
});

router.onReady(() => app.$mount('#app'));

router.beforeEach((to, from, next) => {
    // await Vue.nextTick();
    // console.log(from);
    // console.log(to);
    // console.log(router.app.$root.loginAccessLevel);
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (router.app.$root.loginAccessLevel == 0) {
            // console.log("If ág");
            next({
                name: 'bejelentkezes'
            });
        } else {
            // console.log("Else ág");
            next();
        }
    } else next();
});