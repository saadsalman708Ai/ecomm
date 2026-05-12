import React from 'react';
import type { HomeSectionConfig } from '../../../types/homeSection';
import { SectionListItem } from './SectionListItem';

interface Props {
  sections: HomeSectionConfig[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
  onEdit: (section: HomeSectionConfig) => void;
}

export const SectionList = ({ sections, onMoveUp, onMoveDown, onDelete, onEdit }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <SectionListItem 
          key={section.id} 
          section={section} 
          index={index}
          isFirst={index === 0}
          isLast={index === sections.length - 1}
          onMoveUp={() => onMoveUp(index)}
          onMoveDown={() => onMoveDown(index)}
          onDelete={() => onDelete(index)}
          onEdit={() => onEdit(section)}
        />
      ))}
    </div>
  );
};
