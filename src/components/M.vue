<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full min-w-0 max-w-[500px]">
    <!-- 頂部選項列 -->
    <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
      <input type="checkbox" v-model="isEnabled" class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded" />
      <h2 class="font-semibold text-gray-700">M型</h2>

      <label class="whitespace-nowrap">顏色</label>
      <input v-model="form.color" type="text" class="w-[64px] p-1 border rounded-md focus:ring-1 focus:ring-green-500" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">摘要</label>
      <input v-model="form.sumary" type="text" class="w-[80px] p-1 border rounded-md" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">1開</label>
      <input v-model="form.oneOpen" type="checkbox" class="h-4 w-4" :disabled="!isEnabled" />

      <label class="whitespace-nowrap">3開</label>
      <input v-model="form.duOpen" type="checkbox" class="h-4 w-4" :disabled="!isEnabled" />
    </div>

    <!-- Grid 表格 -->
    <div class="text-sm grid grid-cols-6 gap-2 mb-1 text-center font-semibold text-gray-600">
      <span></span>
      <span>長度</span>
      <span>深度</span>
      <span>前沿</span>
      <span>背牆</span>
      <span>倒包</span>
    </div>

    <div class="grid grid-cols-6 gap-2 text-sm mb-2">
      <template v-for="label in ['1', '2', '3']" :key="label">
        <span class="text-gray-600">檯面{{ label }}</span>
        <input v-model.number="form[`length${label}`]" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form[`depth${label}`]" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form[`frontEdge${label}`]" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form[`backWall${label}`]" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
        <input v-model.number="form[`wrapBack${label}`]" type="number" class="p-1 border rounded-md" :disabled="!isEnabled" />
      </template>
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

  
<script>
import { ref, watch } from 'vue';

