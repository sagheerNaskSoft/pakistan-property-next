import property_not_found from '../../Asset/property_not_found.svg'
import { FallbackImage } from './FallbackImage'
function NoResultFound({marginTop , message , height}) {
    return (
        <div className="no-result-found-global" style={{backgroundColor:"white" , borderRadius:"8px" , marginTop:marginTop ? marginTop : "" , height:height ? height : "", maxHeight:height ? 'unset' : ""}}>
           <div className="img-box">
           <FallbackImage src={property_not_found} alt="property_not_found" componentName="NoResultFound" />
           </div>
            <div className="text">{message ? message : "No Result Found"}</div>
        </div>
    )
}

export default NoResultFound