/**
 * Tests for TradingViewWidget
 * Testing library and framework: Jest + React Testing Library (jsdom).
 * Note: No existing testing setup was detected; these tests follow standard Next.js/React conventions.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradingViewWidget from './trading-view-widget';

// Mock the custom hook and utilities used by the component
jest.mock('@/hooks/useTradingViewWidget', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}));

import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';

const mockUseTradingViewWidget = useTradingViewWidget as jest.Mock;

describe('TradingViewWidget', () => {
  const defaultProps = {
    scriptUrl: 'https://example.com/widget.js',
    config: { symbol: 'AAPL', interval: '1D' },
  };

  beforeEach(() => {
    mockUseTradingViewWidget.mockReturnValue({ current: null });
    (cn as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders outer container with base class', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} />);
      const outer = container.firstElementChild as HTMLElement;
      expect(outer).toBeInTheDocument();
      expect(outer).toHaveClass('w-full');
    });

    it('renders title when provided with expected classes', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} title="Stock Chart" />);
      const heading = container.querySelector('h3');
      expect(heading).toHaveTextContent('Stock Chart');
      expect(heading).toHaveClass('font-semibold', 'text-2xl', 'mb-2', 'text-gray-100');
    });

    it('does not render title when falsy', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} title="" />);
      expect(container.querySelector('h3')).toBeNull();
    });
  });

  describe('classes and styles', () => {
    it('applies widget container classes and merges custom className', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} className="custom-widget-class" />);
      const widgetContainer = container.querySelector('.tradingview-widget-container') as HTMLElement;
      expect(widgetContainer).toBeInTheDocument();
      expect(widgetContainer).toHaveClass('custom-widget-class');
      expect(cn).toHaveBeenCalledWith('tradingview-widget-container', 'custom-widget-class');
    });

    it('invokes cn without custom className', () => {
      render(<TradingViewWidget {...defaultProps} />);
      expect(cn).toHaveBeenCalledWith('tradingview-widget-container', undefined);
    });

    it('applies width 100% and specified height to inner widget', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} height={400} />);
      const inner = container.querySelector('.tradingview-widget-container__widget') as HTMLElement;
      expect(inner).toHaveStyle({ width: '100%', height: '400px' });
    });

    it('omits height style when height is undefined', () => {
      const { container } = render(<TradingViewWidget {...defaultProps} />);
      const inner = container.querySelector('.tradingview-widget-container__widget') as HTMLElement;
      expect(inner).toHaveStyle({ width: '100%' });
      expect(inner.style.height === '' || (inner.style.height as any) === undefined).toBe(true);
    });

    it('supports zero, negative, and large heights', () => {
      const { container, rerender } = render(<TradingViewWidget {...defaultProps} height={0} />);
      let inner = container.querySelector('.tradingview-widget-container__widget') as HTMLElement;
      expect(inner).toHaveStyle({ height: '0px' });

      rerender(<TradingViewWidget {...defaultProps} height={-100} />);
      inner = container.querySelector('.tradingview-widget-container__widget') as HTMLElement;
      expect(inner).toHaveStyle({ height: '-100px' });

      rerender(<TradingViewWidget {...defaultProps} height={99999} />);
      inner = container.querySelector('.tradingview-widget-container__widget') as HTMLElement;
      expect(inner).toHaveStyle({ height: '99999px' });
    });
  });

  describe('hook integration', () => {
    it('calls useTradingViewWidget with expected args', () => {
      render(<TradingViewWidget {...defaultProps} height={300} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        300
      );
    });

    it('passes undefined height when not provided (hook default applies internally)', () => {
      render(<TradingViewWidget {...defaultProps} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith(
        defaultProps.scriptUrl,
        defaultProps.config,
        undefined
      );
    });

    it('does not crash if hook returns null or undefined refs', () => {
      mockUseTradingViewWidget.mockReturnValueOnce(null as any);
      expect(() => render(<TradingViewWidget {...defaultProps} />)).not.toThrow();

      mockUseTradingViewWidget.mockReturnValueOnce(undefined as any);
      expect(() => render(<TradingViewWidget {...defaultProps} />)).not.toThrow();
    });
  });

  describe('props edge cases', () => {
    it('handles empty and complex config objects', () => {
      render(<TradingViewWidget scriptUrl="x.js" config={{}} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith('x.js', {}, undefined);

      const complex = {
        symbol: 'BTCUSD',
        interval: '1H',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_widget',
        studies: ['MASimple@tv-basicstudies'],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
      };
      render(<TradingViewWidget scriptUrl="y.js" config={complex} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith('y.js', complex, undefined);
    });

    it('handles empty and malformed scriptUrl strings', () => {
      render(<TradingViewWidget scriptUrl="" config={{}} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith('', {}, undefined);

      render(<TradingViewWidget scriptUrl="not-a-valid-url" config={{ s: 'AAPL' }} />);
      expect(mockUseTradingViewWidget).toHaveBeenCalledWith('not-a-valid-url', { s: 'AAPL' }, undefined);
    });

    it('handles special and very long titles', () => {
      const special = 'Chart: AAPL & MSFT @ $150+ (50% gain)';
      render(<TradingViewWidget {...defaultProps} title={special} />);
      expect(screen.getByText(special)).toBeInTheDocument();

      const longTitle = 'A'.repeat(1000);
      render(<TradingViewWidget {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders H3 heading when title is present', () => {
      render(<TradingViewWidget {...defaultProps} title="Stock Market Chart" />);
      const h = screen.getByRole('heading', { level: 3 });
      expect(h).toHaveTextContent('Stock Market Chart');
      expect(h.tagName).toBe('H3');
    });
  });

  describe('robustness', () => {
    it('surfaces cn errors cleanly', () => {
      (cn as jest.Mock).mockImplementationOnce(() => { throw new Error('cn error'); });
      expect(() => render(<TradingViewWidget {...defaultProps} />)).toThrow('cn error');
    });

    it('renders consistently across rerenders (memoized component)', () => {
      const props = { ...defaultProps };
      const { rerender, container } = render(<TradingViewWidget {...props} />);
      const firstMarkup = container.innerHTML;

      rerender(<TradingViewWidget {...props} />);
      const secondMarkup = container.innerHTML;

      expect(secondMarkup).toBe(firstMarkup);
    });
  });
});

/*
Testing stack used: Jest + React Testing Library (jsdom).
No existing test framework was detected in package.json; these tests follow common Next.js/React conventions.
*/