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
           <h1 class="mb-5 text-center">Quên mật khẩu</h1>
           <form action="" class="d-flex flex-column px-3 mb-5">
              <div class="form-group mb-3">
                <label for="" class="form-label" >Tên đăng nhập</label>
                <input type="text" class="form-control fs-3">
              </div>
              <div class="form-group mb-5">
                <label for="" class="form-label" >Nhập lại mật khẩu mới</label>
                <input type="password" class="form-control fs-3" >
              </div>
              <div class="text-center">
                <button class="btn btn-primary fs-4 w-50" >Đổi mật khẩu</button>
              </div>
            </form>

            <div class="text-center"> 
              <router-link to="/register" class="text-decoration-none me-5">Đăng ký</router-link>
              <router-link to="/login" class="text-decoration-none">Đăng nhập</router-link>
            </div>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: "ForgotPassword",
  components: {},
  props: {

  },
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

  .p-space{
    padding-bottom: 10rem;
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