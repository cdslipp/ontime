import { memo } from 'react';

import * as Editor from '../../../common/components/editor-utils/EditorUtils';
import ErrorBoundary from '../../../common/components/error-boundary/ErrorBoundary';
import ViewNavigationMenu from '../../../common/components/navigation-menu/ViewNavigationMenu';
import ProtectRoute from '../../../common/components/protect-route/ProtectRoute';
import { handleLinks } from '../../../common/utils/linkUtils';
import { getIsNavigationLocked } from '../../../externals';
import { EditorLayoutMode, useEditorLayout } from '../../../views/editor/useEditorLayout';
import PlaybackControl from './PlaybackControl';
import SimplePlaybackControl from './simple/SimplePlaybackControl';

import style from './TimerControlExport.module.scss';

export default memo(TimerControlExport);
function TimerControlExport() {
  const isExtracted = window.location.pathname.includes('/timercontrol');
  const { layoutMode } = useEditorLayout();

  const useSimple = layoutMode === EditorLayoutMode.SIMPLE && !isExtracted;

  return (
    <ProtectRoute permission='editor'>
      <Editor.Panel data-testid='panel-timer-control'>
        {!isExtracted && layoutMode !== EditorLayoutMode.SIMPLE && <Editor.CornerExtract onClick={(event) => handleLinks('timercontrol', event)} />}
        {isExtracted && <ViewNavigationMenu suppressSettings isNavigationLocked={getIsNavigationLocked()} />}

        <div className={useSimple ? style.contentSimple : style.content}>
          <ErrorBoundary>
            {useSimple ? <SimplePlaybackControl /> : <PlaybackControl />}
          </ErrorBoundary>
        </div>
      </Editor.Panel>
    </ProtectRoute>
  );
}
