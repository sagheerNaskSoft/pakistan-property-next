import home from '../../Asset/Property Index/home.svg'
import home_selected from '../../Asset/Property Index/home_selected.svg'
import plot from '../../Asset/Property Index/plot.svg'
import plot_selected from '../../Asset/Property Index/plot_selected.svg'
import building from '../../Asset/Property Index/building.svg'
import building_selected from '../../Asset/Property Index/building_selected.svg'
import { useState } from 'react'



function Topsearch({ locationName, cityName }) {
    const [activeTab, setActiveTab] = useState("Home")
    const tabData = [
        {
            tabName: "Home",
            activeIcon: home_selected,
            icon: home,
        },
        {
            tabName: "Plot",
            activeIcon: plot_selected,
            icon: plot,
        },
        {
            tabName: "Commerical",
            activeIcon: building_selected,
            icon: building,
        },
    ]


    return (
        <>
            <div className='main-container'>
   
            </div>
        </>
    )
}

export default Topsearch
