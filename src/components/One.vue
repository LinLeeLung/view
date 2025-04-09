<template>
  <div class="bg-white p-4 rounded-lg shadow-md min-w-[450px]">
    <div class="flex items-center mb-2 space-x-2">
      <input
        type="checkbox"
        v-model="isEnabled"
        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
      <h2 class="text-md font-semibold text-gray-700">一字型</h2>

      <label class="w-8 font-medium text-gray-600 text-sm">顏色</label>
      <input
        v-model="form.color"
        type="text"
        class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500 text-sm"
        :disabled="!isEnabled"
      />

      <label class="w-8  text-sm font-medium text-gray-600">摘要</label>
      <input
        v-model="form.sumary"
        type="text"
        class="w-20 p-1 border rounded-md text-sm"
        :disabled="!isEnabled"
      />
      <label class="w-8  text-md font-medium text-gray-600">單開</label>
      <input
        v-model="form.oneOpen"
        type="checkbox"
        class="w-5 p-1 border rounded-md text-sm"
        :disabled="!isEnabled"
      />
      <label class="w-8  text-md font-medium text-gray-600">雙開</label>
      <input
        v-model="form.duOpen"
        type="checkbox"
        class=" p-1 border rounded-md text-sm"
        :disabled="!isEnabled"
      />

    </div>

    <table class="w-full table-fixed">
      <thead>
        <tr class="text-sm text-left text-gray-600">
          <th class="w-1/6">長度</th>
          <th class="w-1/6">深度</th>
          <th class="w-1/6">前沿</th>
          <th class="w-1/6">背牆</th>
          <th class="w-1/6">倒包</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input v-model.number="form.length" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.depth" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.frontEdge" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.backWall" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.wrapBack" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center mt-4 space-x-4">
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-600">板材極限 (cm)</label>
        <input v-model.number="form.limit" type="number" class="w-12 p-1 border rounded-md text-sm" :disabled="!isEnabled" min="60" />
      </div>

      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-600">單價</label>
        <input v-model.number="form.unitPrice" type="number" class="w-16 p-1 border rounded-md text-sm" :disabled="!isEnabled" />
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
