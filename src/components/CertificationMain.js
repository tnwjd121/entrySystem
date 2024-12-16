import React from 'react'
import '../css/cetificationmain.css'

export default function CertificationMain() {
    return (
        <div id='certificationmain-body'>
            <div id='certificationmain-title'>
                인증번호 입력
            </div>
            <div id='certificationmain-container'>
                <div id='certificationmain-input'>
                    <label>
                        <span id='certificationmain-input-title'>인증번호</span><br />
                        <input type='text' id='certification' placeholder='인증번호' />
                    </label>
                </div>
                <div id='certificationmain-re-button'>
                    인증번호 재전송
                </div>
            </div>
            <div id='certificationmain-button'>
                확인 
            </div>
        </div>
    )
}
