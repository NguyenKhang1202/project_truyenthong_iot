<template>
  <div class="add-device">
    <div class="add-device-overlay"></div>
    <vue-drag-resize
      dragHandle=".drag-handle"
      :isResizable="false"
      :w="420"
      :h="heightPopup"
      :x="586"
      :y="180"
    >
      <div class="add-device-content-wrap flex-column">
        <div class="drag-handle"></div>
        <div class="add-device-content">
          <div class="add-device-title flex">
            <span>Thêm thiết bị</span>
            <i @click="hideForm" class="fas fa-times"></i>
          </div>
          <div class="add-device-body">
            <div class="add-device-body-control control">
              <div class="label">
                Tên thiết bị <span style="color: red">*</span>
              </div>
              <input
                v-model="deviceInfor.deviceName"
                class="input"
                maxlength="100"
                placeholder="Tên thiết bị bạn muốn hiển thị"
              />
              <div v-if="!validate.deviceName" class="validate-device">
                Tên thiết bị không được để trống
              </div>
            </div>
            <div class="add-device-body-control control">
              <div class="label">
                Mã thiết bị <span style="color: red">*</span>
              </div>
              <input
                v-model="deviceInfor.deviceId"
                class="input"
                maxlength="100"
                placeholder="Nhập mã thết bị"
              />
              <div v-if="!validate.deviceId" class="validate-device">
                Mã thiết bị không được để trống
              </div>
            </div>
          </div>
          <div class="add-device-footer flex">
            <base-button
              classButton="btn-custom-secondary"
              textButton="Hủy"
              @clickButton="hideForm"
            ></base-button>
            <base-button
              classButton="btn-custom-primary"
              textButton="Thêm"
              @clickButton="addDevice"
            ></base-button>
          </div>
        </div>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import VueDragResize from "vue-drag-resize";
import BaseButton from "../../components/base/BaseButton.vue";
import axios from "axios";

export default {
  name: "AddDevice",
  data() {
    return {
      deviceInfor: {
        deviceName: "",
        deviceId: "",
      },
      //validate nhập vào
      validate: {
        deviceName: true,
        deviceId: true,
      },
      //Chiều cao popup
      heightPopup: 260,
    };
  },
  components: {
    VueDragResize,
    BaseButton,
  },
  computed: {},
  watch: {},

  methods: {
    ...mapMutations(["formAddDevice", "addToast", "showLoading", "hideLoading"]),
    ...mapActions(["getAllDevice"]),
    
    /**
     * Đóng form thêm mới
     */
    hideForm() {
      this.formAddDevice(false);
    },

    validateDevice() {
      let validate = true;
      if (this.deviceInfor.deviceName == "") {
        this.validate.deviceName = false;
        validate = false;
      } else {
        this.validate.deviceName = true;
      }
      if (this.deviceInfor.deviceId == "") {
        this.validate.deviceId = false;
        validate = false;
      } else {
        this.validate.deviceId = true;
      }
      validate ? (this.heightPopup = 260) : (this.heightPopup = 300);
      return validate;
    },

    /**
     * Thêm thiết bị
     */
    addDevice() {
      if (this.validateDevice()) {
        this.showLoading();
        axios
          .post(
            "http://localhost:8000/api/devices",
            {
              deviceId: this.deviceInfor.deviceId,
              deviceName: this.deviceInfor.deviceName,
            },
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            if (response.data.status == "success") {
              //Đóng form
              this.formAddDevice(false);
              //Thông báo
              this.addToast({
                message: "Thêm thiết bị thành công",
                type: "success",
              });
              //Gọi lại api lấy thiết bị
              this.getAllDevice();
            } else {
              //Thông báo
              this.addToast({
                message: `${response.data.msg}`,
                type: "error",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            //Thông báo
            this.addToast({
              message: "Thêm thiết bị thất bại",
              type: "error",
            });
            //Đóng form
            this.formAddDevice(false);
          })
          .finally(() =>{
            this.hideLoading();
          })
      }
    },
  },
};
</script>

<style scoped>
.add-device {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: fadeIn linear 0.1s;
}

.add-device-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.add-device-content-wrap {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  background-color: var(--white-color);
  border-radius: 4px;
}

.add-device-content {
  padding: 0 24px;
}

.drag-handle {
  height: 22px;
  width: 100%;
  cursor: move;
}

.add-device-title {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.add-device-title span {
  font-family: "OpenSans-SemiBold";
  font-size: 2rem;
  color: var(--black-color);
}

.add-device-title i {
  font-size: 2rem;
  cursor: pointer;
}

.add-device-body {
  font-family: "OpenSans-Regular";
  font-size: 1.3rem;
  color: var(--black-color);
  line-height: 18px;
}

.add-device-footer {
  justify-content: flex-end;
  align-items: center;
  margin: 16px 0 22px 0;
}

.add-device-footer .btn-custom {
  width: 92px;
}

.validate-device {
  font-size: 1.3rem;
  color: red;
  padding: 2px 0 0 6px;
}
</style>