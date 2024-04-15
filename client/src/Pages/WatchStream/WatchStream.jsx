import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VidverseContext } from '../../Context/VidverseContext'
import ShowStream from '../../Components/ShowStream/ShowStream'
import Style from './WatchStream.module.css'

const WatchStream = () => {
    const {getStream} = useContext(VidverseContext)
    const { id } = useParams()


    console.log("",id);

    return (
        <div className={Style.container}>
        <ShowStream streamId={id} />
        </div>
    )
}

export default WatchStream