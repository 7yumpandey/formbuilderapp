import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../../types/form';
import { getFieldIcon } from '../../utils/fieldIcons';

interface DraggableFieldProps {
  field: FormField;
  onClick?: () => void;
  isSelected?: boolean;
  dragId?: string;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ 
  field, 
  onClick, 
  isSelected = false,
  dragId = field.id
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    data: { field },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const FieldIcon = getFieldIcon(field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 mb-2 bg-white rounded-md border ${
        isSelected ? 'border-primary shadow-sm' : 'border-neutral-200'
      } flex items-center cursor-grab active:cursor-grabbing ${isDragging ? 'field-dragging' : ''}`}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="p-2 bg-neutral-100 rounded mr-3">
        <FieldIcon className="w-4 h-4 text-neutral-600" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{field.label}</div>
        <div className="text-xs text-neutral-500">{field.type}</div>
      </div>
    </div>
  );
};

export default DraggableField;