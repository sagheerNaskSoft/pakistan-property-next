import React, { useEffect, useState } from "react";
import logo from "../../Asset/HomePage/image 18 (1).svg";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import SingleRangeInput from "../Metiral/InputField/RangeMenuField/SingleRangeInput";
import LoanModel from "../../Component/Metiral/LoanModel";
import { useAuth } from "../../Context/ContextProvider";

function Finance({propertyPrice}) {
    const {getLoansScheme, loanList,
        setLoanList}=useAuth()
    const [priceSlider, setPriceSlider] = useState(0);
    const CurrencyUnit = "PKR";
    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) return `${(num / 1_00_00_00_000).toFixed(2)} Billion`
        else if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(2)} Crore`
        else if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(2)} Lakh`
        else if (num >= 1_000) return `${(num / 1_000).toFixed(2)} Thousand`
        else if (num >= 1_00) return `${(num / 1_00).toFixed(2)} Hundred`
        return num?.toLocaleString()
    }
    const [durationSlider, setDurationSlider] = useState(20);
    const [downSlider, setDownSlider] = useState(30);
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const [installmentValues,setInstallMentValue]=useState({
        monthlyInstalment:"",
        bankFinace:""
    })
    const [data,setData]=useState({
        plan:"",
        property_price:"",
        loanPeriod:20,
        down_payment:""
    })
    useEffect(() => {
        let didFetch = false;
        
        const fetchProjects = async () => {
          try {
            if (!didFetch && !loanList?.data?.length) {
              didFetch = true;
              
              const result = await getLoansScheme();
              if (result?.success) {
                setLoanList(result?.data?.data || []);
                setData({...data,plan:result?.data?.data?.data[0],property_price:propertyPrice,down_payment:30})
                
              }
            }
            else if(loanList?.data?.length){
                setPriceSlider(propertyPrice)
             
                setData({...data,plan:loanList?.data[0],property_price:propertyPrice,down_payment:30})
            }
          } catch (error) {
            console.error("An error occurred while fetching loans:", error);
          }
        };
      if(propertyPrice){
          fetchProjects();
      }
      
        return () => {
          didFetch = true; // prevent re-run on unmount in StrictMode
        };
      }, [propertyPrice]);
    useEffect(()=>{
        let monthlyInstallment
        let totalAmout
        let downPayment
        let onePercentPrice = eval(data?.property_price / 100)

        if (data?.plan?.kibor) {
            let kiborValue = eval(onePercentPrice * data?.plan?.kibor)
            let interestValue = eval(onePercentPrice * data?.plan?.margin)
            let kiborPlusInterest = eval(kiborValue + interestValue)
             totalAmout = eval(parseInt(data?.property_price) + kiborPlusInterest)
            downPayment = eval(data?.down_payment * onePercentPrice)
            let remaingAmout = eval(totalAmout - downPayment)
            let totalMonths = eval(data?.loanPeriod * 12)
            monthlyInstallment = eval(remaingAmout / totalMonths)
        } else {
            let interestValue = eval(onePercentPrice * data?.plan?.margin)
             totalAmout = eval(parseInt(data?.property_price) + interestValue)
            downPayment = eval(data?.down_payment * onePercentPrice)
            let remaingAmout = eval(totalAmout - downPayment)
            let totalMonths = eval(data?.loanPeriod * 12)
            monthlyInstallment = eval(remaingAmout / totalMonths)
        }
        setInstallMentValue({
            monthlyInstalment:monthlyInstallment,
            bankFinace:totalAmout
        })
    },[data])
    const loanUnit = "Years";
    return (
        <>
            <div className="finance-h">
                <h3>Home Finance</h3>
                <p>Calculate and view the monthly mortgage on this property</p>
            </div>

            <div className="finance-container">
                <div className="finance-innerBox">

                    {/* Logo */}
                    <div className="finance-logoBox">
                        <img src={data?.plan?.logo || logo} alt="Bank Logo" className="finance-logo" />
                    </div>

                    {/* Form Grid */}
                    <div className="finance-formGrid">
                        <div className="row m-0" >
                            <div className="col-lg-5 col-md-6 col-12 mt-3 p-0">
                                <div className="inp_main_lone_property_detail">

                                    <SingleMenuFeild getVaiable={"title"} width={true} filterData={data} setFilterData={setData} varName={'plan'} label={"Interest Plan"} menuData={loanList?.data} optionSelect={"single"} />
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-6 col-12 mt-3 p-0">
                                <div className="inp_main_lone_property_detail">

                                <SingleRangeInput modified={true} label={"Property Price"} filterData={data} setFilterData={setData} varName={'property_price'} value={CurrencyUnit} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={99999999999} />
                                </div>
                            </div>

                            <div className="col-lg-5 col-md-6 col-12 mt-3 p-0">
                            <div className="inp_main_lone_property_detail">
                                    <SingleRangeInput modified={true} inputType={"%"} propertyPriceValue={data?.property_price} label={"Down Payment"} filterData={data} setFilterData={setData} varName={'down_payment'} value={CurrencyUnit} sliderValue={downSlider} setSliderValue={setDownSlider} maxValue={50} />
                                </div>
                                </div>

                            <div className="col-lg-6 col-md-6 col-12 mt-3 p-0">
                                <div className="inp_main_lone_property_detail">

                                <SingleRangeInput modified={true} inputType={"date"} label={"Loan Period"} filterData={data} setFilterData={setData} varName={'loanPeriod'} value={loanUnit} sliderValue={durationSlider} setSliderValue={setDurationSlider} maxValue={20} />

                                </div>
                            </div>

                            <div className="col-lg-5 col-md-6 col-12 mt-3 p-0">
                                <div className="inp_main_lone_property_detail">

                                    <h6>Interest</h6>
                                    <p>{data?.plan?.kibor?"Kibor +"+data?.plan?.margin+"%":data?.plan?.margin+"%"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className='deatial-hr-finance'><hr /></span>

                    <div className="finance-paymentInfo w-100">
                        <div className="row m-0 w-100">
                            <div className="col-lg-5 col-md-6 col-12">
                                <h6>Monthly Payment</h6>
                                <h5>{formatNumber(installmentValues?.monthlyInstalment)}<span>PKR</span></h5>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12">
                                <h6>Bank Finance Amount</h6>
                                <h5>{formatNumber(installmentValues?.bankFinace)}<span>PKR</span></h5>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%' }} className='project-hr-line-property-finance mb-3'>
                        <hr className="mt-1" />
                    </div>
                    {/* 👇 Button to open modal */}
                    <button className="finance-button" onClick={handleOpen}>Apply for Loan</button>

                    {/* Disclaimer */}
                    <p className="finance-disclaimer">
                        DISCLAIMER: Interest rates may vary from the value shown on Pakistanproperty.com.
                        Actual interest rate prevalent as per bank’s policy will be<br /> applicable at the time of application.
                    </p>

                    {/* 👇 Modal Component */}
                    <LoanModel installmentValues={installmentValues} planData={data} open={openModal} handleClose={handleClose} />

                </div>
            </div>
        </>
    );
}

export default Finance;
