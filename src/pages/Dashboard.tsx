import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { PlusCircle, Edit, Copy, Trash, FileEdit, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, createForm, dispatch } = useFormBuilder();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDescription, setNewFormDescription] = useState('');

  const handleCreateForm = () => {
    if (newFormTitle.trim()) {
      createForm(newFormTitle.trim(), newFormDescription.trim());
      setShowCreateModal(false);
      setNewFormTitle('');
      setNewFormDescription('');
    }
  };

  const handleDuplicateForm = (formId: string) => {
    const formToDuplicate = state.forms[formId];
    if (formToDuplicate) {
      createForm(`${formToDuplicate.title} (Copy)`, formToDuplicate.description);
    }
  };

  const handleDeleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      const updatedForms = { ...state.forms };
      delete updatedForms[formId];
      dispatch({ type: 'LOAD_FORMS', payload: updatedForms });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900">Form Builder</h1>
          <p className="mt-2 text-neutral-600">Create, manage, and share custom forms</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Your Forms</h2>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusCircle size={18} />
            <span>Create Form</span>
          </button>
        </div>

        {Object.keys(state.forms).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <FileEdit size={40} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No forms yet</h3>
            <p className="text-neutral-600 mb-6">
              Create your first form to start collecting data.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(state.forms).map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-neutral-800">{form.title}</h3>
                  {form.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{form.description}</p>
                  )}
                  <div className="mt-2 flex items-center text-sm text-neutral-500">
                    <span>
                      {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {form.steps.length} {form.steps.length === 1 ? 'step' : 'steps'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(form.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50 flex justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/builder/${form.id}`}
                      className="text-primary hover:text-primary-dark transition-colors p-2 rounded-md hover:bg-neutral-100"
                      title="Edit Form"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicateForm(form.id)}
                      className="text-neutral-600 hover:text-neutral-800 transition-colors p-2 rounded-md hover:bg-neutral-100"
                      title="Duplicate Form"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteForm(form.id)}
                      className="text-error hover:text-error/80 transition-colors p-2 rounded-md hover:bg-neutral-100"
                      title="Delete Form"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                  <Link
                    to={`/view/${form.id}`}
                    className="text-primary hover:text-primary-dark transition-colors p-2 rounded-md hover:bg-neutral-100"
                    title="View Form"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Form</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="formTitle" className="form-label">
                  Form Title
                </label>
                <input
                  type="text"
                  id="formTitle"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Customer Feedback"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="formDescription" className="form-label">
                  Description (optional)
                </label>
                <textarea
                  id="formDescription"
                  value={newFormDescription}
                  onChange={(e) => setNewFormDescription(e.target.value)}
                  className="form-input"
                  placeholder="Brief description of the form's purpose"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateForm}
                className="btn btn-primary"
                disabled={!newFormTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;