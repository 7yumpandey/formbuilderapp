import React from 'react';

interface FileFieldProps {
  id: string;
  name: string;
  label: string;
  value: File | null;
  onChange: (value: File | null) => void;
  helpText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errors?: string[];
  attributes?: Record<string, string>;
}

const FileField: React.FC<FileFieldProps> = ({
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
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {isRequired && <span className="text-error ml-1">*</span>}
      </label>
      <input
        id={id}
        type="file"
        name={name}
        onChange={handleChange}
        disabled={isReadOnly}
        required={isRequired}
        className={`block w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-md
          file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white
          hover:file:bg-primary-dark ${
            errors.length > 0 ? 'border-error focus:border-error focus:ring-error' : ''
          }`}
        {...attributes}
      />
      {value && <p className="mt-1 text-sm text-neutral-600">Selected file: {value.name}</p>}
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

export default FileField;