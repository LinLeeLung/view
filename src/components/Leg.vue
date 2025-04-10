<template>
    <div class="bg-white p-4 rounded-lg shadow-md min-w-[450px]">
      <div class="flex items-center mb-2 space-x-2">
        <input
          type="checkbox"
          v-model="isEnabled"
          class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
        <h2 class="text-md font-semibold text-gray-700">側落腳計價</h2>
  
        <label class="w-20 font-medium text-gray-600 text-sm">顏色</label>
        <input
          v-model="form.color"
          type="text"
          class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
          :disabled="!isEnabled"
        />
  
        <label class="ml-4 text-sm font-medium text-gray-600">摘要</label>
        <input
          v-model="form.sumary"
          type="text"
          class="w-20 p-1 border rounded-md text-sm"
          :disabled="!isEnabled"
        />
      </div>
  
      <table class="w-full table-fixed">
        <thead>
          <tr class="text-sm text-left text-gray-600">
            <th class="w-1/6">長度</th>
            <th class="w-1/6">深度</th>
            <th class="w-1/6">前厚</th>
            <th class="w-1/6">後厚</th>
            <th class="w-1/6">前倒包</th>
            <th class="w-1/6">後倒包</th>
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input v-model.number="form.length" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
            <td><input v-model.number="form.depth" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
            <td><input v-model.number="form.frontEdge" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
            <td><input v-model.number="form.backEdge" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
            <td><input v-model.number="form.wrapFront" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
            <td><input v-model.number="form.wrapBack" type="number" min="0" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
           
          </tr>
        </tbody>
      </table>
  
      <div class="flex items-center mt-4 space-x-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">板材極限 (cm)</label>
          <input v-model.number="form.limit" type="number" min="60" class="w-12 p-1 border rounded-md text-sm" :disabled="!isEnabled" />
        </div>
  
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">單價</label>
          <input v-model.number="form.unitPrice" type="number" min="0" class="w-16 p-1 border rounded-md text-sm" :disabled="!isEnabled" />
        </div>
  
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-600">備註</label>
          <input v-model="form.note" type="text" class="w-20 p-1 border rounded-md text-sm" :disabled="!isEnabled" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref, watch } from 'vue';

export default {
  name: 'Leg',
  emits: ['update-result'],
  props: {
    sepPrice: { type: Number, default: 750 },
    index: {
      type: [String, Number],
      required: true
    },
    initialValue: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const isLoading = ref(false);
    // ✅ 表單數據  
    const form = ref({
      length: 92,
      depth: 90,
      frontEdge: 4,
      backEdge: 4,
      wrapBack: 30,
      wrapFront: 12,
      
      unitPrice: 120,
      color: 'CS-201',
      limit: 68,
      sumary: '',
      note: ''
    });

    const isEnabled = ref(false);

    // ✅ 初始資料載入：只套用值，不觸發 emit
    watch(
  () => props.initialValue,
  (val) => {
    if (val) {
      isLoading.value = true; // ✅ 防止載入時觸發計算

      // ✅ 如果有 forceUpdate，強制更新 unitPrice
      if (val.forceUpdate) {
        console.log(`🔄 Leg.vue - 更新 unitPrice: ${val.unitPrice}`);
        form.value.unitPrice = val.unitPrice;
      }

      // ✅ 正常更新表單數據
      form.value = { ...form.value, ...val };
      isEnabled.value = val.isEnabled ?? false;

      isLoading.value = false; // ✅ 載入完成
    }
  },
  { immediate: true, deep: true }
);

    const calcOneSide = (length, depth, frontEdge, backEdge, wrapBack, wrapFront, limit) => {
      const thickness = depth + frontEdge + backEdge + wrapBack + wrapFront;
      console.log(`thickness: ${thickness}`);
      console.log(`limit: ${limit}`);
      let calcSteps = '';
      let cmValue = 0;
      let area = Math.round(length * (depth + frontEdge + backEdge + wrapBack + wrapFront)/ 900);
      let calcSteps2 = `${length} * (${depth} + ${frontEdge} + ${backEdge} + ${wrapBack} + ${wrapFront}) / 900 = ${area}平方尺`;

      if (thickness < 48 && depth < 40) {
        cmValue = Math.round(length * 0.85);
        calcSteps = `${length} * 0.85 = ${Math.round(cmValue)} 公分\n`;
      } else if (frontEdge + backEdge + wrapBack + wrapFront < (limit - 60) && depth > 60) {
        cmValue = Math.round((depth / 60) * length);
        calcSteps = `${length} * (${depth} / 60) = ${Math.round(cmValue)} 公分\n`;
      } else if (thickness > limit) {
        const deduction = limit - 60 > 0 ? limit - 60 : 0;
        const adjusted = (thickness - deduction) / 60;
        cmValue = Math.round(length * adjusted);

        const wrapFrontStr = wrapFront > 0 ? ` + ${wrapFront}` : '';
        const wrapBackStr = wrapBack > 0 ? ` + ${wrapBack}` : '';
        const minusStr = deduction > 0 ? ` - ${deduction}` : '';
        calcSteps = `${length} * (${depth} + ${frontEdge} + ${backEdge}${wrapBackStr}${wrapFrontStr}${minusStr}) / 60 = ${Math.round(cmValue)} 公分\n`;
      } else {
        cmValue = length;
        calcSteps = `${length} = ${Math.round(cmValue)} 公分\n`;
      }
       

      return { cmValue, calcSteps,area,calcSteps2 };
    // ✅ 返回計算結果
    };

    const calculate = () => {
      if (!isEnabled.value) {
        emit('update-result', { index: props.index, isEnabled: false });
        return;
      }

      const f = form.value;
      const {
        length, depth, frontEdge, backEdge, wrapBack,
        wrapFront, wrapLeft, wrapRight, limit
      } = f;

      const { cmValue, calcSteps ,area,calcSteps2} = calcOneSide(length, depth, frontEdge, backEdge, wrapBack, wrapFront, limit);
      const roundedValue = Math.round(cmValue);
      const subtotal = roundedValue * f.unitPrice;
      const subtotal2 = f.area * props.sepPrice;
      emit('update-result', {
        index: props.index,
        isEnabled: true,
        length,
        depth,
        frontEdge,
        backEdge,
        wrapBack,
        wrapFront,
        wrapLeft,
        wrapRight,
        color: f.color,
        sumary: f.sumary,
        note: f.note,
        limit,
        roundedCentimeters: roundedValue,
        subtotal,
        subtotal2,
        area,
        unitPrice: f.unitPrice,
        calculationSteps: calcSteps.trim(),
        calculationSteps2: calcSteps2.trim(),
      });
    };

    watch(form, calculate, { deep: true });
    watch(isEnabled, calculate);

    return {
      form,
      isEnabled,
      calculate
    };
  }
};
</script>

  
  <style scoped>
  </style>
  