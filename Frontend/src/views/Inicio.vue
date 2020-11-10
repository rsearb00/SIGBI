<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />
    <div class="text-center">
      <v-btn class="ma-2" elevation="5" color="secondary">
        Buscar por Tapa
      </v-btn>
      <v-btn class="ma-2" elevation="5" color="secondary">
        Búsqueda personalizada
      </v-btn>
      <v-btn class="ma-2" elevation="5" color="secondary">
        La recomendación de TapO'N
      </v-btn>
      <v-btn class="ma-2" elevation="5" color="secondary">
        Voy a tener suerte
      </v-btn>
    </div>

    <v-divider></v-divider>

    <FooterTapON />
  </v-app>
</template>

<script>
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
  data: () => ({}),
  methods: {},
  mounted: function() {}
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
