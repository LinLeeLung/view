<!-- components/PricingSection.vue -->
<template>
  <div class="border p-2 m-2 border-gray-600 bg-gray-100">
    <div class="font-bold">
      <input type="checkbox" v-model="data.W_checked" /> <span class="text-teal-600">{{ type }}型計價無極限</span>
      <input type="checkbox" v-model="data.checked" /> <span class="text-blue-600">{{ type }}型計價極限</span>
      <input type="number" v-model.number="limit" class="border p-1 w-20" />
      <button @click="clear" class="bg-teal-500 text-white px-2 py-1 rounded">清空</button>
      <span class="text-blue-500 text-xl">單價</span>
      <input type="number" v-model.number="data.price" class="border border-gray-400 p-1 w-20 text-blue-500 text-xl" @input="$emit('update:price', type, data.price)" />
      <span class="text-blue-500 text-xl">顏色</span>
      <input type="text" v-model="data.color" class="border border-gray-400 p-1 w-20 text-blue-500 text-xl" @input="$emit('update:color', type, data.color)" />
    </div>
    <div class="flex">
      <span>{{ type }}型A長</span>
      <input type="number" v-model.number="data.side1" class="border p-1 w-20" />
      <span>{{ type }}型A深</span>
      <input type="number" v-model.number="data.depth1" class="border p-1 w-20" />
      <span>A厚度</span>
      <input type="number" v-model.number="data.thick1" class="border p-1 w-20" />
      <span>A背牆</span>
      <input type="number" v-model.number="data.stop1" class="border p-1 w-20" />
      <span>A倒包</span>
      <input type="number" v-model.number="data.doubo1" class="border p-1 w-20" />
      <!-- Add more inputs based on type -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useLengthCalc } from '../composables/useLengthCalc';

defineProps({
  type: String,
  data: Object,
});

const emit = defineEmits(['update:price', 'update:color']);

const limit = ref(68);
const { calculateLength } = useLengthCalc();

const clear = () => {
  data.side1 = data.depth1 = data.thick1 = data.stop1 = data.doubo1 = '';
  // Clear other fields based on type
};
</script>