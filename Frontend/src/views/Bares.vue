<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />
    <div class="text-center">
      <v-toolbar class="text-center" color="purple" dark>
        <v-toolbar-title>Bares encontrados:</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="volverATapas()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
    <v-alert :type="tipoAlerta" v-if="alerta" dismissible>{{
      textoAlerta
    }}</v-alert>
    <v-flex d-flex>
      <v-layout wrap>
        <v-flex md4 v-for="bar in bares" :key="bar">
          <v-card class="card-container" elevation="10">
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

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="agregarBar(bar.name)"
              >
                Añadir a Mis Bares
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

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
    bares: { type: [], default: "ERROR" },
    personalizada: { type: String, default: "NO" },
  },
  components: {
    ToolbarTapON,
    FooterTapON,
  },
  data: () => ({
    tapas: [],
    bares: [],
    alerta: false,
    tipoAlerta: "",
    textoAlerta: "",
  }),
  methods: {
    volverATapas: function () {
      if (this.personalizada == "NO") {
        this.$router.push({
          name: "Tapa",
          params: { idUsuario: this.idUsuario },
        });
      } else {
        this.$router.push({
          name: "Personalizada",
          params: { idUsuario: this.idUsuario },
        });
      }
    },
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
    agregarBar: function (nombreBar) {
      //Primero comprobamos que se ha seleccionado al menos una tapa
      if (nombreBar != "") {
        this.tipoAlerta = "success";
        this.alerta = true;
        this.textoAlerta = "Se ha seleccionado el bar " + nombreBar;

        console.log("Intento de añadir el bar");
        axios
          .post("http://localhost:3000/agregarBar", {
            bar: nombreBar,
            user: this.idUsuario,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.tipoAlerta = "success";
              this.alerta = true;
              this.textoAlerta = "¡Bar añadido correctamente!";

              console.log("Se ha añadido el bar");
            } else {
              this.tipoAlerta = "error";
              this.alerta = true;
              this.textoAlerta = "No se ha podido añadir el bar";

              console.log("Fallo en la agregación del bar");
            }
          })
          .catch((error) => {
            //Error al añadir el bar
            console.log(error);
          });
      }
    },
  },
  mounted: function () {},
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>