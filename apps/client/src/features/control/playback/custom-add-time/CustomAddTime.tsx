import { useLocalStorage } from '@mantine/hooks';
import { Playback } from 'ontime-types';
import { MILLIS_PER_HOUR, parseUserTime } from 'ontime-utils';
import { IoAdd, IoRemove } from 'react-icons/io5';

import TimeInput from '../../../../common/components/input/time-input/TimeInput';
import { setPlayback } from '../../../../common/hooks/useSocket';
import TapButton from '../tap-button/TapButton';

import style from './CustomAddTime.module.scss';

interface CustomAddTimeProps {
  playback: Playback;
}

export default function CustomAddTime(props: CustomAddTimeProps) {
  const { playback } = props;
  const [timeInMs, setTime] = useLocalStorage({ key: 'add-time', defaultValue: 300_000 });

  const handleTimeChange = (_field: string, value: string) => {
    const newTimeInMs = parseUserTime(value);
    setTime(Math.min(newTimeInMs, MILLIS_PER_HOUR));
  };

  const disabled = playback !== Playback.Play && playback !== Playback.Pause;
  const doDisableButtons = disabled || timeInMs === 0;

  return (
    <div className={style.customAddTime}>
      <TimeInput name='addtime' submitHandler={handleTimeChange} time={timeInMs} placeholder='Add time' />
      <TapButton onClick={() => setPlayback.addTime(-timeInMs)} disabled={doDisableButtons} aspect='fill'>
        <IoRemove />
      </TapButton>
      <TapButton onClick={() => setPlayback.addTime(timeInMs)} disabled={doDisableButtons} aspect='fill'>
        <IoAdd />
      </TapButton>
    </div>
  );
}
