import { useLocalStorage } from '@mantine/hooks';
import { Playback, SimpleDirection, SimplePlayback, TimerPhase } from 'ontime-types';
import { millisToString, parseUserTime } from 'ontime-utils';
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { IoAdd, IoArrowDown, IoArrowUp, IoPause, IoPlay, IoPlaySkipForward, IoRemove, IoStop } from 'react-icons/io5';

import TimeInput from '../../../../common/components/input/time-input/TimeInput';
import {
  setAuxTimer,
  setPlayback,
  useAuxTimerControl,
  useAuxTimerTime,
  usePlaybackControl,
  useTimer,
} from '../../../../common/hooks/useSocket';
import { enDash } from '../../../../common/utils/styleUtils';
import { formatDuration } from '../../../../common/utils/time';
import { getPlaybackControlState } from '../playbackControl.utils';
import TapButton from '../tap-button/TapButton';
import TimerDisplay from '../timer-display/TimerDisplay';

import style from './SimplePlaybackBar.module.scss';

export default function SimplePlaybackBar() {
  const timer = useTimer();

  const { playback, numEvents, selectedEventIndex } = usePlaybackControl();

  const { playback: auxPlayback, direction: auxDirection } = useAuxTimerControl(1);
  const auxTime = useAuxTimerTime(1);

  const [addTimeInMs] = useLocalStorage({ key: 'add-time', defaultValue: 300_000 });
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage({
    key: 'ontime-simple-sidebar-collapsed',
    defaultValue: false,
  });
  const [editorCollapsed, setEditorCollapsed] = useLocalStorage({
    key: 'ontime-simple-editor-collapsed',
    defaultValue: false,
  });

  const { disableGo, disableNext, disableAddTime, isPlaying, goAction, goLabel } = getPlaybackControlState({
    playback,
    numEvents,
    selectedEventIndex,
    timerPhase: timer.phase,
  });

  const disableAddTimeWithAmount = disableAddTime || addTimeInMs === 0;

  const handleAddTime = (direction: 'add' | 'remove') => {
    if (disableAddTimeWithAmount) return;
    if (direction === 'add') {
      setPlayback.addTime(addTimeInMs);
    } else {
      setPlayback.addTime(-1 * addTimeInMs);
    }
  };

  const handleAuxPlayPause = () => {
    if (auxPlayback === SimplePlayback.Start) {
      setAuxTimer.pause(1);
    } else {
      setAuxTimer.start(1);
    }
  };

  const handleAuxStop = () => {
    setAuxTimer.stop(1);
  };

  const handleAuxDirectionToggle = () => {
    const newDirection =
      auxDirection === SimpleDirection.CountDown ? SimpleDirection.CountUp : SimpleDirection.CountDown;
    setAuxTimer.setDirection(1, newDirection);
  };

  const handleAuxTimeChange = (_field: string, value: string) => {
    const newTimeInMs = parseUserTime(value);
    setAuxTimer.setDuration(1, newTimeInMs);
  };

  const isOvertime = timer.phase === TimerPhase.Overtime;
  const isWaiting = timer.phase === TimerPhase.Pending;
  const displayTime = isWaiting ? timer.secondaryTimer : timer.current;

  const addTimeLabel = formatDuration(addTimeInMs);

  return (
    <div className={style.container}>
      <button
        className={style.sidebarToggle}
        type='button'
        onClick={() => setSidebarCollapsed((prev) => !prev)}
        aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
      >
        <BsLayoutSidebarInset />
      </button>

      <div className={style.itemGroup}>
        <TapButton
          onClick={goAction}
          disabled={disableGo}
          theme={Playback.Play}
          active={isPlaying}
          className={style.goButton}
        >
          <span className={style.goLabel}>{goLabel}</span>
        </TapButton>

        <TapButton
          onClick={setPlayback.next}
          disabled={disableNext}
          className={style.iconButton}
          aspect='square'
        >
          <IoPlaySkipForward />
        </TapButton>

        <TapButton
          onClick={setPlayback.stop}
          disabled={playback === Playback.Stop}
          className={style.iconButton}
          aspect='square'
        >
          <IoStop />
        </TapButton>

        <div className={style.addSection}>
          <div className={style.separator} />
          <TapButton
            onClick={() => handleAddTime('remove')}
            disabled={disableAddTimeWithAmount}
            className={style.iconButtonWithLabel}
            aspect='square'
          >
            <IoRemove />
            {addTimeLabel}
          </TapButton>
          <TapButton
            onClick={() => handleAddTime('add')}
            disabled={disableAddTimeWithAmount}
            className={style.iconButtonWithLabel}
            aspect='square'
          >
            <IoAdd />
            {addTimeLabel}
          </TapButton>
        </div>
      </div>

      <div className={style.timerSection}>
        <span className={style.negativeIndicator} data-active={isOvertime}>
          {enDash}
        </span>
        <TimerDisplay time={displayTime} phase={timer.phase} />
      </div>

      <div className={style.auxSection}>
        <TapButton onClick={handleAuxPlayPause} className={style.iconButton} theme={Playback.Play} aspect='square'>
          {auxPlayback === SimplePlayback.Start ? <IoPause /> : <IoPlay />}
        </TapButton>
        <TapButton
          onClick={handleAuxStop}
          disabled={auxPlayback === SimplePlayback.Stop}
          className={style.iconButton}
          theme={Playback.Stop}
          aspect='square'
        >
          <IoStop />
        </TapButton>
        {auxPlayback !== SimplePlayback.Stop ? (
          <div className={style.auxTimeDisplay}>{millisToString(auxTime)}</div>
        ) : (
          <TimeInput
            name='aux1-simple'
            submitHandler={handleAuxTimeChange}
            time={auxTime}
            className={style.auxTimeInput}
          />
        )}
        <TapButton
          onClick={handleAuxDirectionToggle}
          disabled={auxPlayback !== SimplePlayback.Stop}
          className={style.iconButton}
          aspect='square'
        >
          {auxDirection === SimpleDirection.CountDown ? <IoArrowDown /> : <IoArrowUp />}
        </TapButton>
      </div>

      <button
        className={style.sidebarToggle}
        type='button'
        onClick={() => setEditorCollapsed((prev) => !prev)}
        aria-label={editorCollapsed ? 'Show editor' : 'Hide editor'}
      >
        <BsLayoutSidebarInsetReverse />
      </button>
    </div>
  );
}
