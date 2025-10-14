import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentScheduleForm from '../PaymentScheduleForm';

describe('PaymentScheduleForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form title', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.getByText('form.title')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(
      screen.getByLabelText('form.firstPaymentDate.label')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('form.periodicity.label')).toBeInTheDocument();
    expect(screen.getByLabelText('form.periodicity.label')).toBeInTheDocument();
    expect(screen.getByLabelText('form.assetAmount.label')).toBeInTheDocument();
    expect(screen.getByLabelText('form.rentAmount.label')).toBeInTheDocument();
    expect(
      screen.getByLabelText('form.purchaseOptionAmount.label')
    ).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: 'form.submit' })
    ).toBeInTheDocument();
  });

  it('should show loading state on submit button when loading', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={true}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: 'form.submit...' })
    ).toBeInTheDocument();
  });

  it('should disable all fields when loading', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={true}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should disable submit button when loading', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={true}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: 'form.submit...',
    });
    expect(submitButton).toBeDisabled();
  });

  it('should render form with default values', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.getByDisplayValue('48')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
  });

  it('should have Trimestriel selected by default', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const select = screen.getByRole('combobox');
    expect((select as HTMLSelectElement).value).toBe('3');
  });

  it('should render date input with correct type', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const dateInput = screen.getByLabelText('form.firstPaymentDate.label');
    expect(dateInput).toHaveAttribute('type', 'date');
  });

  it('should render number inputs with correct min values', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const contractDurationInput = screen.getByLabelText(
      'form.contractDuration.label'
    );
    expect(contractDurationInput).toHaveAttribute('min', '1');

    const assetAmountInput = screen.getByLabelText('form.assetAmount.label');
    expect(assetAmountInput).toHaveAttribute('min', '0');
  });

  it('should render number inputs with correct step values', () => {
    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const assetAmountInput = screen.getByLabelText('form.assetAmount.label');
    expect(assetAmountInput).toHaveAttribute('step', '1');

    const rentAmountInput = screen.getByLabelText('form.rentAmount.label');
    expect(rentAmountInput).toHaveAttribute('step', '1');
  });

  it('should call onDataChange when form data changes', async () => {
    const user = userEvent.setup();
    const onDataChange = vi.fn();

    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onDataChange={onDataChange}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const contractDurationInput = screen.getByLabelText(
      'form.contractDuration.label'
    );
    await user.clear(contractDurationInput);
    await user.type(contractDurationInput, '36');

    expect(onDataChange).toHaveBeenCalled();
  });

  it('should apply form CSS classes', () => {
    const { container } = render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(container.querySelector('.payment-form')).toBeInTheDocument();
    expect(container.querySelector('.form-row')).toBeInTheDocument();
  });

  it('should render submit button with correct class', () => {
    const { container } = render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const submitButton = container.querySelector('.submit-btn');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should render with initialData when provided', () => {
    const initialData = {
      periodicity: 'Mensuel',
      contractDuration: '24',
      assetAmount: '50000',
      purchaseOptionAmount: '500',
      firstPaymentDate: '01/01/2024',
      rentAmount: '2000',
    };

    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        initialData={initialData}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
  });

  it('should have form element', () => {
    const { container } = render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        onReset={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
