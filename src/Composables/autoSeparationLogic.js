export function applySeparationItems({ isSep, itemList, totalFrontEdgeLength }) {
    if (!Array.isArray(itemList.value)) return;
  
    itemList.value.forEach(item => {
      const isStar = typeof item.name === 'string' && item.name.includes('★');
  
      if (isSep.value && isStar) {
        item.checked = true;
  
        // ✅ 特別處理前緣長度
        if (item.id === 'frontEdge45') {
          item.amount = parseFloat(totalFrontEdgeLength.value) || 0;
        }
  
        if (!item.amount) {
          item.amount = 1;
        }
  
      } else if (!isSep.value && isStar) {
        // ❌ 取消勾選，還原狀態
        item.checked = false;
        item.amount = 0;
      }
    });
  }
  