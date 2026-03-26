import star from '../../Asset/Agencies/star.svg'
import Image from 'next/image';
const platinumtag = <svg xmlns="http://www.w3.org/2000/svg" width="6" height="2" viewBox="0 0 6 2" fill="none">
<path d="M0 2L6 0V1.99988L0 2Z" fill="#606064"/>
</svg>
const goldtag =<svg xmlns="http://www.w3.org/2000/svg" width="6" height="2" viewBox="0 0 6 2" fill="none">
<path d="M0 2L6 0V2H0Z" fill="#C6A700"/>
</svg>
const bronzetag = <svg xmlns="http://www.w3.org/2000/svg" width="6" height="2" viewBox="0 0 6 2" fill="none">
<path d="M0 2L6 0V2H0Z" fill="#734404"/>
</svg>

function AgencyTag({ leftArrow, text, rightArrow, size, backColor, borderR, noTag , width, bottom, left}) {
  return (
    <div className='global-agency-tag d-flex align-items-center' style={{ background: backColor, width: width ? width : '100%', padding: '0 4px', borderRadius: borderR ? "" : "4px", gap: '4px',height: "20px", position:"absolute",bottom:bottom ? bottom : "-6px", left:left ? left : "10px"}}>
      {
        noTag ? '' : <div className="tag" style={{
        position: "absolute",
        top: -14.2,
        left: "-1px",
        width: 50,
      }}>{
        text === "Platinum" ? platinumtag : text === "Gold" ? goldtag : bronzetag
      }</div>}
      {
        leftArrow ?
        text==="Bronze" ? <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path d="M2.99997 0L3.74164 2.2751L6 2.29178L4.19998 3.75832L4.85409 6L2.99997 4.67508L1.14585 6L1.79996 3.75832L0 2.29178L2.25836 2.2751L2.99997 0Z" fill="#E8B47E"/>
      </svg> :
          <Image style={{ marginBottom: '1px' }} src={star}  alt="" /> : ''
      }
      <span style={{ color: `${text==="Bronze"?"#E8B47E":"#272523"}`, fontSize: size ? size : "12px", fontStyle: "normal", fontWeight: "900", lineHeight: "normal", fontFamily: '"Source Sans 3", sans-serif', textTransform: 'upperCase', whiteSpace: "nowrap" }}>{text}</span>
      {
        rightArrow ?
        text==="Bronze" ? <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path d="M2.99997 0L3.74164 2.2751L6 2.29178L4.19998 3.75832L4.85409 6L2.99997 4.67508L1.14585 6L1.79996 3.75832L0 2.29178L2.25836 2.2751L2.99997 0Z" fill="#E8B47E"/>
      </svg> :
          <Image tyle={{ marginBottom: '1px' }} src={star}  alt="" /> : ''
      }
    </div>
  )
}

export default AgencyTag
