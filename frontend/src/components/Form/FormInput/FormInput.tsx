import { ChangeEvent } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  min?: string;
  step?: string;
  placeholder?: string;
}

export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  disabled = false,
  error,
  min,
  step,
  placeholder,
}: FormInputProps): React.JSX.Element {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? 'input-error' : ''}
        min={min}
        step={step}
        placeholder={placeholder}
      />
      <ErrorMessage message={error} />
    </div>
  );
}
