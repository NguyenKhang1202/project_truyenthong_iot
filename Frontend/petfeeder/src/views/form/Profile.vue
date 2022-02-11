<template>
  <div class="profile">
    <div class="profile-overlay"></div>
    <vue-drag-resize
      dragHandle=".drag-handle"
      :isResizable="false"
      :w="650"
      :minw="650"
      :h="388"
      :minh="388"
      :x="440"
      :y="180"
    >
      <div class="profile-content-wrap flex-column">
        <div class="drag-handle"></div>
        <div class="profile-content">
          <div class="profile-title flex">
            <span>Thông tin tài khoản</span>
            <i @click="hideForm" class="fas fa-times"></i>
          </div>
          <div class="profile-body flex">
            <div class="profile-body-left flex-column">
              <img v-if="imageAvatar" :src="imageAvatar" />
              <img v-else src="../../assets/img/avatar.svg" />
              <label for="image-upload">
                <span>Chọn ảnh</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg"
                @change="uploadImage"
              />
            </div>
            <div class="profile-body-right flex-column">
              <!-- Họ và tên -->
              <div class="body-row flex-column">
                <div class="body-column">
                  <div class="body-item control">
                    <div class="label">
                      Họ và tên <span style="color: red">*</span>
                    </div>
                    <input
                      class="input"
                      maxlength="100"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>
              </div>

              <!-- Ngày sinh + Giới tính -->
              <div class="body-row flex">
                <div class="body-column">
                  <div class="body-item body-item-birthday control">
                    <div class="label">Ngày sinh</div>
                    <date-picker
                    v-model="date"
                      value-type="YYYY-MM-DD"
                      format="DD/MM/YYYY"
                      placeholder="__/__/____"
                      :disabled-date="(date) => date > new Date()"
                      lang="lang"
                    ></date-picker>
                  </div>
                </div>
                <div class="body-column">
                  <div class="body-item body-item-gender-wrap control">
                    <div class="label">Giới tính</div>
                    <div class="body-item-gender">
                      <label>
                        <input
                          name="radio"
                          type="radio"
                          value="0"
                          :checked="true"
                        />
                        <span class="body-item-gender-checkmark"></span>
                        <span class="body-item-gender-text">Nam</span>
                      </label>
                      <label>
                        <input
                          name="radio"
                          type="radio"
                          value="1"
                          :checked="false"
                        />
                        <span class="body-item-gender-checkmark"></span>
                        <span class="body-item-gender-text">Nữ</span>
                      </label>
                      <label>
                        <input
                          name="radio"
                          type="radio"
                          value="2"
                          :checked="false"
                        />
                        <span class="body-item-gender-checkmark"></span>
                        <span class="body-item-gender-text">Khác</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Số điện thoại -->
              <div class="body-row flex-column">
                <div class="body-column">
                  <div class="body-item control">
                    <div class="label">
                      Số điện thoại <span style="color: red">*</span>
                    </div>
                    <input
                      class="input"
                      maxlength="100"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="body-row flex-column">
                <div class="body-column">
                  <div class="body-item control">
                    <div class="label">Email</div>
                    <input
                      class="input"
                      maxlength="100"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-footer flex">
            <base-button
              classButton="btn-custom-secondary"
              textButton="Đóng"
              @clickButton="hideForm"
            ></base-button>
            <base-button
              classButton="btn-custom-primary"
              textButton="Lưu"
              @clickButton="saveProfile"
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
//Datepicker
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
export default {
  name: "Profile",
  data() {
    return {
      //Tiếng việt cho vue2-datepicker
      lang: "vi",
      //ảnh hiển thị
      imageAvatar: null,
      date: null,
    };
  },
  components: {
    VueDragResize,
    BaseButton,
    DatePicker,
  },
  computed: {},
  watch: {},

  methods: {
    ...mapMutations(["formProfile"]),

    /**
     * Đóng form
     */
    hideForm() {
      this.formProfile(false);
    },

    /**
     * Lưu thông tin
     */
    saveProfile() {
      return;
    },

    /**
     * Tải ảnh lên
     */
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.imageAvatar = e.target.result;
      };
    },
  },
};
</script>

<style scoped>
.profile {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: fadeIn linear 0.1s;
}

.profile-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.profile-content-wrap {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  background-color: var(--white-color);
  border-radius: 4px;
}

.profile-content {
  padding: 0 24px;
}

.drag-handle {
  height: 22px;
  width: 100%;
  cursor: move;
}

.profile-title {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.profile-title span {
  font-family: "OpenSans-SemiBold";
  font-size: 2rem;
  color: var(--black-color);
}

.profile-title i {
  font-size: 2rem;
  cursor: pointer;
}

.profile-body {
  font-family: "OpenSans-Regular";
  font-size: 1.3rem;
  color: var(--black-color);
  line-height: 18px;
  align-items: center;
}

.profile-body-left {
  padding-right: 20px;
}

.profile-body-left img {
  width: 150px;
  height: 150px;
  border: 1px solid #e9e9e9;
}

.profile-body-left label {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: OpenSans-SemiBold;
  font-size: 1.3rem;
  height: 32px;
  color: var(--white-color);
  background-color: var(--background-button-primary);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
}

.profile-body-left input[type="file"] {
  display: none;
}

.profile-body-right {
  flex: 1;
  padding-left: 20px;
  border-left: 1px solid #e9e9e9;
}

.profile-body-right .body-row {
}

.profile-body-right .body-column {
  width: 100%;
}

.profile-body-right .body-item {
}

.profile-body-right .body-item-birthday {
  margin-right: 10px;
}

.profile-body-right .body-item-gender-wrap {
  margin-left: 10px;
}

.body-item-gender {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 44px 0 0;
}

.body-item-gender label {
  position: relative;
}

.body-item-gender label:focus-within .body-item-gender-checkmark {
  box-shadow: 0 0 4px var(--background-button-primary-hover);
}

.body-item-gender label input {
  opacity: 0;
}

/* Khi chọn 1 item hiện border */
.body-item-gender label input:checked ~ .body-item-gender-checkmark {
  border: 1px solid var(--background-button-primary);
}

/*Khi chọn 1 item hiện border tâm màu xanh (là lớp giả được css bên dưới) */
.body-item-gender label input:checked ~ .body-item-gender-checkmark::after {
  display: block;
}

.body-item-gender-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
  cursor: pointer;
}

.body-item-gender-checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.body-item-gender label .body-item-gender-checkmark::after {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  background-color: var(--background-button-primary);
}

.body-item-gender-text {
  position: absolute;
  font-size: 1.3rem;
  top: 0px;
  left: 22px;
  cursor: pointer;
}

.profile-footer {
  justify-content: flex-end;
  align-items: center;
  margin: 16px 0 22px 0;
}

.profile-footer .btn-custom {
  width: 92px;
}
</style>