import { createContext, useContext, useEffect, useState, useCallback } from "react";
import PPWatermark from '../AgentPortal/Asset/PP-Watermark.png';
import citiesJsonData from '../citiesLocation/citiesList/cities.json';
export const Authdata = createContext();
export const Authprovider = ({ children }) => {
  const [callingCode, setCallingCode] = useState();
  const [loginData, setLogindata] = useState(JSON.parse(localStorage.getItem("agent_data")) ? JSON.parse(localStorage.getItem("agent_data")) : null)
  let userData = loginData ? loginData : JSON.parse(localStorage.getItem("agent_data"))
  let ceoLogin = JSON.parse(localStorage.getItem("ceo_profile")) || null
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [currencyRates, setCurrencyRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(true);
  const [backtoSearchContentState, setBacktoSearchContentState] = useState(() => {
    const saved = localStorage.getItem('backtoSearchContentState');
    return saved ? JSON.parse(saved) : null;
  })
  const [device_token, setDeviceToken] = useState()
  const [propertyType, setPropertyType] = useState([
    {
      "id": 1,
      "name": "Sell",
      "slug": "sell",
      "categories": [
        {
          "id": 1,
          "name": "Home",
          "sub_categories": [
            {
              "id": 1,
              "category_id": 1,
              "name": "House",
              "slug": "house",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10302\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10303\/Frame-1984078029.svg"
            },
            {
              "id": 2,
              "category_id": 1,
              "name": "Flat",
              "slug": "flat",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10305\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10306\/Frame-1984078029.svg"
            },
            {
              "id": 3,
              "category_id": 1,
              "name": "Upper Portion",
              "slug": "upper-portion",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4547\/upper-potion-hover.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4548\/upper-potion.png"
            },
            {
              "id": 4,
              "category_id": 1,
              "name": "Lower Portion",
              "slug": "lower-portion",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4358\/lower-portion.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4359\/lower-hover-portion.png"
            },
            {
              "id": 5,
              "category_id": 1,
              "name": "Farm House",
              "slug": "farm-house",
              "color": "#d8fca5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9498\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9499\/Frame-1984078029-(2).png"
            },
            {
              "id": 6,
              "category_id": 1,
              "name": "Room",
              "slug": "room",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10217\/Frame-1984078029-(2).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10218\/Room1.png"
            },
            {
              "id": 7,
              "category_id": 1,
              "name": "Penthouse",
              "slug": "penthouse",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9500\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9501\/Frame-1984078029-(2).png"
            }
          ]
        },
        {
          "id": 2,
          "name": "Plots",
          "sub_categories": [
            {
              "id": 8,
              "category_id": 2,
              "name": "Residential Plot",
              "slug": "residential-plot",
              "color": "#a4ccfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4429\/Residential-Plots.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4430\/Residential-Plots-hover.png"
            },
            {
              "id": 9,
              "category_id": 2,
              "name": "Commercial Plot",
              "slug": "commercial-plot",
              "color": "#f7cda0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3764\/com_plot.svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3765\/com_plot_hover.svg"
            },
            {
              "id": 10,
              "category_id": 2,
              "name": "Agricultural Land",
              "slug": "agricultural-land",
              "color": "#d8fca5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3767\/Frame-1984078029-(8).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3768\/Frame-1984078029-(9).png"
            },
            {
              "id": 11,
              "category_id": 2,
              "name": "Industrial Land",
              "slug": "industrial-land",
              "color": "#d8fdd1",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3769\/Frame-1984078029-(6).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3770\/Frame-1984078029-(7).png"
            },
            {
              "id": 12,
              "category_id": 2,
              "name": "Plot File",
              "slug": "plot-file",
              "color": "#d8fdd1",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10310\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10311\/Frame-1984078029.svg"
            },
            {
              "id": 13,
              "category_id": 2,
              "name": "Plot Form",
              "slug": "plot-form",
              "color": "#a4ccfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10312\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10313\/Frame-1984078029.svg"
            }
          ]
        },
        {
          "id": 3,
          "name": "Commercial",
          "sub_categories": [
            {
              "id": 14,
              "category_id": 3,
              "name": "Office",
              "slug": "office",
              "color": "#ddd697",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10228\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10229\/Frame-1984078029-(4).png"
            },
            {
              "id": 15,
              "category_id": 3,
              "name": "Shop",
              "slug": "shop",
              "color": "#fac7c5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3773\/shop.svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3774\/shop_hover.svg"
            },
            {
              "id": 16,
              "category_id": 3,
              "name": "Warehouse Portion",
              "slug": "warehouse-portion",
              "color": "#b4fcd0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3775\/Frame-1984078029-(4).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3776\/Frame-1984078029-(5).png"
            },
            {
              "id": 17,
              "category_id": 3,
              "name": "Factory",
              "slug": "factory",
              "color": "#ef9fca",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4442\/factory.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4443\/factory-hover.png"
            },
            {
              "id": 18,
              "category_id": 3,
              "name": "Building",
              "slug": "building",
              "color": "#9886e4",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10314\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10315\/Frame-1984078029.svg"
            },
            {
              "id": 19,
              "category_id": 3,
              "name": "Other",
              "slug": "other",
              "color": "#f7cda0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9467\/Frame-1984078029-(1).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9468\/Frame-1984078029.png"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "Rent",
      "slug": "rent",
      "categories": [
        {
          "id": 1,
          "name": "Home",
          "sub_categories": [
            {
              "id": 1,
              "category_id": 1,
              "name": "House",
              "slug": "house",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10302\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10303\/Frame-1984078029.svg"
            },
            {
              "id": 2,
              "category_id": 1,
              "name": "Flat",
              "slug": "flat",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10305\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10306\/Frame-1984078029.svg"
            },
            {
              "id": 3,
              "category_id": 1,
              "name": "Upper Portion",
              "slug": "upper-portion",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4547\/upper-potion-hover.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4548\/upper-potion.png"
            },
            {
              "id": 4,
              "category_id": 1,
              "name": "Lower Portion",
              "slug": "lower-portion",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4358\/lower-portion.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4359\/lower-hover-portion.png"
            },
            {
              "id": 5,
              "category_id": 1,
              "name": "Farm House",
              "slug": "farm-house",
              "color": "#d8fca5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9498\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9499\/Frame-1984078029-(2).png"
            },
            {
              "id": 6,
              "category_id": 1,
              "name": "Room",
              "slug": "room",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10217\/Frame-1984078029-(2).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10218\/Room1.png"
            },
            {
              "id": 7,
              "category_id": 1,
              "name": "Penthouse",
              "slug": "penthouse",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9500\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9501\/Frame-1984078029-(2).png"
            }
          ]
        },
        {
          "id": 3,
          "name": "Commercial",
          "sub_categories": [
            {
              "id": 14,
              "category_id": 3,
              "name": "Office",
              "slug": "office",
              "color": "#ddd697",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10228\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10229\/Frame-1984078029-(4).png"
            },
            {
              "id": 15,
              "category_id": 3,
              "name": "Shop",
              "slug": "shop",
              "color": "#fac7c5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3773\/shop.svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3774\/shop_hover.svg"
            },
            {
              "id": 16,
              "category_id": 3,
              "name": "Warehouse Portion",
              "slug": "warehouse-portion",
              "color": "#b4fcd0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3775\/Frame-1984078029-(4).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3776\/Frame-1984078029-(5).png"
            },
            {
              "id": 17,
              "category_id": 3,
              "name": "Factory",
              "slug": "factory",
              "color": "#ef9fca",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4442\/factory.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4443\/factory-hover.png"
            },
            {
              "id": 18,
              "category_id": 3,
              "name": "Building",
              "slug": "building",
              "color": "#9886e4",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10314\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10315\/Frame-1984078029.svg"
            },
            {
              "id": 19,
              "category_id": 3,
              "name": "Other",
              "slug": "other",
              "color": "#f7cda0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9467\/Frame-1984078029-(1).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9468\/Frame-1984078029.png"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "Lease",
      "slug": "lease",
      "categories": [
        {
          "id": 1,
          "name": "Home",
          "sub_categories": [
            {
              "id": 1,
              "category_id": 1,
              "name": "House",
              "slug": "house",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10302\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10303\/Frame-1984078029.svg"
            },
            {
              "id": 2,
              "category_id": 1,
              "name": "Flat",
              "slug": "flat",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10305\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10306\/Frame-1984078029.svg"
            },
            {
              "id": 3,
              "category_id": 1,
              "name": "Upper Portion",
              "slug": "upper-portion",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4547\/upper-potion-hover.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4548\/upper-potion.png"
            },
            {
              "id": 4,
              "category_id": 1,
              "name": "Lower Portion",
              "slug": "lower-portion",
              "color": "#d7fefe",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4358\/lower-portion.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4359\/lower-hover-portion.png"
            },
            {
              "id": 5,
              "category_id": 1,
              "name": "Farm House",
              "slug": "farm-house",
              "color": "#d8fca5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9498\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9499\/Frame-1984078029-(2).png"
            },
            {
              "id": 6,
              "category_id": 1,
              "name": "Room",
              "slug": "room",
              "color": "#f7c6ff",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10217\/Frame-1984078029-(2).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10218\/Room1.png"
            },
            {
              "id": 7,
              "category_id": 1,
              "name": "Penthouse",
              "slug": "penthouse",
              "color": "#cccdfb",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9500\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9501\/Frame-1984078029-(2).png"
            }
          ]
        },
        {
          "id": 3,
          "name": "Commercial",
          "sub_categories": [
            {
              "id": 14,
              "category_id": 3,
              "name": "Office",
              "slug": "office",
              "color": "#ddd697",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10228\/Frame-1984078029-(3).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10229\/Frame-1984078029-(4).png"
            },
            {
              "id": 15,
              "category_id": 3,
              "name": "Shop",
              "slug": "shop",
              "color": "#fac7c5",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3773\/shop.svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3774\/shop_hover.svg"
            },
            {
              "id": 16,
              "category_id": 3,
              "name": "Warehouse Portion",
              "slug": "warehouse-portion",
              "color": "#b4fcd0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/3775\/Frame-1984078029-(4).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/3776\/Frame-1984078029-(5).png"
            },
            {
              "id": 17,
              "category_id": 3,
              "name": "Factory",
              "slug": "factory",
              "color": "#ef9fca",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/4442\/factory.png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/4443\/factory-hover.png"
            },
            {
              "id": 18,
              "category_id": 3,
              "name": "Building",
              "slug": "building",
              "color": "#9886e4",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/10314\/Frame-1984078029-(1).svg",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/10315\/Frame-1984078029.svg"
            },
            {
              "id": 19,
              "category_id": 3,
              "name": "Other",
              "slug": "other",
              "color": "#f7cda0",
              "image": "https:\/\/dev.pakistanproperty.com\/storage\/9467\/Frame-1984078029-(1).png",
              "hover_image": "https:\/\/dev.pakistanproperty.com\/storage\/9468\/Frame-1984078029.png"
            }
          ]
        }
      ]
    }
  ])
  const [citiesList, setCitiesList] = useState([])
  const [locationList, setLocationList] = useState([])
  const [propertyData, setPropertyData] = useState([])
  const [preLocationData, setpreLoactionData] = useState([])
  const [prePropertyData, setprePropertyData] = useState([])
  const [aminitiesLoding, setAminitiesloading] = useState(false)
  const [openLoanModal, setOpenLoanModal] = useState(false)
  const [closeDashboard, setCloseDashboard] = useState(false)
  const [favouriteList, setFavouriteList] = useState([]); // full favourites data
  const [pendingLikeId, setPendingLikeId] = useState([]); // store which card was clicked before login
  const [savedSearches, setSavedSearches] = useState([]);
  const [pendingSearchData, setPendingSearchData] = useState(null);
  const [loanList, setLoanList] = useState([])
  const [addData, setAdData] = useState([])
  const [isLikedProperties, setIsLikedProperties] = useState([])
  const [openSignUp, setOpenSignUp] = useState(false)
  let globalPrice = 5000000000
  let globalArea = 100
  const [currentCity, setCurrentCity] = useState({
    id: 16,
    city: "Lahore",
    geo_location: {
      latitude: 31.5497,
      longitude: 74.3436
    },
    zip_code: "54000",
    app_code: "PP016",
    slug: "lahore"
  })
  const [propertyCountLisitng, setPropertyCountListing] = useState({})
  const [button_loading, setButtonLoading] = useState(false)
  const handleClick = () => {
    setOpen(true);
  };
  const [error, setError] = useState({
    message: "",
    color: ""
  });
  // let base_url = 'http://192.168.88.143:8000/api/';
  let base_url = 'https://admin.pakistanproperty.com/api/';
  // let base_url = 'https://staging.pakistanproperty.com/dev.pakistanproperty.com/pakpro/api/';
  const globalHeaders = {
    'Authorization': userData ? `Bearer ${userData?.data?.token}` : '',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const [areaUnit, setAreaUnits] = useState([])
  const globalFetch = (url, options = {}) => {
    // Ensure options.headers exists and merge with globalHeaders
    options.headers = {
      ...globalHeaders,
      ...options.headers, // In case you need to add additional headers per request
    };
    // Call the native fetch function with the updated options
    return fetch(url, options);
  };
  const login = (credentials) => {
    setButtonLoading(true);

    return globalFetch(`${base_url}auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
      .then(async (response) => {
        setButtonLoading(false);
        const result = await response.json();

        if (response.ok) {
          setLogindata(result); // Store user data in state
          localStorage.setItem("agent_data", JSON.stringify(result)); // Save to localStorage

          // Show success snackbar
          handleClick();
          setError({
            message: result?.message || `Welcome back, ${result?.data?.user?.name || 'User'}! Login successful.`,
            color: "success"
          });

          return { success: true, data: result };
        } else {
          // Show error snackbar for login failure
          handleClick();
          setError({
            message: result?.message || 'Invalid credentials. Please check your email and password.',
            color: "error"
          });
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        console.error('Login error:', error);

        // Show error snackbar for network/unexpected errors
        handleClick();
        setError({
          message: 'Network error. Please check your connection and try again.',
          color: "error"
        });

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const logout = () => {
    localStorage.removeItem("agent_data"); // Save to localStorage
    localStorage.removeItem("ceo_profile"); // Save to localStorage
    setLogindata(false)
    return true
  };
  const registar = (data) => {
    setButtonLoading(true);
    return globalFetch(`${base_url}auth/${data?.role}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setButtonLoading(false);
        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false);

          handleClick()
          setError({ message: result?.message, color: "success" })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);

        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const countriesCode = () => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2')
      .then(res => res.json())
      .then(data => {
        const countries = data?.map(country => ({
          name: country.name.common,
          flag: country.flags?.svg || '', // image flag
          emojiFlag: country.flag || '',   // emoji flag
          callingCode: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
          code: country.cca2 // e.g., PK
        }));

        setCallingCode(countries);
      });
  }
  const getType = () => {
    return globalFetch(`${base_url}property/types-with-categories`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const getCity = () => {
    return new Promise((resolve) => {
      // Sort cities alphabetically by city name (A-Z)
      const sortedCities = [...citiesJsonData].sort((a, b) => {
        const cityA = (a.city || '').toLowerCase();
        const cityB = (b.city || '').toLowerCase();
        return cityA.localeCompare(cityB);
      });
      // Store sorted data in state
      setCitiesList(sortedCities);
      resolve({ success: true, data: sortedCities });
    });
  };
  const getLOcation = async (data) => {
    try {
      const cityCode = data.city_code;
      // Find city object by app_code
      const cityObj = citiesJsonData.find(city => city.app_code === cityCode);
      if (!cityObj) {
        return { success: false, error: 'City not found for code: ' + cityCode };
      }
      // Convert city name to camelCase, remove special chars
      const cityName = toCamelCase(cityObj.city.replace(/[^a-zA-Z0-9 ]/g, ''));
      // Try to import location json for city
      // Path is relative to this file: '../citiesLocation/locations/{CityName}.json'
      let locations;
      try {
        locations = await import(`../citiesLocation/locations/${cityName}.json`);
      } catch (err) {
        return { success: false, error: `Locations file not found for city: ${cityObj.city}` };
      }
      return { success: true, data: locations.default };
    } catch (e) {
      return { success: false, error: 'Unexpected error: ' + e.toString() };
    }
  };

  const getAmintites = (id) => {
    setAminitiesloading(true)
    return globalFetch(`${base_url}agent/properties/amenities/${id}`, {
      method: "GET"
    })

      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setAminitiesloading(false)

          return { success: true, data: result };
        } else {
          setAminitiesloading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setAminitiesloading(false)

        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const addWatermarkToImage = (imageFile, watermarkSrc = PPWatermark) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const watermarkImg = new Image();
          watermarkImg.src = watermarkSrc;

          watermarkImg.onload = () => {
            // ✅ Add image watermark
            const scale = 0.3;
            const wmWidth = canvas.width * scale;
            const wmHeight =
              (watermarkImg.height / watermarkImg.width) * wmWidth;
            const wmX = (canvas.width - wmWidth) / 2;
            const wmY = (canvas.height - wmHeight) / 2;

            ctx.globalAlpha = 0.5;
            ctx.drawImage(watermarkImg, wmX, wmY, wmWidth, wmHeight);
            ctx.globalAlpha = 1;

            // ✅ Add watermark text
            const text = "pakistanproperty.com";
            const fontSize = Math.max(canvas.width * 0.025, 16); // responsive font

            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.textBaseline = "bottom";

            const textWidth = ctx.measureText(text).width;
            const padding = 12;

            const textX = canvas.width - textWidth - padding;
            const textY = canvas.height - padding;

            // Add slight shadow for visibility
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 6;

            ctx.fillText(text, textX, textY);

            ctx.shadowBlur = 0; // reset shadow

            canvas.toBlob(
              (blob) => {
                if (!blob || blob.size < 1000) {
                  reject("Watermarked image is invalid or too small.");
                  return;
                }
                const url = URL.createObjectURL(blob);
                resolve({ blob, url });
              },
              imageFile.type === "image/jpeg" ? "image/jpeg" : "image/png",
              0.9
            );
          };

          watermarkImg.onerror = () => reject("Failed to load watermark image");
        };

        img.onerror = () => reject("Failed to load image.");
      };

      reader.onerror = () => reject("Failed to read file.");
    });
  };
  const handleAddProperty = async (jsonState) => {
    setButtonLoading(true)
    const formData = new FormData();

    // Adding simple key-value pairs
    formData.append('description', jsonState.listingDescription);
    formData.append('area_size', jsonState.areaValue);
    formData.append('title', jsonState.listingTitle);
    formData.append('user_id', userData?.data?.user?.id);
    formData.append('unit_area', jsonState.areaUnit?.id);
    formData.append('bathrooms', jsonState.bathroom);
    formData.append('bedrooms', jsonState.bedroom);
    formData.append('city_code', jsonState.city);
    formData.append('currency', jsonState.priceUnit?.id);
    formData.append('email', jsonState.email);
    if (jsonState?.installment) {
      formData.append('installments_available', jsonState.installment);
      formData.append('monthly_installments', jsonState.monthlyInstallment);
      formData.append('number_of_installments', jsonState.no_of_installment?.id);
      formData.append('advanced_amount', jsonState.advanceAmount);
    }
    if (jsonState.landline) {
      formData.append('land_line', "+92" + jsonState.landline);
    }
    else {
      formData.append('land_line', "");
    }
    formData.append('plot_number', jsonState.plot_number);
    formData.append('ready_for_possession', jsonState.possession == true ? 1 : 0);
    formData.append('price', jsonState.priceValue);
    formData.append('sub_category_id', jsonState.propertyType?.subType);
    formData.append('category_id', jsonState.propertyType?.type);
    formData.append('location_id', jsonState.location);
    formData.append('property_type_id', jsonState.purpose);
    formData.append('property_type_slug', jsonState.slug);
    // Handling arrays
    jsonState.contact.forEach((mobile, index) => {
      if (mobile !== '') {
        formData.append(`contacts[${index}]`, "+92" + mobile);
      };
    });

    jsonState.videos.forEach((link, index) => {
      formData.append(`video_links[${index}]`, link);
    });

    for (let i = 0; i < jsonState.images.length; i++) {
      const image = jsonState.images[i];

      try {
        const watermarkedResult = await addWatermarkToImage(image);

        if (watermarkedResult?.blob?.size < 1000) {
          console.warn(`Image ${image.name} was too small after watermarking. Skipping.`);
          continue;
        }

        const watermarkedFile = new File(
          [watermarkedResult.blob],
          image.name,
          { type: image.type }
        );


        if (i === 0) {
          formData.append('cover_image', watermarkedFile);
        }
        formData.append(`images[${i}]`, watermarkedFile);
      } catch (err) {
        console.error("Error watermarking image:", err);
        continue;
      }
    }

    // Handling nested objects and arrays (like amenities)
    // Concatenate all the amenity data arrays into a single array
    const concatenatedAmenities = jsonState.amenities.reduce((acc, amenity) => { //
      return acc.concat(amenity?.data || amenity);
    }, []);
    // Iterate over the concatenated array and append to formData
    concatenatedAmenities.forEach((item, itemIndex) => {
      formData.append(`amenities[${itemIndex}][id]`, item?.id || item?.amenity_id); //
      formData.append(`amenities[${itemIndex}][value]`, item?.pivot?.value || item?.selected_options || item?.value); //

    });
    if (jsonState?.lease) {
      Object.keys(jsonState.lease).forEach(key => {
        formData.append(`lease[${key}]`, jsonState.lease[key]);
      });
    }
    console.log(formData)
    // Send formData to backend
    try {
      const response = await fetch(`${base_url}agent/properties`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': userData ? `Bearer ${userData?.data?.token}` : '', //
          'Accept': 'application/json',
        }
      });
      const jsonData = await response.json();
      if (jsonData?.success) {
        setButtonLoading(false)
        handleClick()
        setError({ message: jsonData?.message, color: "success" })
        return { success: true, data: jsonData };
      }
      else {
        setButtonLoading(false)

        handleClick()

        setError({ message: jsonData?.data?.phone_number[0] ? jsonData?.data?.phone_number[0] : jsonData?.data?.email[0], color: "error" })
        return { success: false, data: jsonData };

      }
    } catch (error) {
      setButtonLoading(false)

    } finally {
      setButtonLoading(false)

      // setLoading(false); 
    }
  }
  const serchProperty = (data) => {
    setLoading(true);
    setPropertyData([]);
    return globalFetch(`${base_url}properties`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          setPropertyData(result?.data); // normal data
          setPropertyCountListing(result?.data?.city_areas_summary);
          setLoading(false);

          return { success: true, data: result };
        } else {

          handleClick();
          setError({ message: result?.message, color: "error" });
          setPropertyData([]);
          setLoading(false);
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Property search error:", error);
        setPropertyData([]);
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      });
  };
  const getProductList = () => {
    return globalFetch(`${base_url}agent/products`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const getPropertyDetail = (id) => {
    setLoading(true)
    return globalFetch(`${base_url}properties/${id}`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();
        if (response.ok) {
          setLoading(false)


          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result, status: response?.status };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  function formatPriceWithCommas(price) {
    if (price === undefined || price === null || price === '') {
      return '';
    }
    // If price is an object, don't try to format it
    if (typeof price === 'object') {
      return '';
    }
    const priceStr = String(price);
    // Only format if it's a valid number string
    if (!/^\d+$/.test(priceStr.replace(/[^\d]/g, ''))) {
      return priceStr;
    }
    return priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const properyEnquery = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}property/inquiry/${data?.property_id}`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          setButtonLoading(false)
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', // Oct
      day: '2-digit', // 01
      year: 'numeric' // 2025
    });
  };
  const formatPakistaniPhoneNumber = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "") {
      let phone = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters
      // Handle different input formats
      if (phone.startsWith("92")) {
        phone = phone.slice(2);
      } else if (phone.startsWith("+92")) {
        phone = phone.slice(3);
      } else if (phone.startsWith("0")) {
        phone = phone.slice(1);
      }
      // Ensure the phone number is no longer than 10 digits
      if (phone.length > 10) {
        phone = phone.slice(0, 10);
      }
      return phone; // Return processed phone number
    }
    else {
      return ""
    }
  };

  const formatPakistaniLandline = (landline) => {
    if (landline && landline !== "") {
      let phone = landline.replace(/\D/g, ""); // Remove non-digit characters
      // Remove Pakistan country code for landlines as well, if needed
      if (phone.startsWith("92")) {
        phone = phone.slice(2);
      } else if (phone.startsWith("+92")) {
        phone = phone.slice(3);
      } else if (phone.startsWith("0")) {
        phone = phone.slice(1);
      }
      // Landlines in Pakistan (after leading zero/code removed) are typically:
      // city code (1-3 digits) + 6-8 digit number, e.g., 421234567 or 2134567890.
      // This will return as a continuous number string for your logic/UI to format as needed.
      // Optionally, trim to 9 or 10 digits for std+number (you may adjust as per your validation) 
      if (phone.length > 10) {
        phone = phone.slice(0, 10);
      }
      return phone;
    } else {
      return "";
    }
  };
  const handleOpenWhatsapp = (phoneNumber, messageText) => {
    const clean = String(phoneNumber || "").replace(/\D/g, "");
    if (!clean) return;
    const base = `https://wa.me/${clean}`;
    const url = messageText
      ? `${base}?text=${encodeURIComponent(messageText)}`
      : base;
    window.open(url, "_blank");
  };
  const [projectTypeData, setProjectTypeData] = useState([])
  const projectType = () => {
    return globalFetch(`${base_url}project-types`, {
      method: "GET",

    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const propertiesByType = (slug) => {
    return globalFetch(`${base_url}properties/type/${slug}`, {
      method: "GET",

    })
      .then(async (response) => {
        setLoading(true);
        const result = await response.json();

        if (response.ok) {
          setLoading(false);
          return { success: true, data: result };
        } else {
          setLoading(false);
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getAreaUnit = () => {
    return globalFetch(`${base_url}area-units`, {
      method: "GET",

    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

    return "Just now";
  }
  const getProjects = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}projects`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false)

        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      });
  };
  const getProjectsListing = (data) => {
    return globalFetch(`${base_url}project-listing`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      });
  };
  // Step 1: Raw data ko backend format me convert karna
  function buildSearchPayload(data) {
    const payload = {};
    // Property Type
    if (data.propertyType?.type) {
      payload.project_type_id = data.propertyType.type;
    }

    // City
    if (data.city?.app_code) {
      payload.city_code = data.city.app_code;
    }


    if (data?.locations?.length > 0) {
      payload.location_id = data?.locations?.map((item) => item?.id);
    }
    // Sub category IDs
    if (data.propertyType?.subType?.length > 0) {
      payload.sub_category_id = data.propertyType.subType;
    }

    // Price
    if (data.priceRange?.min || data.priceRange?.max) {
      payload.min_price = data.priceRange.min || 0;
      payload.max_price = data.priceRange.max;
      if (data.priceRange?.priceValue) {
        payload.currency = data.priceRange.priceValue?.name || "PKR";
      }
    }


    // Area
    if (data.areaRange?.min || data.areaRange?.max) {
      payload.area_min = data.areaRange.min || 0;
      payload.area_max = data.areaRange.max;
      if (data.areaRange?.areaValue) {
        payload.unit_area = data.areaRange.areaValue?.id;
      }
    }


    // Developer
    if (data.developer_title) {
      payload.developer_title = data.developer_title;
    }

    // Project Title
    if (data.project_title) {
      payload.project_title = data.project_title;
    }

    // Extra flag
    if (data.isTrending) {
      payload.is_trending = 1;
    }
    if (data?.current_page) {
      payload.current_page = data?.current_page;
    }
    if (data?.per_page) {
      payload.per_page = data?.per_page;
    }
    if (data?.sorting) {
      payload.sorting = data?.sorting;
    }
    return payload;
  }
  const parseQueryParams = (search) => {
    const params = new URLSearchParams(search);
    const result = {};

    for (let [key, value] of params.entries()) {
      // Arrays handle
      if (key.endsWith("[]")) {
        const cleanKey = key.replace("[]", "");
        if (!result[cleanKey]) result[cleanKey] = [];
        result[cleanKey].push(value);
      }
      // Nested objects like price[min], price[max]
      else if (key.includes("[")) {
        const match = key.match(/(\w+)\[(\w+)\]/);
        if (match) {
          const mainKey = match[1]; // e.g. price
          const subKey = match[2];  // e.g. min
          if (!result[mainKey]) result[mainKey] = {};
          result[mainKey][subKey] = value;
        }
      }
      // Normal key=value
      else {
        result[key] = value;
      }
    }

    return result;
  };

  const formatPrice = (num) => {
    if (num >= 1_00_00_00_000) {
      return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
    } else if (num >= 1_00_00_000) {
      return `${(num / 1_00_00_000).toFixed(2)} Crore`;
    } else if (num >= 1_00_000) {
      return `${(num / 1_00_000).toFixed(2)} Lakh`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)} Thousand`;
    } else if (num >= 1_00) {
      return `${(num / 1_00).toFixed(2)} Hundred`;
    }
    return num?.toString();
  };

  const projectDetail = (id) => {
    setLoading(true)
    return globalFetch(`${base_url}project/${id}`, {
      method: "GET",
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false);

          return { success: true, data: result };
        } else {
          setLoading(false);

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const projectIquiry = (data) => {
    return globalFetch(`${base_url}projects/inquiry/${data?.id}`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          return { success: true, data: result };
        } else {
          handleClick()
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const buildSearchPayloadProperty = (data) => {
    const payload = {};

    // Property Type
    if (data.property_type_id) {
      payload.property_type_id = data.property_type_id;
    }
    if (data?.purpose?.id) {
      payload.property_type_id = data?.purpose?.id;
    }
    // City
    if (data.city?.app_code) {
      payload.city_code = data.city.app_code;
    }
    if (data?.area?.length > 0) {
      payload.location_id = data?.area?.map((item) => item?.id);
    }
    if (data?.locations?.length > 0) {
      payload.location_id = data?.locations?.map((item) => item?.id);
    }
    // Sub category IDs
    if (data.propertyType?.subType?.length > 0) {
      payload.sub_category_id = data.propertyType.subType;
    }
    if (data.propertyType?.type) {
      payload.category_id = data.propertyType.type;
    }

    // Price
    if (data.priceRange?.min || data.priceRange?.max) {
      payload.min_price = data.priceRange.min || 0;
      payload.max_price = data.priceRange.max;
      if (data.priceRange?.priceValue) {
        payload.currency = data.priceRange.priceValue?.name ? data.priceRange.priceValue?.name : data.priceRange.priceValue ? data.priceRange.priceValue : "PKR";
      }
    }


    // Area
    if (data.areaRange?.min || data.areaRange?.max) {
      payload.area_min = data.areaRange.min || 0;
      payload.area_max = data.areaRange.max;
      if (data.areaRange?.areaValue) {
        payload.unit_area = data.areaRange.areaValue?.id;
      }
    }

    if (data.bathroom?.length) {
      payload.bathrooms = data.bathroom;
    }
    if (data.bedroom?.length) {
      payload.rooms = data.bedroom;
    }
    if (data.areaValue?.id) {
      payload.unit_area = data?.areaValue?.id;
    }
    if (data.more?.length) {
      payload.more = data.more;
    }
    if (data?.per_page) {
      payload.per_page = data?.per_page
    }
    if (data?.current_page) {
      payload.current_page = data?.current_page
    }
    if (data?.city_code) {
      payload.city_code = data?.city_code
    }
    if (data?.sorting) {
      payload.sorting = data?.sorting
    }
    if (data?.agency_name) {
      payload.agency_name = data?.agency_name || ""
    }




    return payload;
  }
  const buildSearchPayloadAgencies = (data) => {
    const payload = {};
    if (data.property_type_id) {
      payload.property_type_id = data.property_type_id;
    }
    if (data.city?.app_code) {
      payload.city_code = data.city.app_code;
    }
    if (data?.locations?.length > 0) {
      payload.location = data?.locations?.map((item) => item?.slug);
    }
    // Sub category IDs
    if (data.propertyType?.subType?.length > 0) {
      payload.sub_category_id = data.propertyType.subType;
    }
    if (data.propertyType?.type) {
      payload.category_id = data.propertyType.type;
    }
    if (data?.agency_name) {
      payload.agency_name = data?.agency_name;
    }
    if (data?.current_page) {
      payload.current_page = data?.current_page;
    }
    if (data?.per_page) {
      payload.per_page = data?.per_page;
    }
    if (data?.most_properties_type) {
      payload.most_properties_type = data?.most_properties_type;
    }





    return payload;
  }
  const buildSearchPayloadCostCalculate = (data) => {

    const payload = {};
    if (data.area_size) {
      payload.size = data.area_size;
    }
    if (data.coverd_area) {
      payload.covered_area = data.coverd_area;
    }
    if (data?.area_unit?.id) {
      payload.unit = data.area_unit?.id;
    }
    if (data.city?.app_code) {
      payload.city_code = data.city.app_code;
    }
    if (data.construction_type) {
      payload.construction_type = data.construction_type?.value ? data.construction_type?.value : data.construction_type;
    }
    if (data.construction_mode) {
      payload.construction_mode = data.construction_mode?.value ? data.construction_mode?.value : data.construction_mode;
    }
    if (data.bedrooms) {
      payload.bedrooms = data.bedrooms?.value ? data.bedrooms?.value : data.bedrooms;
    }
    if (data.bathrooms) {
      payload.bathrooms = data.bathrooms?.value ? data.bathrooms?.value : data.bathrooms;
    }
    if (data.kitchens) {
      payload.kitchens = data.kitchens?.value ? data.kitchens?.value : data.kitchens;
    }
    if (data.living_rooms) {
      payload.living_rooms = data.living_rooms?.value ? data.living_rooms?.value : data.living_rooms;
    }
    if (data.drowing_rooms) {
      payload.drowing_rooms = data.drowing_rooms?.value ? data.drowing_rooms?.value : data.drowing_rooms;
    }




    return payload;
  }

  const buildSearchPayloadLoanCalculate = (data) => {

    const payload = {};
    if (data.propertyPrice) {
      payload.propertyPrice = data.propertyPrice;
    }
    if (data.downPayment) {
      payload.downPayment = data.downPayment;
    }
    if (data.loanPeriod) {
      payload.loanPeriod = data.loanPeriod;
    }
    if (data.loanType) {
      payload.loanType = data.loanType;
    }
    return payload;
  }
  const objectToQueryString = (obj, prefix) => {
    const str = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const k = prefix ? `${prefix}[${key}]` : key;
        const v = obj[key];
        if (typeof v === "object" && !Array.isArray(v)) {
          str.push(objectToQueryString(v, k));
        } else if (Array.isArray(v)) {
          v.forEach((val) => {
            str.push(`${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`);
          });
        } else {
          str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
      }
    }
    return str.join("&");
  };
  const getProprtey = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}agent/properties/all`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const whatsappImpretion = (value, id) => {
    return globalFetch(`${base_url}property/${value}/${id}`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const handleUpdateProperty = async (jsonState) => {
    const formData = new FormData();
    setButtonLoading(true)

    // Adding simple key-value pairs
    formData.append('description', jsonState.listingDescription);
    formData.append('area_size', jsonState.areaValue);
    formData.append('title', jsonState.listingTitle);
    formData.append('user_id', userData?.data?.user?.id);
    formData.append('unit_area', jsonState.areaUnit?.id);
    formData.append('bathrooms', jsonState.bathroom);
    formData.append('bedrooms', jsonState.bedroom);
    formData.append('city_code', jsonState.city?.app_code || jsonState.city);
    formData.append('currency', jsonState.priceUnit?.id);
    formData.append('email', jsonState.email);
    if (jsonState.installment) {
      formData.append('installments_available', jsonState.installment);
      formData.append('monthly_installments', jsonState.monthlyInstallment);
      formData.append('number_of_installments', jsonState.no_of_installment?.id);
      formData.append('advanced_amount', jsonState.advanceAmount);
    }
    if (jsonState.landline) {
      formData.append('land_line', "+92" + jsonState.landline);
    }
    else {
      formData.append('land_line', "");
    }
    formData.append('plot_number', jsonState.plot_number);
    formData.append('ready_for_possession', jsonState.possession == true ? 1 : 0);
    formData.append('price', jsonState.priceValue);
    formData.append('sub_category_id', jsonState.propertyType?.subType);
    formData.append('category_id', jsonState.propertyType?.type);
    formData.append('location_id', jsonState.location?.id || jsonState.location);
    formData.append('property_type_id', jsonState.purpose);
    formData.append('property_type_slug', jsonState.slug);
    formData.append('_method', "put");
    if (jsonState?.deleted_media) {
      jsonState.deleted_media.forEach((item, index) => {
        formData.append(`deleted_media[${index}]`, item);
      });

    }

    // Handling arrays
    jsonState.contact.forEach((mobile, index) => {
      if (mobile !== '') {
        formData.append(`contacts[${index}]`, "+92" + mobile);
      };
    });
    jsonState.videos.forEach((link, index) => {
      formData.append(`video_links[${index}]`, link);
    });

    for (let i = 0; i < jsonState.images.length; i++) {
      const image = jsonState.images[i];

      try {
        const watermarkedResult = await addWatermarkToImage(image);

        if (watermarkedResult?.blob?.size < 1000) {
          console.warn(`Image ${image.name} was too small after watermarking. Skipping.`);
          continue;
        }

        const watermarkedFile = new File(
          [watermarkedResult.blob],
          image.name,
          { type: image.type }
        );


        if (i === 0) {
          formData.append('cover_image', watermarkedFile);
        }
        formData.append(`images[${i}]`, watermarkedFile);
      } catch (err) {
        console.error("Error watermarking image:", err);
        continue;
      }
    }

    // Handling nested objects and arrays (like amenities)
    // Concatenate all the amenity data arrays into a single array
    // Since amenities is now a flat array, we can iterate directly
    jsonState.amenities.forEach((item, itemIndex) => {
      formData.append(`amenities[${itemIndex}][id]`, item?.id);
      formData.append(`amenities[${itemIndex}][value]`, item?.pivot?.value || item?.selected_options || item?.value);
    });
    if (jsonState?.lease) {
      Object.keys(jsonState.lease).forEach(key => {
        formData.append(`lease[${key}]`, jsonState.lease[key]);
      });
    }
    // Send formData to backend
    try {
      const response = await fetch(`${base_url}agent/properties/${jsonState?.id}`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': userData ? `Bearer ${userData?.data?.token}` : '',
          'Accept': 'application/json',
        }
      });
      const jsonData = await response.json();
      if (jsonData?.success) {
        handleClick()
        setButtonLoading(false)

        setError({ message: jsonData?.message, color: "success" })
        return { success: true, data: jsonData };
      }
      else {
        setButtonLoading(false)

      }
    } catch (error) {
      setButtonLoading(false)

    } finally {
      setButtonLoading(false)

    }
  }
  const homePagePreLocation = () => {
    return globalFetch(`${base_url}footer/popular-locations`)
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const homePagePreProperty = () => {
    return globalFetch(`${base_url}footer/popular-cities`)
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getQoutaLogs = (value, paginationData) => {
    let url = `${base_url}agent/quota/logs`;
    const params = [];

    if (value) {
      params.push(`date=${value}`);
    }

    if (paginationData) {
      const page = paginationData.current_page || 1;
      const perPage = paginationData.perPage || 10;
      params.push(`page=${page}`);
      params.push(`per_page=${perPage}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return globalFetch(url, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const getQoutaState = () => {
    return globalFetch(`${base_url}agent/quota/offers`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const getCart = () => {
    return globalFetch(`${base_url}agent/carts`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const addToCart = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}agent/carts`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({ message: result?.message, color: "success" })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const saveFavouritePropertyById = async (id) => {
    try {
      const res = await fetch(`${base_url}likes/toggle/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData ? `Bearer ${userData?.data?.token}` : "",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, data: data?.data };
      } else {
        return { success: false, error: data?.message };
      }
    } catch (err) {
      return { success: false, error: "Unexpected error occurred." };
    }
  };


  const fetchFavourites = useCallback(async () => {
    if (!userData) return;

    try {
      const response = await fetch(`${base_url}likes`, {
        method: "GET",
        headers: {
          Authorization: userData ? `Bearer ${userData?.data?.token}` : "",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setFavouriteList(result?.data?.liked_properties)
      } else {
        setError({ message: result?.message, color: "error" });
      }
    } catch (err) {
      setError({ message: "Error fetching favourites.", color: "error" });
    }
  }, [userData]);

  const handleLikeClick = async (propertyId) => {
    if (!propertyId) return { success: false, error: "Invalid property ID" };

    if (!loginData) {
      setOpenLoanModal(true);
      setCloseDashboard(true);
      setPendingLikeId(propertyId);
      return { success: false, requiresLogin: true };
    }

    if (loginData && pendingLikeId) {
      saveFavouritePropertyById(pendingLikeId).then((res) => {
        if (res.success) {
          setFavouriteList((prev) => ({
            ...prev,
            [pendingLikeId]: res?.data?.liked ?? true,
          }));
          setIsLikedProperties([...isLikedProperties, pendingLikeId])
        }
        setPendingLikeId(null);
      });
    }

    const res = await saveFavouritePropertyById(propertyId);

    if (res.success) {
      let updateProperties = favouriteList?.filter((item) => {
        if (item?.id !== propertyId) {
          return item
        }
      })
      setFavouriteList(updateProperties)
      if (isLikedProperties?.includes(propertyId)) {
        let updateProperties = isLikedProperties?.filter((item) => {
          if (item !== propertyId) {
            return item
          }
        })
        setIsLikedProperties(updateProperties)
      } else {
        setIsLikedProperties([...isLikedProperties, propertyId])

      }
      return { success: true, data: res.data, isLiked: res.data?.liked ?? !isLikedProperties?.includes(propertyId) };
    } else {
      console.error("❌ Toggle failed:", res.error);
      return { success: false, error: res.error };
    }
  };

  const bankDetail = () => {
    return globalFetch(`${base_url}bank-accounts`, {
      method: "GET",
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const payLaterOrder = async () => {
    setLoading(true);
    return globalFetch(`${base_url}agent/orders/pay-later`, {
      method: 'POST',
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          handleClick()
          setLoading(false);
          setError({ message: result?.message, color: "success" })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const craeteOrder = async (data) => {
    setLoading(true);
    const formData = new FormData();


    formData.append('image', data.image);
    try {
      const response = await fetch(`${base_url}agent/orders/pay-now`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': userData ? `Bearer ${userData?.data?.token}` : '',
          'Accept': 'application/json',
        }
      });
      const jsonData = await response.json();
      if (jsonData?.success) {
        setLoading(false);
        handleClick()
        setError({ message: jsonData?.message, color: "success" })
        return { success: true, data: jsonData };
      }
      else {
        handleClick()
        setError({ message: jsonData?.errors?.image?.length ? jsonData?.errors?.image[0] : "Please Upload image jpeg, png, jpg", color: "error" })
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getOrderLIst = (paginationData) => {
    setLoading(true)
    let url = `${base_url}agent/orders`;

    // Build query string for pagination if provided
    if (paginationData) {
      const queryParams = [];
      if (paginationData.current_page) {
        queryParams.push(`page=${paginationData.current_page}`);
      }
      if (paginationData.perPage) {
        queryParams.push(`per_page=${paginationData.perPage}`);
      }
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
    }

    return globalFetch(url, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false);

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const getSavedSearches = async () => {
    try {
      const response = await fetch(`${base_url}saved-searches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userData ? `Bearer ${userData?.data?.token}` : "",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSavedSearches(result?.data)
        return { success: true, data: result };
      } else {
        return { success: false, error: result };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const saveSearch = async (searchData) => {
    // If user is not logged in, store the search data to save after login
    if (!loginData) {
      setPendingSearchData(searchData);
      return { success: false, error: 'User not logged in' };
    }

    try {
      const response = await fetch(`${base_url}saved-searches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userData ? `Bearer ${userData?.data?.token}` : "",
        },
        body: JSON.stringify({ filters: searchData }),
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  // Auto-save pending search after successful login
  useEffect(() => {
    if (loginData && pendingSearchData) {
      const savePendingSearch = async () => {
        try {
          const currentUserData = loginData ? loginData : JSON.parse(localStorage.getItem("agent_data"));
          const response = await fetch(`${base_url}saved-searches`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": currentUserData ? `Bearer ${currentUserData?.data?.token}` : "",
            },
            body: JSON.stringify({ filters: pendingSearchData }),
          });
          const result = await response.json();
          if (response.ok) {
            setPendingSearchData(null); // Clear pending data after successful save
          }
        } catch (error) {
          console.error('Error saving pending search:', error);
        }
      };
      savePendingSearch();
    }
  }, [loginData, pendingSearchData]);

  // Fetch currency rates on component mount
  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  // Save backtoSearchContentState to localStorage whenever it changes
  useEffect(() => {
    if (backtoSearchContentState) {
      localStorage.setItem('backtoSearchContentState', JSON.stringify(backtoSearchContentState));
    } else {
      localStorage.removeItem('backtoSearchContentState');
    }
  }, [backtoSearchContentState]);

  const deleteSavedSearch = async (id) => {
    try {
      const response = await fetch(`${base_url}saved-searches/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userData ? `Bearer ${userData?.data?.token}` : "",
        },
      });

      if (response.ok) {
        setSavedSearches(prev => prev.filter(item => item.id !== id));
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const changePassword = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}auth/change_password`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          handleClick()
          setError({ message: result?.message, color: "success" })
          return { success: true, data: result };
        } else {
          setLoading(false)
          handleClick()
          setError({ message: result?.message, color: "error" })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const updateSetting = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}profile-setting/update`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          if (userData?.data?.user) {

            if (!userData.data.user.setting) {
              userData.data.user.setting = {};
            }


            userData.data.user.setting = result?.data;
          }


          localStorage.setItem("agent_data", JSON.stringify(userData));


          handleClick()
          setError({ message: "User Setting Updated", color: "success" })
          return { success: true, data: result };
        } else {
          setLoading(false)
          handleClick()
          setError({ message: result?.message, color: "error" })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const updateProfile = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}profile`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({ message: "Profile Update Successfully", color: "success" })
          if (userData && userData.data && userData.data.user) {

            let newUserData = { ...result.data };

            let obj = {
              address: newUserData?.address,
              avatar: newUserData?.avatar,
              city_id: newUserData?.city?.app_code,
              currentCity: newUserData?.city,
              connected_account_id: userData?.data?.user?.connected_account_id,
              country_id: userData?.data?.user?.address?.country_id,
              created_at: userData?.data?.user?.created_at,
              created_by: userData?.data?.user?.created_by,
              description: newUserData?.description || userData?.data?.user?.description,
              device_token: userData?.data?.user?.device_token,
              email: newUserData?.email,
              setting: userData?.data?.user?.setting,
              email_verified_at: userData?.data?.user?.email_verified_at,
              guard_name: userData?.data?.user?.guard_name,
              id: userData?.data?.user?.id,
              is_active: userData?.data?.user?.is_active,
              name: newUserData.name,
              phone_number: newUserData?.phone_number,
              whatsapp_number: newUserData?.whatsapp_number,
              landline: newUserData?.landline,
              state_id: newUserData?.address,
              updated_at: userData?.data?.user?.updated_at,
              username: userData?.data?.user?.username
            }

            userData.data.user = obj;

            localStorage.setItem("agent_data", JSON.stringify(userData));
          }
          return { success: true, data: result };
        } else {
          if (result?.message) {
            handleClick()
            setError({ message: result?.message, color: "error" })
          }
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const updateOrder = async (data) => {
    setLoading(true);
    const formData = new FormData();


    formData.append('image', data.image);
    try {
      const response = await fetch(`${base_url}agent/orders/${data?.orderId}`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': userData ? `Bearer ${userData?.data?.token}` : '',
          'Accept': 'application/json',
        }
      });
      const jsonData = await response.json();
      if (jsonData?.success) {
        setLoading(false)
        handleClick()
        setError({ message: jsonData?.message, color: "success" })
        return { success: true, data: jsonData };
      }
      else {

      }

    } catch (error) {
    } finally {

    }
  };
  const getagency = () => {
    setLoading(true);
    return globalFetch(`${base_url}agency-profile`, {
      method: 'GET',
    })
      .then(async (response) => {
        setLoading(false);
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const agencyProfile = (data) => {
    setButtonLoading(true)
    setLoading(true);
    return globalFetch(`${base_url}agency-profile/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);
        setButtonLoading(false)
        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({ message: "Profile Update Successfully", color: "success" })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        setButtonLoading(false)
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const agencyCeo = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}agency-profile/create-ceo-profile`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);
        const result = await response.json();
        if (response.ok) {
          handleClick()
          setError({ message: "Profile Update Successfully", color: "success" })
          const existingProfile = localStorage?.getItem("ceo_profile") || {}
          if (existingProfile) {
            const updatedProfile = {
              ...existingProfile,
              ceo_image: data?.ceo_image
            };
            localStorage.setItem("ceo_profile", JSON.stringify(updatedProfile));
          }
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const featureAgency = () => {
    return globalFetch(`${base_url}agencies/featured`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }

  const planAgency = () => {
    setLoading(true)
    return globalFetch(`${base_url}agencies/categories`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const agencyList = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}agencies`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getInqueries = (paginationData) => {
    const requestData = paginationData || {};
    if (paginationData) {
      requestData.page = paginationData.current_page || 1;
      requestData.per_page = paginationData.perPage || 10;
    }
    return globalFetch(`${base_url}agent/properties/inquiries`, {
      method: "POST",
      body: JSON.stringify(requestData)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const agencyById = (id) => {
    setLoading(true)
    return globalFetch(`${base_url}agency?agency_id=${id}`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getDashboradListing = () => {
    return globalFetch(`${base_url}agent/property/listing`, {
      method: "GET"
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const getDashboradAnalaytics = (data) => {
    return globalFetch(`${base_url}agent/property/analytics`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };

  const recentProperty = () => {
    return globalFetch(`${base_url}agent/property/recent-listing`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const addAgencyStaff = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}agent/agents-store`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "success",
            message: result?.message
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        handleClick()
        setError({
          color: "error",
          message: "An unexpected error occurred"
        })
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const updateAgencyStaff = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}agent/agents/${data?.id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "success",
            message: result?.message
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        handleClick()
        setError({
          color: "error",
          message: "An unexpected error occurred"
        })
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getAgencyStaff = (paginationData) => {
    setLoading(true)
    let url = `${base_url}agent/agents`;
    const params = [];

    if (paginationData) {
      const page = paginationData.current_page || 1;
      const perPage = paginationData.perPage || 10;
      params.push(`page=${page}`);
      params.push(`per_page=${perPage}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return globalFetch(url)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          handleClick()
          return { success: true, data: result };
        } else {
          setLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        handleClick()
        setError({
          color: "error",
          message: "An unexpected error occurred"
        })
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const manageQuota = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}agent/assign-offer/${data?.agentId}`, {
      method: "POST",
      body: JSON.stringify({ offers: data?.data })
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "success",
            message: result?.message
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        handleClick()
        setError({
          color: "error",
          message: "An unexpected error occurred"
        })
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const constructionCalulation = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}construction-cost`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          handleClick()
          setError({
            color: "success",
            message: result?.message
          })
          return { success: true, data: result };
        } else {
          setLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        handleClick()
        setError({
          color: "error",
          message: "An unexpected error occurred"
        })
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getPropertyIndex = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}index-properties-page`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false)

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const filterPropertyIndex = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}property-growth-analysis`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const buildSearchPayloadCPropertyIndex = (data) => {

    const payload = {};
    if (data?.purpose) {
      payload.property_type_id = data.purpose;
    }
    if (data?.city?.app_code) {
      payload.city_code = data?.city?.app_code;
    }
    if (data?.location?.id) {
      payload.location_id = data?.location?.id;
    }
    if (data?.category_id?.id) {
      payload.category_id = data?.category_id?.id;
    }




    return payload;
  }
  const getPropertyTrend = () => {
    setLoading(true)
    return globalFetch(`${base_url}trends`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const buildSearchPayloadCPropertyTrend = (data) => {

    const payload = {};
    if (data?.purpose) {
      payload.property_type_id = data?.purpose?.id ? data?.purpose?.id : data?.purpose;
    }
    if (data?.city?.app_code) {
      payload.city_code = data?.city?.app_code;
    }
    if (data?.location?.id) {
      payload.location_id = data?.location?.id;
    }




    return payload;
  }
  const filterPropertyTrends = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}trends/trend-detail`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getBlogList = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}blogs`, {
      method: "POST",
      body: JSON.stringify(data)

    }

    )
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getBlogDetail = (slug) => {
    setLoading(true)
    return globalFetch(`${base_url}blogs/${slug}`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const applyForLoan = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}loan-application`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getLoansScheme = () => {
    return globalFetch(`${base_url}loans`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getAd = () => {
    return globalFetch(`${base_url}ads`, {
      method: "GET",
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const changePropertyStatus = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}agent/properties/change-status`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          handleClick()
          setError({
            color: "success",
            message: result?.message
          })
          return { success: true, data: result };
        } else {
          setLoading(false)
          handleClick()
          setError({
            color: "error",
            message: result?.message
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const upgradeProperty = (data) => {
    setLoading(true);
    return globalFetch(`${base_url}agent/properties/upgrade/${data?.property_id}`, {
      method: 'POST',
      body: JSON.stringify({ offer_id: data?.offer_id }),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          handleClick()
          setError({ message: result?.message, color: "success" })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const instant = (data) => {
    return globalFetch(`${base_url}instant-valuation-request`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        setButtonLoading(true);
        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false);
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false);
          handleClick()
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const staffPasswordSet = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}verify-agent`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          setLogindata(result); // Store user data in state
          localStorage.setItem("agent_data", JSON.stringify(result)); // Save to localStorage
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)

          handleClick()
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {

        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const [latestBlog, setLatestBlog] = useState([])
  const getHomeBlogs = () => {
    return globalFetch(`${base_url}blogs/latest`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLatestBlog(result)
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const subscribeNewsLater = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}subscribe-newsletter`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          setOpen(true)
          setError({
            message: result?.message || "Successfully subscribed to newsletter!",
            color: "success"
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          setOpen(true)
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const [trustedAgnecyList, setTrustedAgnecyList] = useState([])
  const getTrustedAgency = async () => {
    return globalFetch(`${base_url}agencies/featured`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setTrustedAgnecyList(result?.data)
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false)

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getPackagesAgency = () => {
    return globalFetch(`${base_url}agent/packages`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const agencyPackageInquery = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}package/inquiry/${data?.id}`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setButtonLoading(false)
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          handleClick()
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getNewsList = (data) => {
    setLoading(true)
    return globalFetch(`${base_url}news`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getNewsDetail = (slug) => {
    setLoading(true)
    return globalFetch(`${base_url}news/${slug}`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)

          return { success: true, data: result };
        } else {
          setLoading(false)

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const [latestNews, setLatestNews] = useState([])
  const getHomeNews = () => {
    return globalFetch(`${base_url}news/latest`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLatestNews(result)
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getSearchLocation = (data) => {
    return globalFetch(`${base_url}properties/most-searched-locations/${data?.city_code}/${data?.location_id}`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getUser = (id) => {
    setLoading(true)
    return globalFetch(`${base_url}staff-profile/${id}`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {

          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {

        setLoading(false)
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const [activeAgencies, setActiveAgencies] = useState([])
  const getActiveAgencies = () => {
    return globalFetch(`${base_url}active-agencies`)
      .then(async (response) => {

        const result = await response.json();

        if (response.ok) {
          return { success: true, data: result };
        } else {

          return { success: false, error: result };
        }
      })
      .catch((error) => {

        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getDeveloperProfile = (slug) => {
    setLoading(true)
    return globalFetch(`${base_url}developer/${slug}`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setLoading(false)
          return { success: true, data: result };
        } else {
          setLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false)
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const socailLogin = (credentials) => {
    setLoading(true);
    return globalFetch(`${base_url}auth/social-login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
      .then(async (response) => {
        setLoading(false);

        const result = await response.json();

        if (response.ok) {
          setLogindata(result); // Store user data in state
          localStorage.setItem("agent_data", JSON.stringify(result)); // Save to localStorage
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  const giveRivews = (data) => {
    setButtonLoading(true);
    return globalFetch(`${base_url}agent/rate/${data?.agentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setButtonLoading(false);
        handleClick()
        setError({
          message: "Feedback Sent Successfully!",
          color: "success"
        })
        const result = await response.json();

        if (response.ok) {

          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  };
  // Add helper for camelCase conversion, above getLOcation
  function toCamelCase(str) {
    return str
      .split(' ')
      .map((word, i) =>
        i === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
  }
  const forgetPassword = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}auth/forgot_password`, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        handleClick()
        setError({
          message: result?.message,
          color: "success"
        })
        setButtonLoading(false)
        return { success: true, data: result };
      } else {
        setButtonLoading(false)
        handleClick()
        setError({
          message: result?.message,
          color: "error"
        })
        return { success: false, error: result };
      }
    })
      .catch((error) => {
        setButtonLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const passwordReset = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}verify-agent`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          setButtonLoading(false)
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          handleClick()
          setError({
            message: result?.message,
            color: "error"
          })
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const deleteAgencyStaff = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}agent/agents/${data?.agency_id}`, {
      method: "DELETE",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setButtonLoading(false)
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false)
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const subscribeAlert = (data) => {
    setButtonLoading(true)
    return globalFetch(`${base_url}push-notifications/subscribe`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setButtonLoading(false)
          return { success: true, data: result };
        } else {
          setButtonLoading(false)
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        setButtonLoading(false)
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const forumTopics = () => {
    return fetch(`https://discourse.pakistanproperty.com/latest.json`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',

      }
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const emailVerification = (email_token) => {
    return globalFetch(`${base_url}auth/email_verification?token=${email_token}`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getHelpCenterCategories = () => {
    return globalFetch(`${base_url}help-center/categories `, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getHelpCenterSubcategories = (categorySlug) => {
    return globalFetch(`${base_url}help-center/category/${categorySlug}/articles`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }

  // Fetch currency rates from exchangerate-api.com
  const fetchCurrencyRates = async () => {
    setLoadingRates(true);
    try {
      // Using exchangerate-api.com free API (no API key required for basic usage)
      const response = await fetch('https://open.er-api.com/v6/latest/PKR');
      const data = await response.json();

      if (data && data.rates) {
        // Store rates with currency codes as keys
        const rates = {};
        Object.keys(data.rates).forEach(currency => {
          rates[currency] = data.rates[currency];
        });
        setCurrencyRates(rates);
        setLoadingRates(false);
        return { success: true, data: rates };
      } else {
        setLoadingRates(false);
        return { success: false, error: 'Failed to fetch currency rates' };
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      setLoadingRates(false);
      return { success: false, error: 'An unexpected error occurred while fetching currency rates.' };
    }
  };

  // Convert currency function
  const convertCurrency = (amount, fromCurrency, toCurrency = 'PKR') => {
    if (!currencyRates || Object.keys(currencyRates).length === 0) {
      return amount; // Return original amount if rates not loaded
    }

    // If converting from PKR to another currency
    if (fromCurrency === 'PKR' && toCurrency !== 'PKR') {
      const rate = currencyRates[toCurrency];
      if (rate) {
        return amount * rate;
      }
    }

    // If converting from another currency to PKR
    if (fromCurrency !== 'PKR' && toCurrency === 'PKR') {
      const rate = currencyRates[fromCurrency];
      if (rate) {
        return amount / rate;
      }
    }

    // If converting between two non-PKR currencies
    if (fromCurrency !== 'PKR' && toCurrency !== 'PKR') {
      const fromRate = currencyRates[fromCurrency];
      const toRate = currencyRates[toCurrency];
      if (fromRate && toRate) {
        // Convert to PKR first, then to target currency
        const pkrAmount = amount / fromRate;
        return pkrAmount * toRate;
      }
    }

    return amount; // Return original if conversion not possible
  };
  const helpCenterTopic = (slug) => {
    return globalFetch(`${base_url}help-center/${slug}`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const helpCenterFeedback = (articleId, data) => {
    return globalFetch(`${base_url}help-center/article/${articleId}/feedback`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          handleClick()
          setError({
            message: result?.message,
            color: "success"
          })
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const adsClick = (id) => {
    return globalFetch(`${base_url}ads/${id}/click`, {
      method: "POST",
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const adsImpression = (id) => {
    return globalFetch(`${base_url}ads/${id}/impression`, {
      method: "POST",
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      });
  }
  const getLocationSummery = (data) => {
    return globalFetch(`${base_url}properties/city-area-summary`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }
  const nearestCities = (data) => {
    return globalFetch(`${base_url}properties/nearest-cities?city_code=${data?.city_code}`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }
  const nearestTowns = (data) => {
    return globalFetch(`${base_url}properties/nearest-towns`, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }
  const getPropertyAmenities = (id) => {
    return globalFetch(`${base_url}properties/${id}/amenities`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        return { success: true, data: result };
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }
  const getSimilarProperties = (data) => {
    return globalFetch(`${base_url}similar-list?location_id=${data?.location_id}&user_id=${data?.user_id}&property_type_slug=${data?.property_type_slug}`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        return { success: true, data: result };
      })
      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }
  const getUserOfProperty = (id) => {
    return globalFetch(`${base_url}public-user/users/${id}`, {
      method: "GET"
    })
      .then(async (response) => {
        const result = await response.json();
        return { success: true, data: result };
      })

      .catch((error) => {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
      })
  }

  const getChatContacts = () => {
    return globalFetch(`${base_url}chat/threads`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred.' };
      });
  }

  const getChatMessages = (id) => {
    return globalFetch(`${base_url}chat/threads/${id}/messages`)
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          return { success: true, data: result };
        } else {
          return { success: false, error: result };
        }
      })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred.' };
      });
  }

  const sendChatMessage = (data) => {
    return fetch(`${base_url}chat/messages`, {
      method: 'POST',
      headers: {
        'Authorization': userData ? `Bearer ${userData?.data?.token}` : '',
        'Accept': 'application/json',
      },
      body: data
    }).then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result };
      }
    })
      .catch((error) => {
        return { success: false, error: 'An unexpected error occurred.' };
      });
    // }
  }

  const markMessagesAsRead = (threadId) => {
    return globalFetch(`${base_url}chat/threads/${threadId}/read`, {
      method: 'POST'
    }).then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result };
      }
    }).catch((error) => {
      return { success: false, error: 'An unexpected error occurred.' };
    });
  }

  /**
   * Send user log (page insight) to backend when user does inquiry / call / whatsapp / chat.
   * contact_type: "call" | "email" | "chat"
   * options: { currentPropertyId, propertySlug, contact, email }
   */
  const sendUserLog = (contactType, options = {}) => {
    const { currentPropertyId = null, propertySlug = null, contact = null, email = null, chat_thread_id = null ,inquiry_id = null} = typeof options === 'object' && options !== null ? options : { currentPropertyId: options };
    console.log(inquiry_id,chat_thread_id);
    const userId = userData?.data?.user?.id;
    const token = userData?.data?.token;
    let guestIdentifier = device_token || null;
    if (!guestIdentifier && typeof localStorage !== 'undefined') {
      try {
        guestIdentifier = localStorage.getItem('guest_device_identifier');
        if (!guestIdentifier) {
          guestIdentifier = 'session_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
          localStorage.setItem('guest_device_identifier', guestIdentifier);
        }
      } catch (e) {
        guestIdentifier = 'session_' + Date.now();
      }
    }
    if (!guestIdentifier) guestIdentifier = 'session_' + Date.now();

    const rawRecent = localStorage.getItem('recentViewed');
    const recentViewed = rawRecent ? JSON.parse(rawRecent) : [];
    const viewedIds = (recentViewed || []).map((item) => item?.id).filter(Boolean);

    const rawTime = localStorage.getItem('propertyTimeSpent');
    const timeSpentPerProperty = rawTime ? JSON.parse(rawTime) : {};
    const rawVisits = localStorage.getItem('propertyVisitCounts');
    const repeatVisits = rawVisits ? JSON.parse(rawVisits) : {};

    const currentStart = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('propertyViewStartTime') : null;
    const currentId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('propertyViewId') : null;
    if (currentStart && currentId) {
      const seconds = Math.round((Date.now() - Number(currentStart)) / 1000);
      const idStr = String(currentId);
      timeSpentPerProperty[idStr] = (timeSpentPerProperty[idStr] || 0) + seconds;
    }

    const timePerPropertyNumeric = {};
    let totalTimeOnSite = 0;
    Object.keys(timeSpentPerProperty).forEach((id) => {
      const n = Number(timeSpentPerProperty[id]) || 0;
      timePerPropertyNumeric[id] = n;
      totalTimeOnSite += n;
    });

    const repeatKeys = Object.keys(repeatVisits);
    const mostViewedId = repeatKeys.length
      ? Number(repeatKeys.reduce((a, b) => ((repeatVisits[a] || 0) >= (repeatVisits[b] || 0) ? a : b)))
      : (viewedIds.length ? Number(viewedIds[0]) : (currentPropertyId ? Number(currentPropertyId) : null));

    const rawFilters = localStorage.getItem('userLogFiltersUsed');
    let filtersUsed = {};
    try {
      if (rawFilters) filtersUsed = JSON.parse(rawFilters);
    } catch (e) {}

    const behavior_data = {
      viewed_properties: [...new Set(viewedIds)].map(Number).filter(Boolean),
      most_viewed_property: mostViewedId,
      time_spent_per_property: timePerPropertyNumeric,
      filters_used: filtersUsed,
      repeat_visits: repeatVisits,
      total_time_on_site: totalTimeOnSite
    };
    let allData;
    if (contactType === 'chat') {
      allData = {
        chat_thread_id: chat_thread_id || null
      };
    } else if(contactType === 'email' || contactType === 'whatsapp' || contactType === 'call') {
      allData = {
        inquiry_id: inquiry_id || null
      };
    } 
    const payload = {
      ...allData,
      user_id: userId || null,
      guest_identifier: guestIdentifier,
      property_slug: propertySlug || null,
      contact_type: contactType,
      contact: contact || null,
      email: email || null,
      timestamp: new Date().toISOString(),
      behavior_data
    };
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return fetch(`${base_url}user-logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  const getLeadJourney = (inquiryId) => {
    return globalFetch(`${base_url}lead/journey?inquiry_id=${inquiryId}`, {
      method: 'GET'
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) return { success: true, data: result };
        return { success: false, error: result };
      })
      .catch((error) => {
        return { success: false, error: error?.message || 'An unexpected error occurred.' };
      });
  };

  return (
    <Authdata.Provider value={{
      login,
      logout,
      loginData,
      countriesCode,
      callingCode,
      registar,
      loading,
      error,
      open,
      setOpen,
      setError,
      getType,
      propertyType,
      setPropertyType,
      getCity,
      getLOcation,
      setCitiesList,
      citiesList,
      locationList,
      setLocationList,
      getAmintites,
      aminitiesLoding,
      setAminitiesloading,
      serchProperty,
      propertyData,
      handleAddProperty,
      getProductList,
      currentCity,
      setCurrentCity,
      getPropertyDetail,
      formatPriceWithCommas,
      properyEnquery,
      formatPakistaniPhoneNumber,
      formatPakistaniLandline,
      handleOpenWhatsapp,
      projectType,
      projectTypeData,
      setProjectTypeData,
      propertiesByType,
      getAreaUnit,
      areaUnit,
      setAreaUnits,
      timeAgo,
      getProjects,
      propertyCountLisitng,
      getProjectsListing,
      buildSearchPayload,
      formatPrice,
      projectDetail,
      projectIquiry,
      button_loading,
      parseQueryParams,
      buildSearchPayloadProperty,
      objectToQueryString,
      whatsappImpretion,
      getProprtey,
      formatDate,
      handleUpdateProperty,
      homePagePreLocation,
      preLocationData,
      setpreLoactionData,
      homePagePreProperty,
      prePropertyData,
      setprePropertyData,
      getQoutaLogs,
      getQoutaState,
      addToCart,
      getCart,
      saveFavouritePropertyById,
      openLoanModal,
      setOpenLoanModal,
      closeDashboard,
      setCloseDashboard,
      handleLikeClick,
      favouriteList,
      bankDetail,
      payLaterOrder,
      craeteOrder,
      getOrderLIst,
      saveSearch,
      savedSearches,
      deleteSavedSearch,
      fetchFavourites,
      getSavedSearches,
      changePassword,
      updateSetting,
      updateProfile,
      featureAgency,
      updateOrder,
      getagency,
      agencyCeo,
      agencyProfile,
      planAgency,
      agencyList,
      getInqueries,
      agencyById,
      setButtonLoading,
      getDashboradListing,
      getDashboradAnalaytics,
      recentProperty,
      addAgencyStaff,
      getAgencyStaff,
      manageQuota,
      constructionCalulation,
      buildSearchPayloadCostCalculate,
      getPropertyIndex,
      filterPropertyIndex,
      buildSearchPayloadCPropertyIndex,
      getPropertyTrend,
      buildSearchPayloadCPropertyTrend,
      filterPropertyTrends,
      buildSearchPayloadLoanCalculate,
      getBlogList,
      getBlogDetail,
      applyForLoan,
      getLoansScheme,
      getAd,
      changePropertyStatus,
      upgradeProperty,
      instant,
      getHomeBlogs,
      latestBlog,
      staffPasswordSet,
      subscribeNewsLater,
      getTrustedAgency,
      trustedAgnecyList,
      setAdData,
      addData,
      loanList,
      setLoanList,
      getPackagesAgency,
      agencyPackageInquery,
      getNewsList,
      getNewsDetail,
      getHomeNews,
      latestNews,
      getSearchLocation,
      isLikedProperties,
      getUser,
      getActiveAgencies,
      activeAgencies,
      setActiveAgencies,
      buildSearchPayloadAgencies,
      getDeveloperProfile,
      socailLogin,
      giveRivews,
      updateAgencyStaff,
      forgetPassword,
      passwordReset,
      deleteAgencyStaff,
      globalPrice,
      globalArea,
      base_url,
      subscribeAlert,
      currencyRates,
      loadingRates,
      setCurrencyRates,
      setLoadingRates,
      fetchCurrencyRates,
      convertCurrency,
      openSignUp,
      setOpenSignUp,
      forumTopics,
      ceoLogin,
      emailVerification,
      getHelpCenterCategories,
      getHelpCenterSubcategories,
      helpCenterTopic,
      helpCenterFeedback,
      adsClick,
      adsImpression,
      getLocationSummery,
      nearestCities,
      nearestTowns,
      getPropertyAmenities,
      getSimilarProperties,
      getUserOfProperty,
      backtoSearchContentState,
      setBacktoSearchContentState,
      getChatContacts,
      getChatMessages,
      sendChatMessage,
      markMessagesAsRead,
      sendUserLog,
      getLeadJourney,
      setDeviceToken
    }}>
      {children}
    </Authdata.Provider>
  )
}
export const useAuth = () => useContext(Authdata);