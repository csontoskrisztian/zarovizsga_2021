//1. a routes komponensek
import Home from "../components/routes/Home.vue";
import Profil from "../components/routes/Profil.vue";
import BaratokLista from "../components/routes/BaratokLista.vue";
import BaratokKereses from "../components/routes/BaratokKereses.vue";
import Jatek from "../components/routes/Jatek.vue";
import Bejelentkezes from "../components/routes/Bejelentkezes.vue"

import Test from "../components/routes/Test.vue";
// import AlapadatokAutok from "../components/routes/AlapadatokAutok.vue";
// import AlapadatokBerlok from "../components/routes/AlapadatokBerlok.vue";
// import Kolcsonzes from "../components/routes/Kolcsonzes.vue";
// import Kimutatasok from "../components/routes/Kimutatasok.vue";
// import Kapcsolat from "../components/routes/Kapcsolat.vue";
// import ModalValidate from "../components/routes/ModalValidate.vue";


//2. route - komponenes hozzárendelés
const routes = [
    {
        name: "home",
        path: "/",
        component: Home
    },
    {
        name: "profil",
        path: "/profil/",
        component: Profil
    },
    {
        name: "baratokLista",
        path: "/baratok/lista",
        component: BaratokLista
    },
    {
        name: "baratokKereses",
        path: "/baratok/kereses",
        component: BaratokKereses
    },
    {
        name: "jatek",
        path: "/jatek/",
        component: Jatek
    },
    {
        name: "bejelentkezes",
        path: "/bejelentkezes/",
        component: Bejelentkezes
    },
    {
        name: "test",
        path: "/test/",
        component: Test
    }
    // {
    //     name: "alapadatokAutok",
    //     path: "/alapadatok/autok/",
    //     component: AlapadatokAutok
    // },
    // {
    //     name: "alapadatokBerlok",
    //     path: "/alapadatok/berlok/",
    //     component: AlapadatokBerlok
    // },
    // {
    //     name: "kolcsonzes",
    //     path: "/kolcsonzes/",
    //     component: Kolcsonzes
    // },
    // {
    //     name: "kimutatasok",
    //     path: "/kimutatasok/",
    //     component: Kimutatasok
    // },
    // {
    //     name: "kapcsolat",
    //     path: "/kapcsolat/",
    //     component: Kapcsolat
    // },
    // {
    //     name: "modalValidate",
    //     path: "/modalValidate/",
    //     component: ModalValidate
    // }
];

//3. Export, hogy kívülről elérhető legyen
export default routes;