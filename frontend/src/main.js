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

router.beforeEach(async (to, from, next) => {
    await getUser();
    // await Vue.nextTick();
    // console.log(from);
    // console.log(to);
    // console.log(router.app.$root);
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (router.app.$root.loginAccessLevel == 0) {
            next({
                name: 'bejelentkezes'
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.logedInInvisible)) {
        if (router.app.$root.loginAccessLevel > 0) {
            next({
                name: 'home'
            });
        } else {
            next();
        }
    } else next();
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
    }
})

async function getUser() {
    await axios
        .get("http://localhost/zarovizsga_2021/backend/index.php", {
            params: {
                query: "getUser",
            },
        })
        .then((res) => {
            // console.log(res);
            app.loginAccessLevel = res.data.loginAccessLevel;
            app.loginUserName = res.data.loginUserName;
            app.loginId = res.data.loginId;
            app.loginProfilePicture = res.data.loginProfilePicture;
            app.loginEmail = res.data.loginEmail;
        }).catch(function (error) {
            router.push({name: "error_500", params: {error: error}});
        });
}

router.onReady(() => app.$mount('#app'));