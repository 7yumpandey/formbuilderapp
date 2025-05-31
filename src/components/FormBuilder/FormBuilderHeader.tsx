import React, { useState } from 'react';
import { FormConfig } from '../../types/form';
import { Link } from 'react-router-dom';
import { Share2, Settings, Save, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface FormBuilderHeaderProps {
  form: FormConfig;
  onUpdateForm: (updates: Partial<FormConfig>) => void;
  onSave: () => void;
}

const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({ 
  form, 
  onUpdateForm,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formTitle, setFormTitle] = useState(form.title);
  const [formDescription, setFormDescription] = useState(form.description || '');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleSaveDetails = () => {
    onUpdateForm({
      title: formTitle,
      description: formDescription,
    });
    setIsEditing(false);
    toast.success('Form details updated');
  };

  const handleSave = () => {
    onSave();
    toast.success('Form saved successfully');
  };

  const handleCancel = () => {
    setFormTitle(form.title);
    setFormDescription(form.description || '');
    setIsEditing(false);
  };

  const shareableLink = `${window.location.origin}/view/${form.id}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="mr-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                title="Back to Dashboard"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="form-input text-lg font-bold w-full"
                      placeholder="Form Title"
                    />
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="form-input w-full"
                      placeholder="Form Description (optional)"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleSaveDetails}
                        className="btn btn-primary text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
                    <h1 className="text-xl font-bold">{form.title}</h1>
                    {form.description && <p className="text-neutral-600 mt-1">{form.description}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-secondary flex items-center space-x-1"
                title="Save Form"
              >
                <Save size={16} />
                <span>Save</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="btn btn-primary flex items-center space-x-1"
                  title="Share Form"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-neutral-200">
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Share Form</h3>
                      <p className="text-sm text-neutral-600 mb-3">
                        Anyone with the link can access and submit the form
                      </p>
                      <div className="flex">
                        <input
                          type="text"
                          value={shareableLink}
                          readOnly
                          className="form-input text-sm flex-1 mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(shareableLink)}
                          className="btn btn-secondary text-sm"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <Link
                          to={`/view/${form.id}`}
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          Open form in new tab
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderHeader;