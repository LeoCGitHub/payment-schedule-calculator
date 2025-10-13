import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../FormInput';

describe('FormInput', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testInput',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
  };

  it('should render input with label', () => {
    render(<FormInput {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with correct value', () => {
    render(<FormInput {...defaultProps} value="test value" />);

    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FormInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');

    expect(onChange).toHaveBeenCalledTimes(5); // Once for each character
  });

  it('should render as number input when type is number', () => {
    render(<FormInput {...defaultProps} type="number" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should render as date input when type is date', () => {
    render(<FormInput {...defaultProps} type="date" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FormInput {...defaultProps} disabled={true} />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should not be disabled by default', () => {
    render(<FormInput {...defaultProps} />);

    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('should display error message when error prop is provided', () => {
    render(<FormInput {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error class when error is present', () => {
    render(<FormInput {...defaultProps} error="Error message" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-error');
  });

  it('should not apply error class when no error', () => {
    render(<FormInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).not.toHaveClass('input-error');
  });

  it('should render with min attribute for number input', () => {
    render(<FormInput {...defaultProps} type="number" min="0" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
  });

  it('should render with step attribute for number input', () => {
    render(<FormInput {...defaultProps} type="number" step="0.01" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', '0.01');
  });

  it('should render with placeholder', () => {
    render(<FormInput {...defaultProps} placeholder="Enter text here" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should have correct name and id attributes', () => {
    render(<FormInput {...defaultProps} id="custom-id" name="customName" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
    expect(input).toHaveAttribute('name', 'customName');
  });
});
