import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/ConstructionCostCalcualtor/Banner'
import Popular from '../Component/ConstructionCostCalcualtor/Popular'
import Footer from '../Component/NavBarFooter/Footer'
import Houce from '../Component/ConstructionCostCalcualtor/Houce'
import Cost from '../Component/ConstructionCostCalcualtor/Cost'
import { Helmet } from 'react-helmet'
function ConstructionCostCalcualtor() {
  return (
    <div>
      <Helmet>
        <title>Construction Cost Calculator Pakistan - Build Cost</title>
        <meta name="description" content="Use our construction cost calculator to get accurate estimates for building property in Pakistan. Check labour and finish costs to plan your property well." />
      </Helmet>
      <NavBar />
     <div className="secondary-color">
      <Banner />
     <Popular />
      <Houce />
      <Cost />
     </div>
      <div className="main-container">
        <Footer />
      </div>
    </div>
  )
}

export default ConstructionCostCalcualtor