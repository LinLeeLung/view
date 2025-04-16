<template>
  <div class="mb-2">
    <label class="text-sm">
      <input type="checkbox" v-model="showAll" class="mr-1" />
      顯示所有項目
    </label>
  </div>
  <div class="grid grid-cols-3 gap-2">
    <ItemRow
      v-for="(item, index) in filteredItems"
      :key="index"
      :item="item"
      @update="onItemUpdate(index)"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import ItemRow from './ItemRow.vue';

const props = defineProps({ items: Array });
const emit = defineEmits(['update:items']);

const showAll = ref(false);
const localItems = ref([]);
const isLoading = ref(false);
let prevItems = JSON.stringify([]);

const filteredItems = computed(() =>
  showAll.value ? localItems.value : localItems.value.filter(item => item.checked)
);

// ⬇️ 當 props 改變 → 同步到 localItems
watch(
  () => props.items,
  (val) => {
    if (val) {
      isLoading.value = true;
      localItems.value = JSON.parse(JSON.stringify(val)); // 深拷貝
      prevItems = JSON.stringify(localItems.value);
      isLoading.value = false;
    }
  },
  { immediate: true, deep: true }
);

// ⬇️ 當 localItems 被使用者修改 → emit 回父層
watch(
  localItems,
  async (val) => {
    if (!isLoading.value) {
      await nextTick();
      const currentItems = JSON.stringify(val);
      if (currentItems !== prevItems) {
        prevItems = currentItems;
        emit('update:items', JSON.parse(currentItems));
      }
    }
  },
  { deep: true }
);

// ⬇️ 當單項更新時
const onItemUpdate = (index) => {
  // 手動觸發 localItems 更新（確保觸發 watch）
  localItems.value = [...localItems.value];
};
</script>
