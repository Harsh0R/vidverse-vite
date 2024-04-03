import React, { useContext, useEffect, useState } from 'react'
import imgs from '../../assets/imgs'
import { VidverseContext } from '../../Context/VidverseContext'
import Style from "./RegisteredUsers.module.css"
import { Link } from 'react-router-dom'

const RegisteredUsers = () => {

  const [allUserData, setAllUserData] = useState([])
  const { getAllUniqueRegisteredUsers } = useContext(VidverseContext)
  const [rnum, setRnum] = useState();
  const Rnum = Math.floor((Math.random() * 9));
  const fetchAllUserData = async () => {
    const allUser = await getAllUniqueRegisteredUsers();
    console.log("All registered user data -->>>", allUser);
    setRnum(Rnum);
    setAllUserData(allUser);
  }

  useEffect(() => {
    fetchAllUserData()
  }, [])


  return (
    <div >
      {
        allUserData && (
          <div className={Style.container}>
            {allUserData.map((user, index) => (
              <div className={Style.userData}  key={index}>
                <Link to={`/creator/${user.userAddress}`}>
                  <img src={imgs[`image${((rnum + index)%10)}`]} alt="user Img" width={50} />
                  <div className={Style.nameAndAcc}>
                    <div>User Name : {user.username}</div>
                    <div>User Account : {(user.userAddress).slice(0, 6)}...{(user.userAddress).slice(-4)}</div>
                  </div>
                </Link>
              </div>
            ))
            }
          </div>
        )
      }
    </div>
  )
}

export default RegisteredUsers