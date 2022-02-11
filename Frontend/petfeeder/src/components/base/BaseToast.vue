<template>
  <div v-if="toast" id="toast-noti">
  </div>
</template>

<style>
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(calc(100% + 10px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(calc(100% + 10px));
  }
}

/* Toast Right */
#toast-noti {
  z-index: 50;
  position: fixed;
  bottom: 60px;
  right: 10px;
}

.toast-noti {
  display: flex;
  width: 400px;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  background-color: var(--white-color);
  transition: all 0.3s linear;
  animation: slideInRight ease 0.3s forwards,
    slideOutRight linear 1s 3s forwards;
}

.toast--success {
  border-left: 8px solid green;
}

.toast--warning {
  border-left: 8px solid #fade63;
}

.toast--error {
  border-left: 8px solid #ff6364;
}

.toast-wrap {
  display: flex;
  align-items: center;
}

.toast-icon {
  font-size: 2.4rem;
  margin: 0 14px;
  cursor: pointer;
}

.toast-icon--success {
  background: url(../../assets/icon/ic_ToastMessage_Success.svg);
  width: 32px;
  height: 32px;
}

.toast-icon--warning {
  background: url(../../assets/icon/ic_ToastMessage_Warning.svg);
  width: 36px;
    height: 32px;
}

.toast-icon--error {
  background: url(../../assets/icon/ic_ToastMessage_Error.svg);
  width: 36px;
    height: 32px;
}

.toast-content {
  font-family: 'OpenSans-Regular';
  font-size: 1.5rem;
  line-height: 1.8rem;
  color: #0c0c0c;
}

.toast-icon--close {
  background: url(../../assets/icon/ic_close_2.svg) no-repeat;
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.toast-icon--close:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>

<script>
import { mapState } from "vuex";
export default {
  name: "BaseToast",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      toast: (state) => state.toast,
    }),
  },
  updated() {
    let content = this.$store.state.toast[0]; //Lay element đầu tiên trong mảng các thông báo
    if (content) {
      this.$store.commit("removeToast"); //Xóa đi element vừa lấy
      const main = document.getElementById("toast-noti");
      if (main) {
        const toast = document.createElement("div");

        //Auto remove toast
        const autoRemoveId = setTimeout(() => {
          main.removeChild(toast);
        }, 6000);

        //Chủ động nhấn đóng toast
        toast.onclick = function (e) {
          if (e.target.closest(".toast-icon--close")) {
            main.removeChild(toast);
            clearTimeout(autoRemoveId);
          }
        };

        //Thêm html vào
        toast.classList.add("toast-noti", `toast--${content.type}`);
        toast.innerHTML = `
                        <div class="toast-wrap">
                            <div class="toast-icon">
                                <div class="toast-icon--${content.type}"></div>
                            </div>
                            <div class="toast-content">
                                ${content.message}
                            </div>
                        </div>
                        <div class="toast-icon--close"></div>
                    `;
        main.appendChild(toast);
      }
    } else {
      return;
    }
  },
  methods: {},
};
</script>