<!-- components/FileManager.vue -->
<template>
  <div>
    <input v-model="filename" placeholder="輸入檔名 (預設: YYYYMMDD-001)" class="border p-1 w-60" />
    <button @click="$emit('save')" class="bg-blue-500 text-white px-4 py-2 rounded">存檔</button>
    <input v-model="searchKeyword" placeholder="輸入關鍵字搜尋檔案" class="border p-1 w-60" />
    <select v-model="selectedFile" class="inline w-64 px-3 py-2 border border-gray-500 bg-white text-lg font-bold rounded-md shadow-md focus:ring focus:ring-blue-300 focus:outline-none">
      <option disabled value="">選擇檔案</option>
      <option v-for="(file, index) in filteredFiles" :key="index" :value="file">{{ file }}</option>
    </select>
    <button @click="$emit('load')" class="bg-green-500 text-white px-4 py-2 rounded">載入</button>
    <button @click="$emit('delete')" class="bg-red-500 text-white px-4 py-2 rounded ml-2">刪除</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps(['filename', 'searchKeyword', 'selectedFile']);
defineEmits(['update:filename', 'update:searchKeyword', 'update:selectedFile', 'save', 'load', 'delete']);

const savedFiles = ref([]);

const filteredFiles = computed(() => {
  return savedFiles.value.filter(file =>
    file.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});
</script>