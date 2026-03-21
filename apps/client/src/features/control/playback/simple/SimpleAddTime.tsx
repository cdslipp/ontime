import { Playback } from 'ontime-types';

import { setPlayback } from '../../../../common/hooks/useSocket';
import TapButton from '../tap-button/TapButton';

import style from './SimpleAddTime.module.scss';

interface SimpleAddTimeProps {
  playback: Playback;
}

export default function SimpleAddTime(props: SimpleAddTimeProps) {
  const { playback } = props;

  const disabled = playback !== Playback.Play && playback !== Playback.Pause;

  return (
    <div className={style.addTime}>
      <TapButton onClick={() => setPlayback.addTime(-60_000)} disabled={disabled} className={style.button}>
        -1m
      </TapButton>
      <TapButton onClick={() => setPlayback.addTime(300_000)} disabled={disabled} className={style.button}>
        +5m
      </TapButton>
    </div>
  );
}
