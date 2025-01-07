import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CgClose } from 'react-icons/cg';
import { FaPlus, FaRegCalendar } from 'react-icons/fa6';
import DateModal from './DateModal';
import TimeModal from './TimeModal';
import { IoMdTime } from 'react-icons/io';

export default function AddPersonnel({typeOfSubmit, fetchList, isCloseAdd, entryData }) {
    const API_URL = "http://localhost:5000"

    // 인원추가 페이지
    // id 받아오고 id의 정보 불러오기

    const initialState = {
        partnerCompany: "",
        name: "",
        position: "",
        entryDate: "",
        entryTime: "",
        purpose: "",
        callNumber: "",
        createdDate: "",
        keyCallNumber: "",
        entrylistId: ""
    };

    const [addPersonnelData, setAddPersonnelData] = useState(initialState);
    const [prevData, setPrevData] = useState("");
    const [dateCount, setDateCount] = useState(0);
    const [timeCount, setTimeCount] = useState(0);



    // 출입일시
    const prevButton = () => {
        setAddPersonnelData((prev) => ({
            ...prev,
            entryDate: prevData?.entryDate || "",
            entryTime: prevData?.entryTime || "",
            purpose: prevData?.purpose || "",
        }))
        setSelectedTime(prevData?.entryTime)

        const date = prevData?.entryDate;
        const [yearStr, monthStr, dayStr] = date.split('-');

        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);

        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
    }

    useEffect(() => {
        setPrevData(entryData)
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAddPersonnelData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const addSubmit = async () => {
        if (isFormComplete()) {
            const currentDate = new Date().toISOString();
            const dataToSubmit = {
                ...addPersonnelData,
                entrylistId: prevData?.id || "",
                createdDate: currentDate
            };
            try {
                // 서버로 데이터 전송
                await axios.post(`${API_URL}/addpersonnel`, dataToSubmit);
                console.log("등록된 데이터:", dataToSubmit);

                // 데이터 초기화
                setAddPersonnelData(initialState); // 폼 초기화

                fetchList();
                isCloseAdd();
            } catch (error) {
                console.error("등록 에러 발생:", error);
            }

        }
    };

    const handleClose = () => {
        isCloseAdd();
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
        setAddPersonnelData((prev) => ({ ...prev, entryDate: date }))

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
        setAddPersonnelData((prev) => ({ ...prev, entryTime: selectedTime }))
    }, [selectedTime]);


    const isFormComplete = () => {
        const fields = ["partnerCompany", "name", "position", "entryDate", "entryTime", "purpose", "callNumber"];
        return (
            fields.every((field) => addPersonnelData[field])
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
                    인원 추가
                </div>
            </div>
            <hr />
            <div id='entryregistration-input'>
                <div id='entryregistration-input-partnercompany'>
                    <label>
                        <span id='entryregistration-input-title'>협력업체</span><br />
                        <input type='text' id='partnerCompany' placeholder='협력업체' onChange={handleChange} value={addPersonnelData.partnerCompany} />
                    </label>
                </div>
                <div id='entryregistration-input-position'>
                    <label>
                        <span id='entryregistration-input-title'>직위</span><br />
                        <input type='text' id='position' placeholder='직위' onChange={handleChange} value={addPersonnelData.position} />
                    </label>
                </div>
                <div id='entryregistration-input-name'>
                    <label>
                        <span id='entryregistration-input-title'>성명</span><br />
                        <input type='text' id='name' placeholder='성명' onChange={handleChange} value={addPersonnelData.name} />
                    </label>
                </div>
                <div id='entryregistration-input-callNumber'>
                    <label>
                        <span id='entryregistration-input-title'>연락처</span><br />
                        <input
                            onInput={handleInput}
                            type='number' id='callNumber' placeholder='연락처 (숫자만)' onChange={handleChange} maxLength={11} value={addPersonnelData.callNumber} />
                    </label>
                </div>
                <div id='entryregistration-input-entrydate'>
                    <div id='entryregistration-prevButton' onClick={prevButton}>
                        <div id='entryregistration-prevButton-icon'><FaPlus /></div>
                        <div id='entryregistration-prevButton-text'>출입 일시/목적 불러오기</div>
                    </div>
                    <label>
                        <span id='entryregistration-input-title'>출입일시</span><br />
                        <div id='entryregistration-input-entryday-flex'>
                            <div id='entryDate' onClick={() => { isOpenDate(); setDateCount(dateCount + 1) }}>
                                <div>{addPersonnelData.entryDate || "연도-월-일"}</div>
                                <div><FaRegCalendar /></div>
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
                            {/* 시간만 나오게 하고, 스크롤 형식  */}
                            <div id='entryTime' onClick={() => { isOpenTime(); setTimeCount(timeCount + 1) }}>
                                <div>{`${addPersonnelData.entryTime}시 ` || "시간"}</div>
                                <div><IoMdTime /></div>
                            </div>
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
                    </label>
                </div>
                <div id='entryregistration-input-purpose'>
                    <label>
                        <span id='entryregistration-input-title'>출입목적</span><br />
                        <input type='text' id='purpose' placeholder='출입목적' onChange={handleChange} value={addPersonnelData.purpose} />
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
