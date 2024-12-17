import React from 'react'
import { useLocation } from 'react-router-dom';

export default function EntryMain() {
  // 개인정보 가져오기
  const location = useLocation();
  const { verificationData } = location.state || {};
  console.log(verificationData)


  // 여기는 출입명단 작성
  // 아래에 다른 컴포넌트로 등록한 명단 나오게 하기(삭제 버튼)

  return (
    <div id='entrymain-body'>
      <div id='entrymain-title'>
        출입등록명단
      </div>
      <div id='entrymain-input'>
        <div id='entrymain-input-name'>
        <label>
            <span id='entrymain-input-title'>고객사명</span><br />
            <input type='text' id='client-name' placeholder='고객사명' />
          </label>
        </div>
      </div>

    </div>
  )
}
