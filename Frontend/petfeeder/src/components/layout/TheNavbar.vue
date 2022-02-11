<template>
  <div class="_navbar">
    <base-item-navbar
      v-if="role=='admin'"
      path="/app/dashboard"
      itemText="Tổng quan"
      classIcon="far fa-chart-bar"
    >
    </base-item-navbar>
    <base-item-navbar
      v-if="role=='user'"
      path="/app/setting-feed"
      itemText="Đặt lịch cho ăn"
      classIcon="far fa-calendar-alt"
    >
    </base-item-navbar>
    <base-item-navbar
      v-if="role=='user'"
      path="/app/history"
      itemText="Lịch sử cho ăn"
      classIcon="fas fa-history"
    >
    </base-item-navbar>
    <base-item-navbar
      v-if="role=='admin'"
      path="/app/manage-user"
      itemText="Quản lý người dùng"
      classIcon="fas fa-users-cog"
    >
    </base-item-navbar>
    <base-item-navbar
      v-if="role=='user'"
      path="/app/list-device"
      itemText="Danh sách thiết bị"
      classIcon="fas fa-camera"
    >
    </base-item-navbar>
  </div>
</template>

<script>
import BaseItemNavbar from "../base/BaseItemNavbar.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "TheNavbar",
  components: {
    BaseItemNavbar,
  },
  computed: {
    role() {
      return window.localStorage.getItem("role");
    }
  },
};
</script>

<style>
._navbar {
  height: 100%;
  width: 210px;
  background-color: var(--background-header-sidebar);
}

.navbar-item {
  height: 50px;
  align-items: center;
  border-left: 4px solid #242e42;
  margin: 6px 0;
  cursor: pointer;
  text-decoration: none;
}

.navbar-item:first-child {
  margin-top: 0;
}

.navbar-item:hover {
  background-color: #384359;
}

.navbar-item-active {
  border-left: 4px solid #1f8efa;
  background-color: #384359;
}

.navbar-item-icon {
  font-size: 2rem;
  color: #fbfbfb;
  padding: 0 10px 0 10px;
}

.navbar-item-text {
  font-size: 1.6rem;
  color: #fbfbfb;
}
</style>
