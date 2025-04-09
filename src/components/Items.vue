<template>
  <div class="flex flex-wrap items-center gap-4">
    <div
      v-for="(item, index) in localItems"
      :key="index"
      class="flex items-center space-x-2"
    >
      <input
        type="checkbox"
        v-model="item.checked"
        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
      <span class="text-sm">{{ item.name }}</span>

      <span class="text-sm text-gray-500">單價</span>
      <input
        type="number"
        v-model.number="item.price"
        class="w-16 p-1 border rounded-md text-sm"
        :disabled="!item.checked"
      />

      <span class="text-sm text-gray-500">數量</span>
      <input
        type="number"
        v-model.number="item.amount"
        class="w-12 p-1 border rounded-md text-sm"
        :disabled="!item.checked"
      />

      <span class="text-sm text-gray-500">備註</span>
      <input
        type="text"
        v-model="item.note"
        class="w-24 p-1 border rounded-md text-sm"
        :disabled="!item.checked"
      />
      <span class="text-sm text-gray-500">單位</span>
      <input
        type="text"
        v-model="item.unit"
        class="w-24 p-1 border rounded-md text-sm"
        :disabled="!item.checked"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

// ✅ 定義 props
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

// ✅ 定義 emit
const emit = defineEmits(['update:items']);

// ✅ 使用 localItems 作為本地 clone，不直接修改 props
const localItems = ref([]);
const isLoading = ref(false); // ✅ 防止載入時觸發 watch
let prevItems = JSON.stringify([]); // ✅ 防止重複觸發

// ✅ 接收到 props 的變化 → 更新 localItems，但不觸發 emit
watch(
  () => props.items,
  (val) => {
    if (val) {
      isLoading.value = true; // 🚨 開始載入
      localItems.value = JSON.parse(JSON.stringify(val));
      prevItems = JSON.stringify(localItems.value); // 記錄當前值
      isLoading.value = false; // ✅ 完成載入
    }
  },
  { immediate: true, deep: true }
);

// ✅ 當 localItems 改變時 → emit 更新給父層
watch(
  localItems,
  async (val) => {
    if (!isLoading.value) {
      await nextTick(); // 確保 DOM 更新後再執行

      // ✅ 只有當 localItems 變更時才 emit
      const currentItems = JSON.stringify(val);
      if (currentItems !== prevItems) {
        prevItems = currentItems;
        emit('update:items', JSON.parse(currentItems));
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
/* 可自定義樣式 */
</style>
