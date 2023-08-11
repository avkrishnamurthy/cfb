import React, {useEffect} from 'react';
import Register from '../components/Register'
import { useNavigate } from "react-router-dom";
export default function RegisterPage() {
    let navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('access')) {
            navigate("/home")
        }
    })
    
    return (
        <>
            <Register/>
        </>
    )
}