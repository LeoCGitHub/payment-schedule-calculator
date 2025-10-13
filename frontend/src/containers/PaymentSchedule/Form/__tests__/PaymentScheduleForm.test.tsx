import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentScheduleForm from '../PaymentScheduleForm';

describe('PaymentScheduleForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form title', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    expect(
      screen.getByText('Sélectionnez vos conditions initiales')
    ).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    expect(
      screen.getByLabelText('Date de la première échéance')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Périodicité')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Durée contractuelle (en mois)')
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Valeur de l'actif")).toBeInTheDocument();
    expect(
      screen.getByLabelText('Montant du loyer (fixe et payé à terme échu)')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Valeur de l'option d'achat")
    ).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    expect(
      screen.getByRole('button', { name: /Calculer l'échéancier/i })
    ).toBeInTheDocument();
  });

  it('should show loading state on submit button when loading', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={true} />);

    expect(
      screen.getByRole('button', { name: /Calcul en cours.../i })
    ).toBeInTheDocument();
  });

  it('should disable all fields when loading', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={true} />);

    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should disable submit button when loading', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('should render form with default values', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByDisplayValue('48')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
  });

  it('should render periodicity select with all options', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByRole('option', { name: 'Mensuel' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Trimestriel' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Semestriel' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Annuel' })).toBeInTheDocument();
  });

  it('should have Trimestriel selected by default', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Trimestriel');
  });

  it('should render date input with correct type', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    const dateInput = screen.getByLabelText('Date de la première échéance');
    expect(dateInput).toHaveAttribute('type', 'date');
  });

  it('should render number inputs with correct min values', () => {
    const { container } = render(
      <PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />
    );

    const contractDurationInput = screen.getByLabelText(
      'Durée contractuelle (en mois)'
    );
    expect(contractDurationInput).toHaveAttribute('min', '1');

    const assetValueInput = screen.getByLabelText("Valeur de l'actif");
    expect(assetValueInput).toHaveAttribute('min', '0');
  });

  it('should render number inputs with correct step values', () => {
    render(<PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />);

    const assetValueInput = screen.getByLabelText("Valeur de l'actif");
    expect(assetValueInput).toHaveAttribute('step', '1');

    const rentAmountInput = screen.getByLabelText(
      'Montant du loyer (fixe et payé à terme échu)'
    );
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
      />
    );

    const contractDurationInput = screen.getByLabelText(
      'Durée contractuelle (en mois)'
    );
    await user.clear(contractDurationInput);
    await user.type(contractDurationInput, '36');

    expect(onDataChange).toHaveBeenCalled();
  });

  it('should apply form CSS classes', () => {
    const { container } = render(
      <PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />
    );

    expect(container.querySelector('.payment-form')).toBeInTheDocument();
    expect(container.querySelector('.form-row')).toBeInTheDocument();
  });

  it('should render submit button with correct class', () => {
    const { container } = render(
      <PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />
    );

    const submitButton = container.querySelector('.submit-btn');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should render with initialData when provided', () => {
    const initialData = {
      periodicity: 'Mensuel',
      contractDuration: '24',
      assetValue: '50000',
      purchaseOptionValue: '500',
      firstPaymentDate: '01/01/2024',
      rentAmount: '2000',
    };

    render(
      <PaymentScheduleForm
        onSubmit={mockOnSubmit}
        loading={false}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
  });

  it('should have form element', () => {
    const { container } = render(
      <PaymentScheduleForm onSubmit={mockOnSubmit} loading={false} />
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
