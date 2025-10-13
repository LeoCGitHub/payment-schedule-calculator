import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentScheduleRow from '../PaymentScheduleRow';
import { PaymentScheduleLine } from '@/types/payment-schedule/response/PaymentScheduleLine';

describe('PaymentScheduleRow', () => {
  const mockLine: PaymentScheduleLine = {
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
  };

  it('should render all line data', () => {
    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('17/09/2025')).toBeInTheDocument();
  });

  it('should format currency amounts correctly', () => {
    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    // Check that formatted amounts are present (using regex to handle narrow no-break spaces)
    const rentCell = screen.getByText(/10[\s\u202f]000,00[\s\u202f]€/);
    expect(rentCell).toBeInTheDocument();
  });

  it('should format percentage rates correctly', () => {
    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    // Check that formatted percentages are present
    const periodRateCell = screen.getByText(/1,00[\s\u202f]%/);
    expect(periodRateCell).toBeInTheDocument();
  });

  it('should render period number', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('1');
  });

  it('should render converted date in French format', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells[1]).toHaveTextContent('17/09/2025');
  });

  it('should apply correct CSS classes to amount cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const amountCells = container.querySelectorAll('.amount');
    expect(amountCells.length).toBeGreaterThan(0);
  });

  it('should apply interest class to financial interest cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const interestCell = container.querySelector('.interest');
    expect(interestCell).toBeInTheDocument();
  });

  it('should apply balance class to debt end period cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const balanceCell = container.querySelector('.balance');
    expect(balanceCell).toBeInTheDocument();
  });

  it('should render correct number of cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <PaymentScheduleRow line={mockLine} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(10);
  });

  it('should handle different period numbers', () => {
    const line = { ...mockLine, period: 12 };
    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={line} />
        </tbody>
      </table>
    );

    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should handle zero amounts', () => {
    const line: PaymentScheduleLine = {
      ...mockLine,
      rentAmount: 0,
      financialInterestAmount: 0,
    };

    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={line} />
        </tbody>
      </table>
    );

    const zeroAmounts = screen.getAllByText(/0,00[\s\u202f]€/);
    expect(zeroAmounts.length).toBeGreaterThan(0);
  });

  it('should handle large amounts', () => {
    const line: PaymentScheduleLine = {
      ...mockLine,
      rentAmount: 1000000,
    };

    render(
      <table>
        <tbody>
          <PaymentScheduleRow line={line} />
        </tbody>
      </table>
    );

    expect(screen.getByText(/1[\s\u202f]000[\s\u202f]000,00[\s\u202f]€/)).toBeInTheDocument();
  });
});
