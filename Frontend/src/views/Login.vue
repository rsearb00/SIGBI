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
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
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
                    label="Usuario"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="id"
                  />

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="contrasenya"
                    @keyup.enter="iniciarSesion()"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn dark color="#4D5E9C" @click="registrarse()"
                  >Registrarse</v-btn
                >
                <v-btn
                  dark
                  color="#4D5E9C"
                  @keyup.enter="iniciarSesion()"
                  @click="iniciarSesion()"
                  >Iniciar Sesión</v-btn
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
  name: "Login",
  components: {},
  data: () => ({
    id: "",
    contrasenya: "",
    alerta: false,
    tipoAlerta: "",
    textoAlerta: "",
  }),
  methods: {
    registrarse: function () {
      this.$router.push({
        name: "Registro",
      });
    },
    iniciarSesion: function () {
      this.alerta = false;
      if (this.id == "" && this.contrasenya == "") {
        this.tipoAlerta = "error";
        this.alerta = true;
        this.textoAlerta = "Por favor, introduce usuario y contraseña";
      } else if (this.id == "") {
        this.tipoAlerta = "error";
        this.alerta = true;

        this.textoAlerta = "Por favor, introduce tu usuario";
      } else if (this.contrasenya == "") {
        this.tipoAlerta = "error";
        this.alerta = true;
        this.textoAlerta = "Por favor, introduce tu contraseña";
      } else {
        console.log("Intento de inicio de sesión");
        axios
          .post("http://localhost:3000/login", {
            user: this.id,
            password: this.contrasenya,
          })
          .then((response) => {
            //Llamada exitosa
            if (response.data.ok) {
              this.tipoAlerta = "success";
              console.log(response.data.ok + " Inicio de sesión correcto");
              this.alerta = true;
              this.textoAlerta = "¡Bienvenido a TapO'N " + this.id + "!";
              setTimeout(() => {
                this.$router.push({
                  name: "Inicio",
                  params: { idUsuario: this.id },
                });
              }, 750);
            } else {
              this.tipoAlerta = "error";
              this.alerta = true;
              this.textoAlerta = "Los datos introducidos son incorrectos";
              console.log(response.data.ok + " Fallo en el inicio de sesión");
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
