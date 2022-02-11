<template>
  <div class="login text-dark fs-3">
     <div class="container">
       <div class="row vh-100">
         <div class="col-8 layout text-dark">
           <h1 class="sologan">Thú cưng của bạn xứng đáng được quan tâm nhiều hơn</h1>
           <h1 class="text-title fw-bold">PETFEEDER</h1>
         </div>
         <div class="col-4 layout p-5">
           <div class="text-center"><img class="mb-5 rounded-circle" src="../../assets/img/logo.jpg" alt="photo" width="200" height="200"></div>
           <h1 class="mb-5 text-center">Đăng ký</h1>
           <!-- v-on::submit.prevent="submitForm" -->
           <form class="d-flex flex-column px-3 mb-5" @submit="submitForm">
              <div class="form-group mb-3">
                <label for="username" class="form-label" >Tên đăng nhập</label>
                <input type="text" class="form-control fs-3" id="username" placeholder="Nhập tên đăng nhập của bạn... " v-model="form.username" required>
              </div>
              <div class="form-group mb-3">
                <label for="email" class="form-label" >Email</label>
                <input type="email" class="form-control fs-3" id="email" placeholder="Nhập email của bạn..." v-model="form.email" required>
              </div>
              <div class="form-group mb-3">
                <label for="password" class="form-label" >Mật khẩu</label>
                <input type="password" id="password" placeholder="Nhập password của bạn..." class="form-control fs-3" v-model="form.password" required>
              </div>
              <div class="mb-5 text-center text-danger">{{ $data['msg'] }}</div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary fs-5 w-25 me-3 rounded">Đăng ký</button>
                <router-link to="/login" class="text-decoration-none text-muted">Đăng nhập</router-link>
              </div>
            </form>
         </div>
       </div>
     </div>
  </div>
</template>
<script>
import axios from 'axios'; 
import VueRouter from "vue-router";

export default {
  name: "Register",
  components: {},
  props: {

  },
  data(){
    return{
      form:{
        username: '',
        email: '',
        password: ''
      }, 
      msg: ''
    }
  },
  methods:{
    submitForm(e){
      e.preventDefault();
      axios.post('http://127.0.0.1:8000/auth/user/signup', this.form)
      .then((res) => {
        console.log("response");
        //perform success action
        if(res.status == "success"){
          this.$router.push({name: 'Login'});
        }
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
         this.msg = "Đăng ký thất bại, hãy kiểm tra lại thông tin đăng ký";
      })
      .finally(() => {
        //perform action in always
      });
    }
  }
  
};
</script>
<style scoped>
  .col-4.layout{
    background: #cfc8c8;
  }
  
  .col-8.layout{
    background-image: url("../../assets/img/pet-background.jpg");
    background-repeat: no-repeat;
    position: relative;
  }

  .col-8 .sologan{
    position: absolute;
    top: 52rem;
    font-family: 'Allura', cursive;
    font-size: 3rem;
  }

  .text-title{
    color: red;
    position: absolute;
    right: 10rem;
    top: 2rem;
    font-style: bold;
    font-size: 3rem;
  }
</style>