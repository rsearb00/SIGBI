<template>
  <v-app-bar app clipped-left dark color="#4D5E9C">

<v-spacer></v-spacer>
<v-toolbar-title class="white--text">{{title}} {{ idUsuario }}?</v-toolbar-title>
    <v-spacer></v-spacer>
 

    <v-btn
      class="black--text ma-5"
      color="white"
      @click="clickeoCerrarSesion()"
    >
      <v-icon color="#4D5E9C" left>mdi-login</v-icon>Cerrar Sesión
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
   title: "¿Qué te apetece hacer hoy, "
  }),
  props: {
    idUsuario: { type: String, default: "ERROR" }
  },
  components: {},
  methods: {
    clickeoCerrarSesion: function() {
      this.$router.push("/");
    },
  }
};
</script>