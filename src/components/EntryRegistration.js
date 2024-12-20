import React, { useEffect, useState } from 'react'
import '../css/entryregistration.css'
import { useLocation } from 'react-router-dom';
import { CgClose } from "react-icons/cg";
import axios from 'axios'
import DateModal from './DateModal';
import Test from './Test';

export default function EntryRegistration({toggleEntryRegistration}) {
    const API_URL = "http://localhost:5000"

    // 휴대폰 인증 정보 가져오기
    const location = useLocation();
    const { verificationData } = location.state || {};

    const initialState = {
        clientName: "",
        partnerCompany: "",
        name: "",
        position: "",
        entryDate: "",
        entryTime: "",
        purpose: "",
        callNumber: "",
    };

    // entryregistrationData 상태 정의
    const [entryregistrationData, setEntryregistrationData] = useState(initialState);
    const [verificationState, setVerificationState] = useState(verificationData);

    // verificationData를 초기화
    useEffect(() => {
        if (verificationState) {
            setEntryregistrationData({
                ...initialState,
                name: verificationState?.name || "",
                callNumber: verificationState?.callNumber || "",
            });
        }
    }, [verificationState]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEntryregistrationData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const addSubmit = async () => {
        try {
            // 서버로 데이터 전송
            await axios.post(`${API_URL}/entrylist`, entryregistrationData);
            console.log("등록된 데이터:", entryregistrationData);

            // 데이터 초기화
            setEntryregistrationData(initialState); // 폼 초기화
            setVerificationState(null); // verificationState 초기화
        } catch (error) {
            console.error("등록 에러 발생:", error);
        }
    };

    const handleClose = () => {
        toggleEntryRegistration(); // 부모 컴포넌트에서 닫기 처리
        setVerificationState(null); // verificationState 초기화
    };


    const [openDate, setOpenDate] = useState(false);

    const isOpenDate = () => {
        setOpenDate(!openDate);
    }


    // 여기는 출입명단 작성
    // 아래에 다른 컴포넌트로 등록한 명단 나오게 하기(삭제 버튼)
    return (
        <div id='entryregistration-body'>
            <div id='entryregistration-top'>
                <div id='entryregistration-closebutton' onClick={handleClose}>
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
                        <input type='text' id='clientName' placeholder='고객사명' onChange={handleChange} value={entryregistrationData.clientName}/>
                    </label>
                </div>
                <div id='entryregistration-input-partnercompany'>
                    <label>
                        <span id='entryregistration-input-title'>협력업체</span><br />
                        <input type='text' id='partnerCompany' placeholder='협력업체'onChange={handleChange} value={entryregistrationData.partnerCompany}/>
                    </label>
                </div>
                <div id='entryregistration-input-name'>
                    <label>
                        <span id='entryregistration-input-title'>성명</span><br />
                        <input type='text' id='name' placeholder='성명' onChange={handleChange} value={entryregistrationData.name}/>
                    </label>
                </div>
                <div id='entryregistration-input-position'>
                    <label>
                        <span id='entryregistration-input-title'>직위</span><br />
                        <input type='text' id='position' placeholder='직위' onChange={handleChange} value={entryregistrationData.position}/>
                    </label>
                </div>
                <div id='entryregistration-input-callNumber'>
                    <label>
                        <span id='entryregistration-input-title'>연락처</span><br />
                        <input type='number' id='callNumber' placeholder='연락처 (숫자만)' onChange={handleChange} value={entryregistrationData.callNumber}/>
                    </label>
                </div>
                <div id='entryregistration-input-entrydate'>
                    <label>
                        <span id='entryregistration-input-title'>출입일시</span><br />
                        <div id='entryregistration-input-entryday-flex'>
                            {/* 출입일시 스크롤 형식 */}
                            {/* <input type='date' id='entryDate' placeholder='출입날짜' onChange={handleChange} value={entryregistrationData.entryDate}/> */}
                            <div id='entryDate' onClick={isOpenDate}>출입일시</div>
                            {openDate?<DateModal  isOpenDate={isOpenDate}/>:null }
                            {/* {openDate?<Test/>:null } */}
                            {/* 시간만 나오게 하고, 스크롤 형식 */}
                            {/* <input type='time' id='entryTime' placeholder='출입시간'onChange={handleChange} value={entryregistrationData.entryTime}/> */}
                        </div>
                    </label>
                </div>
                <div id='entryregistration-input-purpose'>
                    <label>
                        <span id='entryregistration-input-title'>출입목적</span><br />
                        <input type='text' id='purpose' placeholder='출입목적' onChange={handleChange} value={entryregistrationData.purpose}/>
                    </label>
                </div>
            </div>
            <div id='entryregistration-entrybutton' onClick={addSubmit}>등록</div>
        </div>
    )
}