<template>
  <v-app id="keep">
    <ToolbarMaristMessage v-bind:idUsuario="idUsuario" />

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="blue-grey lighten-5"
    >
      
      
      <v-divider></v-divider>
     
    </v-navigation-drawer>
    
  </v-app>
</template>

<script>


export default {
  props: {
    idUsuario: { type: String, default: "ERROR" }
  },
  components: {
    
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
