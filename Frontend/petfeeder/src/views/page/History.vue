<template>
  <div class="history flex">
    <div v-if="isShowFilter" class="history-filter flex-column">
      <div class="history-filter-title flex">
        <div class="title-left flex">
          <i class="fas fa-filter"></i>
          <div class="title-left-text">Điều kiện lọc</div>
        </div>
        <div class="title-right">
          <i @click="hideFilter" class="fas fa-angle-double-left"></i>
        </div>
      </div>
      <div class="history-filter-content flex-column">
        <div class="content-feed flex-column">
          <div class="content-feed-label flex">
            <switches v-model="switchWeightFeed"></switches>
            <span>Lượng thức ăn</span>
          </div>
          <div v-show="switchWeightFeed" class="content-feed-detail flex">
            <multiselect
              v-model="valueOperator"
              class="feed-detail-operator"
              :options="optionsOperator"
              :custom-label="displayOperator"
              :allow-empty="false"
              placeholder=""
              deselect-label=""
              label="operatorName"
              track-by="operatorID"
            ></multiselect>
            <input type="number" placeholder="Lượng thức ăn" maxlength="20" />
            <multiselect
              v-model="valueUnit"
              class="feed-detail-unit"
              :options="weightUnit"
              :custom-label="displayUnit"
              :allow-empty="false"
              placeholder=""
              deselect-label=""
              label="unitName"
              track-by="unitID"
            ></multiselect>
          </div>
        </div>
        <div class="content-time flex-column">
          <div class="content-time-label">
            <switches v-model="switchTimeFeed"></switches>
            <span>Thời gian cho ăn</span>
          </div>
          <div v-show="switchTimeFeed" class="content-time-detail flex-column">
            <div class="content-time-item content-time-from">
              <div class="content-time-item-label content-time-from-label">
                <span v-show="switchTimeFeedTo">Từ: </span
                ><span v-show="!switchTimeFeedTo">Trong ngày: </span>
              </div>
              <div
                class="
                  content-time-item-detail content-time-from-detail
                  flex-column
                "
              >
                <date-picker
                  v-model="dateFeedFrom"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  placeholder="__/__/____"
                  :disabled-date="(date) => date > new Date()"
                  lang="lang"
                ></date-picker>
                <div class="hour from-hour flex">
                  <vue-timepicker></vue-timepicker>
                  <i v-show="!switchTimeFeedTo" class="fas fa-arrow-right"></i>
                  <vue-timepicker v-show="!switchTimeFeedTo"></vue-timepicker>
                </div>
              </div>
            </div>
            <div class="content-time-item content-time-to">
              <div class="content-time-item-label content-time-to-label">
                <span>Đến: </span>
                <switches v-model="switchTimeFeedTo"></switches>
              </div>
              <div
                v-show="switchTimeFeedTo"
                class="
                  content-time-item-detail content-time-to-detail
                  flex-column
                "
              >
                <date-picker
                  v-model="dateFeedTo"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  placeholder="__/__/____"
                  :disabled-date="(date) => date > new Date()"
                  lang="lang"
                ></date-picker>
                <div class="hour to-hour flex">
                  <vue-timepicker></vue-timepicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="history-filter-footer flex">
        <base-button
          class="btn-filter"
          classButton="btn-primary"
          textButton="Tra cứu"
          @clickButton="filterHistory"
        ></base-button>
      </div>
    </div>
    <div v-else class="history-filter-hide flex-column">
      <div class="filter-hide-title flex">
        <i @click="showFilter" class="fas fa-filter"></i>
      </div>
      <div class="filter-hide-text">Điều kiện lọc</div>
    </div>
    <div class="history-grid scroll">
      <table cellspacing="0">
        <thead>
          <tr>
            <th title="Ngày cho ăn">Ngày cho ăn</th>
            <th title="Thời điểm cho ăn">Thời điểm cho ăn</th>
            <th title="Lượng thức ăn">Lượng thức ăn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(history, index) in historyDevice"
          :key="index">
            <td>{{ history.date }}</td>
            <td>{{ history.time }}</td>
            <td>{{ history.weight }}g</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BaseButton from "../../components/base/BaseButton.vue";
