import React from 'react'
import Style from "./Error.module.css"

const Error = ({error}) => {
    return (
        <div> <div className={Style.Error}>
            <div className={Style.Error_box}>
                <h3>{error}</h3>
                <div>Please Fix this Error & Reload Browser!!..😥</div>
            </div>
        </div></div>
    )
}

export default Error