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

export default function EntryRegistration({ typeOfSubmit, openEntryRegistration, fetchList }) {
    const API_URL = "http://localhost:5000"


    const location = useLocation();
    const { verificationData } = location.state || {};

    const initialState = {
        partnerCompany: "",
        name: "",
        position: "",
        entryDate: "",
        entryTime: "",
        purpose: "",
        callNumber: "",
        createdDate: "",
        keyCallNumber: verificationData?.callNumber
    };
    const [entryregistrationData, setEntryregistrationData] = useState(initialState);
    const [verificationState, setVerificationState] = useState(verificationData);
    const [dateCount, setDateCount] = useState(0);
    const [timeCount, setTimeCount] = useState(0);

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
        if (isFormComplete()) {
            const currentDate = new Date().toISOString();
            const dataToSubmit = {
                ...entryregistrationData,
                createdDate: currentDate,
                keyCallNumber: verificationData?.callNumber,
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
                handleClose();
            } catch (error) {
                console.error("등록 에러 발생:", error);
            }

        }
    };

    const handleClose = () => {
        openEntryRegistration(); // 부모 컴포넌트에서 닫기 처리
        setVerificationState(null); // verificationState 초기화
    };


    const [openDate, setOpenDate] = useState(false);

    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);

    const isOpenDate = () => {
        setOpenDate(!openDate);
    }

    const dateCloseModal = () => {
        setOpenDate(false);
    };

    useEffect(() => {

        let date = "";
        if (selectedYear && selectedMonth && selectedDay) {
            date = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`;
        }
        setEntryregistrationData((prev) => ({ ...prev, entryDate: date }))

    }, [selectedYear, selectedMonth, selectedDay]);


    const [openTime, setOpentime] = useState(false);

    function isOpenTime() {
        setOpentime(!openTime)
    }

    // 선택 
    const [selectedTime, setSelectedTime] = useState("");
    const timeCloseModal = () => {
        setOpentime(false);
    };

    useEffect(() => {
        setEntryregistrationData((prev) => ({ ...prev, entryTime: selectedTime }))
    }, [selectedTime]);


    const isFormComplete = () => {
        const fields = ["partnerCompany", "name", "position", "entryDate", "entryTime", "purpose", "callNumber"];
        return (
            fields.every((field) => entryregistrationData[field])
        )
    }

    function numberMax(e) {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }
    function numberCheck(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }

    function handleInput(e) {
        numberCheck(e)
        numberMax(e)
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
            <hr />
            <div id='entryregistration-input'>
                <div id='entryregistration-input-partnercompany'>
                    <label>
                        <span id='entryregistration-input-title'>협력업체</span><br />
                        <input type='text' id='partnerCompany' placeholder='협력업체' onChange={handleChange} value={entryregistrationData.partnerCompany} />
                    </label>
                </div>
                <div id='entryregistration-input-position'>
                    <label>
                        <span id='entryregistration-input-title'>직위</span><br />
                        <input type='text' id='position' placeholder='직위' onChange={handleChange} value={entryregistrationData.position} />
                    </label>
                </div>
                <div id='entryregistration-input-name'>
                    <label>
                        <span id='entryregistration-input-title'>성명</span><br />
                        <input type='text' id='name' placeholder='성명' onChange={handleChange} value={entryregistrationData.name} />
                    </label>
                </div>
                <div id='entryregistration-input-callNumber'>
                    <label>
                        <span id='entryregistration-input-title'>연락처</span><br />
                        <input
                            onInput={handleInput}
                            type='number' id='callNumber' placeholder='연락처 (숫자만)' onChange={handleChange} maxLength={11} value={entryregistrationData.callNumber} />
                    </label>
                </div>
                <div id='entryregistration-input-entrydate'>
                    <label>
                        <span id='entryregistration-input-title'>출입일시</span><br />
                        <div id='entryregistration-input-entryday-flex'>
                            <div id='entryDate' onClick={() => { isOpenDate(); setDateCount(dateCount + 1) }}>
                                <div>{entryregistrationData.entryDate || "연도-월-일"}</div>
                                <div><FaRegCalendar /></div>
                            </div>
                            <div id='entryTime' onClick={() => { isOpenTime(); setTimeCount(timeCount + 1) }}>
                                <div>{`${entryregistrationData.entryTime}시 ` || "시간"}</div>
                                <div><IoMdTime /></div>
                            </div>
                        </div>
                    </label>
                </div>
                <div id='entryregistration-input-purpose'>
                    <label>
                        <span id='entryregistration-input-title'>출입목적</span><br />
                        <input type='text' id='purpose' placeholder='출입목적' onChange={handleChange} value={entryregistrationData.purpose} />
                    </label>
                </div>
            </div>
            <div id='entryregistration-entrybutton'
                onClick={addSubmit}
                style={{
                    backgroundColor: isFormComplete() ? "#2150b2" : "#bccae8",
                    cursor: isFormComplete() ? "pointer" : "not-allowed",
                    position: openDate||openTime ? "":"fixed"
                }}
            >
                등록
            </div>
            {openDate
                ?
                <DateModal
                    dateCount={dateCount}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    onClose={dateCloseModal}
                    typeOfSubmit={typeOfSubmit}
                />
                :
                null}
            {openTime
                ?
                <TimeModal
                    timeCount={timeCount}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime} // 상태 업데이트 함수 전달
                    onClose={timeCloseModal}
                    typeOfSubmit={typeOfSubmit}
                />
                :
                null}
        </div>
    )
}