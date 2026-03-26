import React from 'react'
import { Link } from 'react-router-dom'

function HomeDetail() {
    return (
        <div className='Rent-Property'>
            <h3>The #1 Platform for Finding the Best Properties in Pakistan</h3>
            <h4>
                Pakistan Property is created with the concept to find the <b>best properties in Pakistan</b> with ease. We are built to make property dealing easier, everywhere in Pakistan. Whether you need to buy, sell, or lease a home, shop, office, or land, the website brings comprehensive property categories together in one place. This is a classified portal where different agents, developers, and buyers can all connect to deal with their property matters.
            </h4>
            <h4>
                Carry out all your property dealings without any confusion or delays
            </h4>

            <h3>A Simple Platform to Search the Best Properties in Pakistan</h3>
            <h4>The traditional way to handle property-dealing tasks includes making multiple calls, disorganized information, and unclear details. We understand how challenging these dealings can be. This is why we offer a simple platform where agents can list properties, while buyers can easily browse, select, and purchase as needed.</h4>
            <h4>Each <Link to={"/property-for-sell"} ><span>property for sale</span></Link> listing consists of details, locations, associated amenities, images, and prices. This allows users to understand the property before making a call or visit. We aim to provide accurate information at the right time, so everyone can make the right decision.</h4>
            <h3>Multiple Listing Options for Everyone</h3>
            <ul className='rent-property-lis px-3'>
                <h4>Our property listings include different categories. This allows users to list or buy almost every type of real estate, including:</h4>

                <li>Commercial shops, offices, and buildings</li>
                <li>Residential homes, apartments, and plots</li>
                <li>Agricultural land and farmhouses</li>
                <li>Rental properties of all kinds</li>
                <li>Leasing and investment opportunities</li>

                <h4 style={{ marginTop: '28px' }}>
                    How’s this work? Sellers and agents can upload their listings in a few steps, while buyers can filter results based on location, price, and property type
                </h4>
            </ul>

            <h3>Easy Navigation With Clear Information</h3>
            <h4>
            The website interface is user-friendly and helps users browse property listings more easily. A user can search cities such as Karachi, Lahore, Islamabad, Rawalpindi, Multan, and more without wasting time. Each page, including <Link to={"/property-for-rent"}><span>property for rent</span></Link> , lease, or sale, helps you find the relevant property listing more easily.
            </h4>
            <h4>
            There are simple menus, clear categories, and well-designed listings. Even first-time users can understand how the platform works within minutes.
            </h4>

            <h3>Reliable, Helpful, and Updated</h3>
            <h4>
            Pakistan Property stays updated with the recent property market trends. The platform keeps improving its features as per the updated property standards. Instead of visiting multiple websites or dealing with unreliable information, you can find the updated listings here.
            </h4>
            <h4>From updated categories to improved listing tools, Pakistan Property ensures that you can get a helpful and trustworthy experience.</h4>

            <h3>Why Pakistan Property Is Trusted Across Pakistan</h3>
            <h4>The current real estate market has become quite complex and hard to deal with. With the lack of transparency and accessibility, it is hard to find reliable and trustworthy property listings. Pakistan Property offers a simple yet powerful solution. It reduces the usual stress of property searching and gives every user. Whether you’re looking for a <Link to={"/property-for-lease"}><span>property for lease</span></Link>, buy, or rent, this is a chance to find your dream property with ease.</h4>
        </div>
    )
}

export default HomeDetail
