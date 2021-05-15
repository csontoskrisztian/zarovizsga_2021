import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"

const axios = require("axios").default;
axios.defaults.withCredentials = true;

function getUser(to, from, next) {
    axios
        .get("http://localhost/zarovizsga_2021/backend/index.php", {
            params: {
                query: "getUser",
            },
        })
        .then((res) => {
            let loginAccessLevel = res.data.loginAccessLevel;

            console.log(from);
            console.log(to);
            console.log(router.app.$root.loginAccessLevel);
            if (to.name !== 'bejelentkezes' && to.name !== 'regisztracio' && to.name != 'home' && loginAccessLevel == 0) {
                console.log("If ág");
                next({
                    name: 'bejelentkezes'
                });
            } else {
                console.log("Else ág");
                next();
            }
        });
}

//route konfiguráció importálása
import RouteConfig from './config/routes.js'

//route indítása
const router = new VueRouter({
    routes: RouteConfig
});
router.beforeEach((to, from, next) => {
    getUser(to, from, next);
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
    }
}).$mount('#app')