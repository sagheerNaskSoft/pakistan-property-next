import { BiCategory } from "react-icons/bi";
import { FallbackImage } from '../Metiral/FallbackImage';
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../Context/ContextProvider";

function Categories({ categoryData , data  }) {
  const {projectTypeData}=useAuth()
  const {slug}=useParams()
  // get the id if present for slug, otherwise fallback to first available or 0
  const projectTypeObj = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === slug);
  const projectTypeId = projectTypeObj?.id || projectTypeData?.[0]?.id || 0;
  return (
    <>
      <div className="project-categories">
        <div className="heading" >{data ? data : "Find Projects by Categories"}</div>
        <div className="row" style={{ gap: '16px 0' }}>
          {categoryData?.map((data, index) => (
            <div
              className="col-lg-2 col-md-3 col-sm-4 col-6"
              key={index}
            >
              <Link
                style={{textDecoration:'none'}}
                to={`/project-listing/${slug ? slug : "housing-societies"}?project_type_id=${data?.category_id}&sub_category_id[]=${data?.sub_category_id}&city_code=PP016`}
              >
                <div className="card-box"
                  style={{ transition: "background-color 0.3s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = data?.color ? data?.color : "#A4CCFB4D")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "")
                  }>
                  <div
                    className="img"
                  >
                    {
                      data?.image_url?
                      <>
                      <FallbackImage src={data?.image_url }  className="img1" alt="" componentName="Categories" />
                      <FallbackImage src={data?.hover_image_url }  className="img2" alt="" componentName="Categories" />
                      </>
                    : <BiCategory style={{fontSize:'18px'}} />
                    }
                  </div>
                  <div className="text-box">
                    <div className="title">{data?.sub_category_name}</div>
                    <div className="number">{data?.project_count} Projects</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Categories
