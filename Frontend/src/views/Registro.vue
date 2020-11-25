<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-alert :type="tipoAlerta" v-if="alerta" dismissible>{{
              textoAlerta
            }}</v-alert>
            <v-card class="elevation-12">
              <v-toolbar color="#4D5E9C" dark flat>
                <v-toolbar-title>Registro</v-toolbar-title>
                <v-spacer />
                <v-img
                  :src="require(`@/assets/LogoTapON.png`)"
                  alt
                  class="shrink mr-2"
                  width="150"
                />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Nombre de Usuario"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="id"
                  />
                  <v-text-field
                    label="Nombre Completo"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="nombreCompleto"
                  />
                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="contrasenya"
                    v-on:keyup.enter="clickeo"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn dark color="#4D5E9C" @click="iniciarSesion()">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-btn dark color="#4D5E9C" @click="crearUsuario()"
                  >Registrarme</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// @ is an alias to /src
const axios = require("axios");
export default {
  name: "Registro",
  components: {},
  data: () => ({
    id: "",
    contrasenya: "",
    nombreCompleto: "",
    alerta: false,
    tipoAlerta: "",
    textoAlerta: "",
  }),
  methods: {
    iniciarSesion: function () {
      this.$router.push({
        name: "Login",
      });
    },
    crearUsuario: function () {
      this.alerta = false;
      if (
        this.id == "" &&
        this.contrasenya == "" &&
        this.nombreCompleto == ""
      ) {
        this.tipoAlerta = "error";
        this.alerta = true;
        this.textoAlerta =
          "Por favor, introduce los datos para crear al usuario";
      } else if (
        this.id == "" ||
        this.contrasenya == "" ||
        this.nombreCompleto == ""
      ) {
        this.tipoAlerta = "error";
        this.alerta = true;
        this.textoAlerta = "Por favor, introduce los datos que faltan";
      } else {
        console.log("Intento de crear el usuario");
        axios
          .post("http://localhost:3000/registro", {
            user: this.id,
            password: this.contrasenya,
            name: this.nombreCompleto,
          })
          .then((response) => {
            //Llamada exitosa
            if (response.data.ok) {
              this.tipoAlerta = "success";
              console.log(response.data.ok + " creado el usuario con éxito");
              this.alerta = true;
              this.textoAlerta = "¡Usuario " + this.id + " creado!";
              setTimeout(() => {
                this.$router.push({
                  name: "Login",
                });
              }, 1000);
            } else {
              this.tipoAlerta = "error";
              this.alerta = true;
              this.textoAlerta = "Fallo en el registro";
              console.log(response.data.ok + " Fallo en el registro");
            }
          })
          .catch((alerta) => {
            //alerta
            console.log(alerta);
          });
      }
    },
  },
  mounted: function () {},
};
</script>

<style lang="scss" scoped></style>
