<template>
  <div>
    <!-- <login></login>
    <register></register>
    <the-app></the-app> -->
    <router-view />
    <base-toast></base-toast>
    <base-loading v-show="loading"></base-loading>
  </div>
</template>

<script>
import Login from "./components/layout/Login.vue";
import Register from "./components/layout/Register.vue";
import TheApp from "./components/layout/TheApp.vue";
import BaseToast from "./components/base/BaseToast.vue";
import BaseLoading from "./components/base/BaseLoading.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    // Login,
    // Register,
    // TheApp,
    BaseToast,
    BaseLoading,
  },
  computed: {
    ...mapState(["loading"]),
  },
};
</script>

<style>
</style>
