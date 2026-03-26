import { useAuth } from '../../../Context/ContextProvider';
import './PrimaryButton.css'
function PrimaryButton({ icon, text, height, width, padding, widthSize, onFunction  , maxWidth , whiteSpace}) {
  const { button_loading } = useAuth()
  return (
    <div onClick={(e) => {
      if (onFunction) {
        onFunction(e)
      }
      else {
        console.error("no function found!");

      }
    }} className="primary-button" style={{ maxWidth: maxWidth ? maxWidth : "", height: height ? height : "40px", width: widthSize || width ? widthSize ? widthSize : "100%" : 'fit-content', padding: padding ? '10px 20px' : '', whiteSpace: whiteSpace ? whiteSpace : '' , fontSize: whiteSpace ? '12px' : '' , fontWeight: whiteSpace ? '400' : '' , lineHeight: whiteSpace ? '18px' : ''  , padding: whiteSpace ? '10px 8px' : '' }}>
      {icon ?
        icon
        :
        ''
      }
      <div className="text">
        {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : text}
      </div>
    </div>
  )
}

export default PrimaryButton
