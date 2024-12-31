import React, { useEffect, useState } from 'react'
import '../css/entryregistration.css'
import { useLocation } from 'react-router-dom';
import { CgClose } from "react-icons/cg";
import axios from 'axios'
import DateModal from './DateModal';
import { FaRegCalendar } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import TimeModal from './TimeModal';
import { FaPlus } from "react-icons/fa6";

export default function EntryRegistration({toggleEntryRegistration, fetchList, entryCount}) {
    const API_URL = "http://localhost:5000"

    // 수정 필요
    // 1. 휴대폰 인증정보 처음 세팅 한번만 가져오기 추가할 경우 초기화 되어야함 -> 해결

    // 2. 2번째 이후 출일입시랑 목적 동일하면 복사해서 가져오도록 하기(이전 데이터 가져오기)
    // => 2번째 이후부터 버튼 추가하고, 추가하면 -> 해결
    
    // 3. 신청 완료페이지, 오류페이지, 관리자 문의 페이지 만들기


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
        createdDate: ""
        
    };

    const [entryregistrationData, setEntryregistrationData] = useState(initialState);
    const [verificationState, setVerificationState] = useState(verificationData);
    const [prevData, setPrevData] = useState("");
    const [timeCount, setTimeCount] = useState(0);

    


    // verificationData를 초기화
    useEffect(() => {
        console.log(entryCount)
        if (entryCount==1) {
            setEntryregistrationData({
                ...initialState,
                name: verificationState?.name || "",
                callNumber: verificationState?.callNumber || "",
            });
        }else if(entryCount > 1) {
            setEntryregistrationData({
                ...initialState
            })
            fetchPreviousEntryData();
        }

    }, []);

    // 출입일시
    const prevButton = () => {
        setEntryregistrationData({
            ...initialState,
            entryDate: prevData?.entryDate || "",
            entryTime: prevData?.entryTime || "",
            purpose: prevData?.purpose || "",
        })
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEntryregistrationData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const fetchPreviousEntryData = async () => {
        try {
            const response = await axios.get(`${API_URL}/entrylist`);
            const latestEntry = response.data.reduce((latest, current) => {
                return new Date(latest.createdDate) > new Date(current.createdDate) ? latest : current;
            });
            setPrevData(latestEntry)
        } catch (error) {
            console.error("이전 데이터 가져오기 에러:", error);
        }
    };




    const addSubmit = async () => {
        if(isFormComplete()) {
            const currentDate = new Date().toISOString();
            const dataToSubmit = {
                ...entryregistrationData,
                createdDate: currentDate
            };
            try {
                // 서버로 데이터 전송
                await axios.post(`${API_URL}/entrylist`, dataToSubmit);
                console.log("등록된 데이터:", dataToSubmit);
    
                // 데이터 초기화
                setEntryregistrationData(initialState); // 폼 초기화
                setVerificationState(null); // verificationState 초기화
                console.log(verificationState)

                fetchList();
            } catch (error) {
                console.error("등록 에러 발생:", error);
            }

        }
    };

    const handleClose = () => {
        toggleEntryRegistration(); // 부모 컴포넌트에서 닫기 처리
        setVerificationState(null); // verificationState 초기화
        console.log(verificationState)
    };


    const [openDate, setOpenDate] = useState(false);

    const isOpenDate = () => {
        setOpenDate(!openDate);
    }

    const handleDateSelect = (date) => {
        setEntryregistrationData((prev) => ({ ...prev, entryDate: date}))
        setOpenDate(!openDate);
    }

    const [openTime, setOpentime] = useState(false);

    function isOpenTime() {
        setOpentime(!openTime)
    }


    const [selectedTime, setSelectedTime] = useState(0);
    const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    // 수정필요
    const handleTimeSelect = (time) => {
        setEntryregistrationData((prev) => ({...prev, entryTime: time}))
        setOpentime(!openTime)
    }

    const isFormComplete = () => {
        const fields = ["clientName", "partnerCompany", "name", "position", "entryDate", "entryTime", "purpose", "callNumber"];
        return (
            fields.every((field) => entryregistrationData[field])
        )
    }

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
                    { entryCount>1? 
                    (
                    <div id='entryregistration-prevButton' onClick={prevButton}>
                        <div id='entryregistration-prevButton-icon'><FaPlus/></div>
                        <div id='entryregistration-prevButton-text'>이전 출입 일시/목적 불러오기</div>
                    </div>
                    )
                    :
                    null
                    }
                    <label>
                        <span id='entryregistration-input-title'>출입일시</span><br />
                        <div id='entryregistration-input-entryday-flex'>
                            <div id='entryDate' onClick={isOpenDate}>
                                <div>{entryregistrationData.entryDate ||"연도-월-일"}</div>
                                <div><FaRegCalendar/></div>
                            </div>
                            {openDate?<DateModal onSelectDate={handleDateSelect}/>:null }
                            {/* 시간만 나오게 하고, 스크롤 형식  */}
                            <div id='entryTime' onClick={() => {isOpenTime(); setTimeCount(timeCount + 1)}}>
                                <div>{`${entryregistrationData.entryTime}시 `||"시간"}</div>
                                <div><IoMdTime /></div>
                            </div>
                            {openTime
                            ?
                            <TimeModal 
                                timeCount={timeCount}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime} // 상태 업데이트 함수 전달
                                onClose={handleCloseModal}
                            />
                            :
                            null }
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
            <div id='entryregistration-entrybutton' 
                onClick={addSubmit}
                style={{
                    backgroundColor: isFormComplete() ? "#2150b2" : "#bccae8",
                    cursor: isFormComplete() ? "pointer" : "not-allowed",
                }}
            >
                등록
            </div>
        </div>
    )
}