import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormSelect from '../FormSelect';
import { ChangeEvent } from 'react';

describe('FormSelect', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'test-select',
    name: 'testSelect',
    label: 'Test Select',
    value: 'option1',
    options: defaultOptions,
    onChange: vi.fn(),
  };

  it('should render select with label', () => {
    render(<FormSelect {...defaultProps} />);

    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<FormSelect {...defaultProps} />);

    expect(
      screen.getByRole('option', { name: 'Option 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Option 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Option 3' })
    ).toBeInTheDocument();
  });

  it('should have correct selected value', () => {
    render(<FormSelect {...defaultProps} value="option2" />);

    const select = screen.getByRole('combobox');
    expect((select as HTMLSelectElement).value).toBe('option2');
  });

  it('should call onChange when option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FormSelect {...defaultProps} onChange={onChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FormSelect {...defaultProps} disabled={true} />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should not be disabled by default', () => {
    render(<FormSelect {...defaultProps} />);

    expect(screen.getByRole('combobox')).not.toBeDisabled();
  });

  it('should display error message when error prop is provided', () => {
    render(<FormSelect {...defaultProps} error="Please select an option" />);

    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should apply error class when error is present', () => {
    render(<FormSelect {...defaultProps} error="Error message" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('input-error');
  });

  it('should not apply error class when no error', () => {
    render(<FormSelect {...defaultProps} />);

    const select = screen.getByRole('combobox');
    expect(select).not.toHaveClass('input-error');
  });

  it('should have correct name and id attributes', () => {
    render(<FormSelect {...defaultProps} id="custom-id" name="customName" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'custom-id');
    expect(select).toHaveAttribute('name', 'customName');
  });

  it('should render with empty options array', () => {
    render(<FormSelect {...defaultProps} options={[]} />);

    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(0);
  });

  it('should trigger onChange with new value when selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormSelect {...defaultProps} value="option1" onChange={onChange} />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option3');

    expect(onChange).toHaveBeenCalled();
    type ExpectedEventType = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    const callArg = onChange.mock.calls[0][0] as ExpectedEventType;

    await waitFor(() => {
      expect(callArg.target.name).toBe('testSelect');
    });
  });

  it('should render option values correctly', () => {
    render(<FormSelect {...defaultProps} />);

    const option1 = screen.getByRole('option', {
      name: 'Option 1',
    });
    const option2 = screen.getByRole('option', {
      name: 'Option 2',
    });
    const option3 = screen.getByRole('option', {
      name: 'Option 3',
    });

    expect((option1 as HTMLSelectElement).value).toBe('option1');
    expect((option2 as HTMLSelectElement).value).toBe('option2');
    expect((option3 as HTMLSelectElement).value).toBe('option3');
  });
});
