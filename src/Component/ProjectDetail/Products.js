import { useEffect, useState } from 'react';
import img from "../../Asset/Projects/Group (1).svg";
import img2 from '../../Asset/Projects/pent_houce.svg';
import img3 from '../../Asset/Projects/fi-rr-shop.svg';
import img4 from '../../Asset/Projects/Group (2).svg';
import img5 from '../../Asset/Projects/fi-rr-compress-alt.svg';
import img6 from '../../Asset/Projects/fi-rr-bed.svg';
import img7 from '../../Asset/Projects/Shower.svg';
import img8 from '../../Asset/Projects/emty-img.svg';
import { useAuth } from '../../Context/ContextProvider';
import CustomTooltip from '../Metiral/CustomTooltip';
import Image from 'next/image';
function Products({ project_categories }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(project_categories?.length ? project_categories[0] : '');
  const { formatPrice } = useAuth()
  useEffect(() => {
    setSelectedCategory(project_categories?.length ? project_categories[0] : '')
  }, [project_categories])
  return (
    <>
      <div id='product-section' className='product-heading-h3 pe-0 ps-0 mb-2 mt-3'>
        <h3 className='mb-3'>Available Products</h3>
      </div>

      <div className="products-tabs ps-0 pe-0" style={{ width: 'fit-content' }}>
        {project_categories?.map((tab, idx) => (
          <div
            key={`project-tab-${tab?.id || tab?.slug || tab?.name || idx}`}
            className={`tab-item ${activeTab === idx ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(idx)
              setSelectedCategory(tab)
            }}
            style={{
              borderBottom: activeTab === idx ? '2px solid #447158' : '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            <Image
              src={img}
              alt={tab?.name}
              className="tab-icon"
              style={
                activeTab === idx
                  ? {
                    filter:
                      'brightness(0) saturate(100%) invert(39%) sepia(11%) saturate(826%) hue-rotate(83deg) brightness(93%) contrast(85%)',
                  }
                  : {}
              }
            />
            <h6 style={activeTab === idx ? { color: '#447158' } : {}}>{tab?.name}</h6>
          </div>
        ))}
      </div>

      <div className='product-cards mt-sm-4 mt-2'>

        <div className='product-span-h3'>
          <h4>Price Range: </h4>
          <h3>{selectedCategory?.min_price && formatPrice(selectedCategory?.min_price)} - {selectedCategory?.max_price && formatPrice(selectedCategory?.max_price)}</h3>
          <h6>PKR</h6>
        </div>


        {selectedCategory?.properties?.map((item, index) => (
          <div
            key={`project-product-${item?.id || item?.property_id || item?.property_title || index}`}
            className='apartments-cards mt-3'
            style={activeTab === 'Apartments' ? { border: 'none', backgroundColor: 'transparent', boxShadow: 'none' } : {}}
          >


            {item?.minimum_price_range && item?.maximum_price_range && (
              <div>
                <h4 className='studio-apartments'>{item?.property_title}</h4>
                <CustomTooltip placement={"top"} title={`PKR ${item?.minimum_price_range && formatPrice(item?.minimum_price_range)} - ${item?.maximum_price_range && formatPrice(item?.maximum_price_range)}`}>
                  <h4 className='pkr-apartments'>PKR {item?.minimum_price_range && formatPrice(item?.minimum_price_range)} - {item?.maximum_price_range && formatPrice(item?.maximum_price_range)}</h4>

                </CustomTooltip>
              </div>)
            }

            {
              item?.minimum_area_range && item?.maximum_area_range && (
                <div style={{ marginRight: '30px' }} className='product-cards-imgs'>
                  <div className='product-areas'>
                    <Image style={{ marginRight: '7px' }} src={img5} alt='marla' />
                    <div style={{ marginTop: '10px' }} className='pro-marla'>
                      <h5>{item.minimum_area_range} - {item.maximum_area_range}</h5>
                      <CustomTooltip placement={"top"} title={item?.area_unit}>

                        <h6>{item?.area_unit}</h6>
                      </CustomTooltip>
                    </div>
                  </div>
                </div>
              )
            }

            {
              item?.no_of_beds && (
                <div style={{ marginRight: '30px' }} className='product-cards-imgs'>
                  <div className='product-areas'>
                    <Image style={{ marginRight: '10px' }} src={img6} alt='beds' />
                    <div style={{ marginTop: '10px' }} className='pro-marla'>
                      <h5>{item.no_of_beds ? item.no_of_beds : "-"}</h5>
                      <h6>beds</h6>
                    </div>
                  </div>
                </div>
              )
            }

            {
              item?.no_of_bathrooms && (
                <div className='product-cards-imgs'>
                  <div className='product-areas'>
                    <Image style={{ marginRight: '10px' }} src={img7} alt='baths' />
                    <div style={{ marginTop: '10px' }} className='pro-marla'>
                      <h5>{item.no_of_bathrooms ? item.no_of_bathrooms : "-"}</h5>
                      <h6>baths</h6>
                    </div>
                  </div>
                </div>
              )
            }
            {
              item?.no_of_kitchens && (
                <div className='product-cards-imgs'>
                  <div className='product-areas'>
                    <Image style={{ marginRight: '10px' }} src={img7} alt='baths' />
                    <div style={{ marginTop: '10px' }} className='pro-marla'>
                      <h5>{item.no_of_kitchens ? item.no_of_kitchens : "-"}</h5>
                      <h6>Kitchens</h6>
                    </div>
                  </div>
                </div>
              )
            }

          </div>
        ))}
      </div>
    </>
  );
}

export default Products;
