<!-- src/components/ResultDisplay.vue -->
<template>
  <div id="result">
    <!-- Copy Success Notification -->
    <div v-if="copySuccess" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
      已成功複製計算結果！
    </div>

    <!-- Pricing Results -->
    <div v-for="(data, type) in resolvedPricingData" :key="type" class="mt-2">
      <!-- Unlimited Pricing -->
      <div v-if="data.W_checked" :class="['text-teal-600', 't16']">
        {{ data.color || '未指定顏色' }} {{ type }}型
        <span v-if="type === 'M'">
          A: 前沿:{{ data.thick1 > 0 ? data.thick1 : '平板' }} <span v-if="data.stop1 > 0">背牆{{ data.stop1 }}</span> <span v-if="data.doubo1 > 0">倒包{{ data.doubo1 }}</span>
        </span>
        <span v-else>
          前沿:{{ data.thick1 > 0 ? data.thick1 : '平板' }} <span v-if="data.stop1 > 0">背牆{{ data.stop1 }}</span> <span v-if="data.doubo1 > 0">倒包{{ data.doubo1 }}</span>
        </span>
        <div>
          @{{ data.price }}*({{ lengthFormula(type, true) }}) = @{{ data.price }}*{{ length(type, true) }}cm = {{ formatNumber(data.price * length(type, true)) }}
        </div>
      </div>

      <!-- Limited Pricing -->
      <div v-if="data.checked" :class="['text-blue-600', 't16']">
        {{ data.color || '未指定顏色' }} {{ type }}型
        <span v-if="type === 'M'">
          A: 前沿:{{ data.thick1 > 0 ? data.thick1 : '平板' }} <span v-if="data.stop1 > 0">背牆{{ data.stop1 }}</span> <span v-if="data.doubo1 > 0">倒包{{ data.doubo1 }}</span>
        </span>
        <span v-else>
          前沿:{{ data.thick1 > 0 ? data.thick1 : '平板' }} <span v-if="data.stop1 > 0">背牆{{ data.stop1 }}</span> <span v-if="data.doubo1 > 0">倒包{{ data.doubo1 }}</span>
        </span>
        <div>
          @{{ data.price }}*({{ lengthFormula(type, false) }}) = @{{ data.price }}*{{ length(type, false) }}cm = {{ formatNumber(data.price * length(type, false)) }}
        </div>
      </div>
    </div>

    <!-- Extra Items -->
    <div class="text-blue-700 t16 mt-2">
      <div v-for="(item, key) in resolvedExtraItems" :key="key" v-show="item.checked">
        {{ itemNames[key] }}@{{ item.price }}*{{ item.amount }}={{ formatNumber(item.price * item.amount) }}
      </div>
      <div>合計: {{ total.toLocaleString() }} (未稅) 合計: {{ Math.round(total * 1.05).toLocaleString() }} (含稅)</div>
    </div>

    <!-- Buttons -->
    <button @click="copyResult" class="bg-green-500 text-white px-4 py-2 rounded mb-2">複製結果</button>
    <button @click="generateQuotation" class="bg-purple-500 text-white px-4 py-2 rounded mb-2">產出報價單</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLengthCalc } from '../composables/useLengthCalc';

// Define props explicitly
const props = defineProps({
  pricingData: {
    type: Object,
    required: true,
    default: () => ({}), // Provide a default empty object
  },
  extraItems: {
    type: Object,
    required: true,
    default: () => ({}), // Provide a default empty object
  },
});

const emit = defineEmits(['copy', 'generate']);

const copySuccess = ref(false);
const { calculateLength, getFormula } = useLengthCalc();
const limit = ref(68);

// Resolve pricingData with fallback
const resolvedPricingData = computed(() => props.pricingData || {});

// Resolve extraItems with fallback
const resolvedExtraItems = computed(() => props.extraItems || {});

// Item names mapping for extra items
const itemNames = {
  L_sink: '下嵌水槽',
  L_psink: '平接水槽',
  L_stove: '上掛爐',
  L_pstove: '平接爐',
  fee: '工資',
  water: '水電',
  cutting: '裁切費',
};

// Format number with thousand separators
const formatNumber = (value) => {
  if (isNaN(value) || value === undefined) return '0';
  return value.toLocaleString();
};

// Calculate length for a given type
const length = (type, isUnlimited) => {
  const data = resolvedPricingData.value[type];
  if (!data) return 0;
  return calculateLength(
    data.side1 || 0,
    data.depth1 || 0,
    data.thick1 || 0,
    data.stop1 || 0,
    data.doubo1 || 0,
    limit.value,
    isUnlimited
  );
};

// Generate length formula
const lengthFormula = (type, isUnlimited) => {
  const data = resolvedPricingData.value[type];
  if (!data) return '0';
  const arr = [data.depth1, data.thick1, data.stop1, data.doubo1].filter(Boolean);
  if (isUnlimited) {
    return data.side1 + '*(' + getFormula(arr) + ')/60';
  }
  return data.side1 + '*(' + getFormula(arr) + '-' + (limit.value - 60) + ')/60';
};

// Total calculation
const total = computed(() => {
  let sum = 0;
  for (const [type, data] of Object.entries(resolvedPricingData.value)) {
    if (data.checked) sum += length(type, false) * data.price;
    if (data.W_checked) sum += length(type, true) * data.price;
  }
  for (const [key, item] of Object.entries(resolvedExtraItems.value)) {
    if (item.checked) sum += (item.price || 0) * (item.amount || 0);
  }
  return sum;
});

// Copy result to clipboard
const copyResult = () => {
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    navigator.clipboard.writeText(resultDiv.innerText).then(() => {
      copySuccess.value = true;
      setTimeout(() => (copySuccess.value = false), 3000);
      emit('copy');
    }).catch(err => console.error('複製失敗:', err));
  }
};

// Generate quotation (simplified version)
const generateQuotation = () => {
  const printWindow = window.open('', '_blank');
  const htmlContent = `
    <html>
    <head>
      <title>報價單</title>
      <style>
        body { font-family: "DFKai-SB", serif; padding: 10px; font-size: 12px; }
        .header { text-align: center; font-size: 24px; }
        .t16 { font-size: 16px; }
        .text-blue-700 { color: #1e40af; }
        .text-teal-600 { color: #059669; }
      </style>
    </head>
    <body>
      <div class="header">峻晟實業股份有限公司</div>
      <div class="t16">${document.getElementById('result').innerHTML}</div>
    </body>
    </html>
  `;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
  emit('generate');
};
</script>

<style scoped>
.t16 {
  font-size: 16px;
}
</style>