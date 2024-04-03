import React, { useContext, useState } from 'react'
import { VidverseContext } from '../../Context/VidverseContext'

import Style from "./Register.module.css"
import Loader from '../../Components/Loader/Loader'


const Register = () => {

    const { registerUser, account} = useContext(VidverseContext)
    const [username, setUsername] = useState()

    const handleRegisterData = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        console.log("Form Submit", username, account);
        try {
            await registerUser(username, account);
            // Handle successful registration if needed
        } catch (error) {
            console.error("Registration failed", error);
            // Handle registration failure if needed
        } finally {
            setIsLoading(false); // End loading regardless of success or failure
        }
    }
    const [isLoading, setIsLoading] = useState(false); // New state to track loading status


    return (
        <div className={isLoading ? (Style.load) : (Style.container)}>
            {isLoading ? (
                <div className={Style.load}><Loader /></div> // Render your loading component here
            ) : (
                <form onSubmit={handleRegisterData}>
                    Enter Username :
                    <input type="text" name="Username" id="Username" onChange={(e) => setUsername(e.target.value)} required />
                    <br />
                    Your Address :
                    {account}
                    <br />
                    <button className={Style.regbtn} type="submit" value="submit" disabled={isLoading}>Register</button>
                </form>
            )}
        </div>
    )
}

export default Register