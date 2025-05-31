import React from 'react';
import { FormOption } from '../../types/form';

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FormOption[];
  placeholder?: string;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  helpText,
  isRequired,
  isReadOnly,
  errors = [],
  attributes,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {isRequired && <span className="text-error ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value || ''}
        onChange={handleChange}
        disabled={isReadOnly}
        required={isRequired}
        className={`form-input ${errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''}`}
        {...attributes}
      >
        {placeholder && (
          <option value="\" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="form-help">{helpText}</p>}
      {errors.length > 0 && (
        <div className="mt-1 text-error text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;