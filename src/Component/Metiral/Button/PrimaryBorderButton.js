import './PrimaryBorderButton.css'
function PrimaryButton({ icon, text, height, width, padding, widthSize, mediaQuery, maxWidth, onFunction, modified }) {
  return (
    <div onClick={(e) => {
      if (onFunction) {
        onFunction(e)
      }
      else {
        console.error("no function found!");

      }
    }} className={mediaQuery ? "primary-border-button" : modified ? "media primary-border-button modified" : "media primary-border-button"} style={{ maxWidth: maxWidth ? maxWidth : "", height: height ? height : "40px", width: widthSize || width ? widthSize ? widthSize : "100%" : 'fit-content', padding: padding ? '10px 20px' : '', borderColor: modified ? "white" : "" }}>
      {icon ?
        icon
        :
        ''
      }
      <div className="text" style={{ color: modified ? "white" : "" }}>
        {text}
      </div>
    </div>
  )
}

export default PrimaryButton
