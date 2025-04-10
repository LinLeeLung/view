// composables/useEstimate.js
import { ref, onMounted, watch } from 'vue';

export function useEstimate() {
  // Reactive state
  const savedFiles = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const filename = ref(''); // Reactive filename for saving/loading
  const selectedFile = ref(''); // Reactive selected file for loading/deleting

  // Fetch list of saved files
  const getSavedFiles = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('list.php');
      if (!response.ok) throw new Error('無法載入檔案列表');
      const data = await response.json();
      savedFiles.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = '載入檔案列表失敗：' + err.message;
      console.error('載入檔案列表錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  // Save estimate to server
  const saveEstimate = async (estimateData) => {
    loading.value = true;
    error.value = null;
    try {
      const effectiveFilename = filename.value || `${new Date().toISOString().split('T')[0]}-001`;
      const response = await fetch('save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: effectiveFilename, data: estimateData }),
      });
      if (!response.ok) throw new Error('存檔失敗');
      const data = await response.json();
      if (data.status === 'success') {
        filename.value = effectiveFilename; // Update filename after successful save
        await getSavedFiles(); // Refresh file list
        return true;
      } else {
        throw new Error(data.message || '存檔失敗');
      }
    } catch (err) {
      error.value = '存檔失敗：' + err.message;
      console.error('存檔錯誤:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Load estimate from server
  const loadEstimate = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!selectedFile.value) throw new Error('請選擇一個檔案');
      const response = await fetch(`load.php?filename=${encodeURIComponent(selectedFile.value)}`);
      if (!response.ok) throw new Error('載入失敗');
      const data = await response.json();
      if (data.status === 'success') {
        return data.data; // Return the loaded estimate data
      } else {
        throw new Error(data.message || '載入失敗');
      }
    } catch (err) {
      error.value = '載入失敗：' + err.message;
      console.error('載入錯誤:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Delete estimate from server
  const deleteEstimate = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!selectedFile.value) throw new Error('請選擇一個檔案');
      const response = await fetch(`delete.php?filename=${encodeURIComponent(selectedFile.value)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('刪除失敗');
      const data = await response.json();
      if (data.status === 'success') {
        selectedFile.value = ''; // Reset selected file
        await getSavedFiles(); // Refresh file list
        return true;
      } else {
        throw new Error(data.message || '刪除失敗');
      }
    } catch (err) {
      error.value = '刪除失敗：' + err.message;
      console.error('刪除錯誤:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in filename and selectedFile to trigger updates if needed
  watch([filename, selectedFile], ([newFilename, newSelectedFile]) => {
    if (newFilename) console.log('Filename updated:', newFilename);
    if (newSelectedFile) console.log('Selected file updated:', newSelectedFile);
    // Add custom logic here if needed (e.g., auto-save on filename change)
  });

  // Initialize by fetching saved files on mount
  onMounted(() => {
    getSavedFiles();
  });

  return {
    savedFiles,
    error,
    loading,
    filename,
    selectedFile,
    getSavedFiles,
    saveEstimate,
    loadEstimate,
    deleteEstimate,
  };
}