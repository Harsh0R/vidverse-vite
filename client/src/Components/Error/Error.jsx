import React from 'react'
import Style from "./Error.module.css"

const Error = ({error}) => {
    return (
        <div> <div className={Style.Error}>
            <div className={Style.Error_box}>
                <h3>Please Fix this Error & Reload Browser!!..😥</h3>
                {error}
            </div>
        </div></div>
    )
}

export default Error