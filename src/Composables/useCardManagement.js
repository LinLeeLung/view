import { ref } from 'vue';

export function useCardManagement(resultsRef) {
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

  const cardLists = ref({
    '一字型': [],
    'L': [],
    'M': [],
    '中島': [],
    '側落腳': [],
    '倒包': [],
    '假腳或門檻': [],
    '高背': []
  });

  const addCard = (type) => {
    const knownTypes = Object.keys(cardLists.value);
    if (!knownTypes.includes(type)) {
      alert(`❌ 不支援的元件類型：${type}`);
      return;
    }
    const id = `${type}-${typeCounters.value[type]++}`;
    cardLists.value[type].push(id);
    cardOrderList.value.push({ id, type, isEnabled: true });
  };

  const removeCard = (id, type) => {
    const list = cardLists.value[type];
    const index = list.indexOf(id);
    if (index > -1) list.splice(index, 1);
    cardOrderList.value = cardOrderList.value.filter((c) => c.id !== id);
    delete resultsRef.value[id];
  };

  const getComponent = (type) => {
        const map = {
      '一字型': () => import('../components/One.vue'),
      'L': () => import('../components/L.vue'),
      'M': () => import('../components/M.vue'),
      '中島': () => import('../components/Iland.vue'),
      '側落腳': () => import('../components/Leg.vue'),
      '倒包': () => import('../components/Wrap.vue'),
      '假腳或門檻': () => import('../components/DoorFront.vue'),
      '高背': () => import('../components/Wall.vue')
}
    if (!map[type]) {
      console.warn(`⚠️ 無法找到元件類型: "${type}"，將顯示佔位元件。`);
      return {
        template: `<div class='text-red-500 p-2'>⚠ 無效元件類型：${type}</div>`
      };
    }
    return map[type];
  };

  const restoreCardListsFromOrderList = (orderList) => {
    for (const key of Object.keys(cardLists.value)) {
      cardLists.value[key] = [];
    }

    orderList.forEach(({ id, type }) => {
      const num = parseInt(id.split('-')[1]);
      if (!isNaN(num) && num >= typeCounters.value[type]) {
        typeCounters.value[type] = num + 1;
      }
      cardLists.value[type].push(id);
    });
  };

  const detectTypeFromId = (id) => {
    const knownTypes = Object.keys(cardLists.value);
    return knownTypes.find(type => id.startsWith(type)) || '一字型';
  };

  return {
    typeCounters,
    cardLists,
    cardOrderList,
    addCard,
    removeCard,
    getComponent,
    restoreCardListsFromOrderList,
    detectTypeFromId
  };
}
