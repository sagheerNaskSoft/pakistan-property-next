import React, { useEffect, useState } from 'react'
import UpdatedNavbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/HelpCenterPage/Banner'
import CategoryList from '../Component/HelpCenterPage/CategoryList'
import { useAuth } from '../Context/ContextProvider'
function HelpCenterPage() {
  const { getHelpCenterCategories } = useAuth()
  const [categories, setCategories] = useState([])
  useEffect(() => {
    getHelpCenterCategories().then((res) => {
      if (res.success) {
        setCategories(res.data?.data?.categories)
      }
    })
  }, [])
  return (
    <div>
        <UpdatedNavbar/>
        <Banner/>
        <div className='main-container'>
            <CategoryList categories={categories}/>
        <Footer/>
        </div>

    </div>
  )
}

export default HelpCenterPage