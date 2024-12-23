import React from 'react'
import '../css/home.css'
import { useNavigate } from 'react-router-dom';

export default function Home() { 
 const date = new Date().toLocaleDateString(); 
 
 const options = {
     hour: '2-digit',
     minute: '2-digit',
     hour12: true
    };

const time = new Date().toLocaleTimeString('ko-KR', options);

 const navigate = useNavigate();
 const navigateToEnter = () =>{
     navigate('/ibk/entry/phoneVerification')
 }

  return (
    <div id='home-body'>
        <div id='home-title'> 
            통합전산센터<br/>
            출입등록시스템
        </div>
        <div id='home-date'>
            일시: {date} {time}
        </div>
        <div id='home-button' onClick={navigateToEnter}>
            등록
        </div>
    </div>
  )
}
