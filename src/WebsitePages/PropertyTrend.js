import Navbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/PropertyTrends/Banner'
import TopCities from '../Component/PropertyTrends/TopCities'
import TopLocations from '../Component/PropertyTrends/TopLocations'
import SearchedCities from '../Component/PropertyTrends/SearchedCities'
import TrendDetail from '../Component/PropertyTrends/TrendDetail'
import FAQS from '../Component/PropertyIndex/FAQS'
import { useAuth } from '../Context/ContextProvider'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function PropertyTrend() {
    const { getPropertyTrend, objectToQueryString } = useAuth()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true)
                const result = await getPropertyTrend()
                if (result?.success) {
                    setData(result?.data?.data)
                }
            } catch {
                console.error("something went wrong with API")
            } finally {
                setLoading(false)
            }
        }
        fetchTrends()
    }, [])


    const faqData = [
        {
            question: "Is Pakistan Property Trends reliable?",
            answer:
                "Yes. All data is gathered from verified listings and active user searches on Pakistan Property, ensuring you get trustworthy insights for your property decisions."
        },
        {
            question: "How can Pakistan Property Trends help property buyers and sellers?",
            answer:
                "Pakistan Property Trends helps buyers and sellers understand market prices and search activity in real time. By viewing trends for houses, plots, and commercial properties, users can make better pricing and investment choices."
        },
        {
            question: "Can I use Pakistan Property Trends to make investment decisions?",
            answer:
                "Absolutely. The platform highlights growing localities, price changes, and search activity, helping investors and buyers choose the right property at the right time."
        },
        {
            question: "How frequently is Pakistan Property Trends updated?",
            answer:
                "The data is updated regularly to reflect current market conditions and search patterns, ensuring you always have the most recent property insights."
        },
        {
            question: "Can I compare property prices between different cities?",
            answer:
                "Yes, Pakistan Property Trends allows you to compare property prices across major cities like Karachi, Lahore, and Islamabad. You can easily check which areas are more affordable or gaining value, helping you make better property decisions."
        }
    ];

    const para = "Get simple answers to common questions about property listings, prices, and market trends in Pakistan. This section helps you understand how Pakistan Property works, so you can search, compare, and manage your properties easily on our platform."
    const navigate = useNavigate()
    const handleNaviagte = async (data) => {
        const queryString = objectToQueryString(data);
        navigate(`/property-trend-detail?${queryString}`)
    }
    return (
        <>
              <Helmet>
        <title>Pakistan Property Trends & Market Insights - View Today</title>
        <meta name="description" content="View updated property trends in Pakistan. Compare popular areas, market activity, and demand insights to make confident and informed real estate decisions." />
        
      </Helmet>
            <Navbar />
            <Banner />
            <div className="secondary-color">
                <div className="main-container">
                    <TopCities handleNaviagte={handleNaviagte} data={data?.top_trending_cities || []} />
                    <TopLocations handleNaviagte={handleNaviagte} data={data?.top_trending_locations || []} />
                    <SearchedCities handleNaviagte={handleNaviagte} data={data?.by_category_trend} loading={loading} />
                    <TrendDetail />
                </div>
                <FAQS faqData={faqData} para={para} />
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </>
    )
}

export default PropertyTrend
