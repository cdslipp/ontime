import CollapsibleSection from '../../../../common/components/collapsible-section/CollapsibleSection';
import { AuxTimer } from './AuxTimer';

import style from './AuxTimerSection.module.scss';

export default function AuxTimerSection() {
  return (
    <CollapsibleSection title="Auxiliary Timers" storageKey="editor-aux-timers-collapsed">
      <div className={style.auxTimers}>
        <AuxTimer index={1} />
        <AuxTimer index={2} />
        <AuxTimer index={3} />
      </div>
    </CollapsibleSection>
  );
}
