<template>
 


  <div class="container p-2">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-green-600">峻晟會計專用估價1</h1>
    </div>
    <div class="p-6 text-3xl font-bold text-purple-600">
    Tailwind is working! 💜
    </div>
    <!-- File Management Section -->
    <div class="mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">檔案管理</h3>
      <div class="flex flex-wrap gap-4 mb-4">
        <div>
          <label class="mr-2">儲存檔案名稱:</label>
          <input
            v-model="newFilename"
            type="text"
            class="p-1 border rounded-md text-sm"
            placeholder="輸入檔案名稱"
          />
          <button
            @click="saveFile"
            class="ml-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
            儲存
          </button>
        </div>
        <div>
          <label class="mr-2">載入檔案:</label>
          <select v-model="selectedFile" class="p-1 border rounded-md text-sm">
            <option value="" disabled>選擇檔案</option>
            <option v-for="file in files" :key="file" :value="file">{{ file }}</option>
          </select>
          <button
            @click="loadFile"
            class="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="!selectedFile"
          >
            載入
          </button>
          <button
            @click="deleteFile"
            class="ml-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            :disabled="!selectedFile"
          >
            刪除
          </button>

                  
          <label class="mr-2">統一價格：</label>
          <input
            v-model.number="unifiedPrice"
            type="number"
            min="1"
            class="p-1 border rounded-md w-20 text-sm"
            placeholder="輸入單價"
          />
          <button
            @click="applyUnifiedPrice"
            class="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            同一價格
          </button>
          <label class="mr-2">統一顏色：</label>
          <input
            v-model="unifiedColor"
            type="text"
           
            class="p-1 border rounded-md w-20 text-sm"
            placeholder="輸入顏色"
          />
          <button
            @click="applyUnifiedColor"
            class="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            同一顏色
          </button>
          <button @click="generateQuotation" class="ml-2 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600">
            產出報價單
           </button>
           <label class = "m-2" for="checkbox">工料分離</label>
           <input
        type="checkbox"
        v-model="isSep"
        class="m-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
      <label class = "m-2" for="checkbox">每才單價</label>
           <input
        type="number"
        v-model="sepPrice"
        class="p-1 border rounded-md w-20 text-sm"
      />
        </div>
      </div>
      <p v-if="message" class="text-sm text-gray-600">{{ message }}</p>
    </div>

    <div class="bg-blue-50 p-4 rounded-lg shadow-md">
          客戶關鍵字<input type =text v-model="cuskeyword" />
          <label> 選擇客戶：</label>  <select v-if="filterCustomers.length > 0" v-model="selectedCustomer" @change="fillDetails">
            <option v-for="customer in filterCustomers" :key="customer.name" :value="customer">
                {{ customer.name }}
            </option>
        </select>
          客戶名稱<input type = text v-model="customer" placeholder ="請輸入客戶名稱"/> 
          電話<input type = text v-model="tel" placeholder ="請輸入電話"/>
          傳真<input type = text v-model="fax" placeholder ="請輸入傳真"/><br>
          聯絡人<input type = text v-model="contacter" placeholder ="請輸入聯絡人"/>
          地址<input type = text v-model="add" placeholder ="請輸入地址"/>
          

      </div>


    <!-- 一字型區塊 -->
<h3 class="text-lg font-semibold text-gray-700 mb-2">一字型</h3>
<div class="grid grid-cols-3 gap-4 mb-6 bg-blue-100 p-4 rounded">
  <div v-for="index in 6" :key="index" class="min-w-[300px]">
    <One
      :sepPrice="sepPrice"
      :index="'一字型' + index"
      :initialValue="resultsProxy['一字型' + index]"
      @update-result="updateResult"
    />
  </div>
