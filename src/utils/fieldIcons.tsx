import React from 'react';
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Lock,
  Phone,
  Link,
  Calendar,
  Clock,
  CalendarCheck,
  Check,
  CheckSquare,
  List,
  FileText,
  Sliders,
  Palette,
  EyeOff,
} from 'lucide-react';
import { FieldType } from '../types/form';

export const getFieldIcon = (type: FieldType) => {
  switch (type) {
    case 'text':
      return Type;
    case 'textarea':
      return AlignLeft;
    case 'number':
      return Hash;
    case 'email':
      return Mail;
    case 'password':
      return Lock;
    case 'tel':
      return Phone;
    case 'url':
      return Link;
    case 'date':
      return Calendar;
    case 'time':
      return Clock;
    case 'datetime-local':
      return CalendarCheck;
    case 'checkbox':
      return CheckSquare;
    case 'radio':
      return Check;
    case 'select':
    case 'multiselect':
      return List;
    case 'file':
      return FileText;
    case 'range':
      return Sliders;
    case 'color':
      return Palette;
    case 'hidden':
      return EyeOff;
    default:
      return Type;
  }
};