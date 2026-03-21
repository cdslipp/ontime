import { Playback, TimerPhase } from 'ontime-types';
import { FaRegClock } from 'react-icons/fa';
import { IoPause, IoPlay, IoPlaySkipBack, IoPlaySkipForward, IoStop } from 'react-icons/io5';

import { setPlayback } from '../../../../common/hooks/useSocket';
import { getPlaybackControlState } from '../playbackControl.utils';
import TapButton from '../tap-button/TapButton';

import style from './SimplePlaybackButtons.module.scss';

interface SimplePlaybackButtonsProps {
  playback: Playback;
  numEvents: number;
  selectedEventIndex: number | null;
  timerPhase: TimerPhase;
}

export default function SimplePlaybackButtons({
  playback,
  numEvents,
  selectedEventIndex,
  timerPhase,
}: SimplePlaybackButtonsProps) {
  const {
    isPlaying,
    isPaused,
    isRolling,
    disableGo,
    disableNext,
    disablePrev,
    disableRoll,
    disableStop,
    goAction,
    goLabel,
  } = getPlaybackControlState({
    playback,
    numEvents,
    selectedEventIndex,
    timerPhase,
  });

  return (
    <div className={style.buttonContainer}>
      {/* Top row: GO, Roll, Stop */}
      <TapButton
        onClick={goAction}
        disabled={disableGo}
        aspect='fill'
        className={style.main}
        theme={Playback.Play}
      >
        {goLabel}
      </TapButton>

      <TapButton
        onClick={isRolling ? setPlayback.start : setPlayback.roll}
        disabled={isRolling ? false : disableRoll}
        aspect='fill'
        className={style.roll}
        theme={Playback.Roll}
        active={isRolling}
      >
        <FaRegClock />
      </TapButton>

      <TapButton
        onClick={setPlayback.stop}
        disabled={disableStop}
        aspect='fill'
        className={style.stop}
        theme={Playback.Stop}
      >
        <IoStop />
      </TapButton>

      {/* Bottom row: Prev, Play/Pause, Next */}
      <TapButton
        onClick={setPlayback.previous}
        disabled={disablePrev}
        className={style.prev}
      >
        <IoPlaySkipBack />
      </TapButton>

      <TapButton
        onClick={isPaused ? setPlayback.start : setPlayback.pause}
        disabled={!isPlaying && !isPaused}
        theme={isPaused ? Playback.Play : Playback.Pause}
        active={isPaused}
        className={style.pause}
      >
        {isPaused ? <IoPlay /> : <IoPause />}
      </TapButton>

      <TapButton onClick={setPlayback.next} disabled={disableNext} className={style.next}>
        <IoPlaySkipForward />
      </TapButton>
    </div>
  );
}