</div>
      

      <!-- L 型區塊 -->
      <h3 class="text-lg font-semibold text-gray-700 mb-2">L 型</h3>
      <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
        <div v-for="index in 3" :key="'L' + index" class="flex-1 min-w-[300px]">
          <L :sepPrice="sepPrice" :index="'L' + index" :initialValue="resultsProxy['L' + index]" @update-result="updateResult" />
        </div>
      </div>

      <!-- M 型區塊 -->
       <h3 class="text-lg font-semibold text-gray-700 mb-2">M 型</h3>
      <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
        <div v-for="index in 3" :key="'M' + index" class="flex-1 min-w-[300px]">
          <M
          :sepPrice="sepPrice"
          :index="'M' + index"
          :initialValue="resultsProxy['M' + index]"
          @update-result="updateResult"
        />

        </div>
      </div> 

      <!-- 中島區塊 -->
      <h3 class="text-lg font-semibold text-gray-700 mb-2">中島</h3>
      <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
        <div v-for="index in 3" :key="'Island' + index" class="flex-1 min-w-[300px]">
          <Iland
          :sepPrice="sepPrice"
          :index="'中島' + index"
          :initialValue="resultsProxy['中島' + index]"
          @update-result="updateResult"
          />

        </div>
      
      </div> 

       <!-- 側落腳區塊 -->
      <h3 class="text-lg font-semibold text-gray-700 mb-2">側落腳</h3>
      <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
        <div v-for="index in 3" :key="'Leg' + index" class="flex-1 min-w-[300px]">
          <Leg
          :sepPrice="sepPrice"
          :index="'側落腳' + index"
          :initialValue="resultsProxy['側落腳' + index]"
          @update-result="updateResult"
          />

        </div>
      
      </div> 

      <!-- 倒包區塊 -->
      <h3 class="text-lg font-semibold text-gray-700 mb-2">倒包</h3>
      <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
        <div v-for="index in 3" :key="'Wrap' + index" class="flex-1 min-w-[300px]">
          <Wrap
          :sepPrice="sepPrice"
          :index="'倒包' + index"
          :initialValue="resultsProxy['倒包' + index]"
          @update-result="updateResult"
          />

        </div>
      </div>
      
      <!--假腳或門檻-->

        <h3 class="text-lg font-semibold text-gray-700 mb-2">假腳或門檻</h3>
        <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
          <div v-for="index in 3" :key="'DoorFront' + index" class="flex-1 min-w-[300px]">
            <DoorFront
           :sepPrice="sepPrice"
           :index="'假腳或門檻' + index"
           :initialValue="resultsProxy['假腳或門檻' + index]"
           @update-result="updateResult"
           />
          </div>
        </div>
       
        <!--高背-->
        <h3 class="text-lg font-semibold text-gray-700 mb-2">高背</h3>
        <div class="flex flex-row flex-wrap gap-4 mb-6 bg-blue-100 p-4 rounded">
          <div v-for="index in 3" :key="'Wall' + index" class="flex-1 min-w-[300px]">
            <Wall
           :sepPrice="sepPrice"
           :index="'高背' + index"
           :initialValue="resultsProxy['高背' + index]"
           @update-result="updateResult"
           />
          </div>
        </div>  

      <!-- 附加項目區塊 -->
      <h3 class="text-lg font-semibold text-gray-700 mb-2">附加項目</h3>
      <div class="mb-6">
        <Items v-model:items="itemList" />
      </div> 
      <button @click="generateQuotation" class="bg-purple-500 text-white px-4 py-2 rounded">
       產出報價單
      </button> 
      <label class = "m-2" for="checkbox">工料分離</label>
           <input
        type="checkbox"
        v-model="isSep"
        class="m-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
      />
   <div class="result-container mt-6 p-4 bg-green-50 rounded-lg w-full"> 
    <!-- 表頭-->
    
    <QuotationHeader 
      :customer="customer"
      :tel="tel"
      :fax="fax"
      :contacter="contacter"
      :add="add"    />

   
     <QuotationTable v-if="!isSep"
      :filteredResults="filteredResults"
      :filteredItems="filteredItems"
      :totalSubtotal="totalSubtotal"
    />
    <WMSTable v-if="isSep"
      :sepPrice="sepPrice"
      :filteredResults="filteredResults"
      :filteredItems="filteredItems"
      :totalSubtotal2="totalSubtotal2"  />
    
    
    </div>
  </div>
