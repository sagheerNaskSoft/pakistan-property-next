import { useState } from 'react';
import SingleMenuFeild from '../Metiral/InputField/SingleMenuFeild/SingleMenuFeild';
import SingleTypeFeild from '../Metiral/InputField/SingleMenuFeild/SingleTypeFeild';
import { useAuth } from '../../Context/ContextProvider';
// import './Agreement.css';


function Agreement({ propertyPrice }) {
  const { formatPriceWithCommas } = useAuth()
  const [calculatedData, setCalculatedData] = useState({
    monthlyRent: 0,
    advanceSecurity: 0,
    tenure: 0,
    yearlyIncrease: 0,
    oneTimeCommission: 0
  })
  const areaMenu = [
    {
      name: "1 Year",
      value: 1
    },
    {
      name: "2 Years",
      value: 2
    },
    {
      name: "3 Years",
      value: 3
    },
    {
      name: "4 Years",
      value: 4
    },
    {
      name: "5 Years",
      value: 5
    },


  ]
  const rentPaymentMethod = [
    {
      name: "After Month",
      value: "after_month"
    },
    {
      name: "Advance",
      value: "advance"
    },

  ]
  const securityDeposit = [
    {
      name: "1 Month",
      value: 1
    },
    {
      name: "2 Months",
      value: 2
    }
  ]
  const annualRentIncrease = [
    {
      name: "10% Every Year (Fixed)",
      value: 10
    },
    {
      name: "15% Every Year (Fixed)",
      value: 15
    },
    {
      name: "20% Every Year (Fixed)",
      value: 20
    },
    {
      name: "25% Every Year (Fixed)",
      value: 25
    }
  ]
  const oneTimeCommission = [
    {
      name: "10% One Time Commission",
      value: 10
    },
    {
      name: "15% One Time Commission",
      value: 15
    },
    {
      name: "20% One Time Commission",
      value: 20
    },
    {
      name: "25% One Time Commission",
      value: 25
    },
    {
      name: "30% One Time Commission",
      value: 30
    },
    {
      name: "50% One Time Commission",
      value:50
    },
    {
      name: "100% One Time Commission",
      value: 100
    }
  ]
  const [filterData, setFilterData] = useState({
    priceRange: `${formatPriceWithCommas(propertyPrice)} PKR`,
    agreementDuration: "",
    securityDeposit: "",
    rentPaymentMethod: "",
    annualRentIncrease: "",
    oneTimeCommission: "",
  })
  const [errors, setErrors] = useState({})
  const validateForm = () => {
    let errors = {}
    if (!filterData.agreementDuration) {
      errors.agreementDuration = "Agreement Duration is required"
    }
    if (!filterData.securityDeposit) {
      errors.securityDeposit = "Security Deposit is required"
    }
    if (!filterData.annualRentIncrease) {
      errors.annualRentIncrease = "Annual Rent Increase is required"
    }
    if (!filterData.rentPaymentMethod) {
      errors.rentPaymentMethod = "Rent Payment Method is required"
    }
    setErrors(errors)
    return Object.keys(errors).length === 0
  }
  const handleCalculate = () => {
    if (validateForm()) {
      setCalculatedData({
        monthlyRent: propertyPrice,
        advanceSecurity:(filterData.rentPaymentMethod?.value === "advance" ? propertyPrice  : 0) + propertyPrice * filterData.securityDeposit?.value,
        tenure: filterData.agreementDuration,
        yearlyIncrease: filterData.annualRentIncrease?.value || 0,
        rentPaymentMethod: filterData.rentPaymentMethod?.value,
        oneTimeCommission: filterData.oneTimeCommission?.value || 0
      })
    }
  }

  function getOrdinal(n) {
    if (n % 10 === 1 && n % 100 !== 11) return 'st';
    if (n % 10 === 2 && n % 100 !== 12) return 'nd';
    if (n % 10 === 3 && n % 100 !== 13) return 'rd';
    return 'th';
  }

  return (
    <>
      <div className="finance-h mt-lg-0 mt-4">
        <h3>Rent Agreement calculator</h3>
        <p>Easily estimate your rental contract costs and taxes with our Rent Agreement Calculator.</p>
      </div>
      <div className="agreement-box">
        <div className="form-row">
          <div className='row w-100 m-0 finance-formGrid'>
            <div style={{ marginRight: '50px' }} className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleTypeFeild disabled={true} input={true} filterData={filterData} setFilterData={setFilterData} varName={'priceRange'} label={"Enter monthly rent"} error={errors.priceRange} />
            </div>
            {/* Employeement Dropdown */}
            <div className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'agreementDuration'} getVaiable={'name'} label={"Agreement Duration"} menuData={areaMenu} optionSelect={"single"} error={errors.agreementDuration} />
            </div>
            <div style={{ marginRight: '50px' }} className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'securityDeposit'} getVaiable={'name'} label={"Security Deposit (Months of Rent)"} menuData={securityDeposit} optionSelect={"single"} error={errors.securityDeposit} />
            </div>
            {/* Employeement Dropdown */}
            <div className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'rentPaymentMethod'} getVaiable={'name'} label={"Rent Payment Method"} menuData={rentPaymentMethod} optionSelect={"single"} error={errors.rentPaymentMethod} />
            </div>
            <div style={{ marginRight: '50px' }} className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'annualRentIncrease'} getVaiable={'name'} label={"Annual Rent Increase"} menuData={annualRentIncrease} optionSelect={"single"} error={errors.annualRentIncrease} />
            </div>
            <div style={{ marginRight: '50px' }} className="col-lg-4 col-md-6 col-sm-6 p-0">
              <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'oneTimeCommission'} getVaiable={'name'} label={"One Time Commission"} menuData={oneTimeCommission} optionSelect={"single"} error={errors.oneTimeCommission} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} className="check-btn">Calculate</button>

        <div className='project-hr-line-property-finance mb-3'>
          <hr className="" />
        </div>

        {calculatedData.monthlyRent && calculatedData.advanceSecurity && calculatedData.tenure && calculatedData.yearlyIncrease ? <div className='agreement-result gap-0'>
          <div className='agreement-result-item'>
            <h6>Monthly Rent</h6>
            <h5>{formatPriceWithCommas(calculatedData.monthlyRent)} </h5>
          </div>
          <div className='agreement-result-item'>
            <h6>Advance + Security + Commission</h6>
            <h5>{formatPriceWithCommas(calculatedData.advanceSecurity + (calculatedData.oneTimeCommission * calculatedData.monthlyRent / 100))}</h5>
          </div>
          <div className='agreement-result-item'>
            <h6>Tenure</h6>
            <h5>{calculatedData.tenure?.value} Year</h5>
          </div>
          <div style={{ borderRight: 'none' }} className='agreement-result-item'>
            <h6>Yearly Increase</h6>
            <h5>{calculatedData.yearlyIncrease}%</h5>
          </div>
        </div> : <></>}
        <div className='agreement-result-card-main w-100 '>
          {calculatedData?.tenure ? Array.from({ length: calculatedData.tenure?.value }).map((item, index) => {
            const base = calculatedData.monthlyRent;
            const increase = calculatedData.yearlyIncrease;
            const monthly = Math.round(base * Math.pow(1 + increase / 100, index));
            const yearly = monthly * 12;
            const oneTimeCommission = (monthly / 100) * calculatedData.oneTimeCommission;
            return (
              <div className='agreement-result-card-item' key={index}>
                <div className='card_main_top'>
                  <div className='d-flex align-items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <circle cx="4" cy="4" r="4" fill="black" />
                    </svg>
                    <h6 className='mb-0'>Per Month ({index + 1}{getOrdinal(index + 1)} Year)</h6>
                  </div>
                  <div className='d-flex align-items-center justify-content-between w-100 gap-2'>
                    <h6 className='mb-0'>Monthly</h6>
                    <h5 className='mb-0'>{formatPriceWithCommas(monthly)} <span className='currency'>PKR</span></h5>
                  </div>
                  <div className='d-flex align-items-center justify-content-between w-100 gap-2'>
                    <h6 className='mb-0'>Yearly</h6>
                    <h5 className='mb-0'>{formatPriceWithCommas(yearly)} <span className='currency'>PKR</span></h5>
                  </div>
                 <div className='d-flex align-items-center justify-content-between w-100 gap-2'>
                    <h6 className='mb-0'>Commission</h6>
                    {index===0 ?<h5 className='mb-0'>{formatPriceWithCommas(oneTimeCommission)} <span className='currency'>PKR</span></h5>:<h5>- - -</h5>}
                  </div>
                </div>
                <div className='card_main_bottom'>
                  <p className='mb-0'>For {index + 1}{getOrdinal(index + 1)} year the Rent will be calculated as decided. {index===0 ? <span>Commission is only for One time.</span>:""}</p>
                </div>
              </div>
            )
          }):""}
        </div>

       {calculatedData?.tenure ? <div className='project-hr-line-property-finance mb-3'>
          <hr className="" />
        </div> : ""}

        <p className="disclaimer-agremnt mb-0">
          This calculation is intended as a general guide only. We do not provide financial or legal advice, so it’s
          important to consult a professional<br /> adviser. This tool applies to rental agreements within Pakistan and may
          not reflect variations in provincial regulations or commercial property<br /> terms.
        </p>
      </div>
    </>
  );
}

export default Agreement;
