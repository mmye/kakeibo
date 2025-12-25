import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, TableHeader, TableRow, TableCell } from './index';

describe('Table', () => {
  describe('レンダリング', () => {
    it('tableを正しくレンダリングする', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Content</td>
            </tr>
          </tbody>
        </Table>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('カスタムclassNameを追加できる', () => {
      render(
        <Table className="custom-class">
          <tbody>
            <tr>
              <td>Content</td>
            </tr>
          </tbody>
        </Table>
      );
      expect(screen.getByRole('table')).toHaveClass('custom-class');
    });
  });
});

describe('TableHeader', () => {
  describe('レンダリング', () => {
    it('theadを正しくレンダリングする', () => {
      render(
        <table>
          <TableHeader>
            <TableCell header>Header</TableCell>
          </TableHeader>
        </table>
      );
      expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    });

    it('ヘッダースタイルが適用される', () => {
      render(
        <table>
          <TableHeader>
            <TableCell header>Header</TableCell>
          </TableHeader>
        </table>
      );
      expect(screen.getByRole('rowgroup')).toHaveClass('bg-surface-hover');
    });
  });
});

describe('TableRow', () => {
  describe('レンダリング', () => {
    it('trを正しくレンダリングする', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );
      expect(screen.getByRole('row')).toBeInTheDocument();
    });

    it('ホバースタイルが適用される', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );
      expect(screen.getByRole('row')).toHaveClass('hover:bg-background');
    });

    it('クリック可能な行にカーソルスタイルが適用される', () => {
      render(
        <table>
          <tbody>
            <TableRow onClick={() => {}}>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );
      expect(screen.getByRole('row')).toHaveClass('cursor-pointer');
    });
  });

  describe('インタラクション', () => {
    it('クリック時にonClickが呼ばれる', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <table>
          <tbody>
            <TableRow onClick={handleClick}>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );

      await user.click(screen.getByRole('row'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('TableCell', () => {
  describe('レンダリング', () => {
    it('tdを正しくレンダリングする', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByRole('cell')).toBeInTheDocument();
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });

    it('thをレンダリングできる', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableCell header>Header</TableCell>
            </tr>
          </thead>
        </table>
      );
      expect(screen.getByRole('columnheader')).toBeInTheDocument();
    });
  });

  describe('align', () => {
    it('左揃えがデフォルト', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByRole('cell')).toHaveClass('text-left');
    });

    it('中央揃えが適用される', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell align="center">Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByRole('cell')).toHaveClass('text-center');
    });

    it('右揃えが適用される', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell align="right">Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByRole('cell')).toHaveClass('text-right');
    });
  });

  describe('ヘッダースタイル', () => {
    it('ヘッダーセルにスタイルが適用される', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableCell header>Header</TableCell>
            </tr>
          </thead>
        </table>
      );
      const cell = screen.getByRole('columnheader');
      expect(cell).toHaveClass('text-text-secondary');
      expect(cell).toHaveClass('text-xs');
      expect(cell).toHaveClass('font-semibold');
      expect(cell).toHaveClass('uppercase');
    });
  });
});
