import React, { useContext, useEffect, useState } from 'react'
import imgs from '../../assets/imgs'
import { VidverseContext } from '../../Context/VidverseContext'
import { Link } from 'react-router-dom'
import Style from './SubscriptionUser.module.css'

const SubscriptionUser = () => {

    const [allUserData, setAllUserData] = useState([])
    const { registeredUser, getCreators } = useContext(VidverseContext)
    const [rnum, setRnum] = useState();
    const Rnum = Math.floor((Math.random() * 9) + 1);

    const fetchAllUserData = async () => {
        const allUser = await getCreators();
        console.log("All registered user data -->>>", allUser);
        setRnum(Rnum);
        setAllUserData(allUser);
    }

    useEffect(() => {
        fetchAllUserData()
    }, [])

    return (<div className={Style.container}>
        {
            allUserData.length>0 ? (
                <div className={Style.inContainer}>
                    {allUserData.map((user, index) => (
                        <div className={Style.userData} key={index}>
                            <Link to={`/creator/${user}`}>
                            <img src={imgs[`image${(rnum + index)%10}`]} alt="user Img" width={50} />
                             <div className={Style.nameAndAcc}>
                                    {/* Acc<div>{user}</div> */}
                                    <div>{(user).slice(0, 6)}...{(user).slice(-4)}</div>
                                </div>
                            </Link>
                        </div>
                    )
                    )
                    }
                </div>
            )
                : (
                    <p>
                        You have not subscribe any creator.
                    </p>
                )
        }
    </div>
    )
}

export default SubscriptionUser