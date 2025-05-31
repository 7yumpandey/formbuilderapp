import React from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
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
      <label htmlFor={id} className="form-label">
        {label}
        {isRequired && <span className="text-error ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
        required={isRequired}
        className={`form-input ${errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''}`}
        {...attributes}
      />
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

export default TextField;