import React from 'react';
import { FormField, ValidationRule } from '../../types/form';
import TextField from './TextField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import RadioField from './RadioField';
import DateField from './DateField';
import FileField from './FileField';
import NumberField from './NumberField';

interface FormFieldComponentProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  errors?: string[];
  showValidation?: boolean;
}

const validateField = (field: FormField, value: any): string[] => {
  if (!field.validationRules || field.validationRules.length === 0) return [];

  return field.validationRules
    .map((rule) => {
      if (rule.type === 'required' && (!value || (Array.isArray(value) && value.length === 0))) {
        return rule.message || 'This field is required';
      }

      if (value) {
        if (rule.type === 'minLength' && typeof value === 'string' && rule.value && value.length < Number(rule.value)) {
          return rule.message || `Minimum length is ${rule.value} characters`;
        }

        if (rule.type === 'maxLength' && typeof value === 'string' && rule.value && value.length > Number(rule.value)) {
          return rule.message || `Maximum length is ${rule.value} characters`;
        }

        if (rule.type === 'min' && typeof value === 'number' && rule.value && value < Number(rule.value)) {
          return rule.message || `Minimum value is ${rule.value}`;
        }

        if (rule.type === 'max' && typeof value === 'number' && rule.value && value > Number(rule.value)) {
          return rule.message || `Maximum value is ${rule.value}`;
        }

        if (rule.type === 'pattern' && typeof value === 'string' && rule.value) {
          const pattern = new RegExp(rule.value as string);
          if (!pattern.test(value)) {
            return rule.message || 'Invalid format';
          }
        }

        if (rule.type === 'email' && typeof value === 'string') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            return rule.message || 'Invalid email address';
          }
        }

        if (rule.type === 'url' && typeof value === 'string') {
          try {
            new URL(value);
          } catch (e) {
            return rule.message || 'Invalid URL';
          }
        }

        if (rule.type === 'tel' && typeof value === 'string') {
          const telPattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
          if (!telPattern.test(value)) {
            return rule.message || 'Invalid phone number';
          }
        }
      }

      return null;
    })
    .filter(Boolean) as string[];
};

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  value,
  onChange,
  errors = [],
  showValidation = true,
}) => {
  // Run validation
  const validationErrors = showValidation ? validateField(field, value) : [];
  const allErrors = [...errors, ...validationErrors];

  // Common props for all field types
  const commonProps = {
    id: field.id,
    name: field.name,
    label: field.label,
    value,
    onChange: (val: any) => onChange(field.name, val),
    placeholder: field.placeholder,
    helpText: field.helpText,
    isRequired: field.isRequired,
    isReadOnly: field.isReadOnly,
    errors: allErrors,
    attributes: field.attributes,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
      return <TextField type={field.type} {...commonProps} />;
    case 'textarea':
      return <TextareaField {...commonProps} />;
    case 'number':
    case 'range':
      return <NumberField type={field.type} {...commonProps} />;
    case 'select':
      return <SelectField {...commonProps} options={field.options || []} />;
    case 'checkbox':
      return <CheckboxField {...commonProps} />;
    case 'radio':
      return <RadioField {...commonProps} options={field.options || []} />;
    case 'date':
    case 'time':
    case 'datetime-local':
      return <DateField type={field.type} {...commonProps} />;
    case 'file':
      return <FileField {...commonProps} />;
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default FormFieldComponent;