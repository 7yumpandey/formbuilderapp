import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { FormConfig, FormField, DeviceType, FormTemplate, ValidationRule } from '../types/form';

// Initial state
const initialState: FormBuilderState = {
  forms: {},
  currentFormId: null,
  currentForm: null,
  selectedFieldId: null,
  devicePreview: 'desktop',
  isLoading: false,
  error: null,
};

// Context
type FormBuilderState = {
  forms: Record<string, FormConfig>;
  currentFormId: string | null;
  currentForm: FormConfig | null;
  selectedFieldId: string | null;
  devicePreview: DeviceType;
  isLoading: boolean;
  error: string | null;
};

type FormBuilderAction =
  | { type: 'SET_CURRENT_FORM'; payload: string }
  | { type: 'CREATE_FORM'; payload: { title: string; description?: string } }
  | { type: 'UPDATE_FORM'; payload: Partial<FormConfig> }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'UPDATE_FIELD'; payload: { id: string; field: Partial<FormField> } }
  | { type: 'REMOVE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: string[] }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'ADD_VALIDATION_RULE'; payload: { fieldId: string; rule: ValidationRule } }
  | { type: 'REMOVE_VALIDATION_RULE'; payload: { fieldId: string; ruleId: string } }
  | { type: 'SET_DEVICE_PREVIEW'; payload: DeviceType }
  | { type: 'ADD_FORM_STEP'; payload: { title: string; description?: string } }
  | { type: 'REMOVE_FORM_STEP'; payload: number }
  | { type: 'REORDER_FORM_STEPS'; payload: number[] }
  | { type: 'LOAD_TEMPLATE'; payload: FormTemplate }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_FORMS'; payload: Record<string, FormConfig> };

const FormBuilderContext = createContext<{
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
  createForm: (title: string, description?: string) => string;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (ids: string[]) => void;
  selectField: (id: string | null) => void;
  addValidationRule: (fieldId: string, rule: Omit<ValidationRule, 'id'>) => void;
  removeValidationRule: (fieldId: string, ruleId: string) => void;
  setDevicePreview: (device: DeviceType) => void;
  addFormStep: (title: string, description?: string) => void;
  removeFormStep: (index: number) => void;
  reorderFormSteps: (indices: number[]) => void;
  loadTemplate: (template: FormTemplate) => void;
  saveForm: () => void;
  loadForm: (formId: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createForm: () => '',
  addField: () => {},
  updateField: () => {},
  removeField: () => {},
  reorderFields: () => {},
  selectField: () => {},
  addValidationRule: () => {},
  removeValidationRule: () => {},
  setDevicePreview: () => {},
  addFormStep: () => {},
  removeFormStep: () => {},
  reorderFormSteps: () => {},
  loadTemplate: () => {},
  saveForm: () => {},
  loadForm: () => {},
});

// Reducer
function formBuilderReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'SET_CURRENT_FORM':
      return {
        ...state,
        currentFormId: action.payload,
        currentForm: state.forms[action.payload] || null,
        selectedFieldId: null,
      };
    case 'CREATE_FORM': {
      const formId = nanoid();
      const newForm: FormConfig = {
        id: formId,
        title: action.payload.title,
        description: action.payload.description || '',
        fields: [],
        steps: [
          {
            id: nanoid(),
            title: 'Step 1',
            fields: [],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [formId]: newForm,
        },
        currentFormId: formId,
        currentForm: newForm,
      };
    }
    case 'UPDATE_FORM': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedForm = {
        ...state.currentForm,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'ADD_FIELD': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedForm = {
        ...state.currentForm,
        fields: [...state.currentForm.fields, action.payload],
        updatedAt: new Date().toISOString(),
      };
      // Add to the current step if steps exist
      if (updatedForm.steps && updatedForm.steps.length > 0) {
        updatedForm.steps[0].fields = [...updatedForm.steps[0].fields, action.payload.id];
      }
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
        selectedFieldId: action.payload.id,
      };
    }
    case 'UPDATE_FIELD': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedFields = state.currentForm.fields.map((field) =>
        field.id === action.payload.id ? { ...field, ...action.payload.field } : field
      );
      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'REMOVE_FIELD': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedFields = state.currentForm.fields.filter((field) => field.id !== action.payload);
      // Remove from any steps
      const updatedSteps = state.currentForm.steps.map((step) => ({
        ...step,
        fields: step.fields.filter((fieldId) => fieldId !== action.payload),
      }));
      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
        selectedFieldId: state.selectedFieldId === action.payload ? null : state.selectedFieldId,
      };
    }
    case 'REORDER_FIELDS': {
      if (!state.currentFormId || !state.currentForm) return state;
      // Create a map of existing fields by ID
      const fieldMap = state.currentForm.fields.reduce<Record<string, FormField>>(
        (map, field) => {
          map[field.id] = field;
          return map;
        },
        {}
      );
      // Create new ordered array
      const orderedFields = action.payload.map((id) => fieldMap[id]).filter(Boolean);
      const updatedForm = {
        ...state.currentForm,
        fields: orderedFields,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload,
      };
    case 'ADD_VALIDATION_RULE': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedFields = state.currentForm.fields.map((field) => {
        if (field.id === action.payload.fieldId) {
          const rule = { ...action.payload.rule, id: nanoid() };
          return {
            ...field,
            validationRules: [...(field.validationRules || []), rule],
          };
        }
        return field;
      });
      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'REMOVE_VALIDATION_RULE': {
      if (!state.currentFormId || !state.currentForm) return state;
      const updatedFields = state.currentForm.fields.map((field) => {
        if (field.id === action.payload.fieldId) {
          return {
            ...field,
            validationRules: (field.validationRules || []).filter(
              (rule) => rule.id !== action.payload.ruleId
            ),
          };
        }
        return field;
      });
      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'SET_DEVICE_PREVIEW':
      return {
        ...state,
        devicePreview: action.payload,
      };
    case 'ADD_FORM_STEP': {
      if (!state.currentFormId || !state.currentForm) return state;
      const newStep = {
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description || '',
        fields: [],
      };
      const updatedForm = {
        ...state.currentForm,
        steps: [...state.currentForm.steps, newStep],
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'REMOVE_FORM_STEP': {
      if (!state.currentFormId || !state.currentForm) return state;
      // Don't remove if it's the only step
      if (state.currentForm.steps.length <= 1) return state;
      const updatedSteps = state.currentForm.steps.filter((_, index) => index !== action.payload);
      const updatedForm = {
        ...state.currentForm,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'REORDER_FORM_STEPS': {
      if (!state.currentFormId || !state.currentForm) return state;
      const reorderedSteps = action.payload.map((index) => state.currentForm!.steps[index]);
      const updatedForm = {
        ...state.currentForm,
        steps: reorderedSteps,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'LOAD_TEMPLATE': {
      if (!state.currentFormId || !state.currentForm) return state;
      const template = action.payload;
      const updatedForm = {
        ...state.currentForm,
        fields: template.fields,
        steps: template.steps || state.currentForm.steps,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        forms: {
          ...state.forms,
          [state.currentFormId]: updatedForm,
        },
        currentForm: updatedForm,
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOAD_FORMS':
      return {
        ...state,
        forms: action.payload,
      };
    default:
      return state;
  }
}

// Provider component
export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Load forms from localStorage on initial mount
  useEffect(() => {
    try {
      const savedForms = localStorage.getItem('formBuilder.forms');
      if (savedForms) {
        const parsedForms = JSON.parse(savedForms);
        dispatch({ type: 'LOAD_FORMS', payload: parsedForms });
      }
    } catch (error) {
      console.error('Error loading forms from localStorage:', error);
    }
  }, []);

  // Save forms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('formBuilder.forms', JSON.stringify(state.forms));
    } catch (error) {
      console.error('Error saving forms to localStorage:', error);
    }
  }, [state.forms]);

  // Context actions
  const createForm = (title: string, description?: string) => {
    dispatch({ type: 'CREATE_FORM', payload: { title, description } });
    return nanoid(); // Return a new form ID
  };

  const addField = (field: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      ...field,
      id: nanoid(),
      validationRules: field.validationRules || [],
    };
    dispatch({ type: 'ADD_FIELD', payload: newField });
  };

  const updateField = (id: string, field: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { id, field } });
  };

  const removeField = (id: string) => {
    dispatch({ type: 'REMOVE_FIELD', payload: id });
  };

  const reorderFields = (ids: string[]) => {
    dispatch({ type: 'REORDER_FIELDS', payload: ids });
  };

  const selectField = (id: string | null) => {
    dispatch({ type: 'SELECT_FIELD', payload: id });
  };

  const addValidationRule = (fieldId: string, rule: Omit<ValidationRule, 'id'>) => {
    dispatch({ type: 'ADD_VALIDATION_RULE', payload: { fieldId, rule } });
  };

  const removeValidationRule = (fieldId: string, ruleId: string) => {
    dispatch({ type: 'REMOVE_VALIDATION_RULE', payload: { fieldId, ruleId } });
  };

  const setDevicePreview = (device: DeviceType) => {
    dispatch({ type: 'SET_DEVICE_PREVIEW', payload: device });
  };

  const addFormStep = (title: string, description?: string) => {
    dispatch({ type: 'ADD_FORM_STEP', payload: { title, description } });
  };

  const removeFormStep = (index: number) => {
    dispatch({ type: 'REMOVE_FORM_STEP', payload: index });
  };

  const reorderFormSteps = (indices: number[]) => {
    dispatch({ type: 'REORDER_FORM_STEPS', payload: indices });
  };

  const loadTemplate = (template: FormTemplate) => {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  };

  const saveForm = () => {
    // Forms are automatically saved to localStorage via useEffect
    // This is just a placeholder for possible API saving in the future
  };

  const loadForm = (formId: string) => {
    dispatch({ type: 'SET_CURRENT_FORM', payload: formId });
  };

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        createForm,
        addField,
        updateField,
        removeField,
        reorderFields,
        selectField,
        addValidationRule,
        removeValidationRule,
        setDevicePreview,
        addFormStep,
        removeFormStep,
        reorderFormSteps,
        loadTemplate,
        saveForm,
        loadForm,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

// Custom hook for using the context
export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};