</template>

<script>

import { ref, computed ,onMounted, watch} from 'vue';
import One from './components/One.vue';
import L from './components/L.vue';
import M from './components/M.vue';
import Iland from './components/Iland.vue';
import Items from './components/Items.vue';
import axios from 'axios'; // Import axios for API requests
import { nextTick } from 'vue';
import Leg from './components/Leg.vue';
import QuotationHeader from './components/QuotationHeader.vue';
import QuotationTable from './components/QuotationTable.vue';
import WMSTable from './components/WMSTable.vue'; 
import Wrap from './components/Wrap.vue';
import { applySeparationItems } from './Composables/autoSeparationLogic.js'; // Import the separation logic
import DoorFront from './components/DoorFront.vue';
import Wall from './components/Wall.vue';
import styleText from './assets/style.css?raw';


// import WMSTable from './components/WMSTable.vue';
// const cssUrl = new URL("@/public/style.css", import.meta.url).href;


const generateQuotation = () => {
  // ✅ 取得結果區內容
  const resultContent = document.querySelector(".result-container");

  // ✅ 開啟新視窗
  const printWindow = window.open("", "_blank");

  // ✅ 讀取樣式並將 HTML 內容插入
  printWindow.document.write(`
    <html>
    <head>
      <title>報價單</title>
      <style>
        ${styleText}
      </style>
      
    </head>
    <body>
     
      <!-- ✅ 插入結果內容 -->
      <div class="result-container">
        ${resultContent.innerHTML}
      </div>
    </body>
    </html>
  `);

  // ✅ 關閉文件流，確保內容寫入
  printWindow.document.close();

  // ✅ 加載完成後自動執行列印
  printWindow.onload = () => {
    printWindow.print();
  };
};


const calculate = async () => {
  await nextTick(); // 確保 DOM 更新完成
  // 執行計算邏輯
};


export default {
  name: 'App',
  components: { One, L, M, Iland, Items ,Leg, QuotationHeader, QuotationTable , WMSTable, Wrap, DoorFront, Wall },
  setup() {
   

  const applyUnifiedPrice = () => {
  const price = parseInt(unifiedPrice.value);
  if (isNaN(price) || price <= 0) {
    alert("請輸入有效的價格");
    return;
  }
  console.log(`✅ 統一價格: ${unifiedPrice.value}`);

Object.keys(results.value).forEach((key) => {
  // ✅ 不論是否勾選，都強制更新 unitPrice
  console.log(key, results.value[key]);
  results.value[key].unitPrice = unifiedPrice.value; // ✅ 統一價格
  results.value[key].forceUpdate = true; // ✅ 強制更新
  if(key.includes('假腳或門檻')){
    results.value[key].stonePrice = unifiedPrice.value // 假腳或門檻價格的石材價格
  }
});

nextTick(() => {
  calculate(); // ✅ 重新計算結果
});

console.log('🔄 已統一所有元件價格');
};

const applyUnifiedColor = () => {
  const newColor = unifiedColor.value.trim();
  if (!newColor) {
    alert("請輸入有效的顏色");
    return;
  }

  console.log(`✅ 統一顏色: ${newColor}`);

  Object.keys(results.value).forEach((key) => {
    if (results.value[key]?.isEnabled) {
      results.value[key].color = newColor;
    }
  });

  nextTick(() => {
    calculate(); // ✅ 重新計算結果
  });

  console.log("🔄 已統一所有元件顏色");
};


    
    
    const results = ref({});
    const resultsProxy = computed(() => results.value)
    const unifiedPrice = ref(0);
    const unifiedColor = ref("");
    const customer = ref('');
    const tel = ref('');
    const fax = ref('');
    const contacter = ref('');
    const add = ref('');
    const itemList = ref([]);
    const files = ref([]);
    const newFilename = ref('');
    const selectedFile = ref('');
    const message = ref('');
    const cuskeyword = ref('');
    const selectedCustomer = ref('');
    const customers=ref([]);
    const isSep = ref(false);
    const sepPrice = ref(750);
    const totalFrontEdgeLength= computed(() => {
      const total = Object.values(results.value).reduce((sum, r) => {
        if (r?.isEnabled && r?.frontEdgeLength) {
          return sum + parseFloat(r.frontEdgeLength);
        }
        return sum;
      }, 0);
      return total.toFixed(0);
    });
    watch([isSep, totalFrontEdgeLength], () => {
    applySeparationItems({ isSep, itemList, totalFrontEdgeLength });
});



      const fetchCustomers = async () => {
        try {
            let response = await fetch("https://junchengstone.synology.me/acc/proxy.php");
            let data = await response.json();

            if (Array.isArray(data)) {
                customers.value = data; // 使用 ref 變數
            } else {
                console.error("回應的資料格式錯誤！", data);
            }
        } catch (error) {
            console.error("無法獲取客戶資料：", error);
        }
      };
  onMounted(() => {
      console.log("正在獲取客戶資料...");
      fetchCustomers(); // 自動載入客戶資料
      fetchData(); // 自動載入 API 資料
      console.log('isSep:', isSep.value);
      });
   ///
   const filterCustomers = computed(() => {
  let keyword = cuskeyword.value.trim().toLowerCase();

  // ✅ 確保 customers 是陣列
  if (!Array.isArray(customers.value)) {
    console.error("customers 資料異常", customers.value);
    return [];
  }

  // ✅ 篩選邏輯
  return customers.value.filter((c) =>
    c.name.toLowerCase().includes(keyword)
  );
});



   // API URL
const url =
  'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLigc6YtS8LeqlGNHC-izL0xaWOPe_q4nGx1b0ecoRSO3zVu53MKoLdd5Ti7qQmRmOKz3YJzyYl9jYfOqAyuJp7vhmwHXKSp6w--mSBwGMgVHC4-9v1c1bT9tgfY0e4zqq4FK5HfZHk8JXsIqGdNeixPUu6YNuxJ-coCUz1kiqo7cC4zu9pw5xIlBuI5MiROhhGgcRvKJRkci7xDfqM4gijY_Se-ARXAKQyANX1FPokbaN1hQU7d_C7uAsUG1Wr5PlXz2JKxv3el4rsF19KJht0E-MYPGQ&lib=MIG840YcRyBozKsoJjxkgz2my7uZSrO0E';

// 取得 API 資料
const fetchData = async () => {
 // loading.value = true;
  try {
    const response = await axios.get(url);
    itemList.value = response.data;
    //console.log('資料獲取成功：', itemList.value);
  } catch (error) {
    console.error('資料獲取失敗：', error);
    items.value = [];
  } finally {
   // loading.value = false;
  }
};

// 自動載入資料

    // API base URL for localhost since both frontend and backend are in the same Codespace
    const API_BASE_URL ="https://junchengstone.synology.me/accapi/";

    // Fetch the list of files on component mount
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}?action=files`);
        files.value = response.data.files;
      } catch (error) {
        message.value = '無法載入檔案列表: ' + error.message;
      }
    };

    // Call fetchFiles when the component is mounted
    fetchFiles();

    const updateResult = (result) => {
  if (result.isEnabled) {
    // 只有當 result 變更時才更新
    if (
      !results.value[result.index] ||
      JSON.stringify(results.value[result.index]) !== JSON.stringify(result)
    ) {
      results.value[result.index] = { ...result };
    }
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
    const totalSubtotal2 = computed(() => {
      const shapeTotal = Object.values(filteredResults.value).reduce(
        (sum, r) => sum + (parseFloat(r?.subtotal2) || 0), 0
      );
      const itemsTotal = filteredItems.value.reduce(
        (sum, item) => sum + (item.price * item.amount || 0), 0
      );
      return shapeTotal + itemsTotal;
    });
    
    

    // Save the current state to a file
    const saveFile = async () => {
  if (!newFilename.value) {
    message.value = '請輸入檔案名稱';
    return;
  }

  const filename = newFilename.value.endsWith('.json')
    ? newFilename.value
    : `${newFilename.value}.json`;

  const content = {
    results: results.value,
    itemList: itemList.value,
    customer: customer.value,
    tel: tel.value,
    fax: fax.value,
    contacter: contacter.value,
    add: add.value,
    cuskeyword: cuskeyword.value,
    selectedCustomer: selectedCustomer.value,
    isSep: isSep.value,
  };

  try {
    await axios.post(`${API_BASE_URL}?action=save`, {
      filename,
      content
    });

    message.value = `檔案 ${filename} 已儲存`;
    newFilename.value = '';
    fetchFiles(); // 重新載入檔案列表
  } catch (error) {
    message.value = '儲存失敗: ' + error.message;
  }
};
const fillDetails = () => {
  if (selectedCustomer.value) {
    customer.value = selectedCustomer.value.name || "";
    tel.value = selectedCustomer.value.tel || "";
    fax.value = selectedCustomer.value.fax || "";
  }
};


    // Load a file and restore the state
    const loadFile = async () => {
  if (!selectedFile.value) return;
  try {
    const response = await axios.get(`${API_BASE_URL}?action=load`, {
      params: { filename: selectedFile.value },
    });

    const data = response.data.content;

    if (data.results) {
      results.value = { ...data.results }; // ✅ 重新賦值，清空舊資料
      customer.value = data.customer || '';
      tel.value = data.tel || '';
      fax.value = data.fax || '';
      contacter.value = data.contacter || '';
      add.value = data.add || '';
      cuskeyword.value = data.cuskeyword || '';
      selectedCustomer.value = data.selectedCustomer || '';
      isSep.value = data.isSep || false;
  }

    if (data.itemList) {
      itemList.value = JSON.parse(JSON.stringify(data.itemList)); // ✅ 防止引用關聯
    }


    message.value = `檔案 ${selectedFile.value} 已載入`;
    selectedFile.value = '';
  } catch (error) {
    message.value = '載入失敗: ' + error.message;
  }
};



    // Delete a file
    const deleteFile = async () => {
      if (!selectedFile.value) return;
      try {
        await axios.delete(`${API_BASE_URL}?action=delete`, {
          params: { filename: selectedFile.value }
        });
        message.value = `檔案 ${selectedFile.value} 已刪除`;
        selectedFile.value = '';
        fetchFiles(); // Refresh the file list
      } catch (error) {
        message.value = '刪除失敗: ' + error.message;
      }
    };


    






    return {
      itemList,
      updateResult,
      filteredResults,
      filteredItems,
      hasValidResults,
      totalSubtotal,
      totalSubtotal2,
      files,
      newFilename,
      selectedFile,
      message,
      saveFile,
      loadFile,
      deleteFile,
      results,
      resultsProxy,
      cuskeyword,
      customers,
      fetchCustomers,
      selectedCustomer,
      customer,
      tel,
      fax,
      contacter,
      add,
      generateQuotation,
      fetchData,
      filterCustomers,
      fetchFiles,
      applyUnifiedPrice,
      applyUnifiedColor,
      unifiedPrice,
      fillDetails,
      unifiedColor,
      isSep,
      sepPrice
    };
  },
};

</script>

<style scoped>

.text-left {
  text-align: left !important;
}
</style>