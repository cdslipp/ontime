/**
 * encapsulate logic related to showing a clock timer
 */

import { MaybeNumber } from 'ontime-types';

import { formatTime } from '../../../common/utils/time';
import { FORMAT_12, FORMAT_24 } from '../../../viewerConfig';
import { useTimeFormat } from '../../../common/hooks/useTimeFormat';
import SuperscriptTime from '../superscript-time/SuperscriptTime';

interface ClockTimeProps {
  value: MaybeNumber;
  preferredFormat12?: string;
  preferredFormat24?: string;
  className?: string;
}

export default function ClockTime(props: ClockTimeProps) {
  const { value, preferredFormat12 = FORMAT_12, preferredFormat24 = FORMAT_24, className } = props;
  const timeFormatOverride = useTimeFormat();

  const options = timeFormatOverride
    ? { format12: timeFormatOverride, format24: timeFormatOverride }
    : { format12: preferredFormat12, format24: preferredFormat24 };

  const formattedTime = formatTime(value, options);

  return <SuperscriptTime className={className} time={formattedTime} />;
}
