import Banner from '../Component/PropertyIndex/Banner'
import Navbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import PropertyPricing from '../Component/PropertyIndex/PropertyPricing'
import OverView from '../Component/PropertyIndex/OverView'
import FAQS from '../Component/PropertyIndex/FAQS'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import { useAuth } from '../Context/ContextProvider'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

function PropertyIndex() {
     const para = "Get clear answers to common questions about property listings, price trends, and investment in Pakistan. Learn how we help you find and compare properties with confidence."
    const faqData = [
        {
            question: "What is the purpose of the Pakistan Property Index?",
            answer:
                "The Pakistan Property Index helps users track real-time property prices and market trends across Pakistan. It shows average rates for houses, plots, and commercial properties. This tool gives buyers and investors a clear idea of current market values."
        },
        {
            question: "How does the Pakistan Property Index collect data?",
            answer:
                "Data in the Pakistan Property Index comes from verified property listings and user searches on Pakistan Property. This ensures that the information you see is accurate, updated, and based on real market activity."
        },
        {
            question: "Why should I use the Pakistan Property Index before buying or selling property?",
            answer:
                "By checking the Pakistan Property Index, you can compare current prices, track property demand, and see which areas are growing in value. This helps both buyers and sellers make smart, informed decisions."
        },
        {
            question: "How often is the Pakistan Property Index updated?",
            answer:
                "The Index is updated regularly to match market changes and user activity. This means you always have access to the most recent property price information in Pakistan."
        },
        {
            question: "Does the Pakistan Property Index cover all major cities?",
            answer:
                "Yes. The Pakistan Property Index includes data from Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and other major cities. You can easily compare prices between cities to understand regional property trends."
        }
    ];


    const { getPropertyIndex,currentCity } = useAuth()
    const [data, setData] = useState()
    useEffect(() => {
        const fetchIndexes = async () => {
            try {
                let result = await getPropertyIndex({
                    city_code:currentCity?.app_code
                })
                if (result?.success) {
                    setData(result?.data?.data)
                }
            } catch {

            }
        }
        fetchIndexes()
    }, [])

    const heading = "Browse homes available in top cities across Pakistan"
    const para2 = "Latest listings for sale and rent for housing societies and localities."
     const heading1 = "Find properties available in top cities"
    const para3 = "Find houses, flats, commercial plots, and rental options listed by trusted sellers and agents."

    return (
        <>
        <Helmet>
            <title>Pakistan Property Index - View Top Gainers & Losers</title>
            <meta name="description" content="Explore Pakistan Property Index to compare real-time prices, market trends, and demand shifts across major cities. Track top gainers and losers easily." />
        </Helmet>
            <Navbar />
            <div className="secondary-color">
                <Banner />
                <PropertyPricing area_wise={data?.area_wise} />
                <OverView subcategory_wise={data?.subcategory_wise} />
                <FAQS faqData={faqData} para={para} />
                <div className="main-container">
                    <PreLocation heading={heading} para={para2} />
                    <PreProperty heading={heading1} para={para3} />
                </div>
            </div>
            <div className="main-container">
                <Footer />
            </div>

        </>
    )
}

export default PropertyIndex
