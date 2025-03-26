<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div class="flex items-center mb-4">
      <input
        type="checkbox"
        v-model="isEnabled"
        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded mr-2"
      />
      <h2 class="text-lg font-semibold text-gray-700">L 字型計價</h2>
      <label class="ml-4 mr-2 text-gray-600">顏色</label>
      <input
        v-model="form.color"
        type="text"
        class="w-20 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
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

    <table class="w-full">
      <thead>
        <tr>
          <th></th>
          <th>長度</th>
          <th>深度</th>
          <th>前沿</th>
          <th>背牆</th>
          <th>倒包</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>檯面 1</td>
          <td>
            <input
              v-model.number="form.length1"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.depth1"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.frontEdge1"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.backWall1"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.wrapBack1"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
        </tr>
        <tr>
          <td>檯面 2</td>
          <td>
            <input
              v-model.number="form.length2"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.depth2"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.frontEdge2"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.backWall2"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
          <td>
            <input
              v-model.number="form.wrapBack2"
              type="number"
              class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
              :disabled="!isEnabled"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center mt-4">
      <label class="mr-2 text-gray-600">板材極限 (cm)</label>
      <input
        v-model.number="form.limit"
        type="number"
        class="w-12 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
        :disabled="!isEnabled"
      />
      <label class="ml-4 mr-2 text-gray-600">單價</label>
      <input
        v-model.number="form.unitPrice"
        type="number"
        class="w-16 p-1 border rounded-md focus:ring-1 focus:ring-green-500"
        :disabled="!isEnabled"
      />
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
  name: 'L',
  emits: ['update-result'],
  props: {
      index: {
        type: [Number, String],
        required: true,
      },
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
      sumary:"",
      note:"",
      color: 'CS-201',
      limit: 68,
    });

    const isEnabled = ref(false);

    const validateInput = (field) => {
      const value = form.value[field];
      if (field === 'limit') {
        form.value.limit = value === null || value === undefined || isNaN(value)
          ? 60
          : Math.max(60, value);
      } else if (typeof value !== 'string') {
        form.value[field] = isNaN(value) || value < 0 ? 0 : value;
      }
      calculate();
    };

    const calcOneSide = (length, depth, frontEdge, backWall, wrapBack, limit) => {
      const thickness = depth + frontEdge + backWall + wrapBack;
      let calcSteps = '';
      let cmValue = 0;
        
      if (thickness < 48 && depth<40) {
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


      return { cmValue, calcSteps };
    };

    const calculate = () => {
      if (!isEnabled.value) {
        emit('update-result', { index: props.index, isEnabled: false });
        return;
      }

      const f = form.value;
      const side1 = calcOneSide(f.length1, f.depth1, f.frontEdge1, f.backWall1, f.wrapBack1, f.limit);
      const side2 = calcOneSide(f.length2, f.depth2, f.frontEdge2, f.backWall2, f.wrapBack2, f.limit);

      const totalCm = Math.round(side1.cmValue + side2.cmValue);
      const subtotal = totalCm * f.unitPrice;

      const steps = `A：${side1.calcSteps}\n B：${side2.calcSteps}\n`;

      emit('update-result', {
        index: props.index,
        isEnabled: true,
        roundedCentimeters: totalCm,
        subtotal: subtotal,
        unitPrice: f.unitPrice,
        color: f.color,
        sumary:f.sumary,
        note:f.note,
        limit: f.limit,
        calculationSteps: steps,
        detail: {
          side1: {
            length: f.length1,
            depth: f.depth1,
            frontEdge: f.frontEdge1,
            backWall: f.backWall1,
            wrapBack: f.wrapBack1,
            cmValue:side1.cmValue
          },
          side2: {
            length: f.length2,
            depth: f.depth2,
            frontEdge: f.frontEdge2,
            backWall: f.backWall2,
            wrapBack: f.wrapBack2,
            cmValue:side2.cmValue
          }
        }
      });
    };

    watch(form, calculate, { deep: true });
    watch(isEnabled, calculate);

    calculate();

    return {
      form,
      isEnabled,
      validateInput,
      calculate
    };
  }
};
</script>
