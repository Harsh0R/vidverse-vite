import React, { useContext, useEffect, useState } from 'react'
import imgs from '../../assets/imgs'
import { VidverseContext } from '../../Context/VidverseContext'
import { Link } from 'react-router-dom'
import Style from './SubscriptionUser.module.css'

const SubscriptionUser = ({ context }) => {

    const [allUserData, setAllUserData] = useState([])
    const { registeredUser, getCreators, getSubs } = useContext(VidverseContext)
    const [rnum, setRnum] = useState();
    const Rnum = Math.floor((Math.random() * 9) + 1);

    const fetchAllUserData = async () => {
        if (context !== '') {
            console.log("Context ==>", context);
            const allUser = await getSubs(context);
            console.log("Get subs ==> ", allUser);
            setAllUserData(allUser);
        } else {
            const allUser = await getCreators();
            setAllUserData(allUser);
        }
        // console.log("All registered user data -->>>", allUser);
        setRnum(Rnum);
    }

    useEffect(() => {
        fetchAllUserData()
    }, [])

    return (<div className={Style.container}>
        {
            allUserData.length > 0 ? (
                <div className={Style.inContainer}>
                    {allUserData.map((user, index) => (
                        <div className={Style.userData} key={index}>
                            <Link to={`/creator/${user}`}>
                                <img src={imgs[`image${(rnum + index) % 10}`]} alt="user Img" width={50} />
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
                    <div>
                        {context ? (
                            <p>
                                You have no subscriber.
                            </p>
                        ) : (
                            <p>
                                You have not subscribe any creator.
                            </p>

                        )
                        }
                    </div>
                )
        }
    </div>
    )
}

export default SubscriptionUser