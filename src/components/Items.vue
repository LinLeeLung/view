<template>
  <div class="one-card-container">
  <div
    v-for="(item, index) in localItems"
    :key="index"
    class=""
  >
    <ItemRow :item="item" />
  </div>
</div>
</template>

<script setup>
import ItemRow from './ItemRow.vue';
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:items']);
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
</script>

<style scoped>
</style>
