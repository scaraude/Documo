import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Home from '../page';

describe('Home Page', () => {
  test('renders core landing content', () => {
    render(<Home />);

    expect(screen.getAllByText('Documo').length).toBeGreaterThan(0);
    expect(
      screen.getByText("L'échange de documents à l'ère moderne"),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Commencer gratuitement').length).toBe(2);
    expect(
      screen.getByText((content) => content.includes('Pourquoi')),
    ).toBeInTheDocument();
  });

  test('applies root layout classes', () => {
    const { container } = render(<Home />);
    const root = container.firstChild as HTMLElement;

    expect(root).toHaveClass('min-h-screen');
    expect(root).toHaveClass('bg-white');
  });
});
