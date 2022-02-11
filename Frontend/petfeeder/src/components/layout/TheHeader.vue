<template>
  <div class="header flex">
    <div class="header-left flex">
      <img src="../../assets/img/logo.jpg" alt="" />
      <div class="header-name">PETFEEDER</div>
    </div>
    <div class="header-center flex">
      <multiselect
        v-if="role == 'user'"
        v-model="deviceCurrent"
        :options="devices"
        :custom-label="displayDevice"
        :allow-empty="false"
        placeholder="Chọn thiết bị"
        deselect-label=""
        label="deviceName"
        track-by="deviceId"
      ></multiselect>
      <base-button
        v-if="role == 'user'"
        class="btn-add-device"
        classButton="btn-custom-primary"
        textButton="Thêm thiết bị"
        @clickButton="addDevice"
      >
      </base-button>
    </div>
    <div class="header-right flex">
      <i class="far fa-question-circle"></i>
      <i class="far fa-bell"></i>
      <div class="usename">Nguyễn Tất Thanh</div>
      <div class="avatar-wrap">
        <img class="avatar" src="../../assets/img/avatar.png" alt="" />
        <ul class="avatar-option">
          <li @click="showFromProfile">Thông tin tài khoản</li>
          <li @click="showFromChangePassword">Đổi mật khẩu</li>
          <li @click="logout">Đăng xuất</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import BaseButton from "../base/BaseButton.vue";

export default {
  name: "TheHeader",
  components: {
    Multiselect,
    BaseButton,
  },
  data() {
    return {
      deviceCurrent: null,
    };
  },
  async created() {
    //Lấy danh sách thiết bị
    await this.getAllDevice();
    if (this.devices.length > 0) {
      this.deviceCurrent = this.devices[0]; //Luôn lấy thiết bị đầu tiên là tbi hiện tại
    }
  },
  computed: {
    ...mapState({
      deviceCurrentStore: (state) => state.deviceCurrent,
      devices: (state) => state.devices,
      //inforAccount: (state) => state.inforAccount,
    }),
    role() {
      return window.localStorage.getItem("role");
    }
  },
  watch: {
    //Cập nhật lại thiết bị hiện tại
    deviceCurrent: function () {
      this.setDeviceCurrent(this.deviceCurrent);
    },
    //Cập nhật thiết bị khi store cập nhật
    deviceCurrentStore: function () {
      this.deviceCurrent = this.deviceCurrentStore;
    },
  },
  mounted() {
    //Xử lý hiển thị text không có kết quả khi tìm kiếm trong combobox
    let spanText = document.querySelectorAll(".multiselect__content li");
    spanText.forEach((span) => {
      // console.log(span.innerText);
      if (
        span.innerText ==
        "No elements found. Consider changing the search query."
      ) {
        span.innerText = "Không có kết quả";
      }
    });
  },
  methods: {
    ...mapMutations([
      "formAddDevice",
      "formProfile",
      "formChangePassword",
      "setDeviceCurrent",
    ]),
    ...mapActions(["getAllDevice"]),
    /**
     * Cấu hình hiển thị combobox
     */
    displayDevice({ deviceId, deviceName }) {
      return `${deviceName} - ${deviceId}`;
    },

    /**
     * Ấn thêm thiết bị
     */
    addDevice() {
      this.formAddDevice(true);
    },

    /**
     * Xem thông tin tài khoản
     */
    showFromProfile() {
      this.formProfile(true);
    },

    /**
     * Mở form đổi mật khẩu
     */
    showFromChangePassword() {
      this.formChangePassword(true);
    },

    /**
     * Đăng xuất
     */
    logout() {
      window.localStorage.setItem("token", "");
      this.$router.push("/login");
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.header {
  width: 100%;
  height: 90px;
  background-color: var(--background-header-sidebar);
  padding: 0 30px;
  justify-content: space-between;
}

.header-left {
  align-items: center;
}

.header-left img {
  width: 70px;
  height: 70px;
  border-radius: 4px;
}

.header-name {
  font-family: "OpenSans-Bold";
  font-size: 3rem;
  color: #fbfbfb;
  padding-left: 20px;
}

.header-center {
  justify-content: space-between;
  align-items: center;
}

.multiselect {
  width: 250px !important;
}

.btn-add-device {
  height: 42px;
  width: 120px;
  margin-left: 30px;
}

.header-right {
  align-items: center;
}

.fa-question-circle {
  font-size: 2rem;
  color: white;
  margin: 0 6px;
  cursor: pointer;
}

.fa-bell {
  font-size: 2rem;
  color: white;
  margin: 0 6px;
  cursor: pointer;
}

.usename {
  font-size: 1.5rem;
  color: #fbfbfb;
  padding: 0 14px 0 6px;
}

.avatar-wrap {
  position: relative;
}

.avatar {
  display: block;
  width: 46px;
  border-radius: 50%;
  cursor: pointer;
}

.avatar-wrap:hover .avatar-option {
  display: block;
}

.avatar-option {
  display: none;
  z-index: 10;
  position: absolute;
  top: 58px;
  right: 1px;
  background-color: var(--white-color);
  width: 200px;
  border-radius: 2px;
  list-style: none;
  box-shadow: 0 1px 3rem 0 rgba(0, 0, 0, 0.2);
  animation: fadeIn linear 0.2s;
  cursor: default;
  padding: 0;
}

.avatar-option li:first-child {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.avatar-option li:last-child {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.avatar-option::before {
  position: absolute;
  content: "";
  cursor: pointer;
  right: 10px;
  top: -24px;
  border-width: 12px;
  border-style: solid;
  border-color: transparent transparent var(--white-color) transparent;
}

.avatar-option::after {
  position: absolute;
  content: "";
  cursor: pointer;
  right: 1px;
  top: -16px;
  width: 100px;
  height: 16px;
  background-color: transparent;
}

.avatar-option li {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  height: 34px;
  cursor: pointer;
  padding-left: 14px;
}

.avatar-option li:hover {
  background-color: #f0f2fb;
}
</style>>
