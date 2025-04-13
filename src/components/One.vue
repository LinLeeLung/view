<template>
  <div class="bg-white p-1 rounded-lg shadow-md w-full min-w-0">
    <!-- 頂部選項列 -->
    <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
      <input type="checkbox" v-model="isEnabled" class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded" />
      <h2 class="font-semibold text-gray-700">一字型</h2>

      <label class="whitespace-nowrap">顏色</label>
      <input v-model="form.color" type="text" class="w-[64px] p-1 border rounded-md focus:ring-1 focus:ring-green-500" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">摘要</label>
      <input v-model="form.sumary" type="text" class="w-[80px] p-1 border rounded-md" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">單開</label>
      <input v-model="form.oneOpen" type="checkbox" class="h-4 w-4" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">雙開</label>
      <input v-model="form.duOpen" type="checkbox" class="h-4 w-4" :disabled="!isEnabled" />
    </div>

    <!-- 表格改為 Grid -->
    <div class="grid grid-cols-5 gap-2 text-sm">
      <label class="text-gray-600 text-center">長度</label>
      <label class="text-gray-600 text-center">深度</label>
      <label class="text-gray-600 text-center">前沿</label>
      <label class="text-gray-600 text-center">背牆</label>
      <label class="text-gray-600 text-center">倒包</label>

      <input v-model.number="form.length" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      <input v-model.number="form.depth" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      <input v-model.number="form.frontEdge" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      <input v-model.number="form.backWall" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      <input v-model.number="form.wrapBack" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
    </div>
    <!-- 下方選項列 -->
    <div class="flex flex-wrap gap-4 mt-4 text-sm">
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">板材極限 (cm)</label>
        <input v-model.number="form.limit" type="number" class="w-[60px] p-1 border rounded-md" :disabled="!isEnabled" min="60" />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">單價</label>
        <input v-model.number="form.unitPrice" type="number" class="w-[72px] p-1 border rounded-md" :disabled="!isEnabled" />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">備註</label>
        <input v-model="form.note" type="text" class="w-[100px] p-1 border rounded-md" :disabled="!isEnabled" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 新增響應式排版：讓卡片在桌機三欄排列，在手機單欄排列 */
:deep(.one-card-container) {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>


<script>
import { ref, watch } from 'vue';

export default {
  name: 'One',
  props: {
    sepPrice: { type: Number, default: 750 },
    index: { type: [String, Number], required: true },
    initialValue: { type: Object, default: () => ({}) }
  },
  emits: ['update-result'],
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
      sumary: '',
      note: '',
      oneOpen: false,
      duOpen: false 
    });

    const isEnabled = ref(false);
    let isLoading = false;

    watch(
  () => props.initialValue,
  (val) => {
    if (val) {
      isLoading = true;
      Object.keys(form.value).forEach((key) => {
        if (val.hasOwnProperty(key)) {
          form.value[key] = val[key];
        }
      });
      // ✅ 正確設置 isEnabled
      isEnabled.value = val.isEnabled === undefined ? false : val.isEnabled;

      isLoading = false;

      // ✅ 如果已啟用，則強制執行一次計算
      if (isEnabled.value) {
        calculate();
      }
    }
  },
  { immediate: true, deep: true }
);





// ✅ 當 isEnabled 變更時，觸發計算或 emit
watch(isEnabled, (val) => {
  if (!isLoading) {
    calculate(); // ✅ 勾選變更時觸發計算
  } else if (!val) {
    // ✅ 如果取消勾選，回傳 isEnabled: false
    emit('update-result', {
      index: props.index,
      isEnabled: false
    });
  }
});


    // ✅ 只在使用者操作時觸發 emit（calculate）
    watch(
      form,
      () => {
        if (isEnabled.value && !isLoading) {
          calculate();
        }
      },
      { deep: true }
    );

    const calcOneSide = (length, depth, frontEdge, backWall, wrapBack, limit,oneOpen,duOpen) => {
      const thickness = depth + frontEdge + backWall + wrapBack;
      let calcSteps = '';
      let cmValue = 0;
      let area = Math.round((length * (depth + frontEdge + backWall + wrapBack)) / 900);
      let calcSteps2 = `${length} * (${depth} + ${frontEdge} + ${backWall} + ${wrapBack}) / 900 = ${area}平方尺`;
      let frontEdgeLength = 0;
      frontEdgeLength = length;
      if(oneOpen) {
        frontEdgeLength = frontEdge+length
      }
      if (duOpen) {
        frontEdgeLength = frontEdge * 2 + length ;
      } 
      if (thickness < 48 && depth < 40) {
        cmValue = length * 0.85;
        calcSteps = `${length} * 0.85 = ${cmValue.toFixed(0)} 公分`;
      } else if (frontEdge + backWall + wrapBack < (limit - 60) && depth > 60) {
        cmValue = (depth / 60) * length;
        calcSteps = `${length} * (${depth} / 60) = ${cmValue.toFixed(0)} 公分`;
      } else if (thickness > limit) {
        const deduction = limit - 60 > 0 ? limit - 60 : 0;
        const adjusted = (thickness - deduction) / 60;
        cmValue = length * adjusted;
        const wrapStr = wrapBack > 0 ? ` + ${wrapBack}` : '';
        const minusStr = deduction > 0 ? ` - ${deduction}` : '';
        calcSteps = `${length} * (${depth} + ${frontEdge} + ${backWall}${wrapStr}${minusStr}) / 60 = ${cmValue.toFixed(0)} 公分`;
      } else {
        cmValue = length;
        calcSteps = `${length} = ${cmValue.toFixed(0)} 公分`;
      }
    
      return { cmValue, calcSteps, area, calcSteps2 ,frontEdgeLength};
    };

   const calculate = () => {
  if (isLoading) {
    return;
  }

  // ✅ 如果未勾選，僅通知父層
  if (!isEnabled.value) {
    emit('update-result', {
      index: props.index,
      isEnabled: false
    });
    return;
  }

  const f = form.value;
  const { cmValue, calcSteps,area,calcSteps2,frontEdgeLength } = calcOneSide(
    f.length,
    f.depth,
    f.frontEdge,
    f.backWall,
    f.wrapBack,
    f.limit,
    f.oneOpen,
    f.duOpen
  );

  const roundedValue = Math.round(cmValue);
  const subtotal = roundedValue * f.unitPrice;
  const subtotal2 = area * props.sepPrice;
  
  emit('update-result', {
    index: props.index,
    isEnabled: true,
    ...f,
    roundedCentimeters: roundedValue,
    subtotal: Math.round(subtotal),
    calculationSteps: calcSteps.trim(),
    calculationSteps2: calcSteps2.trim(),
    area:area,
    subtotal2:Math.round(subtotal2),  
    frontEdgeLength: frontEdgeLength,

  });
};

    return {
      form,
      isEnabled,
      calculate,
      isLoading
    };
  }
};
</script>
