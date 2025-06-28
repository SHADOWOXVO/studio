"use client";

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    let item;
    if (typeof window !== 'undefined') {
      item = window.localStorage.getItem(key);
    }
    
    if (item) {
      try {
        setValue(JSON.parse(item));
      } catch (e) {
        console.error(`Error parsing JSON from localStorage key "${key}":`, e);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
        setValue(initialValue);
      }
    }
  }, [key, initialValue]);

  const setLocalStorageValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      setValue(prevValue => {
        const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (e) {
          console.error(`Error setting localStorage key "${key}":`, e);
        }
        return valueToStore;
      });
    },
    [key]
  );

  return [value, setLocalStorageValue];
}
