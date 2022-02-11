import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //Trạng thái đóng mở form thêm thiết bị
    formAddDevice: false,
    //Trạng thái đóng mở form thông tin tài khoản
    formProfile: false,
    //Trạng thái đóng mở form đổi mật khẩu
    formChangePassword: false,

    deviceInfor: {},

    /**
     * Mang các obj lưu thông tin toast
     * obj toast co dang
     * @param {String} message
     * @param {String} type Kiểu thông báo để hiên thị màu (Chỉ nhận các giá trị định nghĩa sẵn: success, error, warning)
     */
    toast: [],

    /**
     * Thông tin thiết bị hiện tại
     */
    deviceCurrent: {},

    /**
     * Dách sách thiết bị
     */
    devices: [],

    /**
     * Thông tin tài khoản
     */
    inforAccount: null,

    /**
     * Thông tin tổng quan cho admin
     */
    dashboardAdmin: {
      devices: null,
      totalDevices: null,
      users: null,
      totalUsers: null,
    },

    //Trạng thái loading
    loading: false,
  },

  getters: {},

  mutations: {
    //Đóng mở form thêm thiết bị
    formAddDevice(state, formAddDevice) {
      state.formAddDevice = formAddDevice;
    },

    //Đóng mở form thông tin tài khoản
    formProfile(state, formProfile) {
      state.formProfile = formProfile;
    },

    //Đóng mở form đổi mật khẩu
    formChangePassword(state, formChangePassword) {
      state.formChangePassword = formChangePassword;
    },

    /**
     * Xu ly toast
     * @param {Object} state state trong store
     * @param {Object} content nội dung thêm vào
     *  Author: ntthanh (30/09/2021)
     */
    addToast(state, content) {
      //Them obj vao cuoi
      state.toast.push(content);
    },
    removeToast(state) {
      //Xoa obj
      state.toast.shift();
    },

    /**
     * Set thông tin thiết bị hiện tại
     */
    setDeviceCurrent(state, deviceCurrent) {
      state.deviceCurrent = deviceCurrent;
    },

    setDevices(state, devices) {
      state.devices = devices;
    },

    setInforAccount(state, inforAccount) {
      state.inforAccount = inforAccount;
    },

    setDashboardAdmin(state, dashboardAdmin) {
      state.dashboardAdmin = dashboardAdmin;
    },

    //Thay đổi trạng thái loading
    showLoading(state) {
      state.loading = true;
    },

    hideLoading(state) {
      state.loading = false;
    },
  },

  actions: {
    /**
     * Lấy tất cả thiết bị
     */
    async getAllDevice({ commit }) {
      await commit("showLoading");
      await axios
        .get("http://localhost:8000/api/devices", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.status == "success") {
            commit("setDevices", response.data.data.devices);
            if (response.data.data.devices.length > 0) {
              commit("setDeviceCurrent", response.data.data.devices[0]); //Lấy thiết bị đầu tiên làm thiết bị hiện tại
            } else if (window.localStorage.getItem("role") == "user") {
              commit("setDeviceCurrent", {
                deviceId: "",
                deviceName: "",
              });
              commit("addToast", {
                message:
                  "Bạn chưa có thiết bị trong danh sách. Thêm thiết bị để sử dụng!",
                type: "warning",
              });
            }
          } else {
            commit("addToast", {
              message: "Lấy thông tin thiết bị thất bại!",
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          commit("addToast", {
            message: "Lấy thông tin thiết bị thất bại!",
            type: "error",
          });
        });
      await commit("hideLoading");
    },

    /**
     * Lấy thông tin tổng quan cho admin
     */
    async getDashboard({ commit }) {
      await commit("showLoading");
      await axios
        .get("http://localhost:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          let data = response.data.data;
          if (response.data.status == "success") {
            commit("setDashboardAdmin", {
              devices: data.devices.devices,
              totalDevices: data.devices.totalDevices,
              users: data.users.users,
              totalUsers: data.users.totalUsers,
            });
          } else {
            //Thông báo
            commit("addToast", {
              message: `${response.data.msg}`,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          //Thông báo
          commit("addToast", {
            message: "Lấy thông tin người dùng và thiết bị thất bại!",
            type: "error",
          });
        });
      await commit("hideLoading");
    },
  },
});

export default store;
