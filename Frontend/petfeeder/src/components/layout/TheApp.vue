<template>
  <div ref="viewPage" class="app">
    <the-header></the-header>
    <div class="content flex">
      <the-navbar></the-navbar>
      <router-view ref="viewPage"/>
      <add-device v-if="formAddDevice"></add-device>
      <profile v-if="formProfile"></profile>
      <change-password v-if="formChangePassword"></change-password>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TheHeader from "./TheHeader.vue";
import TheNavbar from "./TheNavbar.vue";
import AddDevice from "../../views/form/AddDevice.vue";
import Profile from "../../views/form/Profile.vue";
import ChangePassword from "../../views/form/ChangePassword.vue";

export default {
  name: "TheApp",
  components: {
    TheHeader,
    TheNavbar,
    AddDevice,
    Profile,
    ChangePassword,
  },
  computed: {
    ...mapState(['formAddDevice', 'formProfile', 'formChangePassword']),
  },
};
</script>

<style>
/* Fontawesome */
@import "../../lib/fontawesome-free-5.15.4-web/fontawesome-free-5.15.4-web/css/all.css";

:root {
  --white-color: #ffffff;
  --black-color: #000;
  --background-page: #f8f8f8;
  --background-header-sidebar: #24344b;
  --background-button-primary: #2ca01c;
  --background-button-primary-hover: #35bf22;
}

* {
  box-sizing: inherit;
  margin: 0;
}

html {
  font-size: 62.5%;
  line-height: 1.6rem;
  font-family: "OpenSans-Regular";
  box-sizing: border-box;
}

body {
  overflow: hidden;
  position: relative;
}

/* Phông chữ */
@font-face {
  font-family: "iconfont";
  src: url("../../assets/fonts/iconfont.woff");
}

@font-face {
  font-family: "OpenSans-Bold";
  src: url("../../assets/fonts/OpenSans-Bold.woff2");
}

@font-face {
  font-family: "OpenSans-Italic";
  src: url("../../assets/fonts/OpenSans-Italic.woff2");
}

@font-face {
  font-family: "OpenSans-Light";
  src: url("../../assets/fonts/OpenSans-Light.woff2");
}

@font-face {
  font-family: "OpenSans-LightItalic";
  src: url("../../assets/fonts/OpenSans-LightItalic.woff2");
}

@font-face {
  font-family: "OpenSans-Regular";
  src: url("../../assets/fonts/OpenSans-Regular.woff2");
}

@font-face {
  font-family: "OpenSans-SemiBold";
  src: url("../../assets/fonts/OpenSans-SemiBold.woff2");
}

@font-face {
  font-family: "OpenSans-SemiBoldItalic";
  src: url("../../assets/fonts/OpenSans-SemiBoldItalic.woff2");
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* css scroll */
.scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #a8a8a8;
}

.scroll::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f1f1f2;
}

/* flex */
.flex {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

/* Css vue datepicker */
.mx-calendar-content .cell.active {
  color: var(--black-color);
  background-color: #f0f0f0;
  border-radius: 50%;
}

.mx-calendar-content .cell {
  color: var(--black-color);
}

.mx-calendar-content .cell:hover {
  background-color: #dbefdc;
  color: #4cb050;
  font-weight: bold;
  border-radius: 50%;
}

.mx-table-year .cell,
.mx-table-month .cell {
  border-radius: 0 !important;
}

.mx-btn:hover {
  border-color: #4cb050;
  color: #4cb050;
}

.mx-calendar-content .cell.disabled {
  cursor: not-allowed;
  background-color: #f3f3f3 !important;
  color: #ccc !important;
  border-radius: 0 !important;
}

/* Css cho combobox */
.multiselect {
	flex: 1;
}

.multiselect__select {
	height: 40px !important;
	width: 30px !important;
}

.multiselect__tags {
	display: flex !important;
	align-items: center !important;
	justify-content: space-between;
	min-height: 42px !important;
	height: 42px !important;
	border-radius: 4px !important;
	border: 1px solid #cccccc !important;
	font-size: 1.6rem !important;
    color: #212121 !important;
	padding: 5px 40px 0 8px !important;
}

.focus-combobox {
	border: 1px solid #08bf1e !important;
}

.multiselect__tags input::placeholder {
	color: #bebebe;
	bottom: 12px;
}

.multiselect__placeholder {
	display: none !important;
}

.multiselect, .multiselect__input, .multiselect__single {
	font-size: 1.6rem !important;
}

.multiselect__input, .multiselect__single {
	top: 2px
}

.multiselect__option--highlight {
	background: #E5F3FF !important;
	color: var(--black-color) !important;
}

.multiselect__option--selected.multiselect__option--highlight:after {
	display: none;
}

.multiselect__option--highlight:after {
	display: none;
}

/* Mỗi item */
.multiselect__option {
	position: relative;
}

.multiselect__option span {
	padding-left: 6px;
}

/* Item đang được chọn */
.multiselect__option--selected {
	color: #35495e !important;
	background: #f3f3f3 !important;
	font-weight: 500 !important;
}

.multiselect__option--selected:after {
	display: none;
}

.multiselect__option--selected:hover {
	color: #35495e !important;
	background: #f3f3f3 !important;
	font-weight: 500 !important;
}

.multiselect__tags-wrap {
	display: flex !important;
	align-items: center !important;
}

.multiselect__tag {
	margin-right: 6px !important;
}

.employee-detail-form-column-subject .multiselect__tag {
	max-width: 82px !important;
}

.employee-detail-form-column-equipmentroom .multiselect__tag {
	max-width: 120px !important;
}

.multiselect__strong {
	display: none !important;
}

.multiselect__content-wrapper {
  border-radius: 5px;
}

.multiselect__content-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.multiselect__content-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #a8a8a8;
}

.multiselect__content-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f1f1f2;
}

/* css trang app */
.app {
  width: 100%;
  background-image: url("../../assets/img/img-background.jpg");
}

.content {
  width: 80%;
  height: calc(100vh - 90px);
  margin: 0 auto;
  background-color: var(--white-color);
}

/* css control input */
.control {
  padding: 6px 0;
}

.control .label {
  color: #757575;
  font-size: 1.3rem;
  width: 100%;
  padding-bottom: 4px;
}

.control .input {
  font-family: "OpenSans-Regular";
  font-size: 1.3rem;
  width: 100%;
  height: 32px;
  color: #212121;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  padding: 0 14px;
}

.control .input::placeholder {
  font-family: "OpenSans-Italic";
  font-size: 1.3rem;
}
</style>
