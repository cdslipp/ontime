import { lazy, useCallback } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { IoOpenOutline } from 'react-icons/io5';

import { DropdownMenuOption } from '../../common/components/dropdown-menu/DropdownMenu';
import { useContextMenu } from '../../common/hooks/useContextMenu';
import { handleLinks } from '../../common/utils/linkUtils';
import SimplePlaybackBar from '../../features/control/playback/simple-playback-bar/SimplePlaybackBar';
import TrackingPlaybackBar from '../../features/control/playback/tracking-playback-bar/TrackingPlaybackBar';
import { AppMode } from '../../ontimeConfig';
import OutlineSection from './title-list/OutlineSection';
import TitleList from './title-list/TitleList';
import { EditorLayoutMode, useEditorLayout } from './useEditorLayout';

import styles from './Editor.module.scss';

const Rundown = lazy(() => import('../../features/rundown/RundownExport'));
const TimerControl = lazy(() => import('../../features/control/playback/TimerControlExport'));
const MessageControl = lazy(() => import('../../features/control/message/MessageControlExport'));
const AuxTimerSection = lazy(() => import('../../features/control/playback/aux-timer/AuxTimerSection'));

export default function Editor() {
  const { layoutMode } = useEditorLayout();
  const [sidebarCollapsed] = useLocalStorage({ key: 'ontime-simple-sidebar-collapsed', defaultValue: false });

  const getPopoutOptions = useCallback(
    (): DropdownMenuOption[] => [
      { type: 'item', label: 'Open Timer Control', icon: IoOpenOutline, onClick: () => handleLinks('timercontrol') },
      { type: 'item', label: 'Open Rundown', icon: IoOpenOutline, onClick: () => handleLinks('rundown') },
      { type: 'item', label: 'Open Message Control', icon: IoOpenOutline, onClick: () => handleLinks('messagecontrol') },
    ],
    [],
  );

  const [onContextMenu] = useContextMenu<HTMLDivElement>(getPopoutOptions);

  if (layoutMode === EditorLayoutMode.SIMPLE) {
    return (
      <div id='panels' className={`${styles.panelContainer} ${styles.panelContainerSimple}`}>
        <div className={styles.simpleContent}>
          <div className={styles.left} onContextMenu={onContextMenu} data-collapsed={sidebarCollapsed || undefined}>
            <TimerControl />
            <AuxTimerSection />
            <MessageControl />
            <OutlineSection />
          </div>
          <Rundown />
        </div>
        <SimplePlaybackBar />
      </div>
    );
  }

  if (layoutMode === EditorLayoutMode.CONTROL) {
    return (
      <div id='panels' className={styles.panelContainer}>
        <div className={styles.left}>
          <TimerControl />
          <MessageControl />
        </div>
        <Rundown />
      </div>
    );
  }

  if (layoutMode === EditorLayoutMode.TRACKING) {
    return (
      <div id='panels' className={`${styles.panelContainer} ${styles.panelContainerTracking}`}>
        <div className={styles.rundownLayout}>
          <div className={styles.titlesPanel}>
            <TitleList mode={AppMode.Run} />
          </div>
          <div className={styles.rundownPanel}>
            <Rundown />
          </div>
        </div>
        <TrackingPlaybackBar />
      </div>
    );
  }

  return (
    <div id='panels' className={styles.panelContainer}>
      <div className={styles.rundownLayout}>
        <div className={styles.titlesPanel}>
          <TitleList mode={AppMode.Edit} />
        </div>
        <div className={styles.rundownPanel}>
          <Rundown />
        </div>
      </div>
    </div>
  );
}
