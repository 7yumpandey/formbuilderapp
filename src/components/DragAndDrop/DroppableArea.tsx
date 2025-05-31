import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableField from './SortableField';
import { FormField } from '../../types/form';

interface DroppableAreaProps {
  id: string;
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  fields,
  selectedFieldId,
  onSelectField,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area ${
        isOver
          ? 'border-primary bg-primary/5'
          : fields.length === 0
          ? 'border-neutral-300 bg-neutral-100'
          : 'border-transparent'
      }`}
    >
      {fields.length === 0 ? (
        <div className="text-center py-10 text-neutral-500">
          <p className="text-sm">Drag and drop fields here</p>
        </div>
      ) : (
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              isSelected={field.id === selectedFieldId}
              onClick={() => onSelectField(field.id)}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
};

export default DroppableArea;