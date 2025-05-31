import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../../types/form';
import { getFieldIcon } from '../../utils/fieldIcons';
import { GripVertical } from 'lucide-react';

interface SortableFieldProps {
  field: FormField;
  isSelected?: boolean;
  onClick?: () => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, isSelected = false, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: { field },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const FieldIcon = getFieldIcon(field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 mb-2 bg-white rounded-md border ${
        isSelected ? 'border-primary shadow-sm' : 'border-neutral-200'
      } flex items-center ${isDragging ? 'field-dragging' : ''}`}
      onClick={onClick}
    >
      <div
        className="p-2 bg-neutral-100 rounded mr-3 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-neutral-600" />
      </div>
      <div className="p-2 bg-neutral-100 rounded mr-3">
        <FieldIcon className="w-4 h-4 text-neutral-600" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{field.label}</div>
        {field.isRequired && <div className="text-xs text-error mt-0.5">Required</div>}
      </div>
    </div>
  );
};

export default SortableField;