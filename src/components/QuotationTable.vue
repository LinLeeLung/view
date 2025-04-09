<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-700 mb-2">計價結果</h3>
    <table class="w-full border-collapse border border-gray-400">
      <thead>
         <component :is="TableHead" />
      </thead>
        <tbody>
          <!-- Shape Results -->
          <template v-for="(result, index) in filteredResults" :key="index">
            <template v-if="result.detail">
              <tr>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">
                  {{ (index.startsWith('L') ? 'L型' : index.startsWith('M') ? 'M型' : '') + index.replace(/^[A-Z]/, '') }}
                </td>
                <td class="border p-2">{{ result.detail.side1.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side1.backWall }}</td>
                <td class="border p-2">{{ result.detail.side1.wrapBack ? result.detail.side1.wrapBack:""}}</td>
                <td class="border p-2 sumary text-left" :rowspan="result.detail.side3 ? 3 : 2">{{ result.sumary }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.color }}</td>
                <td class="border p-2">{{ result.detail.side1.length }}</td>
                <td class="border p-2">{{ result.detail.side1.depth }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.roundedCentimeters }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">cm</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.unitPrice }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.subtotal.toLocaleString() }}</td>
                <td class="border p-2 text-left whitespace-pre-line" :rowspan="result.detail.side3 ? 3 : 2">{{ result.calculationSteps }}</td>
                <td class="note border p-2 whitespace-pre-line text-left " :rowspan="result.detail.side3 ? 3 : 2">{{ result.note }}</td>
              </tr>
              <tr>
                <td class="border p-2">{{ result.detail.side2.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side2.backWall }}</td>
                <td class="border p-2">{{ result.detail.side2.wrapBack ? result.detail.side2.wrapBack : '' }}  </td>
                <td class="border p-2">{{ result.detail.side2.length }}</td>
                <td class="border p-2">{{ result.detail.side2.depth }}</td>
              </tr>
              <tr v-if="result.detail.side3">
                <td class="border p-2">{{ result.detail.side3.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side3.backWall? result.detail.side3.backWall :""}}</td>
                <td class="border p-2">{{ result.detail.side3.wrapBack?result.detail.side3.wrapBack:"" }}</td>
                <td class="border p-2">{{ result.detail.side3.length }}</td>
                <td class="border p-2">{{ result.detail.side3.depth }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="border p-2">{{ index }}</td>
                <td class="border p-2">{{ result.frontEdge }}</td>
                <td class="border p-2">{{ result.backWall || result.backEdge }}</td>
                <td class="border p-2">
                  {{ formatWrapDetails(index, result) }}
                </td>
                <td class="border w40 p-2 sumary text-left">{{ result.sumary }}</td>
                <td class="border p-2">{{ result.color }}</td>
                <td class="border p-2">{{ result.length }}</td>
                <td class="border p-2">{{ result.depth }}</td>
                <td class="border p-2">{{ result.roundedCentimeters }}</td>
                <td class="border p-2">cm</td>
                <td class="border p-2">{{ result.unitPrice }}</td>
                <td class="border p-2">{{ result.subtotal.toLocaleString() }}</td>
                <td class="border p-2  text-left ">{{ result.calculationSteps }}</td>
                <td class="border p-2 whitespace-pre-line text-left note ">{{ !result.note && result.index.includes("倒包")  ? "台面下倒包" + result.color  : result.note}}</td>
              </tr>
            </template>
          </template>
          <!-- Item Results -->
          <tr v-for="(item, idx) in filteredItems" :key="'item-' + idx">
            <td class="border p-2">{{ item.name }}</td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2"></td>
            <td class="border p-2">{{ item.amount }}</td>
            <td class="border p-2">{{item.unit}}</td>
            <td class="border p-2">{{ item.price }}</td>
            <td class="border p-2">{{ (item.price * item.amount).toLocaleString() }}</td>
            <td class="border p-2"></td>
            <td class="border p-2 text-left">{{ item.note }}</td>
          </tr>
          <!-- Total -->
          <tr>
            <td colspan="10" class="border p-2 text-right">總計:</td>
            <td colspan="2" class="border p-2">{{ totalSubtotal.toLocaleString() }} (未稅)</td>
            <td colspan="2" class="border p-2">{{ Math.round(totalSubtotal * 1.05).toLocaleString() }} (含稅)</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import TableHead from './TableHead.vue';

defineProps({
  filteredResults: {
    type: Object,
    required: true
  },
  filteredItems: {
    type: Array,
    required: true
  },
  totalSubtotal: {
    type: Number,
    required: true
  }
});


// 格式化倒包資訊
function formatWrapDetails(index, result) {
  const parts = [];

  const isValid = (val) => val !== undefined && val !== null && val !== '' && val !== 0;

  if (index.includes('中島')) {
    if (isValid(result.wrapFront)) parts.push(`前:${result.wrapFront}`);
    if (isValid(result.wrapBack)) parts.push(`後:${result.wrapBack}`);
    if (isValid(result.wrapLeft)) parts.push(`左:${result.wrapLeft}`);
    if (isValid(result.wrapRight)) parts.push(`右:${result.wrapRight}`);
    return parts.join(' ');
  }

  if (index.includes('腳')) {
    if (isValid(result.wrapFront)) parts.push(`前:${result.wrapFront}`);
    if (isValid(result.wrapBack)) parts.push(`後:${result.wrapBack}`);
    return parts.join(' ');
  }

  return isValid(result.wrapBack) ? result.wrapBack : '';
};

</script>


<style scoped>

</style>


