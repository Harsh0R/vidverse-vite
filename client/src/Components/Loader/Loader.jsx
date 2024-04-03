import React from 'react'
import imgs from "../../assets/imgs"
import Style from "./Loader.module.css"

const Loader = () => {
    return (
        <div className={Style.loadingContainer}>
            <p>Loading...</p>
            <img className={Style.loader} src={imgs.loader} width={150} height={150} alt="Logo" />
        </div>
    )
}

export default Loader