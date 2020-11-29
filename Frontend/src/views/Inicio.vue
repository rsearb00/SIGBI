<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" v-bind:isInicio="true" />
    <div class="text-center">
      <v-btn class="ma-2" elevation="5" dark color="#7A1B6C" @click="tapa()">
        Buscar por Tapa
      </v-btn>
      <v-btn
        class="ma-2"
        elevation="5"
        color="#7A1B6C"
        dark
        @click="personalizada()"
      >
        Búsqueda personalizada
      </v-btn>
      <v-btn
        class="ma-2"
        elevation="5"
        color="#7A1B6C"
        dark
        @click="recomendacion()"
      >
        Voy a tener TapO'N
      </v-btn>
      <v-alert :type="tipoAlerta" v-if="alerta1" dismissible>{{
        textoAlerta1
      }}</v-alert>
    </div>

    <div class="text-center">
      <v-toolbar class="text-center" color="purple" dark>
        <v-toolbar-title>Mis Tapas:</v-toolbar-title>
      </v-toolbar>
    </div>
    <v-flex d-flex>
      <v-layout wrap>
        <v-flex md2 v-for="tapa in tapasFiltro" :key="tapa">
          <v-card class="card-container" elevation="10">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-card-title>{{ tapa }}</v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-divider></v-divider>
    <div class="text-center">
      <v-toolbar class="text-center" color="purple" dark>
        <v-toolbar-title>Mis Bares:</v-toolbar-title>
      </v-toolbar>
    </div>
    <v-alert :type="tipoAlerta" v-if="alerta" dismissible>{{
      textoAlerta2
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
              <v-row align="center" class="mx-0"> </v-row>

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
                @click="borrarBar(bar.name)"
              >
                Borrar Bar de Mis Bares
              </v-btn>
            </v-card-actions>
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
    isInicio: { type: Boolean, default: false }
  },
  components: {
    ToolbarTapON,
    FooterTapON
  },
  data: () => ({
    alerta: false,
    alerta1: false,
    tipoAlerta: "",
    textoAlerta1: "",
    textoAlerta2: "",
    misTapas: [],
    bares: [],
    baresReco: [],
    contador: {},
    tapasFiltro: []
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
      //Aquí usaremos el algoritmo de recomendación planteado
      //Tenemos un contador de cada aparición de cada tapa en la búsqueda
      var tapaMasBuscada = 0;
      var nombreTapa = "";
      for (var i = 0; i < this.tapasFiltro.length; i++) {
        if (this.contador[this.tapasFiltro[i]] > tapaMasBuscada) {
          tapaMasBuscada = this.contador[this.tapasFiltro[i]];
          nombreTapa = this.tapasFiltro[i];
        }
      }
      //Mostramos el valor en el log solo para dar valor a lo que hemos encontrado y contrastarlo con
      console.log(
        "La tapa más buscada es: " +
          nombreTapa +
          " con valor: " +
          tapaMasBuscada
      );
      if (this.tapasFiltro.length == 0) {
        //Ahora llamaremos al método de la búsqueda para esa tapa
        this.tipoAlerta = "error";
        this.alerta1 = true;
        this.textoAlerta1 = "¡Aún no hay búsquedas guardadas!";
      } else if (this.tapasFiltro.length != 0) {
        this.tipoAlerta = "success";
        this.alerta1 = true;
        this.textoAlerta1 = "¡Bares encontrados!";
        console.log("Intento de buscar bares");
        axios
          .post("http://localhost:3000/recomendacion", {
            tapa: nombreTapa,
            user: this.idUsuario
          })
          .then(response => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.baresReco = response.data.datos;
              this.tipoAlerta = "success";
              this.alerta2 = true;
              this.textoAlerta1 = "¡Bares encontrados!";

              console.log("Se han encontrado los bares");
              setTimeout(() => {
                this.$router.push({
                  name: "Bares",
                  params: {
                    idUsuario: this.idUsuario,
                    bares: this.baresReco,
                    voyATener: "SI"
                  }
                });
              }, 750);
            } else {
              this.tipoAlerta = "error";
              this.alerta2 = true;
              this.textoAlerta1 =
                "No se han encontrado bares con la tapa más buscada";

              console.log("Fallo en la búsqueda de los bares");
            }
          })
          .catch(error => {
            //Error al recoger los bares
            console.log(error);
          });
      }
      /*
      this.$router.push({
        name: "Recomendacion",
        params: { idUsuario: this.idUsuario },
      });*/
    },

    random: function() {
      this.$router.push({
        name: "Random",
        params: { idUsuario: this.idUsuario }
      });
    },
    cargarMisTapas: function() {
      console.log("Intento de mostrar las tapas");
      axios
        .post("http://localhost:3000/misTapas", {
          user: this.idUsuario
        })
        .then(response => {
          console.log("Datos recibidos: " + response);
          //Llamada exitosa
          if (response.data.ok == true) {
            this.misTapas = response.data.datos;
            console.log(response.data + " Tapas recibidas");

            this.misTapas.forEach(el => {
              this.contador[el] = (this.contador[el] || 0) + 1;
            });
            console.log("Contador tapas: ", this.contador);
            for (var cont in this.contador) {
              this.tapasFiltro.push(cont);
              console.log("Tapa: ", cont);
            }
            console.log("El array de tapas filtrado: ", this.tapasFiltro);
          } else {
            console.log(response.data + " Fallo en la obtención de las tapas");
          }
        })
        .catch(error => {
          //Error al recoger las tapas
          console.log(error);
        });
    },
    cargarMisBares: function() {
      console.log("Intento de mostrar los bares");
      axios
        .post("http://localhost:3000/misBares", {
          user: this.idUsuario
        })
        .then(response => {
          console.log("Datos recibidos: " + response);
          //Llamada exitosa
          if (response.data.ok == true) {
            this.bares = response.data.datos;
            console.log(response.data + " Bares recibidos");
          } else {
            console.log(response.data + " Fallo en la obtención de los bares");
          }
        })
        .catch(error => {
          //Error al recoger los bares
          console.log(error);
        });
    },
    borrarBar: function(nombreBar) {
      //Primero comprobamos que se ha seleccionado un bar
      if (nombreBar != "") {
        this.tipoAlerta = "success";
        this.alerta = true;
        this.textoAlerta2 = "Se ha seleccionado el bar " + nombreBar;

        console.log("Intento de borrar el bar");
        axios
          .post("http://localhost:3000/borrarBar", {
            bar: nombreBar,
            user: this.idUsuario
          })
          .then(response => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.tipoAlerta = "success";
              this.alerta = true;
              this.textoAlerta2 = "¡Bar borrado correctamente!";

              console.log("Se ha borrado el bar");
              //Si se borra correctamente, cargamos de nuevo todos los bares
              this.cargarMisBares();
            } else {
              this.tipoAlerta = "error";
              this.alerta = true;
              this.textoAlerta2 = "No se ha podido borrar el bar";

              console.log("Fallo en el borrado del bar");
            }
          })
          .catch(error => {
            //Error al borrar el bar
            console.log(error);
          });
      }
    }
  },
  mounted: function() {
    this.cargarMisBares();
    this.cargarMisTapas();
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
