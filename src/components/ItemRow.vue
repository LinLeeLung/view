<template>
  <div class="w-full min-w-0 flex flex-wrap items-center gap-1 bg-white p-2 border rounded-md text-sm break-words">
    <input
      type="checkbox"
      v-model="item.checked"
      class="h-4 w-4 text-green-500 border-gray-300 rounded"
    />
    <span class="w-[60px] truncate">{{ item.name }}</span>

    <span class="text-gray-500">單價</span>
    <input
      type="number"
      v-model.number="item.price"
      class="w-[60px] p-1 border rounded-md"
      :disabled="!item.checked"
    />

    <span class="text-gray-500">數量</span>
    <input
      type="number"
      v-model.number="item.amount"
      class="w-[40px] p-1 border rounded-md"
      :disabled="!item.checked"
    />

    <span class="text-gray-500">備註</span>
    <input
      type="text"
      v-model="item.note"
      class="w-[80px] p-1 border rounded-md"
      :disabled="!item.checked"
    />

    <span class="text-gray-500">單位</span>
    <input
      type="text"
      v-model="item.unit"
      class="w-[30px] p-1 border rounded-md"
      :disabled="!item.checked"
    />
  </div>
</template>

<script setup>

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

</script>

