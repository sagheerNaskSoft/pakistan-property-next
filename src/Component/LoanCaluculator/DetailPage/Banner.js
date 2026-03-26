import SingleRangeInput from '../../Metiral/InputField/RangeMenuField/SingleRangeInput'
import PrimaryButton from '../../Metiral/Button/PrimaryButton'
import SingleMenuFeild from "../../Metiral/InputField/SingleMenuFeild/SingleMenuFeild"
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/ContextProvider';

function Banner({ data, open, setOpen }) {
    const navigate = useNavigate();
    const { buildSearchPayloadLoanCalculate, objectToQueryString } = useAuth();
    const [percentageSlider, setPercentageSlider] = useState(0);
    const [loanSlider, setLoanSlider] = useState(0);
    const [priceSlider, setPriceSlider] = useState(0);
    const [filterData, setFilterData] = useState({
        propertyPrice: "",
        downPayment: "",
        loanPeriod: '',
        loanType: ""
    })
    const CurrencyUnit = "PKR";
    const loanUnit = "Years";
    const LoanTypeMenu = ["All", "Conventional", "Islamic"];
    const searchAreaRef = useRef(null);
    
    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to calculate (propertyPrice, downPayment, loanPeriod)
        const hasData = filterData?.propertyPrice && filterData?.downPayment && filterData?.loanPeriod;
        
        if (hasData) {
            const data = await buildSearchPayloadLoanCalculate(filterData)
            const queryString = objectToQueryString(data);
            navigate(`/loan-listing?${queryString}`, { state: filterData })
            setOpen(false)
        }
    }, [filterData, buildSearchPayloadLoanCalculate, objectToQueryString, navigate, setOpen]);
    
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
    if (open) {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    }
    else {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'unset';
    }



    useEffect(() => {
        const updateFilterData = async () => {
            setFilterData({
                propertyPrice: data?.propertyPrice || "",
                downPayment: data?.downPayment || "",
                loanPeriod: data?.loanPeriod || '',
                loanType: data?.loanType || ""
            });
            setPercentageSlider(data?.downPayment || 0);
            setLoanSlider(data?.loanPeriod || 0);
            setPriceSlider(data?.propertyPrice || 0);
        };
        updateFilterData();
    }, [data]);

    return (
        <>
            <div className={`loan-input-section input-section ${open ? "active" : ''}`} ref={searchAreaRef}>
                <div className="input-area">
                    <div className="main-container d-flex flex-column flex-md-row" style={{ gap: '8px' }}>
                        <div className="top d-md-none d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px" }}>
                            <div className="global-input-section-title">Filters</div>
                            <div className="input-section-close-btn d-lg-none d-flex justify-content-center align-items-center" onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                                    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                </svg>
                            </div>
                        </div>
                        <div className="row m-0 d-md-flex justify-content-lg-center justify-content-md-between" style={{ width: "100%", gap: "15px 0" }}>
                            <div className="col-lg-3 px-1 col-md-4">
                                <SingleRangeInput modified={true} label={"Property Price"} filterData={filterData} setFilterData={setFilterData} varName={'propertyPrice'} value={CurrencyUnit} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={99999999999} />
                            </div>
                            <div className="col-lg-3 px-1 col-md-4 col-12">
                                <SingleRangeInput modified={true} inputType={"%"} propertyPriceValue={filterData?.propertyPrice} label={"Down Payment"} filterData={filterData} setFilterData={setFilterData} varName={'downPayment'} value={CurrencyUnit} sliderValue={percentageSlider} setSliderValue={setPercentageSlider} maxValue={50} />
                            </div>
                            <div className="col-lg-3 px-1 col-md-4 col-12">
                                <SingleRangeInput modified={true} inputType={"date"} label={"Loan Period"} filterData={filterData} setFilterData={setFilterData} varName={'loanPeriod'} value={loanUnit} sliderValue={loanSlider} setSliderValue={setLoanSlider} maxValue={12} />
                            </div>
                            <div className="col-lg-3 px-1 col-md-4 col-12">
                                <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'loanType'} label={"Loan Type"} menuData={LoanTypeMenu} optionSelect={"singleSelect"} />
                            </div>
                            <div className="col-md-2 col-12 d-lg-none d-sm- d-none justify-content-md-end px-1">
                                <div className="button" onClick={handleSearch}>
                                    <PrimaryButton text={"Calculate"} height={"50px"} />
                                </div>
                            </div>
                        </div>
                        <div className="button d-lg-flex d-sm-none d-flex input-section-sticky-buttons" onClick={handleSearch}>
                            <PrimaryButton text={"Calculate"} height={"50px"} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner
