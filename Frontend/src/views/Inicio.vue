<template>
  <v-app id="keep">
    <ToolbarTapON v-bind:idUsuario="idUsuario" />


    <v-divider></v-divider>
     
 
    <FooterTapON/>
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
  data: () => ({
   
  }),
  methods: {
    
  },
  mounted: function() {
   
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
