import { usePlaybackControl } from '../../../../common/hooks/useSocket';
import CustomAddTime from '../custom-add-time/CustomAddTime';
import PlaybackTimer from '../playback-timer/PlaybackTimer';
import { usePlaybackKeyboard } from '../usePlaybackKeyboard';
import SimpleAddTime from './SimpleAddTime';
import SimplePlaybackButtons from './SimplePlaybackButtons';

import style from './SimplePlaybackControl.module.scss';

export default function SimplePlaybackControl() {
  const data = usePlaybackControl();

  usePlaybackKeyboard({
    playback: data.playback,
    numEvents: data.numEvents,
    selectedEventIndex: data.selectedEventIndex,
    timerPhase: data.timerPhase,
  });

  return (
    <div className={style.mainContainer}>
      <PlaybackTimer>
        <SimpleAddTime playback={data.playback} />
      </PlaybackTimer>
      <SimplePlaybackButtons
        playback={data.playback}
        numEvents={data.numEvents}
        selectedEventIndex={data.selectedEventIndex}
        timerPhase={data.timerPhase}
      />
      <CustomAddTime playback={data.playback} />
    </div>
  );
}
