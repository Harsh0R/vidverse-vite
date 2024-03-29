import React, { useContext, useEffect, useState } from 'react'
import imgs from '../../assets/imgs'
import { VidverseContext } from '../../Context/VidverseContext'
import Style from "./RegisteredUsers.module.css"
import { Link } from 'react-router-dom'

const RegisteredUsers = () => {

  const [allUserData, setAllUserData] = useState([])
  const { getAllUniqueRegisteredUsers } = useContext(VidverseContext)

  const fetchAllUserData = async () => {
    const allUser = await getAllUniqueRegisteredUsers();
    console.log("All registered user data -->>>", allUser);
    setAllUserData(allUser);
  }

  useEffect(() => {
    fetchAllUserData()
  }, [])


  return (
    <div className={Style.container}>
      {
        allUserData && (
          <div>
            {allUserData.map((user, index) => (
              <div className={Style.userData}>
                <Link to={`/creator/${user.userAddress}`} key={index}>
                  <img src={imgs.image3} alt="user Img" width={50} />
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