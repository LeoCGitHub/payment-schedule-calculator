import { ChangeEvent } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: FormSelectOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  error?: string;
}

export default function FormSelect({
  id,
  name,
  label,
  value,
  options,
  onChange,
  disabled = false,
  error,
}: FormSelectProps): React.JSX.Element {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? 'input-error' : ''}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMessage message={error} />
    </div>
  );
}
