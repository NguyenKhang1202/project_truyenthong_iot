<template>
  <router-link :to="path" class="navbar-item flex" active-class="navbar-item-active">
    <i class="navbar-item-icon" :class="classIcon"></i>
    <div class="navbar-item-text">{{ itemText }}</div>
  </router-link>
</template>

<script>
export default {
  name: "BaseItemNavbar",
  components: {},
  props: {
      path: {
      type: String,
      required: true,
    },
    classIcon: {
      type: String,
      required: true,
    },
    itemText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
</style>
