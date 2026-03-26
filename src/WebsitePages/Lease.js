import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/Buy_Rent_Lease_Material/Banner/Banner'
import { useEffect, useState, lazy, Suspense } from 'react'
import image from '../Asset/Buy_Rent_Lease/Lease.png'
import { useAuth } from '../Context/ContextProvider'
import { Helmet } from 'react-helmet'
import SpinerLoading from '../Component/Metiral/SpinerLoading'

// Lazy load below-the-fold components for better performance
const CitiesProperties = lazy(() => import('../Component/Buy_Rent_Lease_Material/CitiesProperties/CitiesProperties'))
const Process = lazy(() => import('../Component/Buy_Rent_Lease_Material/Process/Process'))
const PreLocation = lazy(() => import('../Component/HomePage/PreLocation'))
const PreProperty = lazy(() => import('../Component/HomePage/PreProperty'))
const Footer = lazy(() => import('../Component/NavBarFooter/Footer'))
const OurCommunity = lazy(() => import('../Component/HomePage/OurCommunity'))
const Solutions = lazy(() => import('../Component/Buy_Rent_Lease_Material/Solutions/Solutions'))
const Faq = lazy(() => import('../Component/Buy_Rent_Lease_Material/FAQ/Faq'))

const start = <svg xmlns="http://www.w3.org/2000/svg" width="217" height="80" viewBox="0 0 217 80" fill="none">
<g filter="url(#filter0_d_4053_131406)">
  <mask id="path-1-inside-1_4053_131406" fill="white">
    <path d="M196.344 1C197.953 1 199.406 1.96451 200.031 3.44777L214.347 37.4482C214.764 38.4406 214.764 39.5594 214.347 40.5518L200.031 74.5522C199.406 76.0355 197.953 77 196.344 77H6C3.79086 77 2 75.2091 2 73V5C2 2.79086 3.79086 1 6 1H196.344Z"/>
  </mask>
  <path d="M196.344 1C197.953 1 199.406 1.96451 200.031 3.44777L214.347 37.4482C214.764 38.4406 214.764 39.5594 214.347 40.5518L200.031 74.5522C199.406 76.0355 197.953 77 196.344 77H6C3.79086 77 2 75.2091 2 73V5C2 2.79086 3.79086 1 6 1H196.344Z" fill="#F0FAF2"/>
  <path d="M214.347 37.4482L215.268 37.0603L215.268 37.0602L214.347 37.4482ZM214.347 40.5518L215.268 40.9398L215.268 40.9397L214.347 40.5518ZM200.031 74.5522L199.109 74.1642L200.031 74.5522ZM200.031 3.44777L199.109 3.83583L200.031 3.44777ZM200.031 3.44777L199.109 3.83583L213.425 37.8363L214.347 37.4482L215.268 37.0602L200.952 3.05971L200.031 3.44777ZM214.347 37.4482L213.425 37.8362C213.738 38.5804 213.738 39.4196 213.425 40.1638L214.347 40.5518L215.268 40.9397C215.79 39.6993 215.79 38.3007 215.268 37.0603L214.347 37.4482ZM214.347 40.5518L213.425 40.1637L199.109 74.1642L200.031 74.5522L200.952 74.9403L215.268 40.9398L214.347 40.5518ZM196.344 77V76H6V77V78H196.344V77ZM2 73H3V5H2H1V73H2ZM6 1V2H196.344V1V0H6V1ZM6 77V76C4.34314 76 3 74.6569 3 73H2H1C1 75.7614 3.23857 78 6 78V77ZM200.031 74.5522L199.109 74.1642C198.641 75.2766 197.551 76 196.344 76V77V78C198.356 78 200.172 76.7944 200.952 74.9403L200.031 74.5522ZM2 5H3C3 3.34314 4.34315 2 6 2V1V0C3.23858 0 1 2.23857 1 5H2ZM200.031 3.44777L200.952 3.05971C200.172 1.20564 198.356 0 196.344 0V1V2C197.551 2 198.641 2.72339 199.109 3.83583L200.031 3.44777Z" fill="#447158" mask="url(#path-1-inside-1_4053_131406)"/>
</g>
<defs>
  <filter id="filter0_d_4053_131406" x="0" y="0" width="216.66" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4053_131406"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4053_131406" result="shape"/>
  </filter>
</defs>
</svg>

