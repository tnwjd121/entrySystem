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

  const [openCarrierModal, setOpenCarrierModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(""); // 선택된 통신사 상태 추가
  const navigate = useNavigate();

  // 통신사 포함하기
  const [verificationData, setVerificationData] = useState({
    name: "",
    birth: "",
    gender: "",
    genderText: "",
    callNumber: "",
  });

  const [agreementStatus, setAgreementStatus] = useState({
    all: false,
    personalInfo: false,
    uniqueId: false,
    carrierTerms: false,
    serviceTerms: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    const genderText = verificationData.genderText;

    if (id === "gender") {
      if (value === "1" || value === "3") {
        genderText = "male";
      } else if (value === "2" || value === "4") {
        genderText = "female";
      } else {
        genderText = "";
      }
    }

    setVerificationData({
      ...verificationData,
      [id]: value,
      ...(id === "gender" && { genderText }),
    });
  };

  const handleAgreementToggle = (field) => {
    const newStatus = {
      ...agreementStatus,
      [field]: !agreementStatus[field],
    };

    // 모든 필드가 true이면 전체 동의 활성화
    newStatus.all =
      newStatus.personalInfo &&
      newStatus.uniqueId &&
      newStatus.carrierTerms &&
      newStatus.serviceTerms;

    setAgreementStatus(newStatus);
  };

  const handleAllAgreementToggle = () => {
    const newAllStatus = !agreementStatus.all;

    setAgreementStatus({
      all: newAllStatus,
      personalInfo: newAllStatus,
      uniqueId: newAllStatus,
      carrierTerms: newAllStatus,
      serviceTerms: newAllStatus,
    });
  };

  const authenticationSubmit = async () => {
    // 모든 필드가 입력되고 동의해야 인증 요청 가능
    const { name, birth, gender, callNumber } = verificationData;
    const { personalInfo, uniqueId, carrierTerms, serviceTerms } = agreementStatus;

    if (
      Object.values(verificationData).some((value) => !value) ||
      Object.values(agreementStatus).some((value) => !value)
    ) {
      return;
    }

    try {
      console.log("인증 요청 데이터:");
      console.log("이름:", name);
      console.log("생년월일:", birth);
      console.log("성별 코드:", gender);
      console.log("성별 텍스트:", verificationData.genderText);
      console.log("휴대폰번호:", callNumber);
      console.log("선택된 통신사:", selectedCarrier);
      navigate('/ibk/entry/certification', { state: { verificationData } });


    } catch (error) {
      console.error("본인인증 에러 발생");
    }
  };

  const isFormComplete = () => {
    // 필수 데이터와 약관 체크 상태 확인
    const { name, birth, gender, callNumber } = verificationData;
    const { personalInfo, uniqueId, carrierTerms, serviceTerms } = agreementStatus;

    return (
      name &&
      birth &&
      gender &&
      callNumber &&
      selectedCarrier &&
      personalInfo &&
      uniqueId &&
      carrierTerms &&
      serviceTerms
    );
  };

  const clickOpenCarrierModal = () => {
    setOpenCarrierModal(!openCarrierModal);
  };

  const handleCarrierSelect = (carrierName) => {
    setSelectedCarrier(carrierName);
    setOpenCarrierModal(false);
  };





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
        {/* 뒷자리는 성별까지만 나오게 하기 */}
        <div id='phonemain-input-registNumber'>
          <label>
            <span id='phonemain-input-title'>생년월일/성별</span><br />
            <div id='phonemain-input-registNumber-input'>
              <input type='number' id='birth' placeholder='생년월일' onChange={handleChange} />
              <div id='hyphen'><FaMinus /></div>
              <input type='number' id='gender' placeholder='●' onChange={handleChange} />
              <p>●●●●●●</p>
            </div>
          </label>
        </div>
        <div id='phonemain-input-phoneNumber'>
          <label>
            <span id='phonemain-input-title'>휴대폰번호</span><br />
            <div id='phonemain-input-phoneNumber-input'>
              {/* 통신사 버튼 클릭 시 키보드 제거 */}
              <div id='carrier' onClick={clickOpenCarrierModal}>{selectedCarrier || "통신사"} <IoIosArrowDown /></div>
              <div id='phonemain-input-callnumber'><input type='number' id='callNumber' placeholder='휴대폰번호 (숫자만)' onChange={handleChange} /></div>
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
