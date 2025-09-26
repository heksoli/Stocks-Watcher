"use client";

import { renderHook, cleanup } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import useTradingViewWidget from './useTradingViewWidget';

// Mock document methods
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockInnerHTML = jest.fn();

// Setup DOM mocks
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Mock document.createElement
  mockCreateElement.mockReturnValue({
    src: '',
    async: false,
    innerHTML: '',
  });
  document.createElement = mockCreateElement;
  
  // Create a mock container element
  const mockContainer = {
    innerHTML: '',
    dataset: {},
    appendChild: mockAppendChild,
  };
  
  // Mock useRef to return our mock container
  jest.spyOn(require('react'), 'useRef').mockReturnValue({
    current: mockContainer,
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('useTradingViewWidget', () => {
  const defaultConfig = {
    symbol: 'NASDAQ:AAPL',
    theme: 'light',
    locale: 'en',
  };

  describe('Happy Path Tests', () => {
    test('should return a ref object', () => {
      const { result } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(result.current).toHaveProperty('current');
    });

    test('should create script element with correct src URL', () => {
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockCreateElement).toHaveBeenCalledWith('script');
    });

    test('should set script async property to true', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockScript.async).toBe(true);
    });

    test('should set script innerHTML with stringified config', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockScript.innerHTML).toBe(JSON.stringify(defaultConfig));
    });

    test('should create container div with correct height', () => {
      const height = 800;
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, height)
      );
      
      expect(mockContainer.innerHTML).toContain(`height: ${height}px`);
    });

    test('should use default height of 600px when not provided', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockContainer.innerHTML).toContain('height: 600px');
    });

    test('should append script to container', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockAppendChild).toHaveBeenCalledWith(mockScript);
    });

    test('should set loaded dataset flag', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockContainer.dataset.loaded).toBe('true');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should not execute when containerRef.current is null', () => {
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: null,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });

    test('should not execute when containerRef.current is undefined', () => {
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: undefined,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });

    test('should not execute when widget is already loaded', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: { loaded: 'true' },
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockCreateElement).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });

    test('should handle empty config object', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', {})
      );
      
      expect(mockScript.innerHTML).toBe('{}');
    });

    test('should handle null config', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', null as any)
      );
      
      expect(mockScript.innerHTML).toBe('null');
    });

    test('should handle undefined config', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', undefined as any)
      );
      
      expect(mockScript.innerHTML).toBe('undefined');
    });

    test('should handle complex nested config objects', () => {
      const complexConfig = {
        symbol: 'NASDAQ:AAPL',
        theme: 'dark',
        locale: 'en',
        interval: '1D',
        timezone: 'America/New_York',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        studies: ['MASimple@tv-basicstudies'],
        nested: {
          array: [1, 2, 3],
          object: { deep: 'value' },
        },
      };
      
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', complexConfig)
      );
      
      expect(mockScript.innerHTML).toBe(JSON.stringify(complexConfig));
    });

    test('should handle zero height', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, 0)
      );
      
      expect(mockContainer.innerHTML).toContain('height: 0px');
    });

    test('should handle negative height', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, -100)
      );
      
      expect(mockContainer.innerHTML).toContain('height: -100px');
    });

    test('should handle very large height values', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, 99999)
      );
      
      expect(mockContainer.innerHTML).toContain('height: 99999px');
    });
  });

  describe('Script URL Construction', () => {
    test('should construct correct script URL with base URL', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockScript.src).toBe('https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart');
    });

    test('should handle different widget types', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('symbol-info', defaultConfig)
      );
      
      expect(mockScript.src).toBe('https://s3.tradingview.com/external-embedding/embed-widget-symbol-info');
    });

    test('should handle empty scriptUrl', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('', defaultConfig)
      );
      
      expect(mockScript.src).toBe('https://s3.tradingview.com/external-embedding/embed-widget-');
    });

    test('should handle scriptUrl with special characters', () => {
      const mockScript = { src: '', async: false, innerHTML: '' };
      mockCreateElement.mockReturnValue(mockScript);
      
      renderHook(() => 
        useTradingViewWidget('chart-widget-2024', defaultConfig)
      );
      
      expect(mockScript.src).toBe('https://s3.tradingview.com/external-embedding/embed-widget-chart-widget-2024');
    });
  });

  describe('Dependency Changes and Re-renders', () => {
    test('should re-execute effect when scriptUrl changes', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { rerender } = renderHook(
        ({ scriptUrl }) => useTradingViewWidget(scriptUrl, defaultConfig),
        { initialProps: { scriptUrl: 'advanced-chart' } }
      );
      
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      
      // Clear dataset.loaded to simulate fresh render
      mockContainer.dataset = {};
      
      act(() => {
        rerender({ scriptUrl: 'symbol-info' });
      });
      
      expect(mockCreateElement).toHaveBeenCalledTimes(2);
    });

    test('should re-execute effect when config changes', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { rerender } = renderHook(
        ({ config }) => useTradingViewWidget('advanced-chart', config),
        { initialProps: { config: defaultConfig } }
      );
      
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      
      // Clear dataset.loaded to simulate fresh render
      mockContainer.dataset = {};
      
      act(() => {
        rerender({ config: { ...defaultConfig, theme: 'dark' } });
      });
      
      expect(mockCreateElement).toHaveBeenCalledTimes(2);
    });

    test('should re-execute effect when height changes', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { rerender } = renderHook(
        ({ height }) => useTradingViewWidget('advanced-chart', defaultConfig, height),
        { initialProps: { height: 600 } }
      );
      
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      
      // Clear dataset.loaded to simulate fresh render
      mockContainer.dataset = {};
      
      act(() => {
        rerender({ height: 800 });
      });
      
      expect(mockCreateElement).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup Function', () => {
    test('should clear innerHTML on cleanup', () => {
      const mockContainer = {
        innerHTML: 'initial content',
        dataset: { loaded: 'true' },
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { unmount } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      act(() => {
        unmount();
      });
      
      expect(mockContainer.innerHTML).toBe('');
    });

    test('should delete loaded dataset property on cleanup', () => {
      const mockContainer = {
        innerHTML: 'initial content',
        dataset: { loaded: 'true' },
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { unmount } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      act(() => {
        unmount();
      });
      
      expect(mockContainer.dataset.loaded).toBeUndefined();
    });

    test('should handle cleanup when container is null', () => {
      let mockContainer: any = {
        innerHTML: 'initial content',
        dataset: { loaded: 'true' },
        appendChild: mockAppendChild,
      };
      
      const mockRef = { current: mockContainer };
      jest.spyOn(require('react'), 'useRef').mockReturnValue(mockRef);
      
      const { unmount } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      // Set container to null before cleanup
      mockRef.current = null;
      
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });

    test('should handle cleanup when container is undefined', () => {
      let mockContainer: any = {
        innerHTML: 'initial content',
        dataset: { loaded: 'true' },
        appendChild: mockAppendChild,
      };
      
      const mockRef = { current: mockContainer };
      jest.spyOn(require('react'), 'useRef').mockReturnValue(mockRef);
      
      const { unmount } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      // Set container to undefined before cleanup
      mockRef.current = undefined;
      
      expect(() => {
        act(() => {
          unmount();
        });
      }).not.toThrow();
    });
  });

  describe('Container HTML Generation', () => {
    test('should generate correct HTML structure', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, 700)
      );
      
      const expectedHTML = `<div class='tradingview-widget-container__widget style="width: 100%; height: 700px"></div>`;
      expect(mockContainer.innerHTML).toBe(expectedHTML);
    });

    test('should generate HTML with custom height', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, 1200)
      );
      
      expect(mockContainer.innerHTML).toContain('height: 1200px');
    });

    test('should always include width: 100% in generated HTML', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockContainer.innerHTML).toContain('width: 100%');
    });

    test('should include correct CSS class name', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockContainer.innerHTML).toContain(`class='tradingview-widget-container__widget`);
    });
  });

  describe('Multiple Hook Instances', () => {
    test('should handle multiple hook instances independently', () => {
      const mockContainer1 = {
        innerHTML: '',
        dataset: {},
        appendChild: jest.fn(),
      };
      const mockContainer2 = {
        innerHTML: '',
        dataset: {},
        appendChild: jest.fn(),
      };
      
      const mockRef1 = { current: mockContainer1 };
      const mockRef2 = { current: mockContainer2 };
      
      let callCount = 0;
      jest.spyOn(require('react'), 'useRef').mockImplementation(() => {
        callCount++;
        return callCount === 1 ? mockRef1 : mockRef2;
      });
      
      renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig, 600)
      );
      renderHook(() => 
        useTradingViewWidget('symbol-info', { symbol: 'NASDAQ:TSLA' }, 400)
      );
      
      expect(mockContainer1.innerHTML).toContain('height: 600px');
      expect(mockContainer2.innerHTML).toContain('height: 400px');
      expect(mockContainer1.dataset.loaded).toBe('true');
      expect(mockContainer2.dataset.loaded).toBe('true');
    });
  });

  describe('Performance and Memory Leaks', () => {
    test('should not create multiple scripts for same container on re-renders', () => {
      const mockContainer = {
        innerHTML: '',
        dataset: {},
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { rerender } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      
      // Rerender with same props should not create new script due to loaded flag
      act(() => {
        rerender();
      });
      
      expect(mockCreateElement).toHaveBeenCalledTimes(1);
    });

    test('should properly clean up on unmount to prevent memory leaks', () => {
      const mockContainer = {
        innerHTML: '<div>existing content</div>',
        dataset: { loaded: 'true', someOtherProp: 'value' },
        appendChild: mockAppendChild,
      };
      
      jest.spyOn(require('react'), 'useRef').mockReturnValue({
        current: mockContainer,
      });
      
      const { unmount } = renderHook(() => 
        useTradingViewWidget('advanced-chart', defaultConfig)
      );
      
      act(() => {
        unmount();
      });
      
      expect(mockContainer.innerHTML).toBe('');
      expect(mockContainer.dataset.loaded).toBeUndefined();
      // Other dataset properties should remain
      expect(mockContainer.dataset.someOtherProp).toBe('value');
    });
  });
});