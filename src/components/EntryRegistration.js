import React, { useEffect, useState } from 'react'
import '../css/entryregistration.css'
import { useLocation } from 'react-router-dom';
import { CgClose } from "react-icons/cg";
import axios from 'axios'

export default function EntryRegistration({toggleEntryRegistration}) {
    const API_URL = "http://localhost:5000"

    // 휴대폰 인증 정보 가져오기
    const location = useLocation();
    const { verificationData } = location.state || {};

    // 개인정보 가져와서 넣기
    useEffect(()=>{
        const name = document.querySelector('#name');
        const callNumber = document.querySelector('#callNumber');
        name.value = verificationData.name;
        callNumber.value = verificationData.callNumber;
    },[])
    
    // 2. 데이터 목서버로 전송
    const [entryregistrationData, setEntryregistrationData] = useState({
        clientName: "",
        partnerCompany: "",
        name:"",
        position:"",
        entryDate:"",
        entryTime:"",
        purpose:"",
        callNumber:""
    })

    const handleChange = (e) => {
        const{id, value} = e.target;
        setEntryregistrationData({
            ...entryregistrationData,
            [id]: value
        })
    }
    // 문제점 가져온 데이터가 onchange가 아니여서 변경이 안됨

    const addSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}/entrylist`, entryregistrationData);
            setEntryregistrationData({
                clientName: "",
                partnerCompany: "",
                name:"",
                position:"",
                entryDate:"",
                entryTime:"",
                purpose:"",
                callNumber:""
            })
            console.log(entryregistrationData)
        } catch (error) {
            console.error("등록 에러 발생");
        }
    }



    // 3.출일일시, 출입날짜 디자인 변경


    // 여기는 출입명단 작성
    // 아래에 다른 컴포넌트로 등록한 명단 나오게 하기(삭제 버튼)
    return (
        <div id='entryregistration-body'>
            <div id='entryregistration-top'>
                <div id='entryregistration-closebutton' onClick={toggleEntryRegistration}>
                    <CgClose />
                </div>
                <div id='entryregistration-title'>
                    출입 등록
                </div>
            </div>
            <hr/>
            <div id='entryregistration-input'>
                <div id='entryregistration-input-clientname'>
                    <label>
                        <span id='entryregistration-input-title'>고객사명</span><br />
                        <input type='text' id='clientName' placeholder='고객사명' onChange={handleChange}/>
                    </label>
                </div>
                <div id='entryregistration-input-partnercompany'>
                    <label>
                        <span id='entryregistration-input-title'>협력업체</span><br />
                        <input type='text' id='partnerCompany' placeholder='협력업체'onChange={handleChange} />
                    </label>
                </div>
                <div id='entryregistration-input-name'>
                    <label>
                        <span id='entryregistration-input-title'>성명</span><br />
                        <input type='text' id='name' placeholder='성명' onChange={handleChange} />
                    </label>
                </div>
                <div id='entryregistration-input-position'>
                    <label>
                        <span id='entryregistration-input-title'>직위</span><br />
                        <input type='text' id='position' placeholder='직위' onChange={handleChange}/>
                    </label>
                </div>
                <div id='entryregistration-input-callNumber'>
                    <label>
                        <span id='entryregistration-input-title'>연락처</span><br />
                        <input type='number' id='callNumber' placeholder='연락처 (숫자만)' onChange={handleChange}/>
                    </label>
                </div>
                <div id='entryregistration-input-entrydate'>
                    <label>
                        <span id='entryregistration-input-title'>출입일시</span><br />
                        <div id='entryregistration-input-entrydate-flex'>
                            {/* 출입일시 스크롤 형식 */}
                            <input type='date' id='entryDate' placeholder='출입날짜' onChange={handleChange}/>
                            {/* 시간만 나오게 하고, 스크롤 형식 */}
                            <input type='time' id='entryTime' placeholder='출입시간'onChange={handleChange} />
                        </div>
                    </label>
                </div>
                <div id='entryregistration-input-purpose'>
                    <label>
                        <span id='entryregistration-input-title'>출입목적</span><br />
                        <input type='text' id='purpose' placeholder='출입목적' onChange={handleChange}/>
                    </label>
                </div>
            </div>
            <div id='entryregistration-entrybutton' onClick={addSubmit}>등록</div>
        </div>
    )
}
