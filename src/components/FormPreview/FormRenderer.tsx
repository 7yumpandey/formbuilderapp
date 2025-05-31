import React from 'react';
import { FormField } from '../../types/form';
import FormFieldComponent from '../FormFields/FormFieldComponent';

interface FormRendererProps {
  fields: FormField[];
  formData: Record<string, any>;
  onFieldChange: (name: string, value: any) => void;
  errors?: Record<string, string[]>;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  formData,
  onFieldChange,
  errors = {},
}) => {
  if (fields.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-500">
        <p>No fields have been added to this form yet.</p>
        <p className="text-sm mt-2">Add fields using the sidebar to see them in the preview.</p>
      </div>
    );
  }

  return (
    <div>
      {fields.map((field) => (
        <FormFieldComponent
          key={field.id}
          field={field}
          value={formData[field.name] !== undefined ? formData[field.name] : field.defaultValue || ''}
          onChange={onFieldChange}
          errors={errors[field.name] || []}
          showValidation={true}
        />
      ))}
    </div>
  );
};

export default FormRenderer;