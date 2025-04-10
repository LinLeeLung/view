// src/composables/useLengthCalc.js
import { computed } from 'vue';

// Named export for the composable
export function useLengthCalc() {
  // Calculate length based on parameters
  const calculateLength = (side, depth, thick, stop, doubo, limit, isUnlimited) => {
    const totalDepth = (depth || 0) + (thick || 0) + (stop || 0) + (doubo || 0);
    if (isUnlimited) {
      return Math.round((side * totalDepth) / 60);
    } else if (totalDepth > limit) {
      return Math.round((side * (totalDepth - (limit - 60))) / 60);
    }
    return Math.round(side);
  };

  // Generate formula string
  const getFormula = (arr) => {
    return arr.filter(value => value !== '' && value !== 0).join('+') || '0';
  };

  return {
    calculateLength,
    getFormula,
  };
}