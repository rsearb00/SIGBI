<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />
    <div class="text-center">
      <v-btn class="ma-2" elevation="5" color="secondary" @click="tapa()">
        Buscar por Tapa
      </v-btn>
      <v-btn
        class="ma-2"
        elevation="5"
        color="secondary"
        @click="personalizada()"
      >
        Búsqueda personalizada
      </v-btn>
      <v-btn
        class="ma-2"
        elevation="5"
        color="secondary"
        @click="recomendacion()"
      >
        La recomendación de TapO'N
      </v-btn>
      <v-btn class="ma-2" elevation="5" color="secondary" @click="random()">
        Voy a tener suerte
      </v-btn>
    </div>

    <v-divider></v-divider>

    <FooterTapON />
  </v-app>
</template>

<script>
const axios = require("axios");
import ToolbarTapON from "@/components/ToolbarTapON";
import FooterTapON from "@/components/FooterTapON";
export default {
  props: {
    idUsuario: { type: String, default: "ERROR" }
  },
  components: {
    ToolbarTapON,
    FooterTapON
  },
  data: () => ({
    tapas: [],
    bares: []
  }),
  methods: {
    tapa: function() {
      this.$router.push({
        name: "Tapa",
        params: { idUsuario: this.idUsuario }
      });
    },
    personalizada: function() {
      this.$router.push({
        name: "Personalizada",
        params: { idUsuario: this.idUsuario }
      });
    },
    recomendacion: function() {
      this.$router.push({
        name: "Recomendacion",
        params: { idUsuario: this.idUsuario }
      });
    },
    random: function() {
      this.$router.push({
        name: "Random",
        params: { idUsuario: this.idUsuario }
      });
    },
    cargarTapas: function() {},
    cargarBares: function() {
      console.log("Intento de mostrar los bares");
      axios
        .post("http://localhost:3000/baresVisitados", {
          user: this.id
        })
        .then(response => {
          console.log("Datos recibidos: " + response);
          //Llamada exitosa
          if (response.data.ok == true) {
            this.bares = response.data.datos;
            /* this.usuarios.forEach((user, i) => {
              if (user.id === this.idUsuario) {
                this.usuarios.splice(i, 1);
              }
            });*/
            console.log(response.data + " Bares recibidos");
          } else {
            console.log(response.data + " Fallo en la obtención de los bares");
          }
        })
        .catch(error => {
          //Error al recoger los usuarios
          console.log(error);
        });
    }
  },
  mounted: function() {}
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
