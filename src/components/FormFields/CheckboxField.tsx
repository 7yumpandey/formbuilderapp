import React from 'react';

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  helpText,
  isRequired,
  isReadOnly,
  errors = [],
  attributes,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={value || false}
            onChange={handleChange}
            disabled={isReadOnly}
            required={isRequired}
            className={`h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary ${
              errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''
            }`}
            {...attributes}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-neutral-700">
            {label}
            {isRequired && <span className="text-error ml-1">*</span>}
          </label>
          {helpText && <p className="form-help">{helpText}</p>}
        </div>
      </div>
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

export default CheckboxField;