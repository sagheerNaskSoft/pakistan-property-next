import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/ProjectListing/Banner'
import LisitngSection from '../Component/ProjectListing/LisitngSection'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'

function ProjectListing() {
  const location = useLocation();
  const [open, setOpen] = useState(false)
  const { getProjectsListing, parseQueryParams, currencyRates,loadingRates,areaUnit, citiesList, } = useAuth()
  const [projectList, setProjectList] = React.useState( [] )
  const [cityName, setCityName] = useState(null)
  const [filter, setFilter] = useState(null)
  const [filterData, setFilterData] = useState({
    purpose: "",
    city: "",
    searchDeveloper: [],
    searchProject: [],
    marketedByPP: "",
    priceRange: {
      min: "",
      max: "",
      priceValue: "PKR"
    },
    areaRange: {
      min: "",
      max: "",
      areaValue: "Marla"
    },
    propertyType: {
      type: "",
      subType: []
    }
  })
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 0,
  })
  // Add currencyRates state and load from open.er-api.com

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const parsed = await parseQueryParams(location.search);
        const cityResult = await getProjectsListing(parsed);
        setProjectList(cityResult?.data?.data?.projects);
        setPagination(cityResult?.data?.data?.pagination);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    fetchProjects()
    // eslint-disable-next-line
  }, [location.search])
  useEffect(() => {
    const updateFilterData = async () => {

      const parsed = await parseQueryParams(location.search);
      let cityName = citiesList?.find(item => item?.app_code === parsed?.city_code);
      setCityName(cityName?.city)
      setFilter(parsed)
      setFilterData(prevFilterData => ({
        ...prevFilterData,
        city: cityName,
        developer_title: parsed?.developer_title,
        project_title: parsed?.project_title,
        propertyType: {
          type: parsed?.category_id,
          subType: parsed?.sub_category_id,

        },
        priceRange: {
          min: parsed?.min_price,
          max: parsed?.max_price,
          priceValue: {
            id: parsed?.currency,
            name: parsed?.currency,
            code: "pkr"
          }
        },
        areaRange: {
          min: parsed?.area_min,
          max: parsed?.area_max,
          areaValue:areaUnit?.find((item) => item?.id === Number(parsed?.unit_area)),
        },
        current_page: parsed?.current_page,
        per_page: parsed?.per_page,
      }))

    }
    updateFilterData()
  }, [location.search, citiesList,areaUnit])
  // Set body style for modal/side-sheet open
  useEffect(() => {
    if (open) {
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [open]);
  
  return (
    <div>
      <NavBar />
          <Banner open={open} setOpen={setOpen} setFilterData={setFilterData} filterData={filterData} />
      <div style={{ padding: "1px" }} className='secondary-color'>
        <div className='main-container'>
          <LisitngSection
            open={open}
            setOpen={setOpen}
            data={filter}
            pagination={pagination}
            projectList={projectList}
            cityName={cityName}
            filterData={filterData}
            setFilterData={setFilterData}
            currencyRates={currencyRates}
            loadingRates={loadingRates}
          />
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

export default ProjectListing