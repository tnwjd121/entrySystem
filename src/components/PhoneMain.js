import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import '../css/phoneMain.css'
import { FaMinus } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import CarrierModal from './CarrierModal';
import { useNavigate } from 'react-router-dom';

export default function PhoneMain() {

  const [openCarrierModal, setOpenCarrierModal] = useState(false);

  const [verificationData, setVerificationData] = useState({
    name : "",
    birth : "",
    gender : "",
    callNumber : ""
  });

  const handleChange = (e) =>{
    const{id, value} = e.target;
    setVerificationData({
      ...verificationData,
      [id]:value
    })
  }

  // 백엔드 연결 해야 함
  const authenticationSubmit = async (e) =>{
    const inputs = document.querySelectorAll("input");

    try {
      console.log(verificationData.name)
      console.log(verificationData.birth)
      console.log(verificationData.gender)
      console.log(verificationData.callNumber)
    } catch (error) {
      console.error("본인인증 에러 발생")
    }
  }

  const clickOpenCarrierModal = () => {
    setOpenCarrierModal(!openCarrierModal)
  }

  const navigate = useNavigate();

  const navigateToVerification = () =>{
      navigate('/ibk/entry/certification')
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
            <input type='text' id='name' placeholder='이름' onChange={handleChange}/>
          </label>
        </div>
        {/* 뒷자리는 성별까지만 나오게 하기 */}
        <div id='phonemain-input-registNumber'>
            <label>
            <span id='phonemain-input-title'>생년월일/성별</span><br/>
                <div id='phonemain-input-registNumber-input'>
                    <input type='number' id='birth' placeholder='생년월일' onChange={handleChange}/>
                    <div id='hyphen'><FaMinus /></div>
                    <input type='number' id='gender' placeholder='●' onChange={handleChange}/>
                    <p>●●●●●●</p>
                </div>  
            </label>
        </div>
        <div id='phonemain-input-phoneNumber'>
          <label>
            <span id='phonemain-input-title'>휴대폰번호</span><br />
            <div id='phonemain-input-phoneNumber-input'>
              {/* 통신사 버튼 클릭 시 키보드 추가 */}
              <div id='carrier' onClick={clickOpenCarrierModal}>통신사 <IoIosArrowDown /></div>
              <div id='phonemain-input-callnumber'><input type='number' id='callNumber' placeholder='휴대폰번호 (숫자만)'onChange={handleChange} /></div>
            </div>
          </label>
        </div>
      </div>
      <div id='phonemain-verification'>
        <div id='phonemain-verification-total'>
          <div id='phonemain-verification-total-checkbutton'><FaCheckCircle /></div>
          <div id='phonemain-verification-total-text'> 전체 동의</div>
        </div>
        <div id='phonemain-verification-field'>
          <div id='phonemain-verification-field-checkbutton'><FaCheckCircle /></div>
          <div id='phonemain-verification-field-text'>[필수] 개인정보 수집/이용 동의</div>
          <div id='phonemain-verification-field-enter'><FaAngleRight /></div>
        </div>
        <div id='phonemain-verification-field'>
          <div id='phonemain-verification-field-checkbutton'><FaCheckCircle /></div>
          <div id='phonemain-verification-field-text'>[필수] 고유식별정보처리 동의</div>
          <div id='phonemain-verification-field-enter'><FaAngleRight /></div>
        </div>
        <div id='phonemain-verification-field'>
          <div id='phonemain-verification-field-checkbutton'><FaCheckCircle /></div>
          <div id='phonemain-verification-field-text'>[필수] 통신사 이용약관 동의</div>
          <div id='phonemain-verification-field-enter'><FaAngleRight /></div>
        </div>
        <div id='phonemain-verification-field'>
          <div id='phonemain-verification-field-checkbutton'><FaCheckCircle /></div>
          <div id='phonemain-verification-field-text'>[필수] 서비스 이용약관 (휴대폰인증)</div>
          <div id='phonemain-verification-field-enter'><FaAngleRight /></div>
        </div>
      </div>
      <div id='phonemain-verification-button' onClick={authenticationSubmit}>
        인증요청
      </div>
      <div>
      {openCarrierModal ?(
        <CarrierModal/>
      ):null}
      </div>
    </div>
  )
}
