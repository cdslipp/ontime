import { useLocalStorage } from '@mantine/hooks';
import { IoChevronDown } from 'react-icons/io5';

import * as Editor from '../../../../common/components/editor-utils/EditorUtils';
import ErrorBoundary from '../../../../common/components/error-boundary/ErrorBoundary';
import { cx } from '../../../../common/utils/styleUtils';
import { AuxTimer } from './AuxTimer';

import style from './AuxTimerSection.module.scss';

export default function AuxTimerSection() {
  const [collapsed, setCollapsed] = useLocalStorage({ key: 'editor-aux-timers-collapsed', defaultValue: false });

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Editor.Panel>
      <div className={style.section}>
        <div className={style.sectionHeader} onClick={handleCollapse}>
          Auxiliary Timers
          <IoChevronDown className={cx([collapsed ? style.closed : style.open])} />
        </div>
        <ErrorBoundary>
          <div className={cx([style.auxTimers, collapsed && style.hidden])}>
            <AuxTimer index={1} />
            <AuxTimer index={2} />
            <AuxTimer index={3} />
          </div>
        </ErrorBoundary>
      </div>
    </Editor.Panel>
  );
}
