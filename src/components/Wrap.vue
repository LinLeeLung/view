<template>
    <div class="bg-white p-4 rounded-lg shadow-md w-full min-w-0 max-w-[700px]">
      <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
        <input
          type="checkbox"
          v-model="isEnabled"
          class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
        <h2 class="font-semibold text-gray-700">倒包</h2>

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

      <div class="text-sm grid grid-cols-2 gap-2 mb-1 text-center font-semibold text-gray-600">
        <span>長度</span>
        <span>寬度</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm mb-2">
        <input v-model.number="form.length" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form.depth" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      </div>

      <div class="flex flex-wrap gap-4 mt-4 text-sm">
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
    name: 'Wrap',
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
        
        unitPrice: 120,
        color: 'CS-201',
        
        sumary: '',
        note: ''
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
  
      const calcOneSide = (length, depth) => {
        
        let calcSteps = '';
        let cmValue = 0;
        let area = Math.round(length * depth  / 900);
        let calcSteps2 = `${length} * ${depth} / 900 = ${area}平方尺`;
        cmValue = Math.round(length *depth/60);
        calcSteps = `${length} * ${depth} /60 = ${cmValue.toFixed(0)} 公分`;
        return { cmValue, calcSteps, area, calcSteps2 };
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
    const { cmValue, calcSteps,area,calcSteps2 } = calcOneSide(
      f.length,
      f.depth,
      
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
      subtotal2:Math.round(subtotal2)
  
  
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
  