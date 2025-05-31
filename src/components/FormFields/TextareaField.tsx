import React from 'react';

interface TextareaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  helpText,
  isRequired,
  isReadOnly,
  errors = [],
  attributes,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {isRequired && <span className="text-error ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
        required={isRequired}
        className={`form-input min-h-[100px] ${
          errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''
        }`}
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

export default TextareaField;