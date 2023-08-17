import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useNavigate} from "react-router-dom"

const useTokenRefresh = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access'));
  const [refToken, setRefToken] = useState(localStorage.getItem('refresh'));
  const backendURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate()
  const refreshToken = async () => {
    try {
      const response = await fetch(`${backendURL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: localStorage.getItem('refresh'), // Your refresh token
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;
        const newRefreshToken = data.refresh;
        localStorage.setItem('access', newAccessToken);
        localStorage.setItem('refresh', newRefreshToken);
        setAccessToken(newAccessToken);
        setRefToken(newRefreshToken);
      } else {
        console.error('Failed to refresh token');
        navigate("/login")
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (accessToken && jwt_decode(accessToken).exp < Date.now() / 1000) {
        refreshToken();
      }
      else {
      }
    };

    const tokenCheckInterval = setInterval(checkTokenExpiry, 15000);

    return () => clearInterval(tokenCheckInterval);
  }, [accessToken]);

  return accessToken;
};

export default useTokenRefresh;
