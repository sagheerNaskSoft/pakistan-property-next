import noListing from '../../Asset/Property Index/noListing.svg'
import { FallbackImage } from './FallbackImage'

function NoListing({maxWidth}) {
    return (
        <div className=" no-listing-found-section d-flex justify-content-center align-items-center">
            <div style={{ maxWidth: maxWidth ? maxWidth  : '', width: window.innerWidth <= 768 ? '60%' : '100%' }}>
                <FallbackImage className="w-100" src={noListing} alt="No listing found" componentName="NoListing" />
            </div>
            <div className='text-center' style={{ marginTop: '20px' }}>No listing found</div>
        </div>
    )
}

export default NoListing

