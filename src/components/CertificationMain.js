import React, { useState } from 'react'
import '../css/cetificationmain.css'
import { useLocation, useNavigate } from 'react-router-dom';

export default function CertificationMain() {
    // 개인정보 가져오기
    const location = useLocation();
    const { verificationData } = location.state || {}; 

    const [certificationData, setCertificationData] = useState({
        certification: ""
    });

    const handleChange =(e) => {
        const {id, value} = e.target;

        setCertificationData({
            ...certificationData,
            [id]: value
        });
    }

    const isCertificationComplete = () => certificationData.certification.length == 6;

    const certificationSubmit = async () => {

        if(isCertificationComplete()){
            console.log("인증번호:", certificationData.certification);
            navigate('/ibk/entry/entry', { state: { verificationData } });
        }
    }

    const navigate = useNavigate();

    // 인증번호 재전송 누르면 정보 보내지고, 인증번호 초기화
    const reCertificationSubmit = ()=> {
        const certification = document.querySelector("#certification");
        const certificationButton = document.querySelector("#certificationmain-button")

        try {
            console.log(verificationData)
            certification.value = '';
            certificationData.certification ='';
            certificationButton.style.backgroundColor ='#bccae8';
            
        } catch (error) {
            console.error("인증번호 오류 발생")
        }
    }






    return (
        <div id='certificationmain-body'>
            <div id='certificationmain-title'>
                인증번호 입력
            </div>
            <div id='certificationmain-container'>
                <div id='certificationmain-input'>
                    <label>
                        <span id='certificationmain-input-title'>인증번호</span><br />
                        <input type='text' id='certification' placeholder='인증번호' onChange={handleChange}  maxlength='6'/>
                    </label>
                </div>
                <div id='certificationmain-re-button' onClick={reCertificationSubmit}>
                    인증번호 재전송
                </div>
            </div>
            {/* 클릭 버튼 수정 */}
            <div id='certificationmain-button'
            onClick={certificationSubmit}
            style={{backgroundColor: isCertificationComplete()? "#2150b2" : "#bccae8",
                cursor: isCertificationComplete() ? "pointer" : "not-allowed",
            }}
            >
                확인 
            </div>
        </div>
    )
}