const mid = <svg xmlns="http://www.w3.org/2000/svg" width="215" height="80" viewBox="0 0 215 80" fill="none">
<g filter="url(#filter0_d_4053_131414)">
  <mask id="path-1-inside-1_4053_131414" fill="white">
    <path d="M194.324 1C195.933 1 197.386 1.96451 198.01 3.44777L212.326 37.4482C212.744 38.4406 212.744 39.5594 212.326 40.5518L198.01 74.5522C197.386 76.0355 195.933 77 194.324 77H6.00382C3.1431 77 1.20716 74.0843 2.31728 71.4478L15.3262 40.5518C15.7438 39.5594 15.7438 38.4406 15.3262 37.4482L2.31728 6.55223C1.20716 3.9157 3.1431 1 6.00382 1H194.324Z"/>
  </mask>
  <path d="M194.324 1C195.933 1 197.386 1.96451 198.01 3.44777L212.326 37.4482C212.744 38.4406 212.744 39.5594 212.326 40.5518L198.01 74.5522C197.386 76.0355 195.933 77 194.324 77H6.00382C3.1431 77 1.20716 74.0843 2.31728 71.4478L15.3262 40.5518C15.7438 39.5594 15.7438 38.4406 15.3262 37.4482L2.31728 6.55223C1.20716 3.9157 3.1431 1 6.00382 1H194.324Z" fill="#F0FAF2"/>
  <path d="M212.326 37.4482L213.248 37.0603L213.248 37.0602L212.326 37.4482ZM212.326 40.5518L213.248 40.9398L213.248 40.9397L212.326 40.5518ZM15.3262 40.5518L16.2478 40.9398L16.2479 40.9397L15.3262 40.5518ZM15.3262 37.4482L16.2479 37.0603L16.2478 37.0602L15.3262 37.4482ZM2.31728 71.4478L1.39565 71.0597L2.31728 71.4478ZM198.01 74.5522L197.089 74.1642L198.01 74.5522ZM198.01 3.44777L197.089 3.83583L198.01 3.44777ZM198.01 3.44777L197.089 3.83583L211.405 37.8363L212.326 37.4482L213.248 37.0602L198.932 3.05971L198.01 3.44777ZM212.326 37.4482L211.404 37.8362C211.718 38.5805 211.718 39.4195 211.404 40.1638L212.326 40.5518L213.248 40.9397C213.77 39.6992 213.77 38.3008 213.248 37.0603L212.326 37.4482ZM212.326 40.5518L211.405 40.1637L197.089 74.1642L198.01 74.5522L198.932 74.9403L213.248 40.9398L212.326 40.5518ZM194.324 77V76H6.00382V77V78H194.324V77ZM2.31728 71.4478L3.23892 71.8358L16.2478 40.9398L15.3262 40.5518L14.4045 40.1637L1.39565 71.0597L2.31728 71.4478ZM15.3262 40.5518L16.2479 40.9397C16.7699 39.6993 16.7699 38.3007 16.2479 37.0603L15.3262 37.4482L14.4045 37.8362C14.7177 38.5804 14.7177 39.4196 14.4045 40.1638L15.3262 40.5518ZM15.3262 37.4482L16.2478 37.0602L3.23892 6.16418L2.31728 6.55223L1.39565 6.94029L14.4045 37.8363L15.3262 37.4482ZM6.00382 1V2H194.324V1V0H6.00382V1ZM2.31728 6.55223L3.23892 6.16418C2.40632 4.18677 3.85828 2 6.00382 2V1V0C2.42792 0 0.00799167 3.64462 1.39565 6.94029L2.31728 6.55223ZM6.00382 77V76C3.85828 76 2.40632 73.8132 3.23892 71.8358L2.31728 71.4478L1.39565 71.0597C0.00799143 74.3554 2.42792 78 6.00382 78V77ZM198.01 74.5522L197.089 74.1642C196.62 75.2766 195.531 76 194.324 76V77V78C196.335 78 198.151 76.7944 198.932 74.9403L198.01 74.5522ZM198.01 3.44777L198.932 3.05971C198.151 1.20564 196.335 0 194.324 0V1V2C195.531 2 196.62 2.72339 197.089 3.83583L198.01 3.44777Z" fill="#447158" mask="url(#path-1-inside-1_4053_131414)"/>
</g>
<defs>
  <filter id="filter0_d_4053_131414" x="0" y="0" width="214.641" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4053_131414"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4053_131414" result="shape"/>
  </filter>
</defs>
</svg>

