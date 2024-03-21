import React, { useContext, useState } from 'react'
import { VidverseContext } from '../../Context/VidverseContext'

import Style from "./Register.module.css"


const Register = () => {

    const { registerUser, account } = useContext(VidverseContext)
    const [username, setUsername] = useState()

    const handleRegisterData = async (e) => {
        e.preventDefault();
        console.log("Form Submit", username, account);
        await registerUser(username, account)
    }

    return (
        <div className={Style.container}>

            <form onSubmit={handleRegisterData}>
                Enter Username :
                <input type="text" name="Amount" id="Amount" onChange={(e) => setUsername(e.target.value)} required />
                <br />
                Your Address :
                {account}
                {/* <input type="text" name="Account" id="Account" onChange={(e) => setUseraccount(e.target.value)} required /> */}
                <br />
                <button type="submit" value="submit">Registre</button>
            </form>
        </div>
    )
}

export default Register