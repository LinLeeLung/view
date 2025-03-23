<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div class="flex items-center mb-2 space-x-2">
      <input
        type="checkbox"
        v-model="isEnabled"
        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
      <h2 class="text-md font-semibold text-gray-700">一字型計價</h2>

      <label class="w-20 font-medium text-gray-600 text-sm">顏色</label>
      <input
        v-model="form.color"
        type="text"
        class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
        :disabled="!isEnabled"
      />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <!-- 檯面長度 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">檯面長度</label>
        <input
          v-model.number="form.length"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="0"
          :disabled="!isEnabled"
          @input="validateInput('length')"
        />
      </div>

      <!-- 檯面深度 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">檯面深度</label>
        <input
          v-model.number="form.depth"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="0"
          :disabled="!isEnabled"
          @input="validateInput('depth')"
        />
      </div>

      <!-- 前沿高度 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">前沿高度</label>
        <input
          v-model.number="form.frontEdge"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="0"
          :disabled="!isEnabled"
          @input="validateInput('frontEdge')"
        />
      </div>

      <!-- 背牆高度 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">背牆高度</label>
        <input
          v-model.number="form.backWall"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="0"
          :disabled="!isEnabled"
          @input="validateInput('backWall')"
        />
      </div>

      <!-- 倒包長度 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">倒包長度</label>
        <input
          v-model.number="form.wrapBack"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="0"
          :disabled="!isEnabled"
          @input="validateInput('wrapBack')"
        />
      </div>

      <!-- 板材極限 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">板材極限</label>
        <input
          v-model.number="form.limit"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="60"
          max="300"
          step="1"
          :disabled="!isEnabled"
          placeholder="輸入板材極限"
          @input="validateInput('limit')"
        />
      </div>

      <!-- 單價 -->
      <div class="flex items-center space-x-2">
        <label class="w-20 font-medium text-gray-600 text-sm">單價</label>
        <input
          v-model.number="form.unitPrice"
          type="number"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          min="1"
          :disabled="!isEnabled"
          @input="validateInput('unitPrice')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'StraightPricingForm',
  emits: ['update-result'],
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = ref({
      length: 100,
      depth: 60,
      frontEdge: 4,
      backWall: 4,
      wrapBack: 0,
      unitPrice: 120,
      color: 'CS-201',
      limit: 68,
    });

    const isEnabled = ref(false);

    const validateInput = (field) => {
      const value = form.value[field];

      if (field === 'limit') {
        form.value.limit = (value === null || value === undefined || isNaN(value))
          ? 60
          : Math.max(60, value);
      } else if (typeof value !== 'string') {
        form.value[field] = isNaN(value) || value < 0 ? 0 : value;
      }

      calculate();
    };

    const calculate = () => {
      if (!isEnabled.value) {
        emit('update-result', { index: props.index, isEnabled: false });
        return;
      }

      const { length, depth, frontEdge, backWall, unitPrice, wrapBack, limit, color } = form.value;
      const totalThickness = depth + frontEdge + backWall + wrapBack;

      let totalCentimetersValue;
      let calculationSteps = `公分數:\n`;

      if (totalThickness < 40) {
        totalCentimetersValue = length * 0.85;
        calculationSteps += `${length} * 0.85 = ${totalCentimetersValue.toFixed(2)} 公分`;
      } else if (totalThickness > limit) {
        const adjustedValue = limit - 60 > 0
          ? length * (totalThickness - (limit - 60)) / 60
          : length * totalThickness / 60;

        totalCentimetersValue = adjustedValue;

        const wrapBackStr = wrapBack > 0 ? ` + ${wrapBack}` : '';
        calculationSteps += `${length} * (${depth} + ${frontEdge} + ${backWall}${wrapBackStr}${(limit - 60) > 0 ? ` - ${limit - 60}` : ''}) / 60 = ${totalCentimetersValue.toFixed(2)} 公分`;
      } else {
        totalCentimetersValue = length;
        calculationSteps += `${length} = ${totalCentimetersValue} 公分`;
      }

      const roundedValue = Math.round(totalCentimetersValue);
      const subtotal = roundedValue * unitPrice;

      emit('update-result', {
        index: props.index,
        isEnabled: isEnabled.value,
        length,
        depth,
        frontEdge,
        backWall,
        wrapBack,
        color,
        limit,
        roundedCentimeters: roundedValue,
        subtotal: Math.round(subtotal),
        unitPrice,
        calculationSteps: calculationSteps.trim(),
      });
    };

    watch(form, calculate, { deep: true });
    watch(isEnabled, calculate);

    calculate();

    return { form, isEnabled, validateInput, calculate };
  },
};
</script>

<style scoped>
/* 可自定樣式 */
</style>
