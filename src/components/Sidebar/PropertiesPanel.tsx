import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { FormField, ValidationRule, ValidationRuleType, FormOption } from '../../types/form';

interface PropertiesPanelProps {
  field: FormField;
  onUpdate: (field: Partial<FormField>) => void;
  onRemove: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ field, onUpdate, onRemove }) => {
  const [optionValue, setOptionValue] = useState('');
  const [optionLabel, setOptionLabel] = useState('');

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onUpdate({ [name]: checked });
  };

  const addOption = () => {
    if (!optionLabel || !optionValue) return;

    const newOption: FormOption = {
      id: nanoid(),
      label: optionLabel,
      value: optionValue,
    };

    onUpdate({
      options: [...(field.options || []), newOption],
    });

    setOptionLabel('');
    setOptionValue('');
  };

  const removeOption = (id: string) => {
    onUpdate({
      options: (field.options || []).filter((option) => option.id !== id),
    });
  };

  const addValidationRule = (type: ValidationRuleType) => {
    const existingRule = (field.validationRules || []).find((rule) => rule.type === type);
    if (existingRule) return;

    const newRule: ValidationRule = {
      id: nanoid(),
      type,
      message: getDefaultValidationMessage(type),
      value: getDefaultValidationValue(type),
    };

    onUpdate({
      validationRules: [...(field.validationRules || []), newRule],
    });
  };

  const updateValidationRule = (
    id: string,
    updates: Partial<Omit<ValidationRule, 'id' | 'type'>>
  ) => {
    onUpdate({
      validationRules: (field.validationRules || []).map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    });
  };

  const removeValidationRule = (id: string) => {
    onUpdate({
      validationRules: (field.validationRules || []).filter((rule) => rule.id !== id),
    });
  };

  const getDefaultValidationMessage = (type: ValidationRuleType): string => {
    switch (type) {
      case 'required':
        return 'This field is required';
      case 'minLength':
        return 'Minimum length is 3 characters';
      case 'maxLength':
        return 'Maximum length is 100 characters';
      case 'min':
        return 'Minimum value is 0';
      case 'max':
        return 'Maximum value is 100';
      case 'pattern':
        return 'Invalid format';
      case 'email':
        return 'Please enter a valid email address';
      case 'url':
        return 'Please enter a valid URL';
      case 'tel':
        return 'Please enter a valid phone number';
      default:
        return 'Invalid input';
    }
  };

  const getDefaultValidationValue = (type: ValidationRuleType): string | number | boolean => {
    switch (type) {
      case 'required':
        return true;
      case 'minLength':
        return 3;
      case 'maxLength':
        return 100;
      case 'min':
        return 0;
      case 'max':
        return 100;
      case 'pattern':
        return '';
      case 'email':
      case 'url':
      case 'tel':
        return true;
      default:
        return '';
    }
  };

  // Get validation rule types appropriate for this field type
  const getApplicableValidationTypes = (): ValidationRuleType[] => {
    const baseTypes: ValidationRuleType[] = ['required'];
    
    switch (field.type) {
      case 'text':
      case 'textarea':
        return [...baseTypes, 'minLength', 'maxLength', 'pattern'];
      case 'email':
        return [...baseTypes, 'minLength', 'maxLength', 'email'];
      case 'password':
        return [...baseTypes, 'minLength', 'maxLength', 'pattern'];
      case 'number':
      case 'range':
        return [...baseTypes, 'min', 'max'];
      case 'tel':
        return [...baseTypes, 'tel', 'pattern'];
      case 'url':
        return [...baseTypes, 'url'];
      case 'date':
      case 'time':
      case 'datetime-local':
        return [...baseTypes, 'min', 'max'];
      default:
        return baseTypes;
    }
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Field Properties</h3>

      <div className="space-y-4">
        {/* Basic properties */}
        <div>
          <label className="form-label">Label</label>
          <input
            type="text"
            name="label"
            value={field.label}
            onChange={handleTextChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={field.name}
            onChange={handleTextChange}
            className="form-input"
          />
          <p className="form-help">Field identifier in form submissions</p>
        </div>

        <div>
          <label className="form-label">Placeholder</label>
          <input
            type="text"
            name="placeholder"
            value={field.placeholder || ''}
            onChange={handleTextChange}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Help Text</label>
          <textarea
            name="helpText"
            value={field.helpText || ''}
            onChange={handleTextChange}
            className="form-input"
            rows={2}
          />
        </div>

        {/* Field-specific properties */}
        {(field.type === 'select' || field.type === 'radio' || field.type === 'multiselect') && (
          <div className="border border-neutral-200 rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Options</h4>
            
            <div className="space-y-2 mb-3">
              {(field.options || []).map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const updatedOptions = (field.options || []).map((o) =>
                        o.id === option.id ? { ...o, label: e.target.value } : o
                      );
                      onUpdate({ options: updatedOptions });
                    }}
                    className="form-input mr-1 flex-1"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = (field.options || []).map((o) =>
                        o.id === option.id ? { ...o, value: e.target.value } : o
                      );
                      onUpdate({ options: updatedOptions });
                    }}
                    className="form-input mr-1 flex-1"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="p-1 text-error hover:bg-error/10 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={optionLabel}
                onChange={(e) => setOptionLabel(e.target.value)}
                className="form-input flex-1"
                placeholder="Label"
              />
              <input
                type="text"
                value={optionValue}
                onChange={(e) => setOptionValue(e.target.value)}
                className="form-input flex-1"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={addOption}
                className="p-1 text-primary hover:bg-primary/10 rounded"
                disabled={!optionLabel || !optionValue}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Validation rules */}
        <div className="border border-neutral-200 rounded-md p-3">
          <h4 className="text-sm font-medium mb-2">Validation</h4>

          <div className="space-y-3 mb-3">
            {(field.validationRules || []).map((rule) => (
              <div key={rule.id} className="p-2 border border-neutral-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{rule.type}</span>
                  <button
                    type="button"
                    onClick={() => removeValidationRule(rule.id)}
                    className="text-xs text-error hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {(rule.type === 'minLength' ||
                  rule.type === 'maxLength' ||
                  rule.type === 'min' ||
                  rule.type === 'max') && (
                  <div className="mb-2">
                    <label className="form-label text-xs">Value</label>
                    <input
                      type="number"
                      value={rule.value as number}
                      onChange={(e) =>
                        updateValidationRule(rule.id, { value: parseInt(e.target.value) })
                      }
                      className="form-input"
                    />
                  </div>
                )}

                {rule.type === 'pattern' && (
                  <div className="mb-2">
                    <label className="form-label text-xs">Pattern (regex)</label>
                    <input
                      type="text"
                      value={rule.value as string}
                      onChange={(e) => updateValidationRule(rule.id, { value: e.target.value })}
                      className="form-input"
                    />
                  </div>
                )}

                <div>
                  <label className="form-label text-xs">Error Message</label>
                  <input
                    type="text"
                    value={rule.message}
                    onChange={(e) => updateValidationRule(rule.id, { message: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="form-label text-xs">Add Validation Rule</label>
            <select
              className="form-input"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addValidationRule(e.target.value as ValidationRuleType);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Select validation type...</option>
              {getApplicableValidationTypes().map((type) => (
                <option
                  key={type}
                  value={type}
                  disabled={(field.validationRules || []).some((rule) => rule.type === type)}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Other settings */}
        <div className="border border-neutral-200 rounded-md p-3">
          <h4 className="text-sm font-medium mb-2">Settings</h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRequired"
                name="isRequired"
                checked={field.isRequired || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isRequired" className="ml-2 block text-sm text-neutral-700">
                Required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isReadOnly"
                name="isReadOnly"
                checked={field.isReadOnly || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isReadOnly" className="ml-2 block text-sm text-neutral-700">
                Read Only
              </label>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger"
          >
            Delete Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;