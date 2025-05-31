import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import { FormField, FieldType } from '../../types/form';
import { getFieldIcon } from '../../utils/fieldIcons';

interface FieldsPanelProps {
  onAddField: (field: Omit<FormField, 'id'>) => void;
}

const FieldsPanel: React.FC<FieldsPanelProps> = ({ onAddField }) => {
  // Define available field types
  const availableFieldTypes: { type: FieldType; label: string; description: string }[] = [
    { type: 'text', label: 'Text', description: 'Single line text input' },
    { type: 'textarea', label: 'Textarea', description: 'Multi-line text input' },
    { type: 'number', label: 'Number', description: 'Numeric input' },
    { type: 'email', label: 'Email', description: 'Email address input' },
    { type: 'password', label: 'Password', description: 'Password input with masking' },
    { type: 'select', label: 'Dropdown', description: 'Dropdown select menu' },
    { type: 'checkbox', label: 'Checkbox', description: 'Single checkbox for boolean values' },
    { type: 'radio', label: 'Radio Buttons', description: 'Radio button group' },
    { type: 'date', label: 'Date', description: 'Date picker' },
    { type: 'time', label: 'Time', description: 'Time picker' },
    { type: 'file', label: 'File Upload', description: 'File upload field' },
    { type: 'range', label: 'Range Slider', description: 'Range slider input' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'form-builder-dropzone') {
      const fieldType = active.id as FieldType;
      createField(fieldType);
    }
  };

  const createField = (type: FieldType) => {
    // Create a new field based on type
    const newField: Omit<FormField, 'id'> = {
      type,
      label: getDefaultLabel(type),
      name: getDefaultName(type),
      placeholder: `Enter ${getDefaultLabel(type).toLowerCase()}`,
      isRequired: false,
    };

    // Add options for select, radio, etc.
    if (type === 'select' || type === 'radio' || type === 'multiselect') {
      newField.options = [
        { id: nanoid(), label: 'Option 1', value: 'option1' },
        { id: nanoid(), label: 'Option 2', value: 'option2' },
        { id: nanoid(), label: 'Option 3', value: 'option3' },
      ];
    }

    onAddField(newField);
  };

  const getDefaultLabel = (type: FieldType): string => {
    switch (type) {
      case 'text':
        return 'Text Field';
      case 'textarea':
        return 'Text Area';
      case 'number':
        return 'Number';
      case 'email':
        return 'Email Address';
      case 'password':
        return 'Password';
      case 'tel':
        return 'Phone Number';
      case 'url':
        return 'Website URL';
      case 'date':
        return 'Date';
      case 'time':
        return 'Time';
      case 'datetime-local':
        return 'Date and Time';
      case 'checkbox':
        return 'Checkbox';
      case 'radio':
        return 'Radio Group';
      case 'select':
        return 'Dropdown';
      case 'multiselect':
        return 'Multi-Select';
      case 'file':
        return 'File Upload';
      case 'range':
        return 'Range Slider';
      case 'color':
        return 'Color Picker';
      case 'hidden':
        return 'Hidden Field';
      default:
        return 'New Field';
    }
  };

  const getDefaultName = (type: FieldType): string => {
    return getDefaultLabel(type).toLowerCase().replace(/\s+/g, '_');
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Form Components</h3>
      <p className="text-sm text-neutral-500 mb-4">Drag and drop components to build your form</p>
      
      <div className="grid grid-cols-2 gap-2">
        {availableFieldTypes.map((fieldType) => {
          const FieldIcon = getFieldIcon(fieldType.type);
          return (
            <button
              key={fieldType.type}
              className="flex flex-col items-center p-3 border border-neutral-200 rounded-md bg-white hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => createField(fieldType.type)}
            >
              <FieldIcon className="w-5 h-5 text-primary mb-2" />
              <span className="text-sm font-medium">{fieldType.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Quick Tips</h4>
        <ul className="text-xs text-neutral-600 space-y-1 list-disc pl-4">
          <li>Click a component to add it to your form</li>
          <li>Use the properties panel to configure each field</li>
          <li>Drag and drop to rearrange fields in your form</li>
          <li>All forms are saved automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default FieldsPanel;