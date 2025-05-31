export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'password'
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'time' 
  | 'datetime-local'
  | 'checkbox' 
  | 'radio' 
  | 'select' 
  | 'multiselect'
  | 'file'
  | 'range'
  | 'color'
  | 'hidden';

export type ValidationRuleType = 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'min' 
  | 'max'
  | 'pattern' 
  | 'email' 
  | 'url' 
  | 'tel';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ValidationRule {
  id: string;
  type: ValidationRuleType;
  value?: string | number | boolean;
  message: string;
}

export interface FormOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean | string[];
  options?: FormOption[];
  validationRules?: ValidationRule[];
  isRequired?: boolean;
  isHidden?: boolean;
  isReadOnly?: boolean;
  attributes?: Record<string, string>;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // Array of field IDs
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps: FormStep[];
  createdAt: string;
  updatedAt: string;
  submitUrl?: string;
  successMessage?: string;
  errorMessage?: string;
  settings?: {
    showProgressBar?: boolean;
    allowSave?: boolean;
    emailNotifications?: boolean;
    confirmationEmail?: boolean;
    redirectUrl?: string;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  steps?: FormStep[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}