const end =<svg xmlns="http://www.w3.org/2000/svg" width="199" height="80" viewBox="0 0 199 80" fill="none">
<g filter="url(#filter0_d_4053_131454)">
  <mask id="path-1-inside-1_4053_131454" fill="white">
    <path d="M196.979 73C196.979 75.2091 195.189 77 192.979 77H6.00382C3.1431 77 1.20716 74.0843 2.31728 71.4478L15.3262 40.5518C15.7438 39.5594 15.7438 38.4406 15.3262 37.4482L2.31728 6.55223C1.20716 3.9157 3.1431 1 6.00382 1H192.979C195.189 1 196.979 2.79086 196.979 5V73Z"/>
  </mask>
  <path d="M196.979 73C196.979 75.2091 195.189 77 192.979 77H6.00382C3.1431 77 1.20716 74.0843 2.31728 71.4478L15.3262 40.5518C15.7438 39.5594 15.7438 38.4406 15.3262 37.4482L2.31728 6.55223C1.20716 3.9157 3.1431 1 6.00382 1H192.979C195.189 1 196.979 2.79086 196.979 5V73Z" fill="#F0FAF2"/>
  <path d="M15.3262 40.5518L16.2478 40.9398L16.2479 40.9397L15.3262 40.5518ZM15.3262 37.4482L16.2479 37.0603L16.2478 37.0602L15.3262 37.4482ZM2.31728 71.4478L1.39565 71.0597L2.31728 71.4478ZM192.979 77V76H6.00382V77V78H192.979V77ZM2.31728 71.4478L3.23892 71.8358L16.2478 40.9398L15.3262 40.5518L14.4045 40.1637L1.39565 71.0597L2.31728 71.4478ZM15.3262 40.5518L16.2479 40.9397C16.7699 39.6993 16.7699 38.3007 16.2479 37.0603L15.3262 37.4482L14.4045 37.8362C14.7177 38.5804 14.7177 39.4196 14.4045 40.1638L15.3262 40.5518ZM15.3262 37.4482L16.2478 37.0602L3.23892 6.16418L2.31728 6.55223L1.39565 6.94029L14.4045 37.8363L15.3262 37.4482ZM6.00382 1V2H192.979V1V0H6.00382V1ZM196.979 5H195.979V73H196.979H197.979V5H196.979ZM2.31728 6.55223L3.23892 6.16418C2.40632 4.18677 3.85828 2 6.00382 2V1V0C2.42792 0 0.00799167 3.64462 1.39565 6.94029L2.31728 6.55223ZM6.00382 77V76C3.85828 76 2.40632 73.8132 3.23892 71.8358L2.31728 71.4478L1.39565 71.0597C0.00799143 74.3554 2.42792 78 6.00382 78V77ZM192.979 1V2C194.636 2 195.979 3.34315 195.979 5H196.979H197.979C197.979 2.23858 195.741 0 192.979 0V1ZM192.979 77V78C195.741 78 197.979 75.7614 197.979 73H196.979H195.979C195.979 74.6569 194.636 76 192.979 76V77Z" fill="#447158" mask="url(#path-1-inside-1_4053_131454)"/>
</g>
<defs>
  <filter id="filter0_d_4053_131454" x="0" y="0" width="198.98" height="80" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4053_131454"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4053_131454" result="shape"/>
  </filter>
</defs>
</svg>


