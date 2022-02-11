<template>
    <div class="popup">
        <div class="popup-overlay"></div>
        <VueDragResize :isResizable="false" dragHandle="" :w="356" :h="160" :x="586" :y="300">
            <div class="popup-content flex">
                <div class="popup-content-title flex">
                    <div class="popup-content-title-text">Thông báo</div>
                    <div @click="$emit('clickIcon')" class="popup-content-title-icon"></div>
                </div>
                <div class="popup-content-body">
                    {{ popupText }}
                </div>
                <div class="popup-content-footer flex">
                    <base-button
                        v-if="button1"
                        classButton="btn-secondary"
                        :textButton="textButton1"
                        @clickButton="$emit('clickButton1')"
                    ></base-button>
                    <base-button
                        v-if="button2"
                        classButton="btn-secondary"
                        :textButton="textButton2"
                        @clickButton="$emit('clickButton2')"
                    ></base-button>
                    <base-button
                        v-if="button3"
                        classButton="btn-primary"
                        :textButton="textButton3"
                        @clickButton="$emit('clickButton3')"
                    ></base-button>
                </div>
            </div>
        </VueDragResize>
    </div>
</template>

<style>

.popup {
    position: fixed;
	z-index: 10;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	animation: fadeIn linear .1s;
}

.popup-overlay {
    position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
}

.popup-content {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--white-color);
    padding: 0 24px;
    border-radius: 4px;
}

.popup-content-title {
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
}

.popup-content-title-text {
    font-family: OpenSans-SemiBold;
    font-size: 2rem;
    color: var(--black-color);
}

.popup-content-title-icon {
    height: 24px;
	width: 24px;
    margin: -10px -10px 0 0;
	border-radius: 50%;
	cursor: pointer;
    background: transparent url(../../assets/icon/ic_close_2.svg) no-repeat;
}


.popup-content-body {
    font-family: OpenSans-Regular;
    font-size: 1.3rem;
    color: var(--black-color);
    line-height: 18px;
}

.popup-content-footer {
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 24px;
}

.popup-content-footer .btn {
    width: 92px;
}

</style>

<script>
import VueDragResize from 'vue-drag-resize'
import BaseButton from './BaseButton.vue'
export default {
    name: 'BasePopup',
    data() {
        return {}
    },
    components: {
        VueDragResize,
        BaseButton,
    },
    computed: {
        
    },
    watch: {
        
    },
    props: ['popupText', 'button1', 'button2', 'button3', 'textButton1', 'textButton2', 'textButton3'],

    methods: {
        
    }

}
</script>