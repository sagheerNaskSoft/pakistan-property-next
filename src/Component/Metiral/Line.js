
function Line({ margin, color }) {
    return (
        <svg className="w-100" style={{ margin: margin }} xmlns="http://www.w3.org/2000/svg" width="1224" height="2" viewBox="0 0 1224 2" fill="none">
            <path d="M0 1H1224" stroke={color ? color : "#BBBBBB"} />
        </svg>
    )
}

export default Line
