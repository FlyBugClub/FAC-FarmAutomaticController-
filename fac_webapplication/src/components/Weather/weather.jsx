import React, { useEffect, useState, useRef } from "react";
import './weather.scss'
 const Weather = () => {
    
    const itemsRef = useRef(null)

    const [isMosueDown, setIsMouseDown] = useState(false)
    const [startX, setStartX] = useState(false)
    const [scrollLeft, setScrollLeft] = useState(false)

    const hendleMouseDown = (e) => {
        setIsMouseDown(true)
        setStartX(e.pageX - itemsRef.current.offsetLeft)
        setScrollLeft(itemsRef.current.scrollLeft)
    }
    const hendleMouseMove = (e) => {
        if(!isMosueDown) return;
        e.preventDefault();
        const x = e.pageX - itemsRef.current.offsetLeft
        const walk = (x - startX) * 2
        itemsRef.current.scrollLeft = scrollLeft - walk
    }
    const hendleMouseUp = (e) => {
        setIsMouseDown(false)
    }
    const hendleMouseLeave = (e) => {
        setIsMouseDown(false)
    }

    return (
        <div className="Fac_Weather">
            <div className="Fac_Weather_MainBlock">
                <div className="Fac_Weather_MainBlock_Block">
                    
                </div>
            </div>
            <div className="Fac_Weather_Scroll"  ref = {itemsRef}
            onMouseDown = {(e) => hendleMouseDown(e)}
            onMouseMove = {(e) => hendleMouseMove(e)}
            onMouseUp = {(e) =>hendleMouseUp(e)}
            onMouseLeave = {(e)=>hendleMouseLeave(e)}>
                <div className="Fac_Weather_Scroll_Block">
                
                </div>
                <div className="Fac_Weather_Scroll_Block">
                    
                </div>
                <div className="Fac_Weather_Scroll_Block">
                    
                </div>
                <div className="Fac_Weather_Scroll_Block">
                    
                </div>
                <div className="Fac_Weather_Scroll_Block">
                    
                </div>
                 <div className="Fac_Weather_Scroll_Block">
                    
                </div>
                <div className="Fac_Weather_Scroll_Block">
                    
                    </div> 
                    <div className="Fac_Weather_Scroll_Block">
                    
                    </div>
            </div>
        </div>
    )
}

export default Weather