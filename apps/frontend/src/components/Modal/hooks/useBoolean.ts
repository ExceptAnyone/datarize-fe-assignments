import { useState, useCallback } from 'react';

/**
 * boolean 상태를 관리하는 훅
 * @param initialValue 초기 값 (기본: false)
 * @returns value, setTrue, setFalse, toggle 함수들
 */
export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle };
}
