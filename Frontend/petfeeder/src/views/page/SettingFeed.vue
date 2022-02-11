<template>
  <div class="fs-3 w-85 overflow-auto scroll">
    <div class="setting-feed row pt-5">
    <div class="col-6 px-5">
      <div class="calendar-feeder w-100">
        <div class="calender-feeder-item border card shadow mb-5">
          <div class="card-header flex justify-content-center"> 
            <h3>Cho ăn theo lịch trình</h3>
          </div>
          <div class="card-body">
            <form @submit="onFresetFeeding">
            <table class="gfg">
              <tr>
                <th>Đặt giờ:</th>
                <td class="px-3 border-0">
                  <vue-timepicker v-model="form.date"></vue-timepicker>
                </td>
              </tr>
              <tr>
                <th>Lượng thức ăn:</th>
                <td class="ps-3 flex">
                  <input type="text" class="form-control me-3 fs-3" v-model="form.weight">
                  <span>(gam)</span>
                  </td>
              </tr>
              <tr>
                <th>
                  Lên lịch:
                </th>
                <td class="px-3">
                  <button class="btn-send rounded border-0 bg-success shadow d-flex justify-content-center align-items-center" style="height: 35px; width: 50px"><i class="text-white fas fa-paper-plane"></i></button>
                </td>
              </tr>
            </table>
            </form>
          </div>
        </div>
      </div>
      <!-- <div class="add-time-feeder">
        <button class="btn btn-success"><span class="fw-bold">+</span></button>
        <span class="fw-bold">Thêm mới lịch trình</span>
      </div> -->
    </div>
    <div class="col-3">
      <div class="card border rounded flex flex-column justify-content-center align-items-center shadow">
        <div class="card-header w-100 text-center">
          <h3>Cho ăn trực tiếp</h3>
        </div>
        <div class="card-body d-flex flex-wrap mb-3">
          <p class="flex">Lượng thức ăn: (gam)</p>
          <form class="d-flex align-items-center w-100" @submit="onChangeClickWeight">        
            <input type="text" class="form-control me-3 fs-3" v-model="onClickWeight.weight">
            <button type="submit" class="border-0 bg-light btn-change-onclick-weight fas fa-sync-alt"></button>     
          </form>
        </div>
        <div class="card-footer w-100 text-center">
          <button class="btn btn-success btn-feeder" @click="onClickFeed">Cho ăn</button>
        </div>
      </div>
    </div>
    <div class="col-3 px-5">
      <div class="card shadow rounded">
        <div class="card-header text-center fw-bold">
          <h3>Cho ăn tự động</h3>
        </div>
        <div class="card-body text-center">
          <p class="flex">Lượng thức ăn: (gam)</p>
          <div class="d-flex align-items-center w-100 mb-3">        
            <input type="text" class="form-control me-3 fs-3" v-model="autoFeeding.weight">
            <button type="submit" class="border-0 bg-light btn-change-onclick-weight fas fa-sync-alt" @click="changeWeightDetected"></button>  
          </div>
        </div>
        <div class="card-footer text-center">
          <label class="switch mb-2">
            <input type="checkbox" v-model="autoFeeding.status" checked>
            <span class="slider round" @click="autoFeedingFunction"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="px-4">
    <table class="table shadow rounded-3 border" v-show="items.length != 0" >
      <thead>
        <tr>
          <th>STT</th>
          <th>Lượng thức ăn (game)</th>
          <th>Thời gian (giờ:phút)</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" v-bind:key="item._id">
          <td>{{index + 1}}</td>
          <td>{{ item.weight }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.status }}</td>
          <td>
            <b-button v-b-modal="item._id" @click="showModal(item)" class="btn btn-success me-3">Chỉnh sửa</b-button>
            <button @click="deleteItem(item._id)" class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
          </td>
          <!-- The modal -->
          <b-modal :id="item._id" hide-footer title="Chỉnh sửa">
            <div class="fs-3">
              <div class="form-group mb-3">
                <label for="" class="form-lable">Lượng thức ăn</label>
                <input type="text" class="form-control fs-3" v-model="edit.weight">
              </div>
              <div class="form-group mb-3">
                <label for="" class="form-lable me-3">Thời gian</label>
                <vue-timepicker v-model="edit.date"></vue-timepicker>
              </div>
              <div class="form-group mb-3">
                <label for="" class="form-lable me-3">Trạng thái</label>
                <b-form-select v-model="edit.status" :options="edit.options" class="border border-secondary"></b-form-select>
              </div>
              <div class="form-group mb-3 d-flex justify-content-end">
                <button class="btn btn-success fs-3" @click="saveEditForm(item._id)">Save</button>
              </div>
            </div>
          </b-modal>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import AppVue from '../../App.vue';
