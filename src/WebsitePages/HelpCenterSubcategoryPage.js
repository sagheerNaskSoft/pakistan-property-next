import React, { useEffect, useState } from 'react'
import UpdatedNavbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/HelpCenterSubcategoryPage/Banner'
import { useParams } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'
function HelpCenterSubcategoryPage() {
  const { getHelpCenterSubcategories } = useAuth()
  const [subcategories, setSubcategories] = useState({})
  const { slug } = useParams()
  useEffect(() => {
    getHelpCenterSubcategories(slug).then((res) => {
      if (res.success) {
        setSubcategories(res.data?.data)
      }
    })
  }, [])
  return (
    <div>
        <UpdatedNavbar/>
        <Banner subcategories={subcategories}/>
        <div style={{backgroundColor:"#fff"}} className='main-container'>
            {/* <CategoryList/> */}
        <Footer/>
        </div>
    </div>
  )
}

export default HelpCenterSubcategoryPage