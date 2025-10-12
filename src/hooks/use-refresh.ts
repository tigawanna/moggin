import { JSXElementConstructor, ReactElement, useCallback, useState } from 'react';
import { RefreshControlProps } from 'react-native';

export function useRefresh(callback: () => Promise<void> | void) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    setIsRefreshing(true);
    try {
      await callback();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [callback, isRefreshing]);

  return {
    isRefreshing,
    refresh,
  };
}


export type RefreshControlType =
  | ReactElement<RefreshControlProps,
   string | JSXElementConstructor<any>>
  | undefined;
