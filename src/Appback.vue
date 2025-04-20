<template>

  

  <div class="container p-2">
    
      <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-green-600">峻晟會計專用估價(新)</h1>
      </div>
  
    <!-- File Management Section -->
      <div class="mb-6 p-1 bg-gray-100 rounded-lg">
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
              class="m-2 p-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
             >
              儲存
            </button>
         </div>
        <div>
          <label class="m-2">載入檔案:</label>
          <select v-model="selectedFile" class="p-2 border rounded-md text-sm w-30">
            <option value="" disabled>選擇檔案</option>
            <option v-for="file in files" :key="file" :value="file">{{ file }}</option>
          </select>
          <button
            @click="loadFile"
            class="m-2 ml-3 p-1  bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="!selectedFile"
          >
            載入
          </button>
          <button
            @click="deleteFile"
            class="m-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
            :disabled="!selectedFile"
          >
            刪除
          </button>

                  
          <label class="m-2">統一價格：</label>
          <input
            v-model.number="unifiedPrice"
            type="number"
            min="1"
            class="p-1 m-1 border rounded-md w-30 text-sm"
            placeholder="輸入單價"
          />
          <button
            @click="applyUnifiedPrice"
            class="m-1 mr-3 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            統一價格
          </button>
          <label class="m-2 ">統一顏色：</label>
          <input
            v-model="unifiedColor"
            type="text"
           
            class="p-1 m-1 border rounded-md w-30 text-sm"
            placeholder="輸入顏色"
          />
           <button
            @click="applyUnifiedColor"
            class="m-1 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
           >
            統一顏色
           </button>
           <button @click="generateQuotation1" class="m-1 p-1 bg-purple-500 text-white rounded hover:bg-purple-600">
            電腦報價單
           </button>
           <label class = "m-1" for="checkbox">工料分離</label>
           <input
            type="checkbox"
            v-model="isSep"
            class="m-1 h-3 w-3 text-green-500 focus:ring-green-500 border-gray-300 rounded"
           />
          <label class = "m-1" for="checkbox">每才單價</label>
          <input
            type="number"
            v-model="sepPrice"
            class="p-1 border rounded-md w-15 text-sm"
              />
          </div>
          </div>
          <p v-if="message" class="text-sm text-gray-600">{{ message }}</p>
       </div>

      <!-- 客戶資料 -->
        <div class="bg-blue-50 p-1 rounded-lg shadow-md">
          客戶關鍵字<input type =text v-model="cuskeyword" />
          <label> 選擇客戶：</label>  <select v-if="filterCustomers.length > 0" v-model="selectedCustomer" @change="fillDetails">
           <option
            v-for="(customer, index) in filterCustomers"
            :key="customer.name + '-' + index"
            :value="customer"
            >
            {{ customer.name }}
          </option>
        </select>
          客戶名稱<input type = text v-model="customer" placeholder ="請輸入客戶名稱"/> 
          電話<input type = text v-model="tel" placeholder ="請輸入電話"/>
          傳真<input type = text v-model="fax" placeholder ="請輸入傳真"/><br>
          聯絡人<input type = text v-model="contacter" placeholder ="請輸入聯絡人"/>
          地址<input type = text v-model="add" placeholder ="請輸入地址"/>
          

           <!-- ✅ 新增欄寬設定控制區 -->
          <label class="ml-4">欄寬設定：</label>
          <select v-model="selectedLayout" @change="applyColumnWidthLayout" class="p-1 border rounded-md text-sm">
            <option v-for="(cols, name) in columnWidthPresets" :key="name" :value="name">{{ name }}</option>
          </select>
          <input v-model="newLayoutName" placeholder="新設定名稱" class="p-1 border rounded-md text-sm w-[120px] ml-2" />
          <button @click="saveColumnWidthLayout" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">儲存</button>
          <button @click="setDefaultColumnWidthLayout(selectedLayout)" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-blue-600">設為預設</button>
        

      </div>


          <h3 class="text-lg font-semibold text-gray-700 mb-2">混合型</h3>
          <!-- 📌 新增控制區（統一集中操作） -->
     <div class="flex flex-wrap gap-2 mb-4">
      <button @click="addCard('一字型')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 一字型</button>
      <button @click="addCard('L')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ L 型</button>
      <button @click="addCard('M')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ M 型</button>
      <button @click="addCard('中島')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 中島</button>
      <button @click="addCard('側落腳')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 側落腳</button>
      <button @click="addCard('倒包')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 倒包</button>
      <button @click="addCard('假腳或門檻')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 假腳</button>
      <button @click="addCard('高背')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">➕ 高背</button>
     </div>

  

