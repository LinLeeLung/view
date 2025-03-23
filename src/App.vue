<template>
  <div class="container p-6">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-green-600">峻晟會計專用估價</h1>
    </div>

    <div class="flex flex-wrap bg-blue-100 w-full">
      <div v-for="index in 10" :key="index" class="w-full sm:w-1/2 lg:w-1/4 p-2">
        <StraightPricingForm :index="index" @update-result="updateResult" />
      </div>
    </div>

    <div v-if="hasValidResults" class="mt-6 p-4 bg-green-50 rounded-lg w-full">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">計價結果</h3>
      <table class="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th class="border border-gray-400 p-2">項目</th>
            <th class="border border-gray-400 p-2">前沿</th>
            <th class="border border-gray-400 p-2">背牆</th>
            <th class="border border-gray-400 p-2">倒包</th>
            <th class="border border-gray-400 p-2">顏色</th>
            <th class="border border-gray-400 p-2">長</th>
            <th class="border border-gray-400 p-2">深</th>
            <th class="border border-gray-400 p-2">公分數</th>
            <th class="border border-gray-400 p-2">單位</th>
            <th class="border border-gray-400 p-2">單價</th>
            <th class="border border-gray-400 p-2">未稅價</th>
            <th class="border border-gray-400 p-2">計算過程</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in filteredResults" :key="index">
            <td class="border border-gray-400 p-2">一字型{{ index || '' }}</td>
            <td class="border border-gray-400 p-2">{{ result.frontEdge || '' }}</td>
            <td class="border border-gray-400 p-2">{{ result.backWall || '' }}</td>
            <td class="border border-gray-400 p-2">{{ result.wrapBack || '' }}</td>
            <td class="border border-gray-400 p-2">{{ result.color }}</td>
            <td class="border border-gray-400 p-2">{{ result.length }}</td>
            <td class="border border-gray-400 p-2">{{ result.depth }} </td>
            <td class="border border-gray-400 p-2">{{ result.roundedCentimeters }}</td>
                
            
            <td class="border border-gray-400 p-2">cm</td>
            <td class="border border-gray-400 p-2">{{ result.unitPrice }}</td>
            <td class="border border-gray-400 p-2">{{ result.subtotal.toLocaleString() }}</td>
            <td class="border border-gray-400 p-2">{{ result.calculationSteps }}</td>
           
          </tr>
          <tr>
            <td colspan="10" class="border border-gray-400 p-2 text-right">總計:</td>
            <td class="border border-gray-400 p-2">{{ totalSubtotal.toLocaleString() }} (未稅)</td>
            <td class="border border-gray-400 p-2">{{ Math.round(totalSubtotal * 1.05).toLocaleString() }} (含稅)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import StraightPricingForm from './components/One.vue';

export default {
  name: 'ParentComponent',
  components: {
    StraightPricingForm,
  },
  setup() {
    const results = ref({});

    const updateResult = (result) => {
      if (result.isEnabled) {
        results.value[result.index] = { ...result };
      } else {
        delete results.value[result.index];
      }
      console.log('更新後的 results:', JSON.stringify(results.value, null, 2));
    };

    const filteredResults = computed(() => {
      return Object.fromEntries(
        Object.entries(results.value).filter(([_, result]) => result?.isEnabled)
      );
    });

    const hasValidResults = computed(() => Object.keys(filteredResults.value).length > 0);

    const totalCentimeters = computed(() => {
      return Object.values(filteredResults.value).reduce((sum, result) => {
        return sum + (result?.roundedCentimeters || 0);
      }, 0);
    });

    const totalSubtotal = computed(() => {
      return Object.values(filteredResults.value).reduce((sum, result) => {
        return sum + (parseFloat(result?.subtotal) || 0);
      }, 0);
    });

    return {
      results,
      updateResult,
      filteredResults,
      hasValidResults,
      totalCentimeters,
      totalSubtotal,
    };
  },
};
</script>

<style>
body {
  width: 100%;
}
html {
  width: 100%;
}
.container {
  width: 100vw;
}
</style>