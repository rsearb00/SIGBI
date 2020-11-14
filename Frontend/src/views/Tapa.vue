<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />
    <v-container>
      <v-row no-gutters>
        <div class="col">
          <v-card class="pa-2">
            <v-toolbar color="purple" dark>
              <v-text-field
                outlined
                label="Busca tu tapa"
                v-model="buscar"
                append-icon="mdi-magnify"
                @keyup.enter="buscarTapa()"
              ></v-text-field>
            </v-toolbar>

            <v-divider></v-divider>

            <v-list flat>
              <v-subheader>Tapas seleccionables</v-subheader>

              <v-list-item-group
                v-model="tapasSeleccionadas"
                multiple
                active-class="pink--text"
              >
                <template v-for="(tapa, i) in tapas">
                  <v-list-item :key="`item-${i}`" :value="tapa">
                    <template v-slot:default="{ active, toggle }">
                      <v-list-item-content>
                        <v-list-item-title v-text="tapa"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          :true-value="tapa"
                          color="#4D5E9C"
                          @click="active, toggle"
                        ></v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </div>
        <div class="col">
          <v-alert :type="tipoAlerta" v-if="alerta" dismissible>{{
            textoAlerta
          }}</v-alert>
          <v-card class="pa-2">
            <v-toolbar color="purple" dark>
              <v-toolbar-title>Tapas seleccionadas</v-toolbar-title>
            </v-toolbar>

            <v-divider></v-divider>

            <v-list flat>
              <v-list-item-group active-class="pink--text">
                <template v-for="(tapaS, i) in tapasSeleccionadas">
                  <v-list-item :key="`item-${i}`" :value="tapaS">
                    <v-list-item-content>
                      <v-list-item-title v-text="tapaS"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
            <v-fab-transition>
              <v-btn
                color="#4D5E9C"
                dark
                absolute
                right
                fab
                bottom
                @click="buscarBares()"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card>
        </div>
      </v-row>
    </v-container>
    <FooterTapON />
  </v-app>
</template>

<script>
//pruebas
/*<v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />

    <v-col cols="10" class="py-2">
      <p>Text Options</p>

      <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group>
        <v-btn v-for="tapa in tapas" :key="tapa"> <v-icon size="10 px">
            {{ tapa }}
          </v-icon></v-btn>
      </v-btn-toggle>
    </v-col>

    <v-col cols="12" class="py-2">
      <p>Escoge las tapas que quieres buscar</p>

      <v-btn-toggle v-model="model" tile color="deep-purple accent-3" group>
        <v-btn v-for="tapa in tapas" :key="tapa" class="mx-4" dark icon>
          <v-icon size="10 px">
            {{ tapa }}
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <FooterTapON />
  </v-app>

*/
/*
<v-app-bar dark color="#4D5E9C">
        <v-toolbar-title>Crear conversación</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="vuelvePrincipal()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-list shaped style= "300 px height"  class="overflow-y-auto">
              <v-list-item-group v-model="model" multiple>
                <template v-for="(tapa, i) in tapas">
                  <v-divider v-if="!tapa" :key="`divider-${i}`"></v-divider>

                  <v-list-item
                    v-else
                    :key="`item-${i}`"
                    :value="tapa"
                    active-class="deep-purple--text text--accent-4"
                  >
                    <template v-slot:default="{ active, toggle }">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="tapa"
                        ></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          :true-value="tapa"
                          color="#4D5E9C"
                          @click="toggle"
                        ></v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-fab-transition>
        <v-btn
          color="#4D5E9C"
          dark
          absolute
          bottom
          right
          fab
          @click="buscarBares()"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-fab-transition>

*/
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
    buscar: "",
    items: [],
    tapas: [],
    bares: [],
    tapasSeleccionadas: [],
    alerta: false,
    tipoAlerta: "",
    textoAlerta: "",
    nombreGrupo: "",
    ids: [],
  }),
  methods: {
    buscarBares: function () {
      //Primero comprobamos que se ha seleccionado al menos una tapa
      if (this.tapasSeleccionadas.length == 0) {
        this.tipoAlerta = "error";
        this.alerta = true;
        this.textoAlerta = "Selecione al menos una tapa";
      } else {
        console.log("Intento de buscar bares");
        axios
          .post("http://localhost:3000/buscarBares", {
            tapas: this.tapasSeleccionadas,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.bares = response.data.datos;
              this.tipoAlerta = "success";
              this.alerta = true;
              this.textoAlerta = "¡Bares encontrados!";

              console.log("Se han encontrado los bares");
              setTimeout(() => {
                this.$router.push({
                  name: "Bares",
                  params: { idUsuario: this.idUsuario, bares: this.bares },
                });
              }, 750);
            } else {
              this.tipoAlerta = "error";
              this.alerta = true;
              this.textoAlerta =
                "No se han encontrado bares con las tapas seleccionadas";

              console.log("Fallo en la búsqueda de los bares");
            }
          })
          .catch((error) => {
            //Error al recoger los bares
            console.log(error);
          });
      }
    },
    buscarTapa: function () {
      //Funciona
      this.buscar = "Ha pulsado enter";
      console.log("Ha pulsado enter con valor de búsqueda: ", this.buscar);
    },
    //Si el campo está vacío
    buscarAllTapas: function () {
      //Funciona
      this.buscar = "Ha pulsado enter";
      console.log("Ha pulsado enter con valor de búsqueda: ", this.buscar);
    },
    vuelvePrincipal: function () {
      this.$router.push({
        name: "Inicio",
        params: { idUsuario: this.idUsuario },
      });
    },
  },
  mounted: function () {
    //Obtenemos las tapas por pantalla al cargar la página
    console.log("Intento de mostrar las tapas");
    axios
      .post("http://localhost:3000/tapas", {})
      .then((response) => {
        console.log("Datos recibidos: " + response);
        //Llamada exitosa
        if (response.data.ok == true) {
          this.tapas = response.data.datos;
          console.log(response.data + " Tapas recibidas");
        } else {
          console.log(response.data + " Fallo en la obtención de las tapas");
        }
      })
      .catch((error) => {
        //Error al recoger las tapas
        console.log(error);
      });
  },
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>

