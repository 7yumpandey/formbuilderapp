import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { FormBuilderProvider } from './contexts/FormBuilderContext';
import FormBuilder from './pages/FormBuilder';
import FormView from './pages/FormView';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <FormBuilderProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder/:formId?" element={<FormBuilder />} />
          <Route path="/view/:formId" element={<FormView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster 
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </FormBuilderProvider>
    </BrowserRouter>
  );
}

export default App;