<!-- 📦 所有卡片統一顯示 -->
<div class="one-card-container bg-blue-50 p-3 rounded grid gap-4">
  <template v-for="entry in cardOrderList" :key="entry.id">
        <div class="relative border border-gray-300 rounded-lg p-2">
          <div class="font-semibold text-sm text-gray-600 mb-1">{{ entry.id }}</div>
          <component
              v-if="getComponent(entry.type)"
              :is="getComponent(entry.type)"
              :index="entry.id"
              :initialValue="{
                 ...(isObject(resultsProxy[entry.id]) ? resultsProxy[entry.id] : {}),
                 isEnabled: true
              }"
              :sepPrice="sepPrice"
              @update-result="updateResult"
            />

          <button
            @click="removeCard(entry.id, entry.type)"
            class="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
          >✖</button>
        </div>
      </template>
</div>


      

      <!-- 附加項目區塊 -->

      <h3 class="text-lg font-semibold text-gray-700 mb-2">附加項目</h3>
      <div >
         <Items v-model:items="itemList" />
      </div>


      <button @click="generateQuotation" class="bg-purple-500 text-white px-4 py-2 rounded">
       手機報價單
      </button> 
      <label class = "m-2" for="checkbox">工料分離</label>
        <input
          type="checkbox"
          v-model="isSep"
          class="m-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
        />
     <div class="result-container" style="--tw-bg-opacity: 1; background-color: white !important;">

            <!-- 表頭-->
          
          <QuotationHeader 
            :customer="customer"
            :tel="tel"
            :fax="fax"
            :contacter="contacter"
            :add="add"    />

        
          <QuotationTable v-if="!isSep"
            :filteredResults="orderedFilteredResults"
            :filteredItems="filteredItems"
            :totalSubtotal="totalSubtotal"
            :columnWidths="localColumnWidths"
            @update:columnWidths="val => localColumnWidths = val"
            
          />
          <WMSTable v-if="isSep"
            :sepPrice="sepPrice"
            :filteredResults="orderedFilteredResults"
            :filteredItems="filteredItems"
            :totalSubtotal2="totalSubtotal2"  />
          
          
      </div>
 </div>
</template>

<script >
import { useDynamicCardList } from './composables/useDynamicCardList.js'
import { isObject } from './utlis/validate.js';
import One from './components/One.vue';
import L from './components/L.vue';
import M from './components/M.vue';
import Iland from './components/Iland.vue';
import Items from './components/Items.vue';
import axios from 'axios'; // Import axios for API requests

import Leg from './components/Leg.vue';
import QuotationHeader from './components/QuotationHeader.vue';
import QuotationTable from './components/QuotationTable.vue';
import WMSTable from './components/WMSTable.vue'; 
import Wrap from './components/Wrap.vue';
import { applySeparationItems } from './Composables/autoSeparationLogic.js'; // Import the separation logic
import DoorFront from './components/DoorFront.vue';
import Wall from './components/Wall.vue';
import styleText from './assets/style.css?raw';
import html2pdf from 'html2pdf.js';
import { ref, computed, nextTick, onMounted, watch } from 'vue';






const columnWidths = ref([100, 120, 120, 100, 160, 100, 80, 80, 80, 60, 80, 100, 200, 200]);
const localColumnWidths = ref([100, 120, 120, 100, 160, 100, 80, 80, 80, 60, 80, 100, 200, 200]); // 用來儲存每欄的寬度
const selectedLayout = ref('預設欄寬');
const newLayoutName = ref('');
// const localColumnWidths = ref([100, 120, 120, 100, 160, 100, 80, 80, 80, 60, 80, 100, 200, 200]);
const columnWidthPresets = ref({
  '預設欄寬': [...localColumnWidths.value]
});

const saveColumnWidthLayout = () => {
  if (!newLayoutName.value) return alert('請輸入新設定名稱');
  columnWidthPresets.value[newLayoutName.value] = [...localColumnWidths.value];
  selectedLayout.value = newLayoutName.value;
  newLayoutName.value = '';
};

const applyColumnWidthLayout = () => {
  const preset = columnWidthPresets.value[selectedLayout.value];
  if (preset) {
    localColumnWidths.value = [...preset];
  }
};

const setDefaultColumnWidthLayout = (layoutName) => {
  if (!columnWidthPresets.value[layoutName]) return;
  selectedLayout.value = layoutName;
};
    

