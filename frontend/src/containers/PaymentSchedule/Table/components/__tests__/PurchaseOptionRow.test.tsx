import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PurchaseOptionRow from '../PurchaseOptionRow';
import { PurchaseOptionTotals } from '@/types/payment-schedule/response/PurchaseOptionsTotals';

describe('PurchaseOptionRow', () => {
  const mockPurchaseOptionTotals: PurchaseOptionTotals = {
    purchaseOptionAmount: 1500,
    actualizedPurchaseOptionAmount: 1450,
  };

  it('should render purchase option label', () => {
    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Option d'achat")).toBeInTheDocument();
  });

  it('should render purchase option amount with currency formatting', () => {
    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const amounts = screen.getAllByText(/1[\s\u202f]500,00[\s\u202f]€/);
    expect(amounts.length).toBe(2); // Appears twice in the row
  });

  it('should render actualized purchase option amount', () => {
    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    expect(
      screen.getByText(/1[\s\u202f]450,00[\s\u202f]€/)
    ).toBeInTheDocument();
  });

  it('should apply purchase-option-line class to the row', () => {
    const { container } = render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const row = container.querySelector('tr');
    expect(row).toHaveClass('purchase-option-line');
  });

  it('should apply purchase-option-label class to label cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const labelCell = container.querySelector('.purchase-option-label');
    expect(labelCell).toBeInTheDocument();
    expect(labelCell).toHaveTextContent("Option d'achat");
  });

  it('should render empty cells with dash', () => {
    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const emptyCells = screen.getAllByText('-');
    expect(emptyCells.length).toBe(5);
  });

  it('should have correct colSpan for label cell', () => {
    const { container } = render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
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
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(9); // 9 physical cells (first has colSpan 2)
  });

  it('should apply amount class to numeric cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const amountCells = container.querySelectorAll('.amount');
    expect(amountCells.length).toBeGreaterThan(0);
  });

  it('should handle zero purchase option amount', () => {
    const zeroTotals: PurchaseOptionTotals = {
      purchaseOptionAmount: 0,
      actualizedPurchaseOptionAmount: 0,
    };

    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={zeroTotals} />
        </tbody>
      </table>
    );

    const zeroAmounts = screen.getAllByText(/0,00[\s\u202f]€/);
    expect(zeroAmounts.length).toBe(3);
  });

  it('should handle large purchase option amounts', () => {
    const largeTotals: PurchaseOptionTotals = {
      purchaseOptionAmount: 100000,
      actualizedPurchaseOptionAmount: 95000,
    };

    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={largeTotals} />
        </tbody>
      </table>
    );

    const largeAmounts = screen.getAllByText(/100[\s\u202f]000,00[\s\u202f]€/);
    expect(largeAmounts.length).toBe(2); // Appears twice
    expect(
      screen.getByText(/95[\s\u202f]000,00[\s\u202f]€/)
    ).toBeInTheDocument();
  });

  it('should render purchase option amount in correct cells', () => {
    const { container } = render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={mockPurchaseOptionTotals} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    // Cell 0: Label (colSpan 2)
    expect(cells[0]).toHaveTextContent("Option d'achat");
    // Cell 1: purchaseOptionAmount
    expect(cells[1]).toHaveTextContent(/1[\s\u202f]500,00[\s\u202f]€/);
    // Cell 5: purchaseOptionAmount (repayment)
    expect(cells[5]).toHaveTextContent(/1[\s\u202f]500,00[\s\u202f]€/);
    // Cell 8: actualizedPurchaseOptionAmount
    expect(cells[8]).toHaveTextContent(/1[\s\u202f]450,00[\s\u202f]€/);
  });

  it('should handle decimal purchase option amounts', () => {
    const decimalTotals: PurchaseOptionTotals = {
      purchaseOptionAmount: 1500.5,
      actualizedPurchaseOptionAmount: 1450.75,
    };

    render(
      <table>
        <tbody>
          <PurchaseOptionRow purchaseOptionTotals={decimalTotals} />
        </tbody>
      </table>
    );

    const amounts = screen.getAllByText(/1[\s\u202f]500,50[\s\u202f]€/);
    expect(amounts.length).toBe(2); // Appears twice
    expect(
      screen.getByText(/1[\s\u202f]450,75[\s\u202f]€/)
    ).toBeInTheDocument();
  });
});
