//1. a routes komponensek
import Home from "../components/routes/Home.vue";
import Profil from "../components/routes/Profil.vue";
import BaratokLista from "../components/routes/BaratokLista.vue";
import BaratokKereses from "../components/routes/BaratokKereses.vue";
import Jatszmak from "../components/routes/Jatszmak.vue";
import Jatek from "../components/routes/Jatek.vue";
import Bejelentkezes from "../components/routes/Bejelentkezes.vue"
import Regisztracio from "../components/routes/Regisztracio.vue"
import Toplista from "../components/routes/Toplista.vue"
import _404 from "../components/routes/404.vue"
import _500 from "../components/routes/500.vue"

// import AlapadatokAutok from "../components/routes/AlapadatokAutok.vue";
// import AlapadatokBerlok from "../components/routes/AlapadatokBerlok.vue";
// import Kolcsonzes from "../components/routes/Kolcsonzes.vue";
// import Kimutatasok from "../components/routes/Kimutatasok.vue";
// import Kapcsolat from "../components/routes/Kapcsolat.vue";
// import ModalValidate from "../components/routes/ModalValidate.vue";


//2. route - komponenes hozzárendelés
const routes = [{
        name: "home",
        path: "/",
        component: Home,
        meta: {
            requiresAuth: false,
            logedInInvisible: false
        }
    },
    {
        name: "profil",
        path: "/profil/",
        component: Profil,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "baratokLista",
        path: "/baratok/lista",
        component: BaratokLista,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "baratokKereses",
        path: "/baratok/kereses",
        component: BaratokKereses,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "jatszmak",
        path: "/jatszmak/",
        component: Jatszmak,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "jatek",
        path: "/jatek/",
        component: Jatek,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "bejelentkezes",
        path: "/bejelentkezes/",
        component: Bejelentkezes,
        meta: {
            requiresAuth: false,
            logedInInvisible: true
        }
    },
    {
        name: "regisztracio",
        path: "/regisztracio/",
        component: Regisztracio,
        meta: {
            requiresAuth: false,
            logedInInvisible: true
        }
    },
    {
        name: "toplista",
        path: "/toplista/",
        component: Toplista,
        meta: {
            requiresAuth: true,
            logedInInvisible: false
        }
    },
    {
        name: "error_404",
        path: "*",
        component: _404,
        meta: {
            requiresAuth: false,
            logedInInvisible: false
        }
    },
    {
        name: "error_500",
        path: "/error",
        component: _500,
        meta: {
            requiresAuth: false,
            logedInInvisible: false
        },
        props: true
    }
];

//3. Export, hogy kívülről elérhető legyen
export default routes;