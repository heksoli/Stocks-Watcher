import TradingViewWidget from "@/components/trading-view-widget";
import {HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG} from "@/lib/constants";

const Home = () => {
  return (
    <div className="flex min-h-screen home-wrapper">
      <section className="grid w-full gap-5 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl="market-overview.js"
            config={MARKET_DATA_WIDGET_CONFIG}
            className="custom-chart"
          />
        </div>

        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl="stock-heatmap.js"
            config={HEATMAP_WIDGET_CONFIG}
          />
        </div>
      </section>

      <section className="grid w-full gap-5 home-section">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl="timeline.js"
            config={TOP_STORIES_WIDGET_CONFIG}
            className="custom-chart"
          />
        </div>

        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            scriptUrl="market-quotes.js"
            config={MARKET_DATA_WIDGET_CONFIG}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
