<template>
  <div class="change-pasword">
    <div class="change-pasword-overlay"></div>
    <vue-drag-resize
      dragHandle=".drag-handle"
      :isResizable="false"
      :w="420"
      :h="320"
      :x="586"
      :y="180"
    >
      <div class="change-pasword-content-wrap flex-column">
        <div class="drag-handle"></div>
        <div class="change-pasword-content">
          <div class="change-pasword-title flex">
            <span>Đổi mật khẩu</span>
            <i @click="hideForm" class="fas fa-times"></i>
          </div>
          <div class="change-pasword-body">
            <div class="change-pasword-body-control control">
              <div class="label">
                Mật khẩu cũ <span style="color: red">*</span>
              </div>
              <input class="input" maxlength="100" type="password" placeholder="Nhập mật khẩu cũ"/>
            </div>
            <div class="change-pasword-body-control control">
              <div class="label">
                Mật khẩu mới <span style="color: red">*</span>
              </div>
              <input class="input" maxlength="100" type="password" placeholder="Nhập mật khẩu mới"/>
            </div>
            <div class="change-pasword-body-control control">
              <div class="label">
                Nhập lại mật khẩu <span style="color: red">*</span>
              </div>
              <input class="input" maxlength="100" type="password" placeholder="Nhập lại mật khẩu mới"/>
            </div>
          </div>
          <div class="change-pasword-footer flex">
            <base-button
              classButton="btn-custom-secondary"
              textButton="Hủy"
              @clickButton="hideForm"
            ></base-button>
            <base-button
              classButton="btn-custom-primary"
              textButton="Đổi"
              @clickButton="changePassword"
            ></base-button>
          </div>
        </div>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import VueDragResize from "vue-drag-resize";
import BaseButton from "../../components/base/BaseButton.vue";
export default {
  name: "ChangePassword",
  data() {
    return {};
  },
  components: {
    VueDragResize,
    BaseButton,
  },
  computed: {},
  watch: {},

  methods: {
    ...mapMutations(["formChangePassword"]),

    /**
     * Đóng form thêm mới
     */
    hideForm() {
      this.formChangePassword(false);
    },

    /**
     * Đổi mật khẩu
     */
    changePassword() {
      return;
    },
  },
};
</script>

<style scoped>
.change-pasword {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: fadeIn linear 0.1s;
}

.change-pasword-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.change-pasword-content-wrap {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  background-color: var(--white-color);
  border-radius: 4px;
}

.change-pasword-content {
  padding: 0 24px;
}

.drag-handle {
  height: 22px;
  width: 100%;
  cursor: move;
}

.change-pasword-title {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.change-pasword-title span {
  font-family: "OpenSans-SemiBold";
  font-size: 2rem;
  color: var(--black-color);
}

.change-pasword-title i {
  font-size: 2rem;
  cursor: pointer;
}

.change-pasword-body {
  font-family: "OpenSans-Regular";
  font-size: 1.3rem;
  color: var(--black-color);
  line-height: 18px;
}

.change-pasword-footer {
  justify-content: flex-end;
  align-items: center;
  margin: 16px 0 22px 0;
}

.change-pasword-footer .btn-custom {
  width: 92px;
}
</style>