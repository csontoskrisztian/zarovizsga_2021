<template>
  <div class="w3-text-theme w3-theme-light p-5">
      <h1 class="display-3 border-bottom border-5 fst-italic fw-bold">Mi az a <span class="bubblefont fw-normal">Match3!</span> ?</h1>
      <h2 class="w3-theme-l1 p-3 mt-5 rounded-top">Ingyenesen játszható!</h2>
      <img src="@/assets/regisztracio.png" alt="Valami kép" title="Valami kép" class="rounded mb-3 mx-auto d-block border border-3 p-1 border-theme img-fluid">
      <ul class="list-group">
        <li class="list-group-item w3-theme-l4">Regisztrálj vagy jelentkezz be az ingyenes fiókodba és játsz több millió játékossal!</li>
        <li class="list-group-item w3-theme-l4">Annyira könnyű játszani, hogy akár most azonnal is belekezdhetsz!</li>
        <li class="list-group-item w3-theme-l4">Nem kell letölteni semmit!</li>
        <li class="list-group-item w3-theme-l4">Játsz bármikor és bárhonnan, számítógépen vagy akár telefonon!</li>
      </ul>
      <h2 class="w3-theme-l1 p-3 mt-5 rounded-top">Párosíts!</h2>
       <img src="@/assets/jatek.png" alt="Valami kép" title="Valami kép" class="rounded mb-3 mx-auto d-block border border-3 p-1 border-theme img-fluid">
      <ul class="list-group">
        <li class="list-group-item w3-theme-l4">Válaszd ki te magad mennyi ideig szeretnél játszani!</li>
        <li class="list-group-item w3-theme-l4">Játsz a barátaiddal vagy bárkivel a világ bármelyik pontjáról!</li>
        <li class="list-group-item w3-theme-l4">Szabd a nehézséget a saját szintedhez!</li>
      </ul>
      <h2 class="w3-theme-l1 p-3 mt-5 rounded-top">Légy a legjobb!</h2>
       <img src="@/assets/toplista.png" alt="Valami kép" title="Valami kép" class="rounded mb-3 mx-auto d-block border border-3 p-1 border-theme img-fluid">
      <ul class="list-group">
        <li class="list-group-item w3-theme-l4">Gyűjts pontokat minden játék alkalmával!</li>
        <li class="list-group-item w3-theme-l4">Kerülj a ranglista élére!</li>
        <li class="list-group-item w3-theme-l4">És vígyázz, hogy ne köss ki a legalján!</li>
      </ul>
  </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style>
.w-content {
  width: fit-content;
}

.border-theme {
  border-color:#673ab7 !important
}
</style>