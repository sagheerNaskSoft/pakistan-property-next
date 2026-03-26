import AgencyByCity from '../Component/Agencies/AgencyByCity'
import AgencySlider from '../Component/Agencies/AgencySlider'
import Banner from '../Component/Agencies/Banner'
import Find from '../Component/Agencies/Find'
import PlatinumAgency from '../Component/Agencies/PlatinumAgency'
import FeaturedAgencies from '../Component/Agencies/FeaturedAgencies'
import Navbar from '../Component/NavBarFooter/UpdatedNavbar'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useEffect, useState } from 'react'
import { useAuth } from '../Context/ContextProvider'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function Agencies() {
    const navigate = useNavigate()
    const { featureAgency, citiesList, planAgency, agencyList,
        setAgencyArray } = useAuth()
    const cities = ["Karachi", "Islamabad", "Rawalpindi", "Lahore", "Faisalabad", "Multan"]
    const [citiesArray, setCitiesArray] = useState([])
    const [featureAgencyList, setFeatureAgencyList] = useState([])
    const [platinumAgencies, setPlatinumAgencies] = useState([])
    const [packageName, setPackageName] = useState("")
    const heading = 'Looking for popular Agencies?'
    const para = "Here's a list of agencies which are operating in different cities."
    const heading1 = 'Markaz Properties'
    const heading2 = 'Saiban Properties'
    const heading3 = 'Clan group of companies'
    const heading4 = 'Union Properties & developers'
    const heading5 = 'MS Real Estate'


    useEffect(() => {
        const featchFeatuerAgnecy = async () => {
            try {
                let newResult = await planAgency()

                if (newResult?.success) {
                    setPlatinumAgencies(newResult?.data?.data?.agencies)
                    setPackageName(newResult?.data?.data?.package)
                }
                let result = await featureAgency()
                if (result?.success) {
                    setFeatureAgencyList(result?.data?.data)
                }

            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }

        }
        featchFeatuerAgnecy()
    }, [])

    const searchData = async (dataValue) => {
        try {
            let result = await agencyList(dataValue);
            if (result?.success) {
                let propertyData = result?.data?.data?.agencies;
                setAgencyArray(propertyData)
                navigate('/agency-listing')
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };


    useEffect(() => {
        if (citiesList?.length) {
            const lowerCaseCities = cities.map(c => c.toLowerCase());

            const result = citiesList.filter(item =>
                lowerCaseCities.includes(item.city.toLowerCase())
            );

            setCitiesArray(result);
        }
    }, [citiesList]);

    return (
        <>
            <Helmet>
                <title>Top Real Estate Agencies in Pakistan - Verified Agents</title>
                <meta name="description" content="Find verified real estate agencies in Pakistan and connect with trusted property agents for expert help to buy, sell or invest in property with confidence." />
            </Helmet>
            <Navbar />
            <Banner searchData={searchData} />
            <div className="secondary-color">
                <div className="main-container">
                    <div className='agency-padding gap-container' style={{ paddingTop: "160px", display: 'grid', gap: "48px" }}>
                        <Find />
                        <AgencySlider />
                    </div>
                </div>
                <div className='agency-padding gap-container'>
                {platinumAgencies?.length > 0 && <PlatinumAgency agencyData={platinumAgencies} packageName={packageName} />}
                </div>
                <div className="main-container">
                    <div className='agency-padding gap-container' style={{  display: 'grid', gap: "48px" , marginTop:'40px'}}>
                        <AgencyByCity data={citiesArray} citiesName={cities} loading={!citiesList || citiesList.length === 0} />
                        {featureAgencyList?.length > 0 && <FeaturedAgencies agencyData={featureAgencyList} />}
                        <PreProperty heading={heading} heading1={heading1} heading2={heading2} heading3={heading3} heading4={heading4} heading5={heading5} para={para} />
                    </div>
                </div>
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </>
    )
}

export default Agencies