export default {
  name: 'M',
  emits: ['update-result'],
  props: {
    sepPrice: { type: Number, default: 750 },
    index: {
      type: [Number, String],
      required: true
    },
    initialValue: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const isLoading = ref(false);
    const form = ref({
      color: 'CS-201',
      unitPrice: 120,
      limit: 68,
      sumary: '',
      note: '',
      length1: 100, depth1: 60, frontEdge1: 4, backWall1: 4, wrapBack1: 0,
      length2: 100, depth2: 60, frontEdge2: 4, backWall2: 4, wrapBack2: 0,
      length3: 100, depth3: 60, frontEdge3: 4, backWall3: 4, wrapBack3: 0,
    });

    const isEnabled = ref(false);

    watch(
  () => props.initialValue,
  (val) => {
    if (val) {
      isLoading.value = true; // ✅ 防止載入時觸發計算

      // ✅ 如果有 forceUpdate，強制更新 unitPrice
      if (val.forceUpdate) {
        console.log(`🔄 M.vue - 更新 unitPrice: ${val.unitPrice}`);
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




    const calcOneSide = (length, depth, frontEdge, backWall, wrapBack, limit) => {
      const thickness = depth + frontEdge + backWall + wrapBack;
      let calcSteps = '';
      let cmValue = 0;
      let area = Math.round(length * (depth+ frontEdge + backWall + wrapBack) / 900);
      const calcSteps2= `${length} * (${depth} + ${frontEdge} + ${backWall} + ${wrapBack}) / 900 = ${area} 平方尺`;
      if (thickness < 48 && depth < 40) {
        cmValue = Math.round(length * 0.85);
        calcSteps = `${length} * 0.85 = ${Math.round(cmValue)} 公分`;
      } else if (frontEdge + backWall + wrapBack < (limit - 60) && depth > 60) {
        cmValue = Math.round((depth / 60) * length);
        calcSteps = `${length} * (${depth} / 60) = ${cmValue.toFixed(0)} 公分`;
      } else if (thickness > limit) {
        const deduction = limit - 60 > 0 ? limit - 60 : 0;
        const adjusted = (thickness - deduction) / 60;
        cmValue = Math.round(length * adjusted);
        const wrapStr = wrapBack > 0 ? ` + ${wrapBack}` : '';
        const minusStr = deduction > 0 ? ` - ${deduction}` : '';
        calcSteps = `${length} * (${depth} + ${frontEdge} + ${backWall}${wrapStr}${minusStr}) / 60 = ${Math.round(cmValue)} 公分`;
      } else {
        cmValue = length;
        calcSteps = `${length} = ${Math.round(cmValue)} 公分`;
      }

      return { cmValue, calcSteps,area,calcSteps2 };
    };

    const calculate = () => {
      if (!isEnabled.value) {
        emit('update-result', { index: props.index, isEnabled: false });
        return;
      }

      const f = form.value;
      const side1 = calcOneSide(f.length1, f.depth1, f.frontEdge1, f.backWall1, f.wrapBack1, f.limit);
      const side2 = calcOneSide(f.length2, f.depth2, f.frontEdge2, f.backWall2, f.wrapBack2, f.limit);
      const side3 = calcOneSide(f.length3, f.depth3, f.frontEdge3, f.backWall3, f.wrapBack3, f.limit);
      const frontEdgeLength = f.oneOpen ? (f.duOpen?f.length1+f.length2+f.length3+f.depth1+f.depth3:f.length1+f.length2+f.length3+f.depth1):(f.duOpen?f.length1+f.length2+f.length3+f.depth2:f.length1+f.length2+f.length3);
      const s1 = Math.round(side1.cmValue);
      const s2 = Math.round(side2.cmValue);
      const s3 = Math.round(side3.cmValue);
      
      const deduct1 = Math.min(f.depth1 / 2, f.depth2 / 2, 30);
      const deduct2 = Math.min(f.depth2 / 2, f.depth3 / 2, 30);
      const deductArea1 = Math.round(f.depth1 * f.depth2 / 900);
      const deductArea2 = Math.round(f.depth2 * f.depth3 / 900);
      const deductArea = deductArea1 + deductArea2;
      const total = Math.round(s1 + s2 + s3 - deduct1 - deduct2);
      const subtotal = total * f.unitPrice;
      const totalArea = Math.round(side1.area + side2.area + side3.area - deductArea);
      const steps = `A：${side1.calcSteps}\nB：${side2.calcSteps}\nC：${side3.calcSteps}\n${side1.cmValue}+${side2.cmValue}+${side3.cmValue} - ${deduct1} - ${deduct2} = ${total} 公分`;
      const subtotal2 = (side1.area + side2.area + side3.area - deductArea) * props.sepPrice;
      const steps2 = `A：${side1.calcSteps2}\nB：${side2.calcSteps2}\nC：${side3.calcSteps2}\n${side1.area}+${side2.area}+${side3.area} - ${deductArea} = ${totalArea} 平方尺`;
      emit('update-result', {
        index: props.index,
        isEnabled: true,
        unitPrice: f.unitPrice,
        color: f.color,
        sumary: f.sumary,
        note: f.note,
        limit: f.limit,
        ...f,
        roundedCentimeters: total,
        subtotal,
        subtotal2,
        steps2,
        area: totalArea,
        frontEdgeLength,
        unit: '才',
        forceUpdate: false, // ✅ 預設為 false
        calculationSteps: steps,
        calculationSteps2: steps2,
        detail: {
          side1: { length: f.length1, depth: f.depth1, frontEdge: f.frontEdge1, backWall: f.backWall1, wrapBack: f.wrapBack1, cmValue: side1.cmValue },
          side2: { length: f.length2, depth: f.depth2, frontEdge: f.frontEdge2, backWall: f.backWall2, wrapBack: f.wrapBack2, cmValue: side2.cmValue },
          side3: { length: f.length3, depth: f.depth3, frontEdge: f.frontEdge3, backWall: f.backWall3, wrapBack: f.wrapBack3, cmValue: side3.cmValue },
        },
      });
    };

    // ✅ 僅使用者操作才觸發計算
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