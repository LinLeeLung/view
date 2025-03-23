<!-- src/components/ExtraItems.vue -->
<template>
  <div class="border p-2 m-2 border-gray-600 bg-gray-100">
    <h2 class="text-lg font-bold text-blue-600 mb-2">額外項目</h2>
    
    <div class="grid grid-cols-3 gap-4">
      <div v-for="(item, key) in extraItems" :key="key" class="flex flex-col p-2 rounded hover:bg-gray-200 transition">
        <label class="flex items-center">
          <input type="checkbox" v-model="item.checked" @change="emitUpdate" class="mr-2" />
          <span class="text-blue-700">{{ itemNames[key] || key }}</span>
        </label>
        <div v-if="item.checked" class="flex items-center mt-1">
          <span class="mr-2">價格：</span>
          <input
            type="number"
            v-model.number="item.price"
            @input="emitUpdate"
            class="border p-1 w-20 text-blue-500"
            min="0"
          />
          <span class="ml-2 mr-2">數量：</span>
          <input
            type="number"
            v-model.number="item.amount"
            @input="emitUpdate"
            class="border p-1 w-16 text-blue-500"
            min="1"
          />
        </div>
      </div>
    </div>

    <!-- Subtotal Display -->
    <div v-if="subtotal > 0" class="text-blue-700 mt-2">
      額外項目總計: {{ subtotal.toLocaleString() }}
    </div>

    <!-- Dynamic Item Addition -->
    <div class="mt-4 flex items-center">
      <input
        v-model="newItemName"
        placeholder="新項目名稱"
        class="border p-1 w-40 mr-2"
      />
      <input
        v-model.number="newItemPrice"
        type="number"
        placeholder="價格"
        class="border p-1 w-20 mr-2"
        min="0"
      />
      <button @click="addCustomItem" class="bg-green-500 text-white px-2 py-1 rounded">新增</button>
    </div>

    <!-- Clear Button -->
    <button @click="clearItems" class="bg-red-500 text-white px-4 py-2 rounded mt-2">清空所有項目</button>

    <!-- Error Display -->
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';

// Define props with validation and ensure default value
const props = defineProps({
  extraItems: {
    type: Object,
    required: true,
    default: () => ({
      L_sink: { checked: false, price: 2500, amount: 1 },
      L_psink: { checked: false, price: 3000, amount: 1 },
      L_stove: { checked: false, price: 2000, amount: 1 },
      L_pstove: { checked: false, price: 2500, amount: 1 },
      fee: { checked: false, price: 3000, amount: 1 },
      water: { checked: false, price: 500, amount: 1 },
      cutting: { checked: false, price: 1000, amount: 1 },
    }),
  },
});

const emit = defineEmits(['update:extraItems']);

const error = ref(null);
const newItemName = ref('');
const newItemPrice = ref(0);

// Mapping of keys to display names
const itemNames = {
  L_sink: '下嵌水槽',
  L_psink: '平接水槽',
  L_stove: '上掛爐',
  L_pstove: '平接爐',
  fee: '工資',
  water: '水電',
  cutting: '裁切費',
};

// Compute subtotal
const subtotal = computed(() => {
  return Object.values(props.extraItems).reduce((sum, item) => {
    return item.checked ? sum + (item.price * item.amount) : sum;
  }, 0);
});

// Emit updates to parent with validation
const emitUpdate = () => {
  try {
    const updatedItems = { ...props.extraItems };
    for (const key in updatedItems) {
      if (updatedItems[key].checked) {
        updatedItems[key].price = Math.max(0, Number(updatedItems[key].price) || 0);
        updatedItems[key].amount = Math.max(1, Number(updatedItems[key].amount) || 1);
      }
    }
    emit('update:extraItems', updatedItems);
    error.value = null;
  } catch (err) {
    error.value = '更新失敗：' + err.message;
    console.error('更新額外項目錯誤:', err);
  }
};

// Add custom item
const addCustomItem = () => {
  try {
    if (newItemName.value && newItemPrice.value >= 0) {
      const key = `custom_${Date.now()}`;
      const updatedItems = { ...props.extraItems };
      updatedItems[key] = { checked: true, price: Number(newItemPrice.value), amount: 1 };
      itemNames[key] = newItemName.value;
      newItemName.value = '';
      newItemPrice.value = 0;
      emit('update:extraItems', updatedItems);
    } else {
      error.value = '請輸入有效的項目名稱和價格';
    }
  } catch (err) {
    error.value = '新增失敗：' + err.message;
    console.error('新增項目錯誤:', err);
  }
};

// Clear all items
const clearItems = () => {
  try {
    const defaultItems = {
      L_sink: { checked: false, price: 2500, amount: 1 },
      L_psink: { checked: false, price: 3000, amount: 1 },
      L_stove: { checked: false, price: 2000, amount: 1 },
      L_pstove: { checked: false, price: 2500, amount: 1 },
      fee: { checked: false, price: 3000, amount: 1 },
      water: { checked: false, price: 500, amount: 1 },
      cutting: { checked: false, price: 1000, amount: 1 },
    };
    const updatedItems = { ...defaultItems };
    for (const key in props.extraItems) {
      if (!defaultItems[key]) delete updatedItems[key];
    }
    emit('update:extraItems', updatedItems);
    error.value = null;
  } catch (err) {
    error.value = '清空失敗：' + err.message;
    console.error('清空項目錯誤:', err);
  }
};

// Initialize with validation on mount
onMounted(() => {
  emitUpdate(); // Sync initial state
});
</script>

<style scoped>
/* Add Tailwind or custom styles if needed */
</style>