import { MaybeNumber, OntimeEvent, TimerState } from 'ontime-types';
import { millisToString } from 'ontime-utils';

import { getOffsetText } from '../../common/utils/offset';
import { formatTime } from '../../common/utils/time';

const defaultTimeFormat = { format12: 'h:mm a', format24: 'HH:mm' };
export function getFormattedScheduleTimes(
  data: {
    offset: number;
    actualStart: MaybeNumber;
    expectedEnd: MaybeNumber;
  },
  timeFormat?: string,
) {
  const formatOptions = timeFormat ? { format12: timeFormat, format24: timeFormat } : defaultTimeFormat;
  return {
    actualStart: formatTime(data.actualStart, formatOptions),
    expectedEnd: formatTime(data.expectedEnd, formatOptions),
    offset: getOffsetText(data.offset),
  };
}

export function getFormattedEventData(
  eventNow: OntimeEvent | null,
  timer: TimerState,
  mainSource: keyof OntimeEvent | null,
  timeFormat?: string,
) {
  const formatOptions = timeFormat ? { format12: timeFormat, format24: timeFormat } : defaultTimeFormat;
  return {
    title: (eventNow?.[mainSource ?? 'title'] as string) || '-',
    startedAt: formatTime(timer.startedAt, formatOptions),
    expectedEnd: formatTime(timer.expectedFinish, formatOptions),
    timer: millisToString(timer.current),
  };
}
