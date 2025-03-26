<template>
  <div class="container p-6">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-green-600">峻晟會計專用估價</h1>
    </div>

    <!-- 一字型區塊 -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">一字型</h3>
    <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
      <div v-for="index in 3" :key="index" class="flex-1 min-w-[300px]">
        <One :index="index" @update-result="updateResult" />
      </div>
    </div>

    <!-- L 型區塊 -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">L 型</h3>
    <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
      <div v-for="index in 3" :key="'L' + index" class="flex-1 min-w-[300px]">
        <L :index="'L' + index" @update-result="updateResult" />
      </div>
    </div>

    <!-- M 型區塊 -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">M 型</h3>
    <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
      <div v-for="index in 3" :key="'M' + index" class="flex-1 min-w-[300px]">
        <M :index="'M' + index" @update-result="updateResult" />
      </div>
    </div>

    <!-- 附加項目區塊 -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">附加項目</h3>
    <div class="mb-6">
      <Items :items="itemList" />
    </div>

    <!-- 結果區塊 -->
    <div v-if="hasValidResults" class="mt-6 p-4 bg-green-50 rounded-lg w-full">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">計價結果</h3>
      <table class="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th class="border p-2">項目</th>
            <th class="border p-2">前沿</th>
            <th class="border p-2">背牆</th>
            <th class="border p-2">倒包</th>
            <th class="border p-2">摘要</th>
            <th class="border p-2">顏色</th>
            <th class="border p-2">長</th>
            <th class="border p-2">深</th>
            <th class="border p-2">公分數/數量</th>
            <th class="border p-2">單位</th>
            <th class="border p-2">單價</th>
            <th class="border p-2">未稅價</th>
            <th class="border p-2">計算過程</th>
            <th class="border p-2">備註</th>
          </tr>
        </thead>
        <tbody>
          <!-- Shape Results -->
          <template v-for="(result, index) in filteredResults" :key="index">
            <template v-if="result.detail">
              <tr>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">
                  {{ index.startsWith('L') ? 'L型' : index.startsWith('M') ? 'M型' : '' }}{{ index.replace(/^[A-Z]/, '') }}
                </td>
                <td class="border p-2">{{ result.detail.side1.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side1.backWall }}</td>
                <td class="border p-2">{{ result.detail.side1.wrapBack }}</td>
                <td class="border p-2 sumary" :rowspan="result.detail.side3 ? 3 : 2">{{ result.sumary }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.color }}</td>
                <td class="border p-2">{{ result.detail.side1.length }}</td>
                <td class="border p-2">{{ result.detail.side1.depth }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.roundedCentimeters }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">cm</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.unitPrice }}</td>
                <td class="border p-2" :rowspan="result.detail.side3 ? 3 : 2">{{ result.subtotal.toLocaleString() }}</td>
                <td class="border p-2 whitespace-pre-line" :rowspan="result.detail.side3 ? 3 : 2">{{ result.calculationSteps }}</td>
                <td class="border p-2 whitespace-pre-line" :rowspan="result.detail.side3 ? 3 : 2">{{ result.note }}</td>
              </tr>
              <tr>
                <td class="border p-2">{{ result.detail.side2.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side2.backWall }}</td>
                <td class="border p-2">{{ result.detail.side2.wrapBack }}</td>
                <td class="border p-2">{{ result.detail.side2.length }}</td>
                <td class="border p-2">{{ result.detail.side2.depth }}</td>
              </tr>
              <tr v-if="result.detail.side3">
                <td class="border p-2">{{ result.detail.side3.frontEdge }}</td>
                <td class="border p-2">{{ result.detail.side3.backWall }}</td>
                <td class="border p-2">{{ result.detail.side3.wrapBack }}</td>
                <td class="border p-2">{{ result.detail.side3.length }}</td>
                <td class="border p-2">{{ result.detail.side3.depth }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="border p-2">一字型{{ index }}</td>
                <td class="border p-2">{{ result.frontEdge }}</td>
                <td class="border p-2">{{ result.backWall }}</td>
                <td class="border p-2">{{ result.wrapBack }}</td>
                <td class="border p-2 sumary">{{ result.sumary }}</td>
                <td class="border p-2">{{ result.color }}</td>
                <td class="border p-2">{{ result.length }}</td>
                <td class="border p-2">{{ result.depth }}</td>
                <td class="border p-2">{{ result.roundedCentimeters }}</td>
                <td class="border p-2">cm</td>
                <td class="border p-2">{{ result.unitPrice }}</td>
                <td class="border p-2">{{ result.subtotal.toLocaleString() }}</td>
                <td class="border p-2 whitespace-pre-line">{{ result.calculationSteps }}</td>
                <td class="border p-2 whitespace-pre-line">{{ result.note }}</td>
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
            <td class="border p-2">個</td>
            <td class="border p-2">{{ item.price }}</td>
            <td class="border p-2">{{ (item.price * item.amount).toLocaleString() }}</td>
            <td class="border p-2">{{ `${item.price} × ${item.amount} = ${item.price * item.amount}` }}</td>
            <td class="border p-2"></td>
          </tr>
          <!-- Total -->
          <tr>
            <td colspan="11" class="border p-2 text-right">總計:</td>
            <td class="border p-2">{{ totalSubtotal.toLocaleString() }} (未稅)</td>
            <td class="border p-2">{{ Math.round(totalSubtotal * 1.05).toLocaleString() }} (含稅)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { ref, computed } from 'vue';
import One from './components/One.vue';
import L from './components/L.vue';
import M from './components/M.vue';
import Items from './components/Items.vue';

export default {
  name: 'App',
  components: { One, L, M, Items },
  setup() {
    const results = ref({});
    const itemList = ref([
      { name: '平接水槽', price: 6000, amount: 1, checked: false },
      { name: '上掛', price: 1500, amount: 1, checked: false },
      { name: '平接爐', price: 4000, amount: 1, checked: false },
      { name: '側落腳卡榫', price: 2000, amount: 1, checked: false },
      { name: '側落腳平接', price: 6000, amount: 1, checked: false },
      { name: '方型管', price: 1500, amount: 1, checked: false },
      { name: '菜刀型工資', price: 1500, amount: 1, checked: false },
      { name: '包木座工資', price: 25000, amount: 1, checked: false },
      { name: '包浴缸工資', price: 10000, amount: 1, checked: false },
      { name: '包鐵件工資', price: 25000, amount: 1, checked: false },
      { name: '挖排煙機孔', price: 1500, amount: 1, checked: false },
      { name: '弧形工資', price: 2000, amount: 1, checked: false },
      { name: '砧板', price: 1000, amount: 1, checked: false },
      { name: '插座', price: 500, amount: 1, checked: false },
      { name: '昇降插座', price: 1000, amount: 1, checked: false },
      { name: '三角架', price: 1500, amount: 1, checked: false },
      { name: '拆+丟', price: 5000, amount: 1, checked: false },
      { name: '活動蓋板', price: 1500, amount: 1, checked: false },
      { name: '餘料加工', price: 500, amount: 1, checked: false },
      { name: '其他項目', price: 0, amount: 1, checked: false } // 預留自定義
    ]);

    const updateResult = (result) => {
      if (result.isEnabled) {
        if (result.detail) {
          const d = result.detail;
          const d1 = d.side1?.depth || 0;
          const d2 = d.side2?.depth || 0;
          const d3 = d.side3?.depth || 0;
          const s1 = Math.round(d.side1?.cmValue || 0);
          const s2 = Math.round(d.side2?.cmValue || 0);
          const s3 = Math.round(d.side3?.cmValue || 0);
          let deductStr = "";
          let finalCm = s1 + s2;
          let deduct = 0;
          if (d.side3) {
            finalCm += s3;
            const deduct1 = Math.min(d1 / 2, d2 / 2, 30);
            const deduct2 = Math.min(d2 / 2, d3 / 2, 30);
            deduct = deduct1 + deduct2;
            deductStr = ` - ${deduct1}-${deduct2}`;
          } else {
            const deduct1 = Math.min(d1 / 2, d2 / 2, 30);
            deduct = deduct1;
            deductStr = `-${deduct1}`;
          }
          finalCm = Math.round(finalCm - deduct);
          result.roundedCentimeters = finalCm;
          result.subtotal = finalCm * result.unitPrice;
          result.calculationSteps += ` ${s1} + ${s2}${d.side3 ? ' + ' + s3 : ''}${deductStr} = ${finalCm} 公分`;
        }
        results.value[result.index] = { ...result };
      } else {
        delete results.value[result.index];
      }
    };

    const filteredResults = computed(() => {
      const entries = Object.entries(results.value)
        .filter(([_, r]) => r?.isEnabled)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
      return Object.fromEntries(entries);
    });

    const filteredItems = computed(() => {
      return itemList.value.filter(item => item.checked);
    });

    const hasValidResults = computed(() => 
      Object.keys(filteredResults.value).length > 0 || filteredItems.value.length > 0
    );

    const totalSubtotal = computed(() => {
      const shapeTotal = Object.values(filteredResults.value).reduce(
        (sum, r) => sum + (parseFloat(r?.subtotal) || 0), 0
      );
      const itemsTotal = filteredItems.value.reduce(
        (sum, item) => sum + (item.price * item.amount || 0), 0
      );
      return shapeTotal + itemsTotal;
    });

    return {
      itemList,
      updateResult,
      filteredResults,
      filteredItems,
      hasValidResults,
      totalSubtotal,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100vw;
}

table td.sumary {
  white-space: normal;
  word-wrap: break-word;
}
</style>