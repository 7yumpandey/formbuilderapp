import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import FormFieldComponent from '../components/FormFields/FormFieldComponent';

const FormView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { state, loadForm } = useFormBuilder();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (formId) {
      loadForm(formId);
    }
  }, [formId, loadForm]);

  if (!state.currentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The form you are looking for does not exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const form = state.currentForm;
  
  // Get current step fields
  const currentStepFields = form.steps[currentStep]
    ? form.fields.filter((field) => form.steps[currentStep].fields.includes(field.id))
    : form.fields;

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation errors for this field when it changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string[]> = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
      if (field.isRequired && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = ['This field is required'];
        isValid = false;
      }

      // Here you would add additional validation based on field.validationRules
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep() && currentStep < form.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep()) {
      // In a real app, you would send the data to your backend here
      console.log('Form submitted:', formData);
      
      // Show success message
      setIsSubmitted(true);
      
      // In a real app, you might redirect or show a success message
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-lg shadow-sm">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Form Submitted Successfully!</h1>
            <p className="text-neutral-600 mb-6">
              Thank you for your submission. We have received your information.
            </p>
            <div className="mt-8">
              <Link to="/" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && <p className="text-neutral-600 mb-6">{form.description}</p>}

        {/* Progress indicator for multi-step forms */}
        {form.steps.length > 1 && (
          <div className="mb-8">
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

        <form onSubmit={handleSubmit}>
          {currentStepFields.map((field) => (
            <FormFieldComponent
              key={field.id}
              field={field}
              value={formData[field.name] || ''}
              onChange={handleFieldChange}
              errors={errors[field.name] || []}
            />
          ))}

          <div className="mt-8 flex justify-between">
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
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormView;