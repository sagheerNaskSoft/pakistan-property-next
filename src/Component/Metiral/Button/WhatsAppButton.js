import { useAuth } from '../../../Context/ContextProvider'
import './PrimaryButton.css'
function PrimaryButton({ icon, text, contactNumber, height, width, padding, widthSize, maxWidth, modified, onFunction }) {
  const {handleOpenWhatsapp}=useAuth()
  return (
    <div onClick={()=>{
      if(onFunction) {
        onFunction();
      } else if(contactNumber){
        handleOpenWhatsapp(contactNumber)
      }
    }} className="whatsapp-button" style={{ maxWidth: maxWidth ? maxWidth : "", height: height ? height : "40px", width: widthSize || width ? widthSize ? widthSize : "100%" : 'fit-content', padding: padding ? '10px 20px' : '', backgroundColor: modified ? "white" : '' }}>
      {icon ?
        icon
        :
        ''
      }
      <div className="text">
        {text}
      </div>
    </div>
  )
}

export default PrimaryButton
