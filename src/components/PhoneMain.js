import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import '../css/phoneMain.css'
import { FaMinus } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import CarrierModal from './CarrierModal';
import { useNavigate } from 'react-router-dom';
import FailedAuthentication from './FailedAuthentication';

export default function PhoneMain() {
  // 본인인증

  const [openCarrierModal, setOpenCarrierModal] = useState(false);
  const [verificationData, setVerificationData] = useState({
    name: "",
    birth: "",
    gender: "",
    genderText: "",
    callNumber: "",
    carrier:""
  });

  const [agreementStatus, setAgreementStatus] = useState({
    all: false,
    personalInfo: false,
    uniqueId: false,
    carrierTerms: false,
    serviceTerms: false,
  });

  const navigate = useNavigate();

  const handleChange = ({ target: { id, value } }) => {
    setVerificationData((prev) => ({
      ...prev,
      [id]: value,
      ...(id === "gender" && {
        genderText: ["1", "3"].includes(value) ? "male" : ["2", "4"].includes(value) ? "female" : "",
      }),
    }));
  };


  const handleAgreementToggle = (field) => {
    setAgreementStatus((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      updated.all = Object.values(updated).slice(1).every(Boolean);
      return updated;
    });
  };

  const handleAllAgreementToggle = () => {
    const newAllStatus = !agreementStatus.all;
    setAgreementStatus((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((key) => [key, newAllStatus])),
    }));
  };

  const isFormComplete = () => {
    const requiredFields = ["name", "birth", "gender", "callNumber", "carrier"];
    return (
      requiredFields.every((field) => verificationData[field]) &&
      Object.values(agreementStatus).slice(1).every(Boolean)
    );
  };

  const authenticationSubmit = () => {
    if (isFormComplete()) {
      navigate('/ibk/entry/certification', { state: { verificationData } });
    }
  };

  const handleCarrierSelect = (carrierName) => {
    setVerificationData((prev) => ({ ...prev, carrier: carrierName }));
    setOpenCarrierModal(false);
  };

  function numberMax(e) {
    if(e.target.value.length > e.target.maxLength){
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
    <div id='phonemain-body'>
      <div id='phonemain-title'>
        휴대폰 본인인증
      </div>
      <div id='phonemain-input'>
        <div id='phonemain-input-name'>
          <label>
            <span id='phonemain-input-title'>이름</span><br />
            <input type='text' id='name' placeholder='이름' onChange={handleChange} />
          </label>
        </div>
        <div id='phonemain-input-registNumber'>
          <label>
            <span id='phonemain-input-title'>생년월일/성별</span><br />
            <div id='phonemain-input-registNumber-input'>
              <input 
                onInput={handleInput}
              type='number' id='birth' placeholder='생년월일' maxLength={6} onChange={handleChange}
              />
              <div id='hyphen'><FaMinus /></div>
              <input 
                onInput={handleInput}
                type='number' id='gender' placeholder='●' maxLength={1} onChange={handleChange}
                />
              <p>●●●●●●</p>
            </div>
          </label>
        </div>
        <div id='phonemain-input-phoneNumber'>
          <label>
            <span id='phonemain-input-title'>휴대폰번호</span><br />
            <div id='phonemain-input-phoneNumber-input'>
              {/* 통신사 버튼 클릭 시 키보드 제거 */}
              <div id='carrier' 
              onClick={() => setOpenCarrierModal(true)}
              // 수정필요
              style={{color: verificationData.carrier==='' ? "#868686" : "#000000" }}
              >
                {verificationData.carrier || "통신사"} <IoIosArrowDown /></div>
              <div id='phonemain-input-callnumber'>
                <input 
                  onInput={handleInput}
                type='number' id='callNumber' placeholder='휴대폰번호 (숫자만)' maxLength={11}  onChange={handleChange} />
              </div>
            </div>
          </label>
        </div>
      </div>
      <div id='phonemain-verification'>
        <div id='phonemain-verification-total' onClick={handleAllAgreementToggle}>
          <div id='phonemain-verification-total-checkbutton'>
            {agreementStatus.all ? <FaCheckCircle id='check' /> : <FaCheckCircle />}
          </div>
          <div id='phonemain-verification-total-text'> 전체 동의</div>
        </div>
        {[
          { id: "personalInfo", text: "[필수] 개인정보 수집/이용 동의" },
          { id: "uniqueId", text: "[필수] 고유식별정보처리 동의" },
          { id: "carrierTerms", text: "[필수] 통신사 이용약관 동의" },
          { id: "serviceTerms", text: "[필수] 서비스 이용약관 (휴대폰인증)" },
        ].map((item) => (
          <div
            key={item.id}
            id='phonemain-verification-field'
            onClick={() => handleAgreementToggle(item.id)}
          >
            <div id='phonemain-verification-field-checkbutton'>
              {agreementStatus[item.id] ? <FaCheckCircle id='check' /> : <FaCheckCircle />}
            </div>
            <div id='phonemain-verification-field-text'>{item.text}</div>
            <div id='phonemain-verification-field-enter'><FaAngleRight /></div>
          </div>
        ))}
      </div>
      <div id='phonemain-verification-button' onClick={authenticationSubmit}
        style={{
          backgroundColor: isFormComplete() ? "#2150b2" : "#bccae8",
          cursor: isFormComplete() ? "pointer" : "not-allowed",
        }}
      >
        인증요청
      </div>
      <div>
        {openCarrierModal ? (
          <CarrierModal onSelectCarrier={handleCarrierSelect} />
        ) : null}
      </div>
      <div>
        {/* 본인인증 안 될 경우 해당 팝업창 이용 */}
        {/* <FailedAuthentication/> */}
      </div>
    </div>
  )
}