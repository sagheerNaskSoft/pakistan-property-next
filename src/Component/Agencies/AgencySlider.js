import markaz from '../../Asset/Agencies/markaz.png'
import clan from '../../Asset/Agencies/clan.png'
import ahmedEstate from '../../Asset/Agencies/ahmad-estate.png'
import saiban from '../../Asset/Agencies/saiban.png'
import msEstate from '../../Asset/Agencies/ms-real-estate.png'
import lahore from '../../Asset/Agencies/lahore.png'
import bues from '../../Asset/Agencies/bues.png'
import realSouct from '../../Asset/Agencies/real-scout.png'
import Fine from '../../Asset/Agencies/fine-property.png'
import { FallbackImage } from '../Metiral/FallbackImage'

function AgencySlider() {

    const agency = [markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine, markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine , markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine, markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine , markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine, markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine , markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine, markaz, clan, ahmedEstate, saiban, msEstate, lahore, bues, realSouct, Fine]

    return (
        <div className='agency-slider'>
            <div className="agency-slider-track">
                {
                    agency.map((data) => (
                        <div className="img">
                            <FallbackImage src={data} alt="" componentName="AgencySlider" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AgencySlider
