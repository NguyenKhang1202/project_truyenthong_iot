<template>
  <div class="login text-dark fs-3">
    <div class="container">
      <div class="row vh-100">
        <div class="col-8 layout text-dark">
          <h1 class="sologan">
            Thú cưng của bạn xứng đáng được quan tâm nhiều hơn
          </h1>
          <h1 class="text-title fw-bold">PETFEEDER</h1>
        </div>
        <div class="col-4 layout p-5">
          <div class="text-center">
            <img
              class="mb-5 rounded-circle"
              src="../../assets/img/logo.jpg"
              alt="photo"
              width="200"
              height="200"
            />
          </div>
          <h1 class="mb-5 text-center">Đăng nhập</h1>
          <form action="" class="d-flex flex-column px-3 mb-5">
            <div class="form-group mb-3">
              <label for="" class="form-label">Tên đăng nhập</label>
              <input
                v-model="inforLogin.username"
                type="text"
                class="form-control fs-3"
              />
            </div>
            <div class="form-group mb-4">
              <label for="" class="form-label">Mật khẩu</label>
              <input
                v-model="inforLogin.password"
                type="password"
                class="form-control fs-3"
              />
            </div>
            <div class="text-center">
              <button @click="login" class="btn btn-primary fs-4 w-50">
                Đăng nhập
              </button>
            </div>
          </form>

          <div class="text-center p-space">
            <router-link
              to="/forgot-password"
              class="text-decoration-none text-muted mb-5"
              >Quên mật khẩu ?</router-link
            >
          </div>

          <div class="text-center">
            <span class="me-2">Chưa có tài khoản ?</span>
            <router-link to="/register" class="text-decoration-none text-muted"
              >Đăng ký</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      inforLogin: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapMutations(["addToast", "setInforAccount"]),
    login(e) {
      e.preventDefault();
      axios
        .post("http://localhost:8000/auth/user/login", this.inforLogin)
        .then((res) => {
          if (res.status == 200) {
            window.localStorage.setItem("token", res.data.data.token);//set token
            window.localStorage.setItem("role", res.data.data.role)
            //this.setInforAccount(res.data.data.info);
            if(res.data.data.role == "user") {
              this.$router.push("/app/setting-feed");
            }
            else { 
              this.$router.push("/app/dashboard");
            }
            this.addToast({
              message: "Đăng nhập thành công",
              type: "success",
            });
          } else {
            window.localStorage.setItem("token", "");
            this.addToast({
              message: "Đăng nhập thất bại",
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          window.localStorage.setItem("token", "");
          this.addToast({
            message: "Đăng nhập thất bại",
            type: "error",
          });
        });
    },
  },
};
</script>

<style scoped>
.bg-gray {
  background: #cfc8c8;
}

.col-4.layout {
  background: #cfc8c8;
}

.col-8.layout {
  background-image: url("../../assets/img/pet-background.jpg");
  background-repeat: no-repeat;
  position: relative;
}

.p-space {
  padding-bottom: 10rem;
}

.text-title {
  color: red;
  position: absolute;
  right: 10rem;
  top: 2rem;
  font-style: bold;
  font-size: 3rem;
}
.col-8 .sologan {
  position: absolute;
  top: 52rem;
  font-family: "Allura", cursive;
  font-size: 3rem;
}
</style>