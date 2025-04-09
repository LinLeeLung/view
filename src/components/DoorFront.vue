<template>
  <div class="bg-white p-4 rounded-lg shadow-md min-w-[450px]">
    <div class="flex items-center mb-2 space-x-2">
      <input
        type="checkbox"
        v-model="isEnabled"
        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
      <h2 class="text-md font-semibold text-gray-700">門檻或假腳
      </h2>

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
      

    </div>

    <table class="w-full table-fixed">
      <thead>
        <tr class="text-sm text-left text-gray-600">
          <th class="w-1/6">長度</th>
          <th class="w-1/6">展開深度</th>
          <th class="w-1/6">基本工資</th>
         
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input v-model.number="form.length" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.depth" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
          <td><input v-model.number="form.baseWage" type="number" class="w-full p-1 border rounded-md text-sm" :disabled="!isEnabled" /></td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center mt-4 space-x-4">
     

      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-600">石材單價</label>
        <input v-model.number="form.stonePrice" type="number" class="w-16 p-1 border rounded-md text-sm" :disabled="!isEnabled" />
      </div>
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-gray-600">假腳單價</label>
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
  name: 'DoorFront',
  props: {
    sepPrice: { type: Number, default: 750 },
    index: { type: [String, Number], required: true },
    initialValue: { type: Object, default: () => ({}) }
  },
  emits: ['update-result'],
  setup(props, { emit }) {
    const form = ref({
      length: 100,
      depth: 16,
      baseWage: 25,
      stonePrice: 120,
      unitPrice: 57,
      color: 'CS-201',
      limit: 68,
      sumary: '',
      note: '',
      
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
  f.unitPrice = Math.round(f.baseWage+ f.stonePrice*f.depth/60)

  const roundedValue = Math.round(f.length);
  const subtotal = roundedValue * f.unitPrice;
  const area = Math.round(f.length * f.depth / 900);
  const subtotal2 = area * props.sepPrice;
  
  const calcSteps = `${f.unitPrice} * ${f.length} = ${subtotal}`;
  const calcSteps2 = `${f.unitPrice} * ${area} = ${subtotal2}`;
  
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
    frontEdgeLength: f.length,

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
