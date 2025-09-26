/**
 * Testing Framework: Jest
 * Testing Library: React Testing Library
 */

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import Home from "./(root)/page";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

const mockTradingViewWidget = jest.fn((props: any) => (
  <div data-testid="trading-view-widget">
    {props.title ? <span>{props.title}</span> : null}
  </div>
));

jest.mock("@/components/trading-view-widget", () => ({
  __esModule: true,
  default: (props: any) => mockTradingViewWidget(props),
}));

beforeEach(() => {
  mockTradingViewWidget.mockClear();
});

describe("Home page layout", () => {
  it("renders the home wrapper with two sections", () => {
    const { container } = render(<Home />);
    const wrapper = container.querySelector(".home-wrapper");

    expect(wrapper).toBeInTheDocument();

    const sections = wrapper?.querySelectorAll("section.home-section");
    expect(sections).toHaveLength(2);
  });

  it("renders four TradingViewWidget instances", () => {
    render(<Home />);

    expect(mockTradingViewWidget).toHaveBeenCalledTimes(4);
  });
});

describe("Home page TradingView widgets", () => {
  it("passes the correct props to each TradingViewWidget instance", () => {
    render(<Home />);

    const callArgs = mockTradingViewWidget.mock.calls.map(([props]) => props);

    expect(callArgs[0]).toMatchObject({
      title: "Market Overview",
      scriptUrl: "market-overview.js",
      config: MARKET_DATA_WIDGET_CONFIG,
      className: "custom-chart",
    });

    expect(callArgs[1]).toMatchObject({
      title: "Stock Heatmap",
      scriptUrl: "stock-heatmap.js",
      config: HEATMAP_WIDGET_CONFIG,
    });
    expect(callArgs[1]?.className).toBeUndefined();

    expect(callArgs[2]).toMatchObject({
      scriptUrl: "timeline.js",
      config: TOP_STORIES_WIDGET_CONFIG,
      className: "custom-chart",
    });
    expect(callArgs[2]?.title).toBeUndefined();

    expect(callArgs[3]).toMatchObject({
      scriptUrl: "market-quotes.js",
      config: MARKET_DATA_WIDGET_CONFIG,
    });
    expect(callArgs[3]?.title).toBeUndefined();
    expect(callArgs[3]?.className).toBeUndefined();
  });

  it("ensures each TradingViewWidget receives a distinct scriptUrl", () => {
    render(<Home />);

    const callArgs = mockTradingViewWidget.mock.calls.map(([props]) => props);
    const scriptUrls = callArgs.map((props) => props.scriptUrl);

    expect(new Set(scriptUrls).size).toBe(scriptUrls.length);
  });
});