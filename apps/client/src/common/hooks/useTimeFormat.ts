import { use, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { PresetContext } from '../context/PresetContext';

/**
 * Hook to retrieve the time format from URL parameters or current Preset
 */
export function useTimeFormat(): string | undefined {
  const [searchParams] = useSearchParams();
  const maybePreset = use(PresetContext);

  return useMemo(() => {
    const getValue = (key: string) => (maybePreset ? new URLSearchParams(maybePreset.search).get(key) : null) ?? searchParams.get(key);
    return getValue('timeformat') ?? undefined;
  }, [maybePreset, searchParams]);
}
