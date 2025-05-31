import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { FormField } from '../types/form';
import DroppableArea from '../components/DragAndDrop/DroppableArea';
import FieldsPanel from '../components/Sidebar/FieldsPanel';
import PropertiesPanel from '../components/Sidebar/PropertiesPanel';
import TemplateManager from '../components/FormTemplates/TemplateManager';
import PreviewPanel from '../components/FormPreview/PreviewPanel';
import FormBuilderHeader from '../components/FormBuilder/FormBuilderHeader';
import { nanoid } from 'nanoid';

type TabType = 'fields' | 'properties' | 'templates';

const FormBuilder: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const {
    state,
    createForm,
    addField,
    updateField,
    removeField,
    reorderFields,
    selectField,
    loadTemplate,
    setDevicePreview,
    saveForm,
    loadForm,
  } = useFormBuilder();

  const [activeTab, setActiveTab] = useState<TabType>('fields');
  const [isDragging, setIsDragging] = useState(false);

  // Initialize or load the form
  useEffect(() => {
    if (formId) {
      if (state.forms[formId]) {
        loadForm(formId);
      } else {
        navigate('/builder/new', { replace: true });
      }
    } else {
      // Create a new form if none exists or if we're at /builder/new
      if (!state.currentForm) {
        const id = createForm('New Form');
        navigate(`/builder/${id}`, { replace: true });
      }
    }
  }, [formId, state.forms, loadForm, createForm, navigate]);

  // Automatically switch to properties tab when a field is selected
  useEffect(() => {
    if (state.selectedFieldId && activeTab !== 'properties') {
      setActiveTab('properties');
    }
  }, [state.selectedFieldId]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    // Handle adding a new field from the sidebar
    if (over && over.id === 'form-builder-dropzone' && active.data?.current) {
      const field = active.data.current.field;
      if (field) {
        addField(field);
      }
    }
  };

  const handleUpdateForm = (updates: Partial<typeof state.currentForm>) => {
    if (state.currentForm) {
      updateField(updates.id || '', updates as Partial<FormField>);
    }
  };

  const getSelectedField = () => {
    if (!state.currentForm || !state.selectedFieldId) return null;
    return state.currentForm.fields.find((field) => field.id === state.selectedFieldId) || null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {state.currentForm && (
        <FormBuilderHeader
          form={state.currentForm}
          onUpdateForm={(updates) => handleUpdateForm(updates)}
          onSave={saveForm}
        />
      )}

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-neutral-200 bg-white flex flex-col">
          <div className="flex border-b border-neutral-200">
            <button
              type="button"
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'fields' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'
              }`}
              onClick={() => setActiveTab('fields')}
            >
              Fields
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'properties' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'
              } ${!state.selectedFieldId ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => state.selectedFieldId && setActiveTab('properties')}
              disabled={!state.selectedFieldId}
            >
              Properties
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'templates' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'fields' && <FieldsPanel onAddField={addField} />}
            
            {activeTab === 'properties' && state.selectedFieldId && getSelectedField() && (
              <PropertiesPanel
                field={getSelectedField()!}
                onUpdate={(updates) => updateField(state.selectedFieldId!, updates)}
                onRemove={() => {
                  removeField(state.selectedFieldId!);
                  setActiveTab('fields');
                }}
              />
            )}
            
            {activeTab === 'templates' && (
              <TemplateManager
                onLoadTemplate={loadTemplate}
                onSaveTemplate={() => {}}
                currentForm={state.currentForm}
              />
            )}
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="flex-1 flex flex-col">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex-1 flex flex-col lg:flex-row">
              <div className="lg:w-1/2 flex-1 p-6 bg-neutral-50 overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">Form Builder</h2>
                  <p className="text-neutral-600 text-sm">
                    Drag and drop fields or click to add them to your form
                  </p>
                </div>

                {state.currentForm && (
                  <DroppableArea
                    id="form-builder-dropzone"
                    fields={state.currentForm.fields}
                    selectedFieldId={state.selectedFieldId}
                    onSelectField={selectField}
                  />
                )}
              </div>

              <div className="lg:w-1/2 flex-1 border-l border-neutral-200 bg-white">
                {state.currentForm && (
                  <PreviewPanel
                    form={state.currentForm}
                    deviceType={state.devicePreview}
                    onDeviceChange={setDevicePreview}
                  />
                )}
              </div>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;