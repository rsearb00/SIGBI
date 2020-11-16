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
    <div class="text-center">
      <v-toolbar class="text-center" color="purple" dark>
        <v-toolbar-title>Mis Bares:</v-toolbar-title>
      </v-toolbar>
    </div>
    <v-flex d-flex>
      <v-layout wrap>
        <v-flex md4 v-for="bar in bares" :key="bar">
          <v-card :loading="loading" class="card-container" elevation="10">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-card-title>{{ bar.name }}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-rating
                  :value="4.5"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>

                <div class="grey--text ml-4">4.5 (413)</div>
              </v-row>

              <div>Teléfono: {{ bar.telephone }}</div>
              <div>Dirección: {{ bar.address }}</div>
              <div>Web: {{ bar.web }}</div>
              <div>Tapas: {{ bar.tapas.toString() }}</div>
              <div>Fútbol: {{ bar.futbol }}</div>
              <div>Despedidas de solteros: {{ bar.despedidas }}</div>
              <div>Cerveza Artesana: {{ bar.cervezaArtesana }}</div>
              <div>Sidra Artesana: {{ bar.sidra }}</div>
              <div>Acepta perros: {{ bar.perros }}</div>
              <div>Futbolín: {{ bar.futbolin }}</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
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
    idUsuario: { type: String, default: "ERROR" },
  },
  components: {
    ToolbarTapON,
    FooterTapON,
  },
  data: () => ({
    tapas: [],
    bares: [],
    //tapasSinFiltro: [],
  }),
  methods: {
    tapa: function () {
      this.$router.push({
        name: "Tapa",
        params: { idUsuario: this.idUsuario },
      });
    },
    personalizada: function () {
      this.$router.push({
        name: "Personalizada",
        params: { idUsuario: this.idUsuario },
      });
    },
    recomendacion: function () {
      this.$router.push({
        name: "Recomendacion",
        params: { idUsuario: this.idUsuario },
      });
    },
    random: function () {
      this.$router.push({
        name: "Random",
        params: { idUsuario: this.idUsuario },
      });
    },
    cargarMisTapas: function () {},
    cargarMisBares: function () {
      console.log("Intento de mostrar los bares");
      axios
        .post("http://localhost:3000/misBares", {
          user: this.idUsuario,
        })
        .then((response) => {
          console.log("Datos recibidos: " + response);
          //Llamada exitosa
          if (response.data.ok == true) {
            this.bares = response.data.datos;
            console.log(response.data + " Bares recibidos");
          } else {
            console.log(response.data + " Fallo en la obtención de los bares");
          }
        })
        .catch((error) => {
          //Error al recoger los bares
          console.log(error);
        });
    },
  },
  mounted: function () {
    this.cargarMisBares();
  },
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
