import React, { useState } from 'react';
import { FormTemplate, FormConfig } from '../../types/form';
import { nanoid } from 'nanoid';

const predefinedTemplates: FormTemplate[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'A simple contact form with name, email, and message fields',
    fields: [
      {
        id: nanoid(),
        type: 'text',
        label: 'Full Name',
        name: 'full_name',
        placeholder: 'Enter your full name',
        isRequired: true,
        validationRules: [
          { id: nanoid(), type: 'required', message: 'Please enter your name' },
          { id: nanoid(), type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
        ],
      },
      {
        id: nanoid(),
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'Enter your email address',
        isRequired: true,
        validationRules: [
          { id: nanoid(), type: 'required', message: 'Please enter your email address' },
          { id: nanoid(), type: 'email', message: 'Please enter a valid email address' },
        ],
      },
      {
        id: nanoid(),
        type: 'textarea',
        label: 'Message',
        name: 'message',
        placeholder: 'Enter your message',
        isRequired: true,
        validationRules: [
          { id: nanoid(), type: 'required', message: 'Please enter a message' },
          { id: nanoid(), type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
        ],
      },
    ],
    steps: [
      {
        id: nanoid(),
        title: 'Contact Information',
        fields: [],
      },
    ],
  },
  {
    id: 'survey-form',
    name: 'Customer Survey',
    description: 'A customer feedback survey with multiple question types',
    fields: [
      {
        id: nanoid(),
        type: 'text',
        label: 'Name',
        name: 'name',
        placeholder: 'Enter your name',
        isRequired: false,
      },
      {
        id: nanoid(),
        type: 'email',
        label: 'Email',
        name: 'email',
        placeholder: 'Enter your email',
        isRequired: false,
      },
      {
        id: nanoid(),
        type: 'select',
        label: 'How did you hear about us?',
        name: 'referral_source',
        options: [
          { id: nanoid(), label: 'Search Engine', value: 'search' },
          { id: nanoid(), label: 'Social Media', value: 'social' },
          { id: nanoid(), label: 'Friend/Colleague', value: 'referral' },
          { id: nanoid(), label: 'Other', value: 'other' },
        ],
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'radio',
        label: 'How would you rate your experience?',
        name: 'rating',
        options: [
          { id: nanoid(), label: 'Excellent', value: '5' },
          { id: nanoid(), label: 'Good', value: '4' },
          { id: nanoid(), label: 'Average', value: '3' },
          { id: nanoid(), label: 'Below Average', value: '2' },
          { id: nanoid(), label: 'Poor', value: '1' },
        ],
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'textarea',
        label: 'Additional Comments',
        name: 'comments',
        placeholder: 'Please share any additional feedback',
        isRequired: false,
      },
    ],
    steps: [
      {
        id: nanoid(),
        title: 'Personal Information',
        fields: [],
      },
      {
        id: nanoid(),
        title: 'Feedback',
        fields: [],
      },
    ],
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'A multi-step job application form with personal and professional information',
    fields: [
      {
        id: nanoid(),
        type: 'text',
        label: 'First Name',
        name: 'first_name',
        placeholder: 'Enter your first name',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'text',
        label: 'Last Name',
        name: 'last_name',
        placeholder: 'Enter your last name',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'Enter your email address',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'tel',
        label: 'Phone Number',
        name: 'phone',
        placeholder: 'Enter your phone number',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'select',
        label: 'Position',
        name: 'position',
        options: [
          { id: nanoid(), label: 'Software Developer', value: 'developer' },
          { id: nanoid(), label: 'Designer', value: 'designer' },
          { id: nanoid(), label: 'Project Manager', value: 'pm' },
          { id: nanoid(), label: 'Marketing Specialist', value: 'marketing' },
        ],
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'textarea',
        label: 'Work Experience',
        name: 'experience',
        placeholder: 'Describe your relevant work experience',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'textarea',
        label: 'Education',
        name: 'education',
        placeholder: 'Enter your educational background',
        isRequired: true,
      },
      {
        id: nanoid(),
        type: 'file',
        label: 'Resume/CV',
        name: 'resume',
        helpText: 'Upload your resume (PDF, DOC, or DOCX)',
        isRequired: true,
      },
    ],
    steps: [
      {
        id: nanoid(),
        title: 'Personal Information',
        fields: [],
      },
      {
        id: nanoid(),
        title: 'Professional Information',
        fields: [],
      },
      {
        id: nanoid(),
        title: 'Documents',
        fields: [],
      },
    ],
  },
];

interface TemplateManagerProps {
  onLoadTemplate: (template: FormTemplate) => void;
  onSaveTemplate: (form: FormConfig) => void;
  currentForm: FormConfig | null;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  onLoadTemplate,
  onSaveTemplate,
  currentForm,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [userTemplates, setUserTemplates] = useState<FormTemplate[]>([]);

  const handleLoadTemplate = (template: FormTemplate) => {
    if (confirm('Loading a template will replace your current form. Continue?')) {
      onLoadTemplate(template);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!currentForm) return;
    if (!templateName) return;

    const newTemplate: FormTemplate = {
      id: nanoid(),
      name: templateName,
      description: templateDescription,
      fields: currentForm.fields,
      steps: currentForm.steps,
    };

    setUserTemplates([...userTemplates, newTemplate]);
    setShowSaveDialog(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Templates</h3>
        <button
          type="button"
          onClick={() => setShowSaveDialog(true)}
          className="btn btn-secondary text-sm"
          disabled={!currentForm || currentForm.fields.length === 0}
        >
          Save as Template
        </button>
      </div>

      {showSaveDialog && (
        <div className="mb-6 p-4 border border-neutral-200 rounded-md bg-neutral-50">
          <h4 className="text-sm font-medium mb-2">Save Current Form as Template</h4>
          <div className="space-y-3">
            <div>
              <label className="form-label text-sm">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="form-input"
                placeholder="e.g., My Contact Form"
              />
            </div>
            <div>
              <label className="form-label text-sm">Description (optional)</label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="form-input"
                placeholder="Brief description of this template"
                rows={2}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSaveAsTemplate}
                className="btn btn-primary text-sm"
                disabled={!templateName}
              >
                Save Template
              </button>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="btn btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {userTemplates.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Your Templates</h4>
            <div className="space-y-2">
              {userTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-neutral-200 rounded-md bg-white hover:border-primary cursor-pointer"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <h5 className="font-medium">{template.name}</h5>
                  {template.description && <p className="text-xs text-neutral-500 mt-1">{template.description}</p>}
                  <p className="text-xs text-neutral-500 mt-1">
                    {template.fields.length} fields • {template.steps?.length || 1} steps
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">Predefined Templates</h4>
          <div className="space-y-2">
            {predefinedTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 border border-neutral-200 rounded-md bg-white hover:border-primary cursor-pointer"
                onClick={() => handleLoadTemplate(template)}
              >
                <h5 className="font-medium">{template.name}</h5>
                {template.description && <p className="text-xs text-neutral-500 mt-1">{template.description}</p>}
                <p className="text-xs text-neutral-500 mt-1">
                  {template.fields.length} fields • {template.steps?.length || 1} steps
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;