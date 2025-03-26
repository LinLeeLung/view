<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full">
    <h2 class="text-lg font-semibold text-gray-700 mb-2">項目列表</h2>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center mb-2 space-x-4 w-[calc(25%-1rem)]"
      >
        <input
          type="checkbox"
          v-model="item.checked"
          class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
        <span class="w-32 text-gray-800">{{ item.name }}</span>
        <input
          v-model.number="item.price"
          type="number"
          class="w-20 p-1 border rounded-md text-sm"
          placeholder="單價"
        />
        <input
          v-model.number="item.amount"
          type="number"
          class="w-20 p-1 border rounded-md text-sm"
          placeholder="數量"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemList',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>