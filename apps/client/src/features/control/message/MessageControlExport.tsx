import { useLocalStorage } from '@mantine/hooks';
import { memo } from 'react';
import { IoChevronDown } from 'react-icons/io5';

import * as Editor from '../../../common/components/editor-utils/EditorUtils';
import ErrorBoundary from '../../../common/components/error-boundary/ErrorBoundary';
import ViewNavigationMenu from '../../../common/components/navigation-menu/ViewNavigationMenu';
import ProtectRoute from '../../../common/components/protect-route/ProtectRoute';
import { handleLinks } from '../../../common/utils/linkUtils';
import { cx } from '../../../common/utils/styleUtils';
import { getIsNavigationLocked } from '../../../externals';
import { EditorLayoutMode, useEditorLayout } from '../../../views/editor/useEditorLayout';
import MessageControl from './MessageControl';

import style from './MessageControlExport.module.scss';

export default memo(MessageControlExport);
function MessageControlExport() {
  const isExtracted = window.location.pathname.includes('/messagecontrol');
  const { layoutMode } = useEditorLayout();
  const [collapsed, setCollapsed] = useLocalStorage({ key: 'editor-message-control-collapsed', defaultValue: false });

  const useSimple = layoutMode === EditorLayoutMode.SIMPLE && !isExtracted;

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <ProtectRoute permission='editor'>
      <Editor.Panel className={cx([style.growPanel, useSimple && collapsed && style.collapsedPanel])} data-testid='panel-messages-control'>
        {!isExtracted && layoutMode !== EditorLayoutMode.SIMPLE && <Editor.CornerExtract onClick={(event) => handleLinks('messagecontrol', event)} />}
        {isExtracted && <ViewNavigationMenu suppressSettings isNavigationLocked={getIsNavigationLocked()} />}

        {useSimple && (
          <div className={style.sectionHeader} onClick={handleCollapse}>
            Messages
            <IoChevronDown className={cx([collapsed ? style.closed : style.open])} />
          </div>
        )}

        <div className={cx([style.contentLayout, useSimple && collapsed && style.hidden])}>
          <ErrorBoundary>
            <MessageControl />
          </ErrorBoundary>
        </div>
      </Editor.Panel>
    </ProtectRoute>
  );
}
