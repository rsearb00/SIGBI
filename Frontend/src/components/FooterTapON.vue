<template>
  <v-footer app dark padless inset>
    <v-card class="flex" flat tile>
      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} - @<strong>TapO'N</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<script>
/* Pruebas
  <v-card-title class="teal">
        <strong class="subheading">¡Síguenos en redes!</strong>

        <v-spacer></v-spacer>

        <v-btn v-for="icon in icons" :key="icon" class="mx-4" dark icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-title>



<v-btn v-for="palabra in palabras" :key="palabra" class="mx-8" dark icon>
          <v-icon size="10 px">
            {{ palabra }}
          </v-icon>
        </v-btn>

*/

export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"]
  })
};
</script>
