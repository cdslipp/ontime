import CollapsibleSection from '../../../common/components/collapsible-section/CollapsibleSection';
import { AppMode } from '../../../ontimeConfig';
import TitleList from './TitleList';

import style from './OutlineSection.module.scss';

export default function OutlineSection() {
  return (
    <CollapsibleSection
      title="Outline"
      storageKey="editor-outline-collapsed"
      panelClassName={style.outlinePanel}
      collapsedPanelClassName={style.collapsedPanel}
      contentClassName={style.content}
      sectionClassName={style.section}
    >
      <TitleList mode={AppMode.Run} className={style.embeddedList} />
    </CollapsibleSection>
  );
}