import { mapMutations } from "vuex";
import { mapState } from "vuex";

export default {
  name: "SettingFeed",
  components: {VueTimepicker},
  props: {

  },
  data(){
    return{
      form: {
        date: {
          HH: '00',
          mm: '00'
        },
        weight: ''
      },
      onClickWeight: {
        weight: ""
      },
      fields: [
        {
          key: 'weight',
          sortable: true,
          label: 'Khối lượng'
        }, 
        {
          key: 'status',
          label: 'Trạng thái'
        }, 
        {
          key: 'date',
          sortable: true,
          label: 'Thời gian'
        },
        {
          key: 'actions',
          label: 'Hành động' 
        }
      ],
      items: [],
      modal: {
        id: 'modal-detail',
        title: '',
        content: ''
      },
      selected: 'on',
      options: [
        {value: 'on', text: 'on'},
        {value: 'off', text: 'off'}
      ],
      edit:{
        status: '',
        weight: '',
        date: {
          HH: '00',
          mm: '00'
        },
        options:[
          {value: 'on', text: 'on'},
          {value: 'off', text: 'off'}
        ]
      },
      autoFeeding: {
        weight: 0,
        status: false
      }
    }
  },
  created(){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const url = 'http://127.0.0.1:8000/api/devices/' + deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const data = {};
      axios.get(url, {headers})
      .then((res) => {
        //perform success action
        this.items = res.data.data.presetFeed;
        this.onClickWeight.weight = res.data.data.onClickFeedWeight;
        this.autoFeeding.status = res.data.data.petDetectedFeedWeight.status=='on'?true:false;
        this.autoFeeding.weight = res.data.data.petDetectedFeedWeight.weight;
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        console.log(error);
      })
      .finally(() => {
        //perform action in always
      });
  },
  watch:{
    deviceId: function(){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const url = 'http://127.0.0.1:8000/api/devices/' + deviceId;
      const data = {};
      axios.get(url, {headers})
      .then((res) => {
        //perform success action
        this.items = res.data.data.presetFeed;
        this.onClickWeight.weight = res.data.data.onClickFeedWeight;
        this.autoFeeding.status = res.data.data.petDetectedFeedWeight.status=='on'?true:false;
        this.autoFeeding.weight = res.data.data.petDetectedFeedWeight.weight;
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        console.log(error);
      })
      .finally(() => {
        //perform action in always
      });
    }
  },
  computed:{
    token(){
      return window.localStorage.getItem('token');
    },
    deviceId(){
      return this.$store.state.deviceCurrent.deviceId;
    }
  },
  methods: {
    ...mapState(["deviceCurrent"]),
    ...mapMutations(["addToast","showLoading", "hideLoading"]),
    changeWeightDetected(){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      axios.put('http://127.0.0.1:8000/api/feeding/petDetected/' + deviceId, {"weight" : this.autoFeeding.weight}, {headers})
      .then((res) => {
        //perform success action
        this.addToast({
              message: "Đã đổi lượng thức ăn !",
              type: "success",
            });
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Đổi lượng thức ăn thất bại!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    },
    onChangeClickWeight(e){
      e.preventDefault(); 
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      axios.put('http://127.0.0.1:8000/api/feeding/onClick/' + deviceId, this.onClickWeight, {headers})
      .then((res) => {
        //perform success action
        this.addToast({
              message: "Đã đổi lượng thức ăn !",
              type: "success",
            });
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Đổi lượng thức ăn thất bại!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    },

    onClickFeed(){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const url = 'http://127.0.0.1:8000/api/feeding/onClick/' + deviceId;
      console.log(url);
      const data = {};
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      axios.post(url, data, {headers})
      .then((res) => {
        //perform success action
        this.addToast({
              message: "Thú cưng của bạn đã được cho ăn!",
              type: "success",
            });
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Lỗi cho quá trình cho ăn!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    },
    onFresetFeeding(e){
      e.preventDefault();
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const url = 'http://127.0.0.1:8000/api/feeding/preset/' + deviceId;
      const data = {
        status: 'on',
        weight: this.form.weight,
        date: `${this.form.date.HH}:${this.form.date.mm}`
      };
      console.log(data);
      axios.post(url, data, {headers})
      .then((res) => {
        //perform success action
        this.items = res.data.data.presetFeed;
        this.addToast({
              message: "Thêm mới thành công lịch trình!",
              type: "success",
            });
        this.form.date.HH = '00';
        this.form.date.mm = '00';
        this.form.weight = 0
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Thêm mới thất bại!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    },
    info(item, index, button) {
      console.log(item);
      this.modal.title = `Row index: ${index}`
      this.modal.content = JSON.stringify(item, null, 2);
      
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    toggleDetails(){
      alert("hello");
    },
    showModal(item){
      this.edit.status = item.status;
      this.edit.weight = item.weight;
      this.edit.date.HH = item.date.substring(0,2);
      this.edit.date.mm = item.date.substring(3);
    },
    saveEditForm(id){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const url = 'http://127.0.0.1:8000/api/feeding/preset/' + deviceId + '/' + id;
      console.log(url);
      const data = {
        status: this.edit.status,
        weight: this.edit.weight,
        date: `${this.edit.date.HH}:${this.edit.date.mm}`
      };
      console.log(data);
      axios.put(url, data, {headers})
      .then((res) => {
        //perform success action
        this.items = res.data.data.presetFeed;
        this.addToast({
              message: "Chỉnh sửa thành công lịch trình!",
              type: "success",
            });
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        console.log(error);
        this.addToast({
              message: "Chỉnh sửa thất bại!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
        this.$
      });
    },
    deleteItem(id){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const url = "http://127.0.0.1:8000/api/feeding/preset/" + deviceId + '/' + id;
      axios.delete(url, {headers})
      .then((res) => {
        //perform success action
        this.items = res.data.data.presetFeed;
        this.addToast({
              message: "Xóa thành công!",
              type: "success",
            });
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Xóa thất bại!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    },
    autoFeedingFunction(){
      const deviceId = this.$store.state.deviceCurrent.deviceId;
      const token = window.localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
      const url = 'http://127.0.0.1:8000/api/feeding/petDetected/' + deviceId;
      const data = {
        "status": this.autoFeeding.status?"off":"on"
      };
      axios.post(url, data, {headers})
      .then((res) => {
        //perform success action
        if(this.autoFeeding.status){
          this.addToast({
              message: "Cho ăn tự động được bật!",
              type: "success",
            });
        }else{
          this.addToast({
              message: "Cho ăn tự động đã tắt!",
              type: "error",
            });
        }
        
      })
      .catch((error) => {
        //error.response.status check status code
        //error network
        this.addToast({
              message: "Lỗi trong quá trình cho ăn!",
              type: "error",
            });
      })
      .finally(() => {
        //perform action in always
      });
    }
    
  }
};
</script>

<style>
.w-85{
  width: 85%;
}
.btn-change-onclick-weight:hover{
  color: rgb(106, 221, 52);
}

.btn-send{
  transition: transform .3s;
}

.btn-send:hover{
  transform: scale(1.1);
}

.btn-feeder{
  width: 100px;
  height: 40px;
}

.feeder-container{
  height: 180px;
}

.tbl{
  border-collapse: collapse;
}

.gfg {
    border-collapse:separate;
    border-spacing:0 15px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(204, 192, 192);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: rgb(255, 255, 255);
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #179e2d;
}

input:focus + .slider {
  box-shadow: 0 0 1px #245883;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.add-time-feeder{
  position: absolute;
  bottom: 2rem;
  right: 28rem;
}
</style>
