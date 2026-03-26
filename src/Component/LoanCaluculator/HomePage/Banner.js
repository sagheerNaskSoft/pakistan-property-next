import React, { useState, useRef, useCallback, useEffect } from 'react'
import BreadCrumb from '../../Metiral/BreadCrumb'
import SingleRangeInput from '../../Metiral/InputField/RangeMenuField/SingleRangeInput'
import PrimaryButton from '../../Metiral/Button/PrimaryButton'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/ContextProvider';

function Banner() {
  const navigate = useNavigate();
  const [percentageSlider, setPercentageSlider] = useState(30);
  const [loanSlider, setLoanSlider] = useState(20);
  const [priceSlider, setPriceSlider] = useState(15000000);
  const { buildSearchPayloadLoanCalculate, objectToQueryString } = useAuth();
  const [filterData, setFilterData] = useState({
    propertyPrice: "15000000",
    downPayment: "30",
    loanPeriod: '20'
  })
  const CurrencyUnit = "PKR";
  const loanUnit = "Years";
  const searchAreaRef = useRef(null);
  
  // 🟢 Handle search function
  const handleSearch = useCallback(async () => {
    // Check if there's data to calculate (propertyPrice, downPayment, loanPeriod)
    const hasData = filterData?.propertyPrice && filterData?.downPayment && filterData?.loanPeriod;
    
    if (hasData) {
      const data = await buildSearchPayloadLoanCalculate(filterData)
      const queryString = objectToQueryString(data);
      navigate(`/loan-listing?${queryString}`, { state: filterData })
    }
  }, [filterData, buildSearchPayloadLoanCalculate, objectToQueryString, navigate]);
  
  // 🟢 Enter key handler for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only trigger if Enter is pressed and we're in the search area
      if (event.key === 'Enter' && searchAreaRef.current?.contains(event.target)) {
        event.preventDefault();
        handleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSearch]);

  return (
    <>
      <div className="loan-calculator-banner secondary-color">
        <div className="main-container">
         
          <div className="text-box">
            <div className="heading">Loan Calculator</div>
            <div className="para">
            Choose the right property loan plan with ease. Compare financing options and calculate monthly payments to choose the right loan option.
            </div>
          </div>
          <div className="loan-input-section" ref={searchAreaRef}>
            <div className="input">
              <SingleRangeInput modified={true} width={true} label={"Property Price"} filterData={filterData} setFilterData={setFilterData} varName={'propertyPrice'} value={CurrencyUnit} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={1000000000000} />
            </div>
            <div className="input">
              <SingleRangeInput modified={true} inputType={"%"} propertyPriceValue={filterData?.propertyPrice} width={true} label={"Down Payment"} filterData={filterData} setFilterData={setFilterData} varName={'downPayment'} value={CurrencyUnit} sliderValue={percentageSlider} setSliderValue={setPercentageSlider} maxValue={50} />
            </div>
            <div className="input">
              <SingleRangeInput modified={true} inputType={"date"} width={true} label={"Loan Period"} filterData={filterData} setFilterData={setFilterData} varName={'loanPeriod'} value={loanUnit} sliderValue={loanSlider} setSliderValue={setLoanSlider} maxValue={20} />
            </div>
            <div className="button" onClick={handleSearch}>
              <PrimaryButton text={"Calculate"} height={"50px"} />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Banner
