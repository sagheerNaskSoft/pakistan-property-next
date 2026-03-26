import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/LoanCaluculator/DetailPage/Banner'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'
import Listing from '../Component/LoanCaluculator/DetailPage/Listing'

function LoanListing() {

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState()
 
    const { parseQueryParams, getLoansScheme, getAd,
        loanList,
        setLoanList, } = useAuth()
      const [addData, setAdData] = useState([]);
        useEffect(() => {
            const fetchProjects = async () => {
              try {
                const parsed = await parseQueryParams(location.search);
                setFilter(parsed);
          
                // Declare results
                let loanResult = null;
                let adResult = null;
          
                // Fetch only if data not already loaded
                if (!loanList?.data?.length) {
                  loanResult = await getLoansScheme();
                }
          
               
                  adResult = await getAd();
                  
          
                // Update states if responses are successful
                if (loanResult?.success) {
                  setLoanList(loanResult?.data?.data || []);
                }
          
                if (adResult?.success) {
                  setAdData(adResult?.data?.data || []);
                }
          
              } catch (error) {
                console.error("An error occurred while fetching data:", error);
              }
            };
          
            fetchProjects();
          }, [location.search]);
          
    return (
        <>
            <NavBar />
            <Banner open={open} setOpen={setOpen} data={filter} />
            <div className="secondary-color">
                <div className="main-container">
                    <Listing setFilterOpen={setOpen} setFilterData={setFilter} adData={addData} data={loanList} filterData={filter} />
                </div>
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </>
    )
}

export default LoanListing
