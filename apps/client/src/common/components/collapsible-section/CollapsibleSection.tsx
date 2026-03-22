import { ReactNode } from 'react';

import { useLocalStorage } from '@mantine/hooks';
import { IoChevronDown } from 'react-icons/io5';

import { cx } from '../../utils/styleUtils';
import * as Editor from '../editor-utils/EditorUtils';
import ErrorBoundary from '../error-boundary/ErrorBoundary';

import style from './CollapsibleSection.module.scss';

interface CollapsibleSectionProps {
  title: string;
  storageKey: string;
  children: ReactNode;
  panelClassName?: string;
  collapsedPanelClassName?: string;
  contentClassName?: string;
  sectionClassName?: string;
}

export default function CollapsibleSection({
  title,
  storageKey,
  children,
  panelClassName,
  collapsedPanelClassName,
  contentClassName,
  sectionClassName,
}: CollapsibleSectionProps) {
  const [collapsed, setCollapsed] = useLocalStorage({ key: storageKey, defaultValue: false });

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Editor.Panel className={cx([panelClassName, collapsed && collapsedPanelClassName])}>
      <div className={cx([style.section, sectionClassName])}>
        <div className={style.sectionHeader} onClick={handleCollapse}>
          {title}
          <IoChevronDown className={cx([collapsed ? style.closed : style.open])} />
        </div>
        <ErrorBoundary>
          <div className={cx([contentClassName, collapsed && style.hidden])}>
            {children}
          </div>
        </ErrorBoundary>
      </div>
    </Editor.Panel>
  );
}
