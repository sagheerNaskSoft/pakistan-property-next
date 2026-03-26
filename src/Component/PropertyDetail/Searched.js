import React, { useEffect, useState } from 'react';
import CustomTooltip from '../Metiral/CustomTooltip';
// import './Searched.css';


function Searched({ mostSearchs,propertyData }) {
  const [data, setData] = useState([])
  useEffect(() => {
    if (mostSearchs?.length) {
      let updateData = mostSearchs
        ?.slice()
        .sort((a, b) => b.percentage - a.percentage)
        .map((item) => {
          return {
            label: item?.name,
            value: item?.percentage
          }
        })
      setData(updateData)
    }
  }, [mostSearchs])
  return (
    <>
      <div className='finance-h mb-3'>
        <h3>Most Searched locations in {propertyData?.city?.name}</h3>
      </div>
      <div className="searched-container">
        <div className="bars-area">
          {data.map((item, index) => (
            <div key={index} className="bar-row">
              <CustomTooltip
                title={`${item.label} has been searched ${item.value}% of the time`}
                placement="right"
              >
                <div className="bar-label" style={{ width: "80px" }}>
                  {item.label
                    ? item.label.length > 9
                      ? item.label.slice(0, 9) + '...'
                      : item.label
                    : ''}
                </div>
              </CustomTooltip>

              <div className="bar-wrapper">
                <div className="bar" style={{ width: `${item.value}%` }} />
                <div className="bar-value">{item.value}%</div>
              </div>
            </div>
          ))}
          <div className="x-axis">
            <div className="x-line" style={{ left: '-13px' }}>
              <span>0</span>
            </div>
            <div className="x-line" style={{ left: '25%' }}>
              <span>25</span>
            </div>
            <div className="x-line" style={{ left: '50%' }}>
              <span>50</span>
            </div>
            <div className="x-line" style={{ left: '75%' }}>
              <span>75</span>
            </div>
            <div className="x-line" style={{ left: '100%' }}>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Searched;