import Switches from "vue-switches";
import Multiselect from "vue-multiselect";
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "History",
  components: { BaseButton, Switches, Multiselect, VueTimepicker, DatePicker },
  props: {},
  data() {
    return {
      //Tiếng việt cho vue2-datepicker
      lang: "vi",
      //Ẩn hiện bộ lọc
      isShowFilter: false,
      dateFeedFrom: null,
      dateFeedTo: null,
      //Đánh dấu hiển thị lọc theo lượng thức ăn
      switchWeightFeed: false,
      //Đánh dấu hiển thị lọc theo thời gian cho ăn
      switchTimeFeed: false,
      //Đánh dấu hiển thị lọc theo thời gian cho ăn từ -> đến
      switchTimeFeedTo: true,
      //Toán tử lọc lượng thức ăn
      valueOperator: { operatorID: 1, operatorName: "Bằng" },
      optionsOperator: [
        { operatorID: 1, operatorName: "Bằng" },
        { operatorID: 2, operatorName: "Lớn hơn" },
        { operatorID: 3, operatorName: "Nhỏ hơn" },
      ],
      //combo trọng lượng thức ăn
      valueUnit: { unitID: 1, unitName: "g" },
      weightUnit: [
        { unitID: 1, unitName: "g" },
        { unitID: 2, unitName: "kg" },
      ],

      //thông tin lịch sử
      historyDevice: [], 
    };
  },

  created() {
    this.getHistoryDevice();
  },

  computed: {
    ...mapState(["deviceCurrent"]),
  },

  watch: {
    deviceCurrent: function () {
      this.getHistoryDevice();
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

    //Thêm class scroll cho combo chọn giờ, phút
    let tagHours = document.querySelectorAll(".select-list .hours");
    tagHours.forEach((item) => {
      item.classList.add("scroll");
    });
    let tagMinutes = document.querySelectorAll(".select-list .minutes");
    tagMinutes.forEach((item) => {
      item.classList.add("scroll");
    });
  },

  methods: {
    ...mapMutations(["addToast", "showLoading", "hideLoading"]),

    async getHistoryDevice() {
      await this.showLoading();
      if (parseInt(this.deviceCurrent.deviceId)) {
        await axios
          .get(
            `http://localhost:8000/api/history/${parseInt(
              this.deviceCurrent.deviceId
            )}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            if (response.data.status == "success") {
              this.historyDevice = this.convertHistory(response.data.data.detail);
            } else {
              this.addToast({
                message: `${response.data.msg}`,
                type: "error",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.addToast({
              message: "Lấy thông tin lịch sử cho ăn thất bại!",
              type: "error",
            });
          });
      }
      await this.hideLoading();
    },

    /**
     * Convert thông tin lịch sử lấy về thành dữ liệu hiển thị lên màn hình
     * Trả về dạng mảng obj {
     *    weight
     *    date
     *    time
     * }
     */
    convertHistory(data) {
      if(data.length>0) {
        let history = [];
        data.map((item) => {
          let dateTime = new Date(item.time);
          let arrDateTime = dateTime.toLocaleString().split(",");
          history.push({
            weight: item.weight,
            date: arrDateTime[0],
            time: arrDateTime[1],
          })
        });
        return history;
      }
      else { 
        return [];
      }
    },

    //Cấu hình hiển thị toán tử lọc lượng thức ăn
    displayOperator({ operatorName }) {
      return `${operatorName}`;
    },
    //Cấu hình hiển thị combo đơn vị đo
    displayUnit({ unitName }) {
      return `${unitName}`;
    },

    //Lọc
    filterHistory() {
      return;
    },

    //Ẩn bộ Lọc
    hideFilter(e) {
      this.isShowFilter = false;
    },

    //Hiện bộ Lọc
    showFilter(e) {
      this.isShowFilter = true;
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.history {
  flex: 1;
  background-color: var(--background-page);
}

/* css bộ lọc lúc ẩn */
.history-filter-hide {
  position: relative;
  flex: 0.3;
  background-color: var(--white-color);
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  transition: all linear 0.1s;
  animation: fadeIn linear 0.2s;
  align-items: center;
}

.filter-hide-title {
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid #dddddd;
}

.filter-hide-title i {
  font-size: 3rem;
  color: #2979ff;
  padding: 20px;
  border-radius: 4px;
  cursor: pointer;
}

.filter-hide-text {
  position: absolute;
  font-family: "OpenSans-SemiBold";
  font-size: 2rem;
  width: 300px;
  top: 220px;
  transform: rotate(-90deg);
}

/* css tiêu đề bộ lọc */
.history-filter {
  flex: 2;
  background-color: var(--white-color);
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  transition: all linear 0.1s;
  animation: fadeIn linear 0.2s;
}

.history-filter-title {
  height: 60px;
  justify-content: space-between;
  align-items: center;
}

.history-filter-title .title-left {
}

.history-filter-title .title-left i {
  font-size: 1.6rem;
  color: #ffa53a;
  padding: 0 10px;
}

.history-filter-title .title-left-text {
  font-family: "OpenSans-SemiBold";
  font-size: 1.7rem;
}

.history-filter-title .title-right {
}

.history-filter-title .title-right i {
  font-size: 3rem;
  color: #ff6a6a;
  padding: 6px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* css nội dung chính bộ lọc */
.history-filter-content {
  flex: 1;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 40px 10px;
}

.content-feed {
  margin-bottom: 30px;
}

.content-feed-label {
  align-items: center;
  padding-bottom: 20px;
}

.content-feed-label span {
  font-size: 1.6rem;
  padding: 0 10px;
}

.content-feed-detail {
  animation: fadeIn linear 0.2s;
}

.content-feed-detail input {
  font-family: "OpenSans-Regular";
  font-size: 1.4rem;
  height: 40px;
  width: 140px;
  color: #212121;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  padding: 0 4px 0 14px;
  margin: 0 10px;
}

.feed-detail-operator {
  flex: 3;
  font-size: 0.2rem;
}

.feed-detail-unit {
  flex: 2;
}

.content-feed-detail .multiselect,
.multiselect__input {
  font-size: 1.4rem !important;
}

::v-deep .content-feed-detail .multiselect__single {
  font-size: 1.4rem !important;
  margin-bottom: 6px;
}

::v-deep .content-feed-detail .multiselect__tags {
  min-height: 40px !important;
  height: 40px !important;
}

.content-time {
}

.content-time-label {
}

.content-time-label span {
  font-size: 1.6rem;
  padding: 0 10px;
}

.content-time-detail {
  padding: 0 20px;
  animation: fadeIn linear 0.2s;
}

.content-time-item {
  padding-top: 10px;
}

.content-time-item-label {
  padding-bottom: 6px;
}

.content-time-item-label span {
  font-size: 1.4rem;
  padding: 0 10px;
}

.content-time-item-detail {
}

::v-deep .content-time .mx-input {
  height: 40px;
  font-size: 1.4rem;
  padding-top: 10px;
}

.hour {
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
}

.hour i {
  font-size: 1.6rem;
  padding: 0 20px;
  color: #2979ff;
}

/* css vue switch */
::v-deep .vue-switcher-theme--default.vue-switcher-color--default div {
  background-color: #70a1f3;
}

::v-deep
  .vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div {
  background-color: #aaa;
}

::v-deep .vue-switcher-theme--default.vue-switcher-color--default div:after {
  background-color: #2979ff;
}

::v-deep
  .vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked
  div:after {
  background-color: #c4c4c4;
}

/* css giờ */
.vue__time-picker {
  flex: 1;
}

::v-deep .vue__time-picker input.display-time {
  height: 40px;
  width: 100%;
  font-size: 1.4em;
  border-radius: 4px;
  padding: 4px 0 0 20px;
  outline: none;
}

::v-deep .vue__time-picker .dropdown {
  width: 100% !important;
  top: calc(2.2em + 16px);
}

::v-deep .vue__time-picker .dropdown .select-list {
  width: 100% !important;
}

::v-deep .vue__time-picker .dropdown ul li {
  font-size: 1.2em;
}

::v-deep .vue__time-picker .controls .char {
  font-size: 2.2rem;
  padding: 6px 10px 0 0;
}

/* css footer bộ lọc */
.history-filter-footer {
  height: 60px;
  align-items: center;
  justify-content: flex-end;
}

.btn-filter {
  width: 80px;
  height: 36px;
  margin-right: 30px;
  background-color: #2979ff;
}

.btn-filter:hover {
  background-color: #3f84f6;
}

.history-grid {
  overflow: auto;
  flex: 3;
  margin: 20px;
  background-color: var(--white-color);
  border-radius: 6px;
  border: 2px solid #d5d8e6;
  transition: all linear 0.1s;
  animation: fadeIn linear 0.2s;
}

.history-grid::-webkit-scrollbar-track {
  margin-top: 40px;
}

.history-grid table {
}

.history-grid table tr {
  animation: fadeIn linear 0.6s;
}

.history-grid table tr:hover {
  background-color: #e5f3ff !important;
}

.history-grid table thead {
}

.history-grid table thead tr {
  z-index: 1;
  position: sticky;
  top: 0;
  height: 40px;
}

.history-grid table thead tr th {
  padding-left: 40px;
  min-width: 120px;
  width: 12%;
  font-family: "OpenSans-SemiBold";
  background-color: #f5f6fa;
  border-bottom: 2px solid #d5d8e6;
  border-right: 1px solid #d5d8e6;
  font-size: 1.6rem;
  cursor: default;
}

.history-grid table tbody {
}

.history-grid table tbody tr:nth-child(odd) {
  background-color: white;
}

.history-grid table tbody tr:nth-child(even) {
  background-color: #f5f6fa;
}

.history-grid table tbody tr td {
  text-align: center;
  font-size: 1.4rem;
  height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #d5d8e6;
  border-right: 1px solid #d5d8e6;
}
</style>
