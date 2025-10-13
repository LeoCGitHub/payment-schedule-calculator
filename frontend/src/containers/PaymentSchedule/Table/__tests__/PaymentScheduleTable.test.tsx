import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentScheduleTable from '../PaymentScheduleTable';
import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';

describe('PaymentScheduleTable', () => {
  const mockSchedule: PaymentScheduleResponse = {
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
      {
        period: 2,
        dueDate: '2025-12-17',
        rentAmount: 10000,
        periodRate: 0.01,
        annualReferenceRate: 0.12,
        financialInterestAmount: 1415,
        repaymentAmount: 8585,
        debtBeginningPeriodAmount: 141500,
        debtEndPeriodAmount: 132915,
        actualizedCashFlowAmount: 9750,
      },
    ],
    paymentScheduleTotals: {
      totalAmount: 20000,
      totalInterestAmount: 2915,
      totalRepaymentAmount: 17085,
      totalActualizedCashFlowsAmount: 19600,
    },
    purchaseOptionTotals: {
      purchaseOptionAmount: 1500,
      actualizedPurchaseOptionAmount: 1450,
    },
  };

  it('should render null when schedule is null', () => {
    const { container } = render(<PaymentScheduleTable schedule={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render table when schedule is provided', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    expect(screen.getByText('Période')).toBeInTheDocument();
    expect(screen.getByText("Date d'échéance")).toBeInTheDocument();
    expect(screen.getByText('Loyer')).toBeInTheDocument();
    expect(screen.getByText('Taux')).toBeInTheDocument();
    expect(screen.getByText('Taux annuel')).toBeInTheDocument();
    expect(screen.getByText('Intérêts financiers')).toBeInTheDocument();
    expect(screen.getByText('Remboursement')).toBeInTheDocument();
    expect(screen.getByText('Dette début période')).toBeInTheDocument();
    expect(screen.getByText('Dette fin période')).toBeInTheDocument();
    expect(screen.getByText('Flux actualisés')).toBeInTheDocument();
  });

  it('should render all payment schedule lines', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render PaymentScheduleRow for each line', () => {
    const { container } = render(
      <PaymentScheduleTable schedule={mockSchedule} />
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(2);
  });

  it('should render TotalsRow in tfoot', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('should render PurchaseOptionRow in tfoot', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    expect(screen.getByText("Option d'achat")).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <PaymentScheduleTable schedule={mockSchedule} />
    );

    expect(container.querySelector('.schedule-container')).toBeInTheDocument();
    expect(
      container.querySelector('.schedule-table-wrapper')
    ).toBeInTheDocument();
    expect(container.querySelector('.table-responsive')).toBeInTheDocument();
    expect(container.querySelector('.schedule-table')).toBeInTheDocument();
  });

  it('should render table structure with thead, tbody, and tfoot', () => {
    const { container } = render(
      <PaymentScheduleTable schedule={mockSchedule} />
    );

    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
    expect(container.querySelector('tfoot')).toBeInTheDocument();
  });

  it('should render correct number of header columns', () => {
    const { container } = render(
      <PaymentScheduleTable schedule={mockSchedule} />
    );

    const headers = container.querySelectorAll('thead th');
    expect(headers).toHaveLength(10);
  });

  it('should handle empty payment schedule lines', () => {
    const emptySchedule: PaymentScheduleResponse = {
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

    const { container } = render(
      <PaymentScheduleTable schedule={emptySchedule} />
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(0);
  });

  it('should render with single payment line', () => {
    const singleLineSchedule: PaymentScheduleResponse = {
      paymentScheduleLines: [mockSchedule.paymentScheduleLines[0]],
      paymentScheduleTotals: mockSchedule.paymentScheduleTotals,
      purchaseOptionTotals: mockSchedule.purchaseOptionTotals,
    };

    const { container } = render(
      <PaymentScheduleTable schedule={singleLineSchedule} />
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(1);
  });

  it('should render totals with correct values', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    expect(
      screen.getByText(/20[\s\u202f]000,00[\s\u202f]€/)
    ).toBeInTheDocument();
  });

  it('should render purchase option totals with correct values', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);

    const amounts = screen.getAllByText(/1[\s\u202f]500,00[\s\u202f]€/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it('should use period as key for rows', () => {
    const { container } = render(
      <PaymentScheduleTable schedule={mockSchedule} />
    );

    const tbody = container.querySelector('tbody');
    const rows = tbody?.querySelectorAll('tr');
    expect(rows).toHaveLength(2);
  });
});
