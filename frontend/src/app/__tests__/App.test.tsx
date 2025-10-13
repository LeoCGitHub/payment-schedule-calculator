import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { paymentScheduleApiService } from '@/api/PaymentScheduleApi';

vi.mock('@/api/PaymentScheduleApi', () => ({
  paymentScheduleApiService: {
    calculateSchedule: vi.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render app header', () => {
    render(<App />);

    expect(
      screen.getByText(
        "Calculateur d'échéancier d'un contrat de location-financement"
      )
    ).toBeInTheDocument();
  });

  it('should render PaymentScheduleForm', () => {
    render(<App />);

    expect(
      screen.getByText('Sélectionnez vos conditions initiales')
    ).toBeInTheDocument();
  });

  it('should render placeholder when no schedule', () => {
    render(<App />);

    expect(screen.getByText('Echéancier')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Remplissez le formulaire et cliquez sur "Calculer l'échéancier"/i
      )
    ).toBeInTheDocument();
  });

  it('should render placeholder icon', () => {
    render(<App />);

    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<App />);

    expect(container.querySelector('.app')).toBeInTheDocument();
    expect(container.querySelector('.app-header')).toBeInTheDocument();
    expect(container.querySelector('.app-main')).toBeInTheDocument();
    expect(container.querySelector('.main-layout')).toBeInTheDocument();
    expect(container.querySelector('.form-section')).toBeInTheDocument();
    expect(container.querySelector('.table-section')).toBeInTheDocument();
  });

  it('should have main and header elements', () => {
    const { container } = render(<App />);

    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('should not render Toast when no error', () => {
    render(<App />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should display Toast on API error', async () => {
    const mockError = new Error('API Error');
    vi.mocked(
      paymentScheduleApiService.calculateSchedule
    ).mockRejectedValueOnce(mockError);

    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('should display schedule table after successful API call', async () => {
    const mockSchedule = {
      paymentScheduleLines: [
        {
          period: 1,
          dueDate: '2025-09-17',
          rentAmount: 10000,
          periodRate: 0.01,
          annualReferenceRate: 0.12,
          financialInterestAmount: 1500,
          repaymentAmount: 8500,
          debtBeginningPeriodAmount: 150000,
          debtEndPeriodAmount: 141500,
          actualizedCashFlowAmount: 9850,
        },
      ],
      paymentScheduleTotals: {
        totalAmount: 10000,
        totalInterestAmount: 1500,
        totalRepaymentAmount: 8500,
        totalActualizedCashFlowsAmount: 9850,
      },
      purchaseOptionTotals: {
        purchaseOptionAmount: 1500,
        actualizedPurchaseOptionAmount: 1450,
      },
    };

    vi.mocked(
      paymentScheduleApiService.calculateSchedule
    ).mockResolvedValueOnce(mockSchedule);

    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('should hide placeholder after successful calculation', async () => {
    const mockSchedule = {
      paymentScheduleLines: [],
      paymentScheduleTotals: {
        totalAmount: 0,
        totalInterestAmount: 0,
        totalRepaymentAmount: 0,
        totalActualizedCashFlowsAmount: 0,
      },
      purchaseOptionTotals: {
        purchaseOptionAmount: 0,
        actualizedPurchaseOptionAmount: 0,
      },
    };

    vi.mocked(
      paymentScheduleApiService.calculateSchedule
    ).mockResolvedValueOnce(mockSchedule);

    const user = userEvent.setup();
    render(<App />);

    // Initially placeholder is shown
    expect(screen.getByText(/Remplissez le formulaire/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Remplissez le formulaire/i)
      ).not.toBeInTheDocument();
    });
  });

  it('should close Toast when close button is clicked', async () => {
    const mockError = new Error('Test Error');
    vi.mocked(
      paymentScheduleApiService.calculateSchedule
    ).mockRejectedValueOnce(mockError);

    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Fermer');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Error')).not.toBeInTheDocument();
    });
  });

  it('should show loading state during API call', async () => {
    vi.mocked(paymentScheduleApiService.calculateSchedule).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByRole('button', { name: /Calcul en cours.../i })
    ).toBeInTheDocument();
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(
      paymentScheduleApiService.calculateSchedule
    ).mockRejectedValueOnce('String error');

    const user = userEvent.setup();
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'An error occurred while calculating the payment schedule'
        )
      ).toBeInTheDocument();
    });
  });

  it('should pass loading state to form', () => {
    render(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Calculer l'échéancier/i,
    });
    expect(submitButton).not.toBeDisabled();
  });
});
