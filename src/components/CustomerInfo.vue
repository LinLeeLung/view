<!-- components/CustomerInfo.vue -->
<template>
  <div class="border p-2 m-2 border-gray-600 bg-gray-100">
    <h2 class="text-lg font-bold text-blue-600 mb-2">客戶資料</h2>
    
    <!-- Customer Search and Selection -->
    <div class="mb-2">
      <label class="mr-2">搜尋客戶：</label>
      <input
        v-model="searchCustomer"
        @input="filterCustomers"
        placeholder="輸入關鍵字搜尋客戶"
        class="border p-1 w-64"
      />
      <select
        v-model="selectedCustomer"
        @change="selectCustomer"
        class="inline w-64 px-3 py-2 border border-gray-500 bg-white text-lg font-bold rounded-md shadow-md focus:ring focus:ring-blue-300 focus:outline-none"
      >
        <option disabled value="">請選擇客戶</option>
        <option v-for="(customer, index) in filteredCustomers" :key="index" :value="customer">
          {{ customer.name }}
        </option>
      </select>
    </div>

    <!-- Customer Details Inputs -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label>公司名稱：</label>
        <input v-model="customerData.name" class="border p-1 w-full" @input="emitUpdate" />
      </div>
      <div>
        <label>電話：</label>
        <input v-model="customerData.tel" class="border p-1 w-full" @input="emitUpdate" />
      </div>
      <div>
        <label>傳真：</label>
        <input v-model="customerData.fax" class="border p-1 w-full" @input="emitUpdate" />
      </div>
      <div>
        <label>聯絡人：</label>
        <input v-model="customerData.contacter" class="border p-1 w-full" @input="emitUpdate" />
      </div>
      <div class="col-span-2">
        <label>地址：</label>
        <input v-model="customerData.add" class="border p-1 w-full" @input="emitUpdate" />
      </div>
    </div>

    <!-- Loading/Error States -->
    <div v-if="loading" class="text-gray-500 mt-2">載入客戶資料中...</div>
    <div v-if="error" class="text-red-500 mt-2">載入客戶資料失敗：{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

defineProps({
  customerData: {
    type: Object,
    required: true,
    default: () => ({ name: '', tel: '', fax: '', contacter: '', add: '' }),
  },
});

const emit = defineEmits(['update:customerData']);

const searchCustomer = ref('');
const selectedCustomer = ref('');
const customers = ref([]);
const filteredCustomers = ref([]);
const loading = ref(false);
const error = ref(null);

// Fetch customer data from server
const fetchCustomers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('proxy.php');
    if (!response.ok) throw new Error('無法載入客戶資料');
    const data = await response.json();
    customers.value = data;
    filteredCustomers.value = data;
  } catch (err) {
    error.value = err.message;
    console.error('載入客戶資料錯誤:', err);
  } finally {
    loading.value = false;
  }
};

// Filter customers based on search keyword
const filterCustomers = () => {
  const keyword = searchCustomer.value.toLowerCase();
  filteredCustomers.value = customers.value.filter(customer =>
    customer.name.toLowerCase().includes(keyword) ||
    customer.tel.toLowerCase().includes(keyword) ||
    customer.fax.toLowerCase().includes(keyword) ||
    customer.contacter.toLowerCase().includes(keyword) ||
    customer.add.toLowerCase().includes(keyword)
  );
};

// Update customer data when a customer is selected
const selectCustomer = () => {
  if (selectedCustomer.value) {
    Object.assign(customerData, {
      name: selectedCustomer.value.name || '',
      tel: selectedCustomer.value.tel || '',
      fax: selectedCustomer.value.fax || '',
      contacter: selectedCustomer.value.contacter || '',
      add: selectedCustomer.value.add || '',
    });
    emitUpdate();
  }
};

// Emit updates to parent
const emitUpdate = () => {
  emit('update:customerData', { ...customerData });
};

// Watch for changes in customerData from parent and sync
watch(
  () => customerData,
  (newData) => {
    if (!selectedCustomer.value || newData.name !== selectedCustomer.value.name) {
      selectedCustomer.value = ''; // Reset selection if manual edit occurs
    }
  },
  { deep: true }
);

// Fetch customers on mount
onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped>
/* Add any additional Tailwind or custom styles here if needed */
</style>