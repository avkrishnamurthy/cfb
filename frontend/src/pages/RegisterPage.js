import React, {useEffect, useState} from 'react';
import Register from '../components/Register'
import { useNavigate } from "react-router-dom";
export default function RegisterPage() {
    const backendURL = process.env.REACT_APP_API_URL
    let navigate = useNavigate()
    const [validToken, setValidToken] = useState(false)
    function validateJWTToken() {
        const endpoint = `${backendURL}/api/token/verify/`
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: localStorage.getItem('access')})
        }

        try {
            fetch(endpoint, options).then(response => {

                if (response.status === 200 || response.status === 201) {
                    setValidToken(true)
                }
                else {
                    setValidToken(false)
                }
                response.json()
            }).then(x=> {
                //refresh token
            })
        }
        catch {
            console.log("Error")
        }
        
    }
    useEffect(() => {
        validateJWTToken()
        if (validToken) {
            navigate("/home")
            return
        }
    }, [validToken])
    
    return (
        <>
            <Register/>
        </>
    )
}