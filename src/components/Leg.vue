<template>
    <div class="bg-white p-4 rounded-lg shadow-md w-full min-w-0 max-w-[700px]">
      <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
        <input
          type="checkbox"
          v-model="isEnabled"
          class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
        <h2 class="font-semibold text-gray-700">側落腳</h2>

        <label class="whitespace-nowrap">顏色</label>
        <input
          v-model="form.color"
          type="text"
          class="w-[80px] p-1 border rounded-md focus:ring-1 focus:ring-green-500"
          :disabled="!isEnabled"
        />

        <label class="whitespace-nowrap">摘要</label>
        <input
          v-model="form.sumary"
          type="text"
          class="w-[100px] p-1 border rounded-md"
          :disabled="!isEnabled"
        />
      </div>

      <div class="text-sm grid grid-cols-6 gap-2 mb-1 text-center font-semibold text-gray-600">
        <span>長度</span>
        <span>深度</span>
        <span>前厚</span>
        <span>後厚</span>
        <span>前倒包</span>
        <span>後倒包</span>
      </div>

      <div class="grid grid-cols-6 gap-2 text-sm mb-2">
        <input v-model.number="form.length" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.depth" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.frontEdge" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.backEdge" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.wrapFront" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.wrapBack" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      </div>

      <div class="flex flex-wrap gap-4 mt-4 text-sm">
        <div class="flex items-center space-x-1">
          <label class="whitespace-nowrap">板材極限 (cm)</label>
          <input v-model.number="form.limit" type="number" class="w-[72px] p-1 border rounded-md" :disabled="!isEnabled" min="60" />
        </div>
        <div class="flex items-center space-x-1">
          <label class="whitespace-nowrap">單價</label>
          <input v-model.number="form.unitPrice" type="number" class="w-[80px] p-1 border rounded-md" :disabled="!isEnabled" />
        </div>
        <div class="flex items-center space-x-1">
          <label class="whitespace-nowrap">備註</label>
          <input v-model="form.note" type="text" class="w-[120px] p-1 border rounded-md" :disabled="!isEnabled" />
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
  