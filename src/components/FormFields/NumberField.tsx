import React from 'react';

interface NumberFieldProps {
  id: string;
  name: string;
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  type: 'number' | 'range';
  placeholder?: string;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const NumberField: React.FC<NumberFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  type,
  placeholder,
  helpText,
  isRequired,
  isReadOnly,
  errors = [],
  attributes = {},
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
    onChange(numberValue);
  };

  const min = attributes.min ? parseFloat(attributes.min) : undefined;
  const max = attributes.max ? parseFloat(attributes.max) : undefined;
  const step = attributes.step ? attributes.step : '1';

  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {isRequired && <span className="text-error ml-1">*</span>}
      </label>
      <div className={type === 'range' ? 'flex items-center gap-4' : ''}>
        <input
          id={id}
          type={type}
          name={name}
          value={value === 0 ? '0' : value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={isReadOnly}
          required={isRequired}
          min={min}
          max={max}
          step={step}
          className={`${
            type === 'number' ? 'form-input' : 'w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer'
          } ${errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''}`}
          {...attributes}
        />
        {type === 'range' && <span className="text-sm font-medium w-10 text-center">{value}</span>}
      </div>
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

export default NumberField;