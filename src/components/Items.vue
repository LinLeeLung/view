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
      @update="() => emit('update:items', items)"
    />
  </div>
</template>

<script setup>
import ItemRow from './ItemRow.vue';
const props = defineProps({ items: Array });
const emit = defineEmits(['update:items']);
const showAll = ref(false);
import { ref, watch, nextTick,computed } from 'vue';
const filteredItems = computed(() =>
  showAll.value ? props.items : props.items.filter(item => item.checked)
);


const localItems = ref([]);
const isLoading = ref(false);
let prevItems = JSON.stringify([]);

watch(
  () => props.items,
  (val) => {
    if (val) {
      isLoading.value = true;
      localItems.value = JSON.parse(JSON.stringify(val));
      prevItems = JSON.stringify(localItems.value);
      isLoading.value = false;
    }
  },
  { immediate: true, deep: true }
);

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
watch(() => props.items, (newVal) => {
  //console.log('📦 itemList updated in <Items>: ', newVal);
}, { immediate: true, deep: true });


</script>

<style scoped>
</style>
