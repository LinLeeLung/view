import { ref, nextTick } from 'vue'

export function useDynamicCardList(typeName, resultsRef) {
  const cardList = ref([])
  const counter = ref(1) // 🆕 用來控制 index

  const addCard = () => {
    const id = `${typeName}${counter.value}`
    cardList.value.push(id)
    counter.value++
  }

  const removeCard = (id) => {
    cardList.value = cardList.value.filter((item) => item !== id)
    delete resultsRef.value[id]
    resultsRef.value = { ...resultsRef.value }
    nextTick()
  }

  const restoreFromResults = () => {
    cardList.value = Object.keys(resultsRef.value).filter(key => key.startsWith(typeName))

    // 🆙 根據已存在的 index 更新 counter，避免重複
    const maxIndex = cardList.value
      .map(id => parseInt(id.replace(typeName, '')))
      .filter(n => !isNaN(n))
      .reduce((a, b) => Math.max(a, b), 0)

    counter.value = maxIndex + 1
  }

  return {
    cardList,
    addCard,
    removeCard,
    restoreFromResults
  }
}
