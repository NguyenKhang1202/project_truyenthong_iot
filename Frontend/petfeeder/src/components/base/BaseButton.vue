<template>
  <button
    class="btn-custom"
    :class="classButton"
    @click="$emit('clickButton')"
    @keyup.enter="$emit('enterButton')"
  >
    {{ textButton }}
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  components: {},
  props: {
    classButton: {
      type: String,
    },
    textButton: {
      type: String,
    },
  },
};
</script>
        <style>
.btn-custom {
  display: flex;
  justify-content: center;
  height: 32px;
  text-align: center;
  align-items: center;
  font-size: 1.3rem;
  border-radius: 4px;
  font-family: "OpenSans-SemiBold";
  margin: 0 4px;
  outline: none;
  border: none;
  cursor: pointer;
}

.btn-custom-primary {
  background-color: var(--background-button-primary);
  color: var(--white-color);
}

.btn-custom-primary:hover {
  background-color: var(--background-button-primary-hover);
}

.btn-custom-secondary {
  background-color: var(--white-color);
  color: #3d3f4e;
  border: 1px solid #cecece;
}

.btn-custom-secondary:hover {
  background-color: #f8f8f8;
}
</style>