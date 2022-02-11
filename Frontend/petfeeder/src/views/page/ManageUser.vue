<template>
  <div class="manage-user p-5 fs-4 overflow-auto flex-grow-1">
    <div class="">
      <h2 class="mb-5 fw-bold"><i class="fas fa-users-cog"></i> Quản lý người dùng</h2>
      <table class="table table-bordered border shadow">
        <thead class="table-primary border">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Gender</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in dashboardAdmin.users"
          :key="index">
            <th scope="row">{{ index+1 }}</th>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.gender }}</td>
            <td><i class="far fa-trash-alt btn-delete"></i></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "ManageUser",
  components: {},
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
.btn-delete{
  cursor: pointer;
}
.btn-delete:hover{
  color: red;
  font-weight: bold;
}
</style>
