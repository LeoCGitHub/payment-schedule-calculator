import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TotalsRow from '../TotalsRow';
import { PaymentScheduleTotals } from '@/types/payment-schedule/response/PaymentScheduleTotals';

describe('TotalsRow', () => {
  const mockTotals: PaymentScheduleTotals = {
    totalAmount: 480000,
    totalInterestAmount: 331500,
    totalRepaymentAmount: 148500,
    totalActualizedCashFlowsAmount: 450000,
  };

  it('should render Total label', () => {
    render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    expect(screen.getByText('table.total')).toBeInTheDocument();
  });

  it('should render all totals with currency formatting', () => {
    render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    expect(
      screen.getByText(/480[\s\u202f]000,00[\s\u202f]€/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/331[\s\u202f]500,00[\s\u202f]€/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/148[\s\u202f]500,00[\s\u202f]€/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/450[\s\u202f]000,00[\s\u202f]€/)
    ).toBeInTheDocument();
  });

  it('should apply totals-row-line class to the row', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('totals-row-line');
  });

  it('should apply highlight class to total cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const highlightCells = container.querySelectorAll('.highlight');
    expect(highlightCells.length).toBeGreaterThan(0);
  });

  it('should apply totals-row-value class to value cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const valueCells = container.querySelectorAll('.totals-row-value');
    expect(valueCells.length).toBe(5); // Total label + 4 amount cells
  });

  it('should render empty cells with dash', () => {
    render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const emptyCells = screen.getAllByText('table.emptyCell');
    expect(emptyCells.length).toBe(4);
  });

  it('should have correct colSpan for Total label cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const firstCell = container.querySelector('td');
    expect(firstCell).toHaveAttribute('colSpan', '2');
  });

  it('should render correct number of cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(9); // 9 physical cells (first has colSpan 2)
  });

  it('should handle zero totals', () => {
    const zeroTotals: PaymentScheduleTotals = {
      totalAmount: 0,
      totalInterestAmount: 0,
      totalRepaymentAmount: 0,
      totalActualizedCashFlowsAmount: 0,
    };

    render(
      <table>
        <tbody>
          <TotalsRow totals={zeroTotals} />
        </tbody>
      </table>
    );

    const zeroAmounts = screen.getAllByText(/0,00[\s\u202f]€/);
    expect(zeroAmounts.length).toBe(4);
  });

  it('should apply amount class to numeric cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const amountCells = container.querySelectorAll('.amount');
    expect(amountCells.length).toBeGreaterThan(0);
  });

  it('should render totals in correct order', () => {
    const { container } = render(
      <table>
        <tbody>
          <TotalsRow totals={mockTotals} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    // Cell 0: Total label (colSpan 2)
    expect(cells[0]).toHaveTextContent('table.total');
    // Cell 1: totalAmount
    expect(cells[1]).toHaveTextContent(/480[\s\u202f]000,00[\s\u202f]€/);
  });

  it('should handle large totals', () => {
    const largeTotals: PaymentScheduleTotals = {
      totalAmount: 10000000,
      totalInterestAmount: 5000000,
      totalRepaymentAmount: 5000000,
      totalActualizedCashFlowsAmount: 9500000,
    };

    render(
      <table>
        <tbody>
          <TotalsRow totals={largeTotals} />
        </tbody>
      </table>
    );

    expect(
      screen.getByText(/10[\s\u202f]000[\s\u202f]000,00[\s\u202f]€/)
    ).toBeInTheDocument();
  });
});
