<template>
  <div
    class="
      dashboard
      flex-grow-1
      fs-4
      p-5
      overflow-auto
      flex flex-column
      align-items-center
    "
  >
    <div class="w-75 flex flex-column align-items-center">
      <h1 class="mb-5 fw-bold"><i class="far fa-chart-bar"></i> Tổng quan</h1>
      <div class="text-white flex w-75 mb-3">
        <div class="bg-primary p-3 w-50 me-4 text-center shadow rounded">
          <span>{{ dashboardAdmin.totalDevices }}</span> thiết bị
        </div>
        <div class="bg-success p-3 w-50 text-center shadow rounded">
          <span>{{ dashboardAdmin.totalUsers }}</span> người dùng
        </div>
      </div>
    </div>
    <div class="w-100 mt-5">
      <h2 class="mb-4">
        <i class="fas fa-users-cog"></i> Danh sách người dùng thiết bị
      </h2>
      <table class="table table-bordered shadow">
        <thead class="table-primary">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Người dùng</th>
            <th scope="col">Thiết bị</th>
            <th scope="col">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Nghia</td>
            <td>Id123</td>
            <td>
              <div
                class="
                  border border-success
                  status-icon
                  bg-success
                  rounded
                  text-white
                  fw-bold
                "
              >
                On
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      
    };
  },
  created() {
    this.getDashboard();
  },
  computed: {
    ...mapState(["dashboardAdmin"]),
  },
  methods: {
    ...mapActions(["getDashboard"]),
  },
};
</script>

<style scoped>
.dashboard {
  background-color: var(--background-page);
}

.status-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
