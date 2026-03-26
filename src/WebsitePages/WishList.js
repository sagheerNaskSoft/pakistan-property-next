import React, { useEffect } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/WishList/Banner'
import { useAuth } from '../Context/ContextProvider'

function WishList() {
    const { fetchFavourites } = useAuth()
    useEffect(() => {
        fetchFavourites()
    }, [fetchFavourites])
    return (
        <div>
            <NavBar />


            <div className='secondary-color'>

                <div className='main-container'>
                    <Banner />
                    <PreLocation />
                    <PreProperty />
                </div>
            </div>
            <div className='main-container'>
                <Footer />
            </div>
        </div>
    )
}

export default WishList