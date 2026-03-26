import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function PropertyText({ Purpose, City }) {
    const location = useLocation()
    const [change, setChange] = useState(false)

    useEffect(() => {
        if (location.pathname === '/properties/new') {
            setChange(true)
        } else {
            setChange(false)
        }
    }, [location.pathname])

    const text = [
        {
            heading: "Properties for Rent in Lahore",
            para: " Looking for rental properties in Lahore? Whether you're after a furnished apartment, a spacious house, or a commercial space, Lahore offers a wide range of rental options across every budget. Explore listings in popular areas like DHA, Gulberg, and Bahria Town with up-to-date prices and verified listings.",
        },
        {
            heading: "About Lahore – The Heart of Punjab",
            para: " Lahore is a city rich in culture, history, and economic opportunity. As the provincial capital of Punjab, it combines modern infrastructure with timeless architecture. With thriving educational institutions, vibrant commercial hubs, and a warm community, Lahore is ideal for both living and investing.",
        },
        {
            heading: " Popular Areas to Rent in Lahore",
            para: " Some of the most in-demand areas in Lahore include DHA, Model Town, Bahria Town, and Gulshan-e-Ravi. These locations are known for their planned layouts, security, and access to schools, hospitals, and shopping centers. Each area offers a unique lifestyle tailored to different needs.",
        },
        {
            heading: " Why Choose Lahore for Your Next Home or Business",
            para: " From upscale residential zones to commercial hotspots, Lahore offers immense potential for both renters and investors. With continuous urban development, easy connectivity, and a growing job market, it's one of Pakistan’s top choices for settling or starting a business.",
        },
    ]

    const text1 = [
        {
            heading: "Buy New Properties in Pakistan with Confidence",
            para: <>
                Looking for <b>new properties in Pakistan</b> that match your investment plan? Pakistan Property makes it simple to find homes, apartments, and commercial spaces across the country. Whether you need a modern apartment, a family home, or a commercial unit, we have it all. Our verified listings connect you with trusted sellers and agents. <br /> <br />
                With prime locations, modern designs, and high investment potential, Pakistan Property helps you make the right choice for a secure future.
            </>,
        },
        {
            heading: "Emerging Market Trends in New Properties in Pakistan",
            para: <>
                The property market in Pakistan is growing fast. It now offers more options and better value for buyers and investors. From major cities to new housing communities, Pakistan Property lists ready-to-move properties that combine modern amenities with financial growth. <br /> <br />
                With upgraded facilities, new roads, and rising buyer demand, we present the right portal to buy or invest in property.
            </>,
        },
        {
            heading: " Top Areas to Buy Property in Pakistan",
            para: <>
                At Pakistan Property, we feature listings from the most in-demand locations. Explore the <b>latest properties in Pakistan</b>, including DHA, Bahria Town, Gulberg, and more. These areas are known for secure living, advanced facilities, and high rental returns. We list the most reliable listings that match your budget and goals. <br /> <br />
                Be it a furnished apartment, a residential house, or a commercial space, our listings cover Pakistan’s leading property locations.
            </>,
        },
        {
            heading: "New Properties That Bring Long-Term Value",
            para: <>
                With the continuous growth of real estate in Pakistan, owning property is more than a purchase. It’s a practical investment to secure more profits in the future. Through Pakistan Property, you get authentic listings, fair prices, and expert support that simplify your property buying. <br /> <br />
                We help you find the properties that deliver satisfaction and long-term value.
            </>,
        },
    ]



    return (
        <>
            <div className="property-text">
                <div className="main-container">
                    <div className="row m-0">
                        <div className="text-box">

                            <div className="box" >
                                <div className="heading">Property for {Purpose} in {City}
                                </div>
                                <div className="para">Finding the right property for {Purpose} in {City} is easy with the wide range of active listings available in the city. From residential options to commercial spaces, {City} offers strong real estate activity, reliable locations, and steady demand, making it a preferred choice for many buyers, renters, and investors across Pakistan. Each listing provides essential details, price information, and direct contact options to help you make a confident decision.
                                </div>
                                <div className="heading">Discover Real Estate Opportunities in {City}
                                </div>
                                <div className="para">{City} is known for its diverse neighborhoods, expanding development, and access to essential facilities like schools, markets, healthcare, and major road networks. Whether you are exploring central areas or new upcoming locations, the real estate market in {City} continues to grow with opportunities suitable for different needs and budgets. The city attracts individuals, families, and businesses looking for reliable property options.

                                </div>
                                <div className="heading">Real Estate Market Insight for {Purpose} in {City}

                                </div>
                                <div className="para">Property offered for {Purpose} in {City} covers a broad range of choices designed for living, business, or investment use. Many areas in the city are known for their strong infrastructure, secure environment, and long-term value. Whether you are looking for convenience, potential return, or a strategic location, {City} provides a variety of options backed by an active and stable market.

                                </div>
                                <div className="heading">Why Choose Property in {City}?
                                </div>
                                <div className="para">
                                    <ul>
                                        <li>Well-established and developing areas
                                        </li>
                                        <li>Access to commercial hubs and main roads</li>
                                        <li>Competitive prices across different locations</li>
                                        <li>Continuous construction and new projects</li>
                                        <li>Strong rental and resale demand</li>
                                        <li>Safe and community-friendly zones</li>
                                    </ul>
                                </div>
                                <div className="para">
                                        These advantages make {City} a strong destination for anyone searching for property suitable for {Purpose}.
                                </div>
                                <div className="heading">Start Exploring Property Options in {City}

                                </div>
                                <div className="para">With updated real-estate listings and easy access to property details, you can explore different price points, locations, and features within {City}. Whether your goal is personal living, business setup, or long-term investment, the city offers reliable choices to match your requirements and future plans.
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PropertyText
