<script setup>
const comment = defineModel()
</script>

<template>
  <div class="input-box">
    <el-input
      v-model="comment"
      type="textarea"
      placeholder="平等表达，友善交流"
      resize="none"
      :autosize="true"
    />
    <el-button type="primary" class="submit-btn">发送</el-button>
  </div>
</template>

<style scoped lang="scss">
.input-box {
  flex: 1;
  margin-left: 20px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f2f3f5;
  transition: all 0.3s;

  &:hover {
    background-color: #e4e6eb;
  }

  &:focus-within {
    border: 1px solid $mainColor;
    background-color: transparent;
  }

  :deep(.el-textarea__inner) {
    outline: none;
    border: none;
    box-shadow: none;
    background-color: transparent;
    transition: all 0.3s;

    &:focus {
      min-height: 150px !important;
    }
  }

  .submit-btn {
    display: block;
    margin-left: auto;
  }
}
</style>
