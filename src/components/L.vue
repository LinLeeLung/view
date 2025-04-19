<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full min-w-0 max-w-[500px]">
    <!-- 頂部選項列 -->
    <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
      <!-- <input type="checkbox" v-model="isEnabled" class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded" /> -->
      <h2 class="font-semibold text-gray-700">L型</h2>

      <label class="whitespace-nowrap">顏色</label>
      <input v-model="form.color" type="text" class="w-[64px] p-1 border rounded-md focus:ring-1 focus:ring-green-500"  />

      <label class="whitespace-nowrap">摘要</label>
      <input v-model="form.sumary" type="text" class="w-[80px] p-1 border rounded-md"  />

      <label class="whitespace-nowrap">單開</label>
      <input v-model="form.oneOpen" type="checkbox" class="h-4 w-4"  />

      <label class="whitespace-nowrap">雙開</label>
      <input v-model="form.duOpen" type="checkbox" class="h-4 w-4"  />
    </div>

    <!-- 表格改為 Grid -->
    <div class="text-sm grid grid-cols-6 gap-2 mb-1 text-center font-semibold text-gray-600">
      <span></span>
      <span>長度</span>
      <span>深度</span>
      <span>前沿</span>
      <span>背牆</span>
      <span>倒包</span>
    </div>
    <div class="grid grid-cols-6 gap-2 text-sm mb-2">
      <span class="text-gray-600">檯面1</span>
      <input v-model.number="form.length1" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.depth1" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.frontEdge1" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.backWall1" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.wrapBack1" type="number" class="p-1 border rounded-md"  />

      <span class="text-gray-600">檯面2</span>
      <input v-model.number="form.length2" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.depth2" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.frontEdge2" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.backWall2" type="number" class="p-1 border rounded-md"  />
      <input v-model.number="form.wrapBack2" type="number" class="p-1 border rounded-md"  />
    </div>

    <!-- 下方選項列 -->
    <div class="flex flex-wrap gap-4 mt-4 text-sm">
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">板材極限 (cm)</label>
        <input v-model.number="form.limit" type="number" class="w-[60px] p-1 border rounded-md"  min="60" />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">單價</label>
        <input v-model.number="form.unitPrice" type="number" class="w-[72px] p-1 border rounded-md"  />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">備註</label>
        <input v-model="form.note" type="text" class="w-[100px] p-1 border rounded-md"  />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch ,nextTick} from 'vue';

export default {
  name: 'L',
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
    const form = ref({
      length1: 100,
      depth1: 60,
      frontEdge1: 4,
      backWall1: 4,
      wrapBack1: 0,
      length2: 100,
      depth2: 60,
      frontEdge2: 4,
      backWall2: 4,
      wrapBack2: 0,
      unitPrice: 120,
      sumary: "",
      note: "",
      color: 'CS-201',
      limit: 68,
      oneOpen: false,
      duOpen: false 
    });

    const isEnabled = ref(false);
    const isLoading = ref(false);

// ✅ 避免載入時觸發 calculate
watch(
  () => props.initialValue,
  (val) => {
    if (val) {
      isLoading.value = true; // ✅ 開始載入

      // ✅ 如果有 forceUpdate，更新 unitPrice
      if (val.forceUpdate) {
        console.log(`🔄 L.vue - 更新 unitPrice: ${val.unitPrice}`);
        form.value.unitPrice = val.unitPrice;
      }

      form.value = { ...form.value, ...val }; // ✅ 正常更新
      isEnabled.value = val.isEnabled ?? false;

      isLoading.value = false; // ✅ 載入完成
      nextTick(() => {
      isLoading.value = false;
      calculate(); // ✅ 在 DOM 完整載入後執行計算，避免批次更新遺漏
    });
    }
  },
  { immediate: true, deep: true }
);


// ✅ 僅在使用者互動時才觸發 calculate
watch(form, () => {
  if (!isLoading.value) {
    calculate();
  }
}, { deep: true });

watch(isEnabled, (val) => {
  if (!isLoading.value) {
    calculate();
  }
});

   

    const calcOneSide = (length, depth, frontEdge, backWall, wrapBack, limit) => {
      const thickness = depth + frontEdge + backWall + wrapBack;
      let calcSteps = '';
      let cmValue = 0;
      let area = Math.round(length*(depth+frontEdge+backWall+wrapBack)/900);
      let calcSteps2 = `${length} * (${depth} + ${frontEdge} + ${backWall} + ${wrapBack}) / 900 = ${area}平方尺`;

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

      return { cmValue, calcSteps,area, calcSteps2 };
    };

    const calculate = () => {
      if (!isEnabled.value) {
        emit('update-result', { index: props.index, isEnabled: false });
        return;
      }

      const f = form.value;
      const side1 = calcOneSide(f.length1, f.depth1, f.frontEdge1, f.backWall1, f.wrapBack1, f.limit);
      const side2 = calcOneSide(f.length2, f.depth2, f.frontEdge2, f.backWall2, f.wrapBack2, f.limit);
      const deductArea= Math.round(f.depth1*f.depth2/900);
      const conerdecut=Math.min(f.depth1/2,f.depth2/2,30);
      const totalCm = Math.round(side1.cmValue + side2.cmValue-conerdecut);
      const subtotal = totalCm * f.unitPrice;
      const totalArea = side1.area + side2.area;
      const subtotal2 = totalArea * props.sepPrice
      const frontEdgeLength = f.oneOpen ? (f.duOpen?f.length1+f.length2+f.depth1+f.depth2:f.length1+f.length2+f.depth1):(f.duOpen?f.length1+f.length2+f+f.depth2:f.length1+f.length2);
      const steps = `A：${side1.calcSteps}\nB：${side2.calcSteps}\n${side1.cmValue}+${side2.cmValue}-${conerdecut}= ${totalCm.toFixed(0)} 公分\n`;
      const steps2=  `A：${side1.calcSteps2}\nB：${side2.calcSteps2}\n${side1.area}+${side2.area}-${deductArea} = ${side1.area+side2.area-deductArea}平方尺`;
      emit('update-result', {
        index: props.index,
        isEnabled: true,
        roundedCentimeters: totalCm,
        subtotal,
        subtotal2,
        area: totalArea,
        unitPrice: f.unitPrice,
        color: f.color,
        sumary: f.sumary,
        note: f.note,
        forceUpdate: false, // ✅ 預設為 false
        limit: f.limit,
        calculationSteps: steps,
        calculationSteps2: steps2,
        frontEdgeLength: frontEdgeLength,
        detail: {
          side1: {
            length: f.length1,
            depth: f.depth1,
            frontEdge: f.frontEdge1,
            backWall: f.backWall1,
            wrapBack: f.wrapBack1,
            cmValue: side1.cmValue
          },
          side2: {
            length: f.length2,
            depth: f.depth2,
            frontEdge: f.frontEdge2,
            backWall: f.backWall2,
            wrapBack: f.wrapBack2,
            cmValue: side2.cmValue
          }
        }
      });
    };

    // ✅ 僅當使用者互動才觸發 emit
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
