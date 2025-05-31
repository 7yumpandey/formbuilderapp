import React, { useState } from 'react';
import { FormConfig, DeviceType } from '../../types/form';
import FormRenderer from './FormRenderer';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface PreviewPanelProps {
  form: FormConfig;
  deviceType: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  form,
  deviceType,
  onDeviceChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Get current step fields
  const currentStepFields = form.steps[currentStep]
    ? form.fields.filter((field) => form.steps[currentStep].fields.includes(field.id))
    : form.fields;

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation errors for this field when it changes
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
      if (field.isRequired && (!formData[field.name] || formData[field.name] === '')) {
        errors[field.name] = ['This field is required'];
        isValid = false;
      }

      // Add other validation checks here
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep() && currentStep < form.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      // In a real app, you would send the data to your backend here
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            className={`p-2 rounded-md ${
              deviceType === 'desktop' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            title="Desktop"
          >
            <Monitor size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('tablet')}
            className={`p-2 rounded-md ${
              deviceType === 'tablet' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            title="Tablet"
          >
            <Tablet size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            className={`p-2 rounded-md ${
              deviceType === 'mobile' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            title="Mobile"
          >
            <Smartphone size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-neutral-100 p-4">
        <div className={`device-preview-${deviceType} bg-white rounded-lg shadow overflow-hidden`}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{form.title}</h2>
            {form.description && <p className="text-neutral-600 mb-6">{form.description}</p>}

            {/* Progress indicator for multi-step forms */}
            {form.steps.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {form.steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`flex flex-col items-center ${
                          index <= currentStep ? 'text-primary' : 'text-neutral-400'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                            index < currentStep
                              ? 'bg-primary text-white'
                              : index === currentStep
                              ? 'border-2 border-primary text-primary'
                              : 'border-2 border-neutral-300 text-neutral-400'
                          }`}
                        >
                          {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span className="text-xs">{step.title}</span>
                      </div>
                      {index < form.steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            index < currentStep ? 'bg-primary' : 'bg-neutral-300'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <FormRenderer
              fields={currentStepFields}
              formData={formData}
              onFieldChange={handleFieldChange}
              errors={validationErrors}
            />

            <div className="mt-6 flex justify-between">
              {currentStep > 0 ? (
                <button type="button\" onClick={handlePrevStep} className="btn btn-secondary">
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < form.steps.length - 1 ? (
                <button type="button" onClick={handleNextStep} className="btn btn-primary">
                  Next
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;