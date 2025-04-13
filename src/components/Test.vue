<template>
  <div class="max-w-screen-x2 mx-auto p-4">
    <p class="mb-2 text-sm text-gray-600">test start</p>
    <div class="one-card-container">
      <div
        v-for="i in 9"
        :key="i"
        class="bg-white border rounded p-4 text-center shadow-sm"
      >
        項目 {{ i }}
      </div>
    </div>
  </div>
</template>

<script setup>
// 不需要特別寫 script 的部分
</script>

<style scoped>
/* 如要額外設定樣式可加在這 */
</style>
