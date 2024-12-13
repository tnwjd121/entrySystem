import React from 'react'
import { IoIosArrowDown } from "react-icons/io";
import '../css/phoneMain.css'
import { FaMinus } from "react-icons/fa6";

export default function PhoneMain() {
  return (
    <div id='phonemain-body'>
      <div id='phonemain-title'>
        휴대폰 본인인증
      </div>
      <div id='phonemain-input'>
        <div id='phonemain-input-name'>
            <label>
                <span id='phonemain-input-title'>이름</span><br/>
                <input type='text' id='name' placeholder='이름'/>
            </label>
        </div>
            {/* 뒷자리는 보안, 주민등록번호 제외 */}
        {/* <div id='phonemain-input-registNumber'>
            <label>
            <span id='phonemain-input-title'>주민등록번호</span><br/>
                <div id='phonemain-input-registNumber-input'>
                    <input type='number' id='registNumber' placeholder='주민등록번호'/>
                    <div id='hyphen'><FaMinus /></div>
                    <input type='number' id='registNumber'/>
                </div>
            </label>
        </div> */}
        <div id='phonemain-input-phoneNumber'>
            <label>
            <span id='phonemain-input-title'>휴대폰번호</span><br/>
                <div id='phonemain-input-phoneNumber-input'>
                    <div id='carrier'>통신사<IoIosArrowDown /></div>
                    <div id='phonemain-input-callnumber'><input type='number' placeholder='휴대폰번호 (숫자만)'/></div>
                </div>
                {/* 본인인증 api확인 */}
            </label>
        </div>
      </div>
    </div>
  )
}