function Lease() {

    const faqData = [
        { question: "What’s the difference between leasing and renting?", answer: 'Renting is usually short-term, like monthly or yearly agreements. Leasing is longer-term and often includes fixed terms, payment plans, and detailed conditions.' },
        { question: "Can residential and commercial spaces be leased?", answer: 'Yes, different property options can be leased, like homes and business spaces. It depends on your needs and the type of property available.' },
        { question: "Is a security deposit required for leasing?", answer: 'Usually yes. Most lease agreements need a refundable security deposit before you move in or start using the space.' },
        { question: "What are my options when the lease term ends?", answer: 'You can renew the lease, end the agreement, or sign a new one if both parties agree on the terms.' },
        { question: "Can I terminate my lease agreement early if my plans change?", answer: 'Yes, but it depends on your lease agreement. Some leases allow early termination with notice or a small penalty, while others require completing the full term.' },
    ]
    const para2 = "Leasing a property may seem confusing at first. This section of answers to common questions about lease terms, payments, and renewals will help you understand the process and make the right choice for property leasing."
    const [filterData, setFilterData] = useState({
        city: '',
        search: [],
        priceRange: {
            min: "",
            max: "",
            priceValue: "PKR"
        },
        areaRange: {
            min: "",
            max: "",
            areaValue: {id: 4, name: "Marla", code: "marla"}
        },
        propertyType: {
            type: "",
            subType: []
        }
    })
    const pageType = "lease"
    const breadcrumb = 'For Lease'
    const heading = 'Properties for Lease in Pakistan'
    const para = <>Connect with verified listings and the latest leasing opportunities. Explore a wide selection of <b>properties for lease in Pakistan</b> across Pakistan’s top locations on the Pakistan Property platform.</>
const exploreTitle = "for Lease"
    const cardType = ['Commercial Properties', "Residential Properties", "Plots"]
    const { propertiesByType } = useAuth()

    const [propertyData, setPropertyData] = useState({})
    useEffect(() => {
        const page_slug = window?.location?.pathname?.split("/property-for-")[1]


        const fetchProperty = async () => {
            try {
                // Fetch Cities
                let result = await propertiesByType(page_slug);
                if (result?.success) {
                    setPropertyData(result?.data?.data?.properties_by_city)
                }


            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };

        fetchProperty()

    }, [])
    const [propertySubType, setPropertySubType] = useState([])

    const data = [
        { img: start, backNumber: "1", heading: "Browse Listings", para:"Find lease listings by area and price." },
        { img: mid, backNumber: "2", heading: "Plan a Visit", para: "Book a time to inspect the property." },
        { img: mid, backNumber: "3", heading: "Review Lease Terms", para: "Check duration, cost, and conditions." },
        { img: mid, backNumber: "4", heading: "Submit Documents", para: "Provide ID & required verification papers." },
        { img: mid, backNumber: "5", heading: "Sign Lease Agreement", para: "Complete paperwork to confirm lease." },
        { img: end, backNumber: "6", heading: "Begin Setup", para:<>Get your leased space & begin setup.</> },
    ]

    const processData = {
        heading: 'Quick Guide to Leasing Property in Pakistan',
        para: <>
            Leasing a property in Pakistan is now straightforward and secure. The simple portal will help you find the right space, compare lease options, and finalize documentation with ease. Whether you're a business owner or tenant, <b>PakistanProperty.com lease listings</b> connect you with trusted agents and transparent leasing terms.</>
    }
    return (
        <>
        <Helmet>
                <title>Properties for Lease in Pakistan - Ideal Properties</title>
                <meta name="description" content="Browse properties for lease in Pakistan with verified commercial units, offices, and shops available for flexible terms designed for business needs."/>
            </Helmet>
            <NavBar />
            <div className="secondary-color">
                <div className="main-container gap-container" style={{ display: "flex", flexDirection: "column", gap: "40px 0" }} >

                    <Banner setPropertySubType={setPropertySubType} propertySubType={propertySubType} pageType={pageType} breadcrumb={breadcrumb} heading={heading} para={para} filterData={filterData} setFilterData={setFilterData} image={image} />
                    
                    <Suspense fallback={<SpinerLoading />}>
                        <Solutions />
                    </Suspense>
                    
                    {propertyData?.["Lahore"]?.length > 0 && (
                        <Suspense fallback={<></>}>
                            <CitiesProperties propertyData={propertyData?.["Lahore"]} heading={"Lease in Lahore"} tabMenu={cardType} />
                        </Suspense>
                    )}
                    {propertyData?.["Islamabad"]?.length > 0 && (
                        <Suspense fallback={<></>}>
                            <CitiesProperties propertyData={propertyData?.["Islamabad"]} heading={"Lease in Islamabad"} tabMenu={cardType} />
                        </Suspense>
                    )}
                    {propertyData?.["Karachi"]?.length > 0 && (
                        <Suspense fallback={<></>}>
                            <CitiesProperties propertyData={propertyData?.["Karachi"]} heading={"Lease in Karachi"} tabMenu={cardType} />
                        </Suspense>
                    )}
                    
                    <Suspense fallback={<></>}>
                        <Process data={data} processData={processData}  />
                    </Suspense>
                    
                    <Suspense fallback={<></>}>
                        <Faq faqData={faqData} para={para2} />
                    </Suspense>
                    
                    <Suspense fallback={<></>}>
                        <OurCommunity heading={"Find out more about Buying a property"} />
                    </Suspense>
                    
                    <Suspense fallback={<></>}>
                        <PreLocation />
                    </Suspense>
                    
                    <Suspense fallback={<></>}>
                        <PreProperty />
                    </Suspense>

                </div>
            </div>
            <div className='main-container'>
                <Suspense fallback={<SpinerLoading />}>
                    <Footer />
                </Suspense>
            </div>
        </>
    )
}

export default Lease
