import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// テスト環境動作確認用のサンプルテスト
describe('テスト環境の動作確認', () => {
  it('Vitestが動作すること', () => {
    expect(1 + 1).toBe(2);
  });

  it('React Testing Libraryが動作すること', () => {
    render(<div data-testid="test-element">Hello</div>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('jest-domマッチャーが動作すること', () => {
    render(<button disabled>Click me</button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
