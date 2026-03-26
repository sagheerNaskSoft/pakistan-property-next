import React, { useRef, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useAuth } from "../../Context/ContextProvider";

/* ---------- helpers ---------- */
const fmtCr = (n) => `${n} Cr`;
const COLORS = { up: "#1C6040", down: "#E53935" };

/* ---------- custom cursor: show line only from dot -> bottom ---------- */
const DownOnlyCursor = ({ points, height, margin, color = "#1C6040" }) => {
  const x = points?.[0]?.x ?? 0;                 // active x
  const y = points?.[0]?.y ?? 0;                 // active y (dot center)
  const yBottom = height - (margin?.bottom ?? 0);
  const id = "downGrad-" + Math.random().toString(36).slice(2);

  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id={id} x1="0" y1={y} x2="0" y2={yBottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {/* thin rounded strip from dot downwards */}
      <rect
        x={x - 1}
        y={y}
        width={2}
        height={Math.max(0, yBottom - y)}
        fill={`url(#${id})`}
        rx={1}
      />
    </g>
  );
};

/* ---------- card ---------- */

/* ---------- parent ---------- */
export default function PropertyPricing({ area_wise }) {
  const sliderRef = useRef(null);
  const { loading } = useAuth()
  const [slidesToShow, setSlidesToShow] = useState(3);

  // ✅ Determine how many slides are currently showing based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setSlidesToShow(1);
      } else if (window.innerWidth <= 992) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  // ✅ Show arrow only if there are more items than currently visible slides
  const showArrow = area_wise?.length > slidesToShow;
  const formatNumber1 = (num) => {
    if (num >= 1_00_00_00_000) {
      return `${(num / 1_00_00_00_000).toFixed(0)} B`;
    } else if (num >= 1_00_00_000) {
      return `${(num / 1_00_00_000).toFixed(0)} Cr`;
    } else if (num >= 1_00_000) {
      return `${(num / 1_00_000).toFixed(0)} Lac`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(0)} K`;
    } else if (num >= 1_00) {
      return `${(num / 1_00).toFixed(0)} Hundred`;
    }
    return num.toString();
  };
  const formatNumber = (num) => {
    if (num >= 1_00_00_00_000) {
      return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
    } else if (num >= 1_00_00_000) {
      return `${(num / 1_00_00_000).toFixed(2)} Crore`;
    } else if (num >= 1_00_000) {
      return `${(num / 1_00_000).toFixed(2)} Lakh`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)} K`;
    } else if (num >= 1_00) {
      return `${(num / 1_00).toFixed(2)} Hundred`;
    }
    return num.toString();
  };
  function PriceCard({ location_name, city_name, current_avg_price, percent_change, trend }) {
    const series = trend?.map((item) => {
      return { v: item?.avg_price, d: item?.month }
    })
    const latest = trend[trend.length - 1]?.percent_change ?? 0;
    const prev = trend[trend.length - 2]?.percent_change ?? 0;
    const calcPct = prev === 0 ? 0 : Math.round(((latest - prev) / prev) * 100);
    const diffPct = typeof percent_change === "number" ? percent_change : calcPct;

    const isUp = diffPct >= 0;
    const color = isUp ? COLORS.up : COLORS.down;
    const gradId = `grad-${location_name}-${city_name}`.replace(/\s+/g, "_");

    return (
      <div className="price-card">
        <div className="top">
          <div className="card-title">{location_name}</div>
          <div className="location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.3334 6.66668C13.3334 9.99534 9.64075 13.462 8.40075 14.5327C8.28523 14.6195 8.14461 14.6665 8.00008 14.6665C7.85555 14.6665 7.71493 14.6195 7.59941 14.5327C6.35941 13.462 2.66675 9.99534 2.66675 6.66668C2.66675 5.25219 3.22865 3.89563 4.22885 2.89544C5.22904 1.89525 6.58559 1.33334 8.00008 1.33334C9.41457 1.33334 10.7711 1.89525 11.7713 2.89544C12.7715 3.89563 13.3334 5.25219 13.3334 6.66668Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 8.66666C9.10457 8.66666 10 7.77123 10 6.66666C10 5.56209 9.10457 4.66666 8 4.66666C6.89543 4.66666 6 5.56209 6 6.66666C6 7.77123 6.89543 8.66666 8 8.66666Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#447158" }}>{city_name}</span>
          </div>
        </div>

        <div className="price">
          <span>PKR</span>
          <div className="number">{formatNumber(current_avg_price)}</div>
        </div>

        <div className="mini-chart-wrap px-1" style={{ position: "relative", left: -14, width: "108%", height: 180, overflow: "visible" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#E6E9EC" />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                dataKey="v"
                tickFormatter={(n) => formatNumber1(n)}
                tick={{ fill: "#9AA0A6", fontSize: 12, dx: -4, dy: -4 }}
                domain={[0, 16]}
              />

              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area
                dataKey="v"
                type="monotone"
                stroke={color}
                strokeWidth={3}
                fill={`url(#${gradId})`}
                activeDot={{ r: 5, fill: "#fff", stroke: color, strokeWidth: 3 }}
                dot={false}
              />

              {/* ⬇️ only-bottom cursor here */}
              <Tooltip
                cursor={<DownOnlyCursor color={color} />}
                wrapperStyle={{ outline: "none" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0].value;
                  const date = payload[0].payload?.d;


                  return (
                    <div className="mini-tip">
                      <div className="mini-tip-date">{date}</div>
                      <div className="mini-tip-row" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="mini-tip-value">{formatNumber(val)}</div>
                        <div className={`mini-tip-badge ${isUp ? "up" : "down"}`}>
                          {isUp ? `+${diffPct}%` : `${diffPct}%`}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="property-index-pricing">
      <div className="main-container">
        <div className="title">
          Compare Property Values Across Pakistan’s Popular Communities
        </div>
        {loading ?
          window.innerWidth > 576 ?
            <div className="row m-0">
              <div className="col-lg-4 col-md-4 col-sm-4 ps-0">
                <div className='placeholder-glow'>
                  <div className='placeholder w-100 mt-2' style={{ height: "300px" }} />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 ps-0">
                <div className='placeholder-glow'>
                  <div className='placeholder w-100 mt-2' style={{ height: "300px" }} />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 p-0">
                <div className='placeholder-glow'>
                  <div className='placeholder w-100 mt-2' style={{ height: "300px" }} />
                </div>
              </div>
            </div>
            :
            <div className="card-section global-scroll-box d-flex align-items-center" style={{ gap: '24px' }}>
              {[...Array(3)].map((_, idx) => (
                <div key={idx} style={{ minWidth: '280px' }}>
                  <div className='placeholder-glow'>
                    <div className='placeholder w-100' style={{ height: "300px", borderRadius: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
          : window.innerWidth > 576?
            <div className="card-section">
              <Slider ref={sliderRef} {...sliderSettings}>
                {area_wise?.map((c, idx) => (
                  <div key={idx} style={{ paddingRight: "12px" }}>
                    <PriceCard {...c} />
                  </div>
                ))}
              </Slider>
              {/* ✅ Show arrow only if there are more items than currently visible slides */}
              {showArrow && (
                <div className="arrow-box" onClick={() => sliderRef.current?.slickNext()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_2945_60967)">
                      <path d="M6.99799 24.0002C6.86638 24.0009 6.73592 23.9757 6.61408 23.9259C6.49224 23.8762 6.38143 23.8028 6.28799 23.7102C6.19426 23.6172 6.11986 23.5066 6.06909 23.3847C6.01833 23.2629 5.99219 23.1322 5.99219 23.0002C5.99219 22.8681 6.01833 22.7374 6.06909 22.6156C6.11986 22.4937 6.19426 22.3831 6.28799 22.2902L14.458 14.1202C15.0198 13.5577 15.3353 12.7952 15.3353 12.0002C15.3353 11.2052 15.0198 10.4427 14.458 9.88017L6.28799 1.71018C6.09968 1.52188 5.99389 1.26649 5.99389 1.00018C5.99389 0.733883 6.09968 0.478489 6.28799 0.290185C6.47629 0.101882 6.73168 -0.00390625 6.99799 -0.00390625C7.26429 -0.00390625 7.51968 0.101882 7.70799 0.290185L15.878 8.46017C16.3436 8.92463 16.713 9.47639 16.9651 10.0838C17.2172 10.6913 17.3469 11.3425 17.3469 12.0002C17.3469 12.6578 17.2172 13.3091 16.9651 13.9165C16.713 14.524 16.3436 15.0757 15.878 15.5402L7.70799 23.7102C7.61455 23.8028 7.50373 23.8762 7.38189 23.9259C7.26005 23.9757 7.12959 24.0009 6.99799 24.0002Z" fill="#2D2D2D" />
                    </g>
                    <defs>
                      <clipPath id="clip0_2945_60967">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
            :
            <div className="card-section global-scroll-box d-flex align-items-center" style={{gap:'24px'}}>
              {area_wise?.map((c, idx) => (
                <div key={idx}>
                  <PriceCard {...c} />
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
