<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />
    <v-container>
      <v-row no-gutters>
        <div class="col">
          <v-alert :type="tipoAlerta" v-if="alerta1" dismissible>{{
            textoAlerta
          }}</v-alert>
          <v-card class="pa-2">
            <v-toolbar color="purple" dark>
              <v-text-field
                outlined
                label="Busca tu tapa"
                v-model="buscar"
                append-icon="mdi-magnify"
                @keyup.enter="buscarTapas()"
                @click:append="buscarTapas()"
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
          <v-alert :type="tipoAlerta" v-if="alerta3" dismissible>{{
            textoAlerta
          }}</v-alert>
          <v-card class="pa-2">
            <v-toolbar color="purple" dark>
              <v-toolbar-title>Complementos</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-divider></v-divider>

            <v-list flat>
              <v-subheader>Propiedades seleccionables</v-subheader>

              <v-list-item-group
                v-model="propiedadesSeleccionadas"
                multiple
                active-class="pink--text"
              >
                <template v-for="(prop, i) in propiedades">
                  <v-list-item :key="`item-${i}`" :value="prop">
                    <template v-slot:default="{ active, toggle }">
                      <v-list-item-content>
                        <v-list-item-title v-text="prop"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          :true-value="prop"
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
          <v-alert :type="tipoAlerta" v-if="alerta2" dismissible>{{
            textoAlerta
          }}</v-alert>
          <v-card class="pa-2">
            <v-toolbar color="purple" dark>
              <v-toolbar-title>Tapas seleccionadas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="borrarTapasSeleccionadas()">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
    misTapas: [],
    bares: [],
    propiedades: [
      "Fútbol",
      "Despedidas de solteros",
      "Cerveza artesana",
      "Sidra artesana",
      "Acepta Perros",
      "Futbolín",
    ],
    propiedadesSeleccionadas: [],
    tapasSeleccionadas: [],
    alerta1: false,
    alerta2: false,
    alerta3: false,
    tipoAlerta: "",
    textoAlerta: "",
    ids: [],
    agregar: false,
  }),
  methods: {
    borrarTapasSeleccionadas: function () {
      this.tapasSeleccionadas = [];
    },
    buscarBares: function () {
      //Primero comprobamos que se ha seleccionado al menos una tapa
      if (
        this.tapasSeleccionadas.length == 0 &&
        this.propiedadesSeleccionadas.length == 0
      ) {
        this.tipoAlerta = "error";
        this.alerta2 = true;
        this.textoAlerta = "Seleccione sus preferencias";
      } else if (this.tapasSeleccionadas.length == 0) {
        this.tipoAlerta = "error";
        this.alerta2 = true;
        this.textoAlerta = "Seleccione al menos una tapa";
      } else if (this.propiedadesSeleccionadas.length == 0) {
        this.tipoAlerta = "error";
        this.alerta2 = true;
        this.textoAlerta = "Seleccione al menos un complemento";
      } else {
        //agregamos las tapas buscadas
        this.agregarMisTapas();
        console.log("Intento de buscar bares");
        axios
          .post("http://localhost:3000/buscarBaresPersonalizados", {
            tapas: this.tapasSeleccionadas,
            propiedades: this.propiedadesSeleccionadas,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.bares = response.data.datos;
              this.tipoAlerta = "success";
              this.alerta2 = true;
              this.textoAlerta = "¡Bares encontrados!";

              console.log("Se han encontrado los bares");
              setTimeout(() => {
                this.$router.push({
                  name: "Bares",
                  params: {
                    idUsuario: this.idUsuario,
                    bares: this.bares,
                    personalizada: "SI",
                  },
                });
              }, 750);
            } else {
              this.tipoAlerta = "error";
              this.alerta2 = true;
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
    buscarTapas: function () {
      //Si está vacío, obtenemos todas las tapas
      if (this.buscar == "") {
        //Obtenemos todas las tapas por pantalla al cargar la página
        console.log("Intento de mostrar las tapas");
        axios
          .post("http://localhost:3000/tapas", {})
          .then((response) => {
            console.log("Datos recibidos: " + response);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.tapas = response.data.datos;
              console.log(response.data.datos + " Tapas recibidas");
            } else {
              console.log(
                response.data.datos + " Fallo en la obtención de las tapas"
              );
            }
          })
          .catch((error) => {
            //Error al recoger las tapas
            console.log(error);
          });
      }
      //Solo buscamos si la longitud no está vacía
      else if (this.buscar != "") {
        console.log("Ha pulsado enter con valor de búsqueda: ", this.buscar);
        console.log("Intento de buscar tapa");
        axios
          .post("http://localhost:3000/buscarTapas", {
            tapa: this.buscar,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              this.alerta1 = false;
              this.tapas = response.data.datos;
              console.log("Se han encontrado las tapas");
            } else {
              this.tipoAlerta = "error";
              this.alerta1 = true;
              this.textoAlerta = "No hay tapas con esos criterios";
              console.log("Fallo en la búsqueda de las tapas");
            }
          })
          .catch((error) => {
            //Error al recoger los bares
            console.log(error);
          });
      }
    },
    buscarMisTapas: function () {
      console.log("Intento de mostrar las tapas");
      axios
        .post("http://localhost:3000/misTapas", {
          user: this.idUsuario,
        })
        .then((response) => {
          console.log("Datos recibidos: " + response);
          //Llamada exitosa
          if (response.data.ok == true) {
            this.misTapas = response.data.datos;
            console.log(response.data + " Tapas recibidas");
            this.agregar = true;
          } else {
            console.log(response.data + " Fallo en la obtención de las tapas");
            this.agregar = false;
          }
        })
        .catch((error) => {
          //Error al recoger las tapas
          console.log(error);
        });
    },
    agregarMisTapas: function () {
      //Si buscar Tapas devuelve falso, es porque aún no hay búsquedas
      //Por tanto, agregar será falso
      if (this.agregar == false) {
        console.log(
          "Intento de añadir las tapas por primera vez",
          this.tapasSeleccionadas
        );
        axios
          .post("http://localhost:3000/agregarMisTapas", {
            tapas: this.tapasSeleccionadas,
            user: this.idUsuario,
            nuevo: true,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              console.log("Se han añadido las tapas");
            } else {
              console.log("Fallo en la agregación de las tapas");
            }
          })
          .catch((error) => {
            //Error al añadir el bar
            console.log(error);
          });
      } else if (this.agregar == true) {
        console.log(
          "Intento de añadir las tapas habiendo ya otras",
          this.tapasSeleccionadas
        );
        axios
          .post("http://localhost:3000/agregarMisTapas", {
            tapas: this.tapasSeleccionadas,
            user: this.idUsuario,
            nuevo: false,
          })
          .then((response) => {
            console.log("Datos recibidos: " + response.data.ok);
            //Llamada exitosa
            if (response.data.ok == true) {
              console.log("Se han añadido las tapas");
            } else {
              console.log("Fallo en la agregación de las tapas");
            }
          })
          .catch((error) => {
            //Error al añadir el bar
            console.log(error);
          });
      }
    },
  },
  mounted: function () {
    this.buscarTapas();
    this.buscarMisTapas();
  },
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>

