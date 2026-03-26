import React, { useEffect, useState } from 'react'
import Banner from '../Component/PropertyIndexDetail/Banner'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import IndexDetail from '../Component/PropertyIndexDetail/IndexDetail'
import IndexAnalization from '../Component/PropertyIndexDetail/IndexAnalization'
import { useAuth } from '../Context/ContextProvider'
import { useLocation } from 'react-router-dom'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'

function PropertyIndexDetail() {
  const { filterPropertyIndex, citiesList, propertyType,locationList, parseQueryParams } = useAuth()
  const location = useLocation()
  const [data, setData] = useState()
  const [open, setOpen] = useState(false)
  const [parsedData,setParsedData]=useState({
    location:"",
    category:"",
    city:"",
    propertyType:""

  })
  const [filterData, setFilterData] = useState({
    purpose: "",
    city: "",

  });
  useEffect(() => {
    const fetchFilterIndexes = async () => {
      try {
        const parsed = await parseQueryParams(location.search);



        const result = await filterPropertyIndex(parsed)
        if (result?.success) {
          setData(result?.data?.data);

        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    fetchFilterIndexes()
  }, [location?.search])
  const [graphData, setGraphData] = useState([])
  const [activePeriod, setActivePeriod] = useState('year1_trend')
  const [selectedMonth, setSelectedMonth] = useState(null)
  
  // Reset selected month when period changes
  useEffect(() => {
    setSelectedMonth(null)
  }, [activePeriod])
  
  useEffect(()=>{
     const sortData=async()=>{
      const parsed = await parseQueryParams(location.search);
      const city = citiesList?.find((item) => {
        if (item?.app_code === parsed?.city_code) {
          return item
        }
      })
      const loaction = locationList?.find((item) => {
        if (item?.id === parseInt(parsed?.location_id)) {
          return item
        }
      })
      const propertyTypeId = propertyType?.find((item) => {
        if (item?.id === parseInt(parsed?.property_type_id)) {
          return item
        }
      })
      const category=propertyTypeId?.categories?.find((item)=>{
        if(item?.id===parseInt(parsed?.category_id)){
          return item
        }
      })
      setParsedData({
        propertyType:propertyTypeId,
        city: city,
        location:loaction,
        category:category,
      })
      setFilterData({
        purpose:propertyTypeId,
        city: city,
        location:loaction,
        category_id:category,
      })
     }
     sortData()
  },[citiesList,locationList,propertyType,location.search])
  
  return (
    <>
      <NavBar />
      <Banner filterData={filterData} setFilterData={setFilterData} open={open} setOpen={setOpen} />
      <div style={{padding:"1px"}} className='secondary-color'>
      <IndexDetail setOpen={setOpen} parsedData={parsedData} filterData={filterData} data={data} setGraphData={setGraphData} activePeriod={activePeriod} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
      <IndexAnalization otherData={data} graphData={graphData} activePeriod={activePeriod} setActivePeriod={setActivePeriod} selectedMonth={selectedMonth}/>
      <div className='main-container'>
      <PreLocation />
      <PreProperty />
      </div>
      </div>
      <div className='main-container'>
      <Footer/>
      </div>
      
    </>
  )
}

export default PropertyIndexDetail
