import React from 'react';
import { FormOption } from '../../types/form';

interface RadioFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FormOption[];
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const RadioField: React.FC<RadioFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  helpText,
  isRequired,
  isReadOnly,
  errors = [],
  attributes,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <fieldset>
        <legend className="form-label">
          {label}
          {isRequired && <span className="text-error ml-1">*</span>}
        </legend>
        <div className="mt-1 space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                id={`${id}-${option.id}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={isReadOnly}
                required={isRequired}
                className={`h-4 w-4 border-neutral-300 text-primary focus:ring-primary ${
                  errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''
                }`}
                {...attributes}
              />
              <label htmlFor={`${id}-${option.id}`} className="ml-3 block text-sm font-medium text-neutral-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
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

export default RadioField;