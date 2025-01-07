import React, { useEffect, useState } from 'react'
import '../css/entryedit.css'
import axios from 'axios';
import { CgClose } from "react-icons/cg";
import DateModal from './DateModal';
import { FaRegCalendar } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import TimeModal from './TimeModal';
import { FaPlus } from "react-icons/fa6";

export default function EntryEdit({typeOfSubmit, isCloseEdit, entryData, fetchList }) {

    const [entryeditData, setentryeditData] = useState({
        id:"",
        clientName: "",
        partnerCompany: "",
        name: "",
        position: "",
        entryDate: "",
        entryTime: "",
        purpose: "",
        callNumber: "",
        createdDate: ""
    });

    useEffect(() => {
        console.log(entryData)
        setentryeditData({
            id:entryData.id,
            clientName: entryData.clientName,
            partnerCompany: entryData.partnerCompany,
            name: entryData.name,
            position: entryData.position,
            entryDate: entryData.entryDate,
            entryTime: entryData.entryTime,
            purpose: entryData.purpose,
            callNumber: entryData.callNumber,
            createdDate: entryData.createdDate
        })

        setSelectedTime(entryData?.entryTime)
        const date = entryData?.entryDate;
        const [yearStr, monthStr, dayStr] = date.split('-');

        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);

        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
    }, []);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setentryeditData({
            ...entryeditData,
            [id]: value
        })
    };

    const API_URL = "http://localhost:5000/entrylist/"

    const editSubmit = async () => {
        try { 
            // 수정 데이터 서버 전송
            const response =  await axios.put(`${API_URL}${entryeditData.id}`, entryeditData);
            console.log("등록된 데이터:", response);
            fetchList()
            isCloseEdit()
        } catch (error) {
            console.error("등록 에러 발생:", error);
        }
    }

const handleClose = () => {
    isCloseEdit();
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
    setentryeditData((prev) => ({ ...prev, entryDate: date }))

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
    setentryeditData((prev) => ({ ...prev, entryTime: selectedTime }))
}, [selectedTime]);


const isFormComplete = () => {
    const fields = ["partnerCompany", "name", "position", "entryDate", "entryTime", "purpose", "callNumber"];
    return (
        fields.every((field) => entryeditData[field])
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
    <div id='entryedit-body'>
        <div id='entryedit-top'>
            <div id='entryedit-closebutton' onClick={handleClose}>
                <CgClose />
            </div>
            <div id='entryedit-title'>
                출입 수정
            </div>
        </div>
        <hr />
        <div id='entryedit-input'>
            <div id='entryedit-input-partnercompany'>
                <label>
                    <span id='entryedit-input-title'>협력업체</span><br />
                    <input type='text' id='partnerCompany' placeholder='협력업체' onChange={handleChange} value={entryeditData.partnerCompany} />
                </label>
            </div>
            <div id='entryedit-input-name'>
                <label>
                    <span id='entryedit-input-title'>성명</span><br />
                    <input type='text' id='name' placeholder='성명' onChange={handleChange} value={entryeditData.name} />
                </label>
            </div>
            <div id='entryedit-input-position'>
                <label>
                    <span id='entryedit-input-title'>직위</span><br />
                    <input type='text' id='position' placeholder='직위' onChange={handleChange} value={entryeditData.position} />
                </label>
            </div>
            <div id='entryedit-input-callNumber'>
                <label>
                    <span id='entryedit-input-title'>연락처</span><br />
                    <input
                        onInput={handleInput}
                        type='number' id='callNumber' placeholder='연락처 (숫자만)' onChange={handleChange} maxLength={11} value={entryeditData.callNumber} />
                </label>
            </div>
            <div id='entryedit-input-entrydate'>
                <label>
                    <span id='entryedit-input-title'>출입일시</span><br />
                    <div id='entryedit-input-entryday-flex'>
                        <div id='entryDate' onClick={() => { isOpenDate(); }}>
                            <div>{entryeditData.entryDate || "연도-월-일"}</div>
                            <div><FaRegCalendar /></div>
                        </div>
                        {openDate
                            ?
                            <DateModal
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
                        <div id='entryTime' onClick={() => { isOpenTime(); }}>
                            <div>{`${entryeditData.entryTime}시 ` || "시간"}</div>
                            <div><IoMdTime /></div>
                        </div>
                        {openTime
                            ?
                            <TimeModal
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
            <div id='entryedit-input-purpose'>
                <label>
                    <span id='entryedit-input-title'>출입목적</span><br />
                    <input type='text' id='purpose' placeholder='출입목적' onChange={handleChange} value={entryeditData.purpose} />
                </label>
            </div>
        </div>
        <div id='entryedit-entrybutton'
            onClick={editSubmit}
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