import { OffsetMode, OntimeEvent, OntimeGroup, TimerPhase, TimerType } from 'ontime-types';
import { dayInMs, isPlaybackActive } from 'ontime-utils';

import * as Editor from '../../../../common/components/editor-utils/EditorUtils';
import { useEntry } from '../../../../common/hooks-query/useRundown';
import {
  useCurrentGroupId,
  useFlagTimerOverView,
  useGroupTimerOverView,
  useNextFlag,
} from '../../../../common/hooks/useSocket';
import { cx } from '../../../../common/utils/styleUtils';
import { formatDueTime } from '../../../overview/overview.utils';

import style from './TimeSummary.module.scss';

interface TimeSummaryProps {
  standalone?: boolean;
}

export default function TimeSummary({ standalone }: TimeSummaryProps) {
  return (
    <div className={cx([style.timeSummary, standalone && style.standalone])}>
      <Editor.Title>Time summary</Editor.Title>
      <GroupTimeSummary />
      <FlagTimeSummary />
    </div>
  );
}

function GroupTimeSummary() {
  const { clock, mode, groupExpectedEnd, actualGroupStart, currentDay, playback, phase } = useGroupTimerOverView();
  const currentGroupId = useCurrentGroupId();
  const group = useEntry(currentGroupId) as OntimeGroup | null;

  const hasRunningTimer = phase !== TimerPhase.Pending && isPlaybackActive(playback);

  const plannedGroupEnd = (() => {
    if (!hasRunningTimer) return null;
    if (!group || group.timeStart === null) return null;
    const normalizedClock = clock + currentDay * dayInMs;

    if (mode === OffsetMode.Absolute) {
      return group.timeStart + group.duration - normalizedClock;
    }
    if (actualGroupStart === null) return null;
    return actualGroupStart + group.duration - normalizedClock;
  })();

  const plannedDisplay = formatDueTime(plannedGroupEnd, 3, TimerType.CountDown);

  const expectedGroupEnd = hasRunningTimer && groupExpectedEnd !== null ? groupExpectedEnd - clock : null;
  const expectedDisplay = formatDueTime(expectedGroupEnd, 3, TimerType.CountDown);

  const heading = group?.title || 'Current group';

  return (
    <div className={style.section}>
      <span className={style.heading}>{heading}</span>
      <TimeRow label='Planned end' value={plannedDisplay} isActive={!!group && hasRunningTimer} />
      <TimeRow label='Expected end' value={expectedDisplay} isActive={expectedGroupEnd !== null} />
    </div>
  );
}

function FlagTimeSummary() {
  const { clock, mode, actualStart, plannedStart, playback, currentDay, phase } = useFlagTimerOverView();
  const { id, expectedStart } = useNextFlag();
  const entry = useEntry(id) as OntimeEvent | null;

  const hasRunningTimer = phase !== TimerPhase.Pending && isPlaybackActive(playback);

  const plannedFlagStart = (() => {
    if (!hasRunningTimer) return null;
    if (!entry) return null;
    const normalizedTimeStart = entry.timeStart + entry.dayOffset * dayInMs;
    const normalizedClock = clock + currentDay * dayInMs;
    if (mode === OffsetMode.Absolute) {
      return normalizedTimeStart - normalizedClock;
    }
    if (actualStart === null || plannedStart === null) return null;
    return normalizedTimeStart + actualStart - plannedStart - normalizedClock;
  })();

  const plannedDisplay = formatDueTime(plannedFlagStart, 3, TimerType.CountDown);

  const expectedTimeUntil = hasRunningTimer && expectedStart !== null ? expectedStart - clock : null;
  const expectedDisplay = formatDueTime(expectedTimeUntil, 3, TimerType.CountDown);

  const heading = entry?.title || 'Next flag';

  return (
    <div className={style.section}>
      <span className={style.heading}>{heading}</span>
      <TimeRow label='Planned start' value={plannedDisplay} isActive={!!entry && hasRunningTimer} />
      <TimeRow label='Expected start' value={expectedDisplay} isActive={expectedTimeUntil !== null} />
    </div>
  );
}

interface TimeRowProps {
  label: string;
  value: string;
  isActive: boolean;
}

function TimeRow({ label, value, isActive }: TimeRowProps) {
  const isDue = value === 'due';

  return (
    <div className={style.row}>
      <span className={style.label}>{label}</span>
      <span className={cx([style.value, !isActive && style.muted, isDue && style.dueTime])}>{value}</span>
    </div>
  );
}