const generateQuotation1 = () => {
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

const generateQuotation = async () => {
  const element = document.querySelector(".result-container");
  if (!element) {
    alert("找不到報價內容，請先產生報價！");
    return;
  }

  await nextTick(); // 確保 Vue 渲染完

  const opt = {
    margin: 0.5,
    filename: `報價單_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
};








const calculate = async () => {
  await nextTick(); // 確保 DOM 更新完成
  // 執行計算邏輯
};


export default {
  name: 'App',
  components: { One, L, M, Iland, Items ,Leg, QuotationHeader, QuotationTable , WMSTable, Wrap, DoorFront, Wall },
  setup() {
  
  const orderedFilteredResults = computed(() => {
  return Object.fromEntries(
    cardOrderList.value
      .map(({ id }) => [id, results.value[id]])
      .filter(([_, r]) => r?.isEnabled)
  );
});
 
   const cardOrderList = ref([]);
    const typeCounters = ref({
      '一字型': 1,
      'L': 1,
      'M': 1,
      '中島': 1,
      '側落腳': 1,
      '倒包': 1,
      '假腳或門檻': 1,
      '高背': 1,
    });

    const oneCardList = ref([]);
    const lCardList = ref([]);
    const mCardList = ref([]);
    const islandCardList = ref([]);
    const legCardList = ref([]);
    const wrapCardList = ref([]);
    const doorCardList = ref([]);
    const wallCardList = ref([]);
    const addCard = (type) => {
      const knownTypes = ['一字型', 'L', 'M', '中島', '側落腳', '倒包', '假腳或門檻', '高背'];
      if (!knownTypes.includes(type)) {
        alert(`❌ 不支援的元件類型：${type}`);
        return;
      }

      const id = `${type}-${typeCounters.value[type]++}`;

      // 對應各元件清單
      const listMap = {
        '一字型': oneCardList,
        'L': lCardList,
        'M': mCardList,
        '中島': islandCardList,
        '側落腳': legCardList,
        '倒包': wrapCardList,
        '假腳或門檻': doorCardList,
        '高背': wallCardList,
      };

      listMap[type].value.push(id);
      cardOrderList.value.push({ id, type, isEnabled: true });
    };


    const removeCard = (id, type) => {
      const listMap = {
        '一字型': oneCardList,
        'L': lCardList,
        'M': mCardList,
        '中島': islandCardList,
        '側落腳': legCardList,
        '倒包': wrapCardList,
        '假腳或門檻': doorCardList,
        '高背': wallCardList,
      };
      const list = listMap[type];
      const index = list.value.indexOf(id);
      if (index > -1) list.value.splice(index, 1);
      cardOrderList.value = cardOrderList.value.filter((c) => c.id !== id);
      delete results.value[id];
    };

  const getComponent = (type) => {
  const map = {
    '一字型': One,
    'L': L,
    'M': M,
    '中島': Iland,
    '側落腳': Leg,
    '倒包': Wrap,
    '假腳或門檻': DoorFront,
    '高背': Wall,
  };
  if (!map[type]) {
    // console.log(`⚠️ 無法找到元件類型: "${type}"，將顯示佔位元件。`);
    return {
     
    };
  }
  return map[type];
};




    const restoreCardListsFromOrderList = (orderList) => {
  // 清空所有清單
  oneCardList.value = []
  lCardList.value = []
  mCardList.value = []
  islandCardList.value = []
  legCardList.value = []
  wrapCardList.value = []
  doorCardList.value = []
  wallCardList.value = []

  orderList.forEach(({ id, type }) => {
    const num = parseInt(id.split('-')[1]);
    if (!isNaN(num) && num >= typeCounters.value[type]) {
      typeCounters.value[type] = num + 1;
    }

    switch (type) {
      case '一字型': oneCardList.value.push(id); break;
      case 'L': lCardList.value.push(id); break;
      case 'M': mCardList.value.push(id); break;
      case '中島': islandCardList.value.push(id); break;
      case '側落腳': legCardList.value.push(id); break;
      case '倒包': wrapCardList.value.push(id); break;
      case '假腳或門檻': doorCardList.value.push(id); break;
      case '高背': wallCardList.value.push(id); break;
    }
  });
};

  const applyUnifiedPrice = () => {
      const price = parseInt(unifiedPrice.value);
      if (isNaN(price) || price <= 0) {
        alert("請輸入有效的價格");
        return;
      }
      console.log(`✅ 統一價格: ${unifiedPrice.value}`);

      Object.keys(results.value).forEach((key) => {
      // ✅ 不論是否勾選，都強制更新 unitPrice
      // console.log(key, results.value[key]);
      results.value[key].unitPrice = unifiedPrice.value; // ✅ 統一價格
      results.value[key].forceUpdate = true; // ✅ 強制更新
      if(key.includes('假腳或門檻')){
        results.value[key].stonePrice = unifiedPrice.value // 假腳或門檻價格的石材價格
      }
      });

    nextTick(() => {
      calculate(); // ✅ 重新計算結果
    });

    // console.log('🔄 已統一所有元件價格');
  };

const applyUnifiedColor = () => {
  const newColor = unifiedColor.value.trim();
  if (!newColor) {
    alert("請輸入有效的顏色");
    return;
  }

  // console.log(`✅ 統一顏色: ${newColor}`);

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
    let separationTimeout = null;
watch(
  [isSep, () => totalFrontEdgeLength.value],
  () => {
    clearTimeout(separationTimeout);
    separationTimeout = setTimeout(() => {
      applySeparationItems({ isSep, itemList, totalFrontEdgeLength });
    }, 100);
  },
  { flush: 'post' }
);
 
// ⬇️ 引入自定義卡片管理 composable





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
      // console.log("正在獲取客戶資料...");
      fetchCustomers(); // 自動載入客戶資料
      fetchData(); // 自動載入 API 資料
      // console.log('isSep:', isSep.value);
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
      // console.log('[updateResult]', result.index);
    const current = results.value[result.index];
     const isChanged = !current || JSON.stringify(current) !== JSON.stringify(result);
     
  if (isChanged) {
    results.value[result.index] = { ...result };
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
    
    

    const saveFile = async () => {
  if (!newFilename.value) {
    message.value = '請輸入檔案名稱';
    return;
  }

  const filename = newFilename.value.endsWith('.json')
    ? newFilename.value
    : `${newFilename.value}.json`;

  const content = {
    cardOrderList: cardOrderList.value,
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
    localColumnWidths: localColumnWidths.value  // ✅ 正確存欄寬
  };

  try {
    await axios.post(`${API_BASE_URL}?action=save`, {
      filename,
      content
    });

    message.value = `檔案 ${filename} 已儲存`;
    newFilename.value = '';
    fetchFiles(); // 重新載入檔案清單
  } catch (error) {
    message.value = '儲存失敗: ' + error.message;
  }
};



const detectTypeFromId = (id) => {
  const knownTypes = ['一字型', 'L', 'M', '中島', '側落腳', '倒包', '假腳或門檻', '高背'];
  return knownTypes.find(type => id.startsWith(type)) || '一字型';
};

const fillDetails = () => {
  if (selectedCustomer.value) {
    customer.value = selectedCustomer.value.name || "";
    tel.value = selectedCustomer.value.tel || "";
    fax.value = selectedCustomer.value.fax || "";
  }
};

const loadFile = async () => {
  if (!selectedFile.value) return;

  try {
    const response = await axios.get(`${API_BASE_URL}?action=load`, {
      params: { filename: selectedFile.value },
    });

    const data = response.data.content;

    // 項目與結果還原
    if (Array.isArray(data.itemList)) itemList.value = data.itemList;
    if (data.results) results.value = data.results;

    // 卡片清單還原
    if (Array.isArray(data.cardOrderList)) {
      const newOrder = data.cardOrderList.map(c => ({
        ...c,
        isEnabled: c.isEnabled !== false
      }));
      cardOrderList.value = newOrder;
      restoreCardListsFromOrderList(newOrder);
    } else if (data.results && typeof data.results === 'object') {
      // 舊版備援
      const fallback = Object.keys(data.results).map(id => ({
        id,
        type: detectTypeFromId(id),
        isEnabled: true
      }));
      cardOrderList.value = fallback;
      restoreCardListsFromOrderList(fallback);
    }

    // 其他欄位還原
    customer.value = data.customer || '';
    tel.value = data.tel || '';
    fax.value = data.fax || '';
    contacter.value = data.contacter || '';
    add.value = data.add || '';
    cuskeyword.value = data.cuskeyword || '';
    selectedCustomer.value = data.selectedCustomer || '';
    isSep.value = data.isSep || false;

    // 欄寬還原並套用
    if (Array.isArray(data.localColumnWidths)) {
      localColumnWidths.value = data.localColumnWidths;
      await nextTick();
      applyColumnWidthLayout();  // ✅ 套用選取的設定名稱
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
      saveColumnWidthLayout,
      applyColumnWidthLayout,
      setDefaultColumnWidthLayout,
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
      generateQuotation1,
      fetchData,
      filterCustomers,
      fetchFiles,
      applyUnifiedPrice,
      applyUnifiedColor,
      unifiedPrice,
      fillDetails,
      unifiedColor,
      isSep,
      sepPrice,
      cardOrderList,
      addCard,
      removeCard,
      getComponent,
      orderedFilteredResults,
      localColumnWidths,
      isObject,
      columnWidthPresets,
      selectedLayout,
      newLayoutName,
      newLayoutName,
      

    };
  },
};



</script>





<style scoped>
.text-left {
  text-align: left !important;
}
/* 新增響應式排版：讓卡片在桌機三欄、橫向手機二欄、直式手機一欄 */
:deep(.one-card-container) {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;        /* 保證不超出 */
  max-width: 100%;    /* 限制最大 */
  overflow-x: hidden; /* 預防橫向 overflow */
}


@media (min-width: 640px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

}
</style>