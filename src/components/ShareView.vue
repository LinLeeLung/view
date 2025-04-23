<template>
  <div class="p-4">
    <h1 class="text-xl font-bold text-green-600 mb-4">報價單預覽：{{ filename }}</h1>
     
    <QuotationHeader
      :customer="customer"
      :tel="tel"
      :fax="fax"
      :contacter="contacter"
      :add="add"
    />
    <QuotationTable
      v-if="!isSep"
      :filteredResults="orderedFilteredResults"
      :filteredItems="filteredItems"
      :totalSubtotal="totalSubtotal"
      :columnWidths="columnWidths"
    />
    <WMSTable
      v-if="isSep"
      :sepPrice="sepPrice"
      :filteredResults="filteredResults"
      :filteredItems="filteredItems"
      :totalSubtotal2="totalSubtotal"
    />
    <div class="mt-6 text-right">
      <button @click="handleShare" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" :disabled="!shareFilename">
        複製分享連結
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import QuotationHeader from './QuotationHeader.vue';
import QuotationTable from './QuotationTable.vue';
import WMSTable from './WMSTable.vue';
import styleText from '../assets/style.css?raw';
const route = useRoute();
const filename = ref(route.query.filename || 'all.json');
const shareFilename = ref(filename.value);

const customer = ref('');
const tel = ref('');
const fax = ref('');
const contacter = ref('');
const add = ref('');
const filteredResults = ref({});
const itemList = ref([]);
const isSep = ref(false);
const sepPrice = ref(750);
const totalSubtotal = ref(0);
const columnWidths = ref([60, 60, 60, 60, 100, 60, 50, 50, 60, 40, 60, 60, 90, 90]);
const cardOrderList = ref([]);
const loading = ref(true);
const error = ref('');

const filteredItems = computed(() => itemList.value.filter(item => item.checked));

const orderedFilteredResults = computed(() => {
  return Object.fromEntries(
    cardOrderList.value
      .map(({ id }) => [id, filteredResults.value[id]])
      .filter(([_, r]) => r?.isEnabled)
  );
});

const detectTypeFromId = (id) => {
  const knownTypes = ['一字型', 'L', 'M', '中島', '側落腳', '倒包', '假腳或門檻', '高背'];
  return knownTypes.find(type => id.startsWith(type)) || '一字型';
};

onMounted(async () => {
  try {
    const res = await axios.get(`https://junchengstone.synology.me/accapi/?action=load`, {
      params: { filename: filename.value }
    });
    const data = res.data.content;

    customer.value = data.customer || '';
    tel.value = data.tel || '';
    fax.value = data.fax || '';
    contacter.value = data.contacter || '';
    add.value = data.add || '';
    filteredResults.value = data.results || {};
    itemList.value = data.itemList || [];
    isSep.value = data.isSep || false;
    sepPrice.value = data.sepPrice || 750;

    totalSubtotal.value = Object.values(filteredResults.value).reduce(
      (sum, r) => sum + (parseFloat(isSep.value ? r?.subtotal2 : r?.subtotal) || 0), 0
    ) + filteredItems.value.reduce((sum, i) => sum + i.amount * i.price, 0);

    columnWidths.value = data.localColumnWidths || columnWidths.value;

    if (data.cardOrderList) {
      cardOrderList.value = data.cardOrderList.map(c => ({ ...c, isEnabled: c.isEnabled !== false }));
    } else {
      cardOrderList.value = Object.keys(data.results || {}).map(id => ({ id, type: detectTypeFromId(id), isEnabled: true }));
    }
    loading.value = false;
  } catch (err) {
    error.value = '載入分享資料失敗';
    loading.value = false;
  }
});

const handleShare = async () => {
  if (!shareFilename.value) {
    alert('請先儲存或選擇要分享的檔案');
    return;
  }

  const shareUrl = `${window.location.origin}/accn/share?${encodeURIComponent(shareFilename.value)}`;
  try {
    await navigator.clipboard.writeText(shareUrl);
    showMessage(`分享連結已複製到剪貼簿：\n${shareUrl}`);
  } catch (err) {
    showMessage('無法複製分享連結，請手動複製以下連結：\n' + shareUrl);
  }
};
// 建立顯示訊息的 HTML 結構 (如果還沒有的話)
if (!document.getElementById('notification-container')) {
  const container = document.createElement('div');
  container.id = 'notification-container';
  document.body.appendChild(container);
}
function showMessage(message, type = 'info', duration = 3000) {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.classList.add(type); // 可以添加 'success', 'error', 'info' 等樣式
  notification.textContent = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out'); // 添加淡出動畫的 class
    setTimeout(() => {
      container.removeChild(notification);
    }, 300); // 等待淡出動畫結束後移除元素
  }, duration);
}

</script>

<style src="../assets/style.css"></style>