import React, { useState } from 'react'
import '../css/entrymain.css'
import { LuPlus } from "react-icons/lu";
import EntryRegistration from './EntryRegistration';


export default function EntryMain() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleEntryRegistration = () => {
    setIsOpen(!isOpen); 
  };

  // 목서버 데이터 가져오기


  //디자인
  // 고객사명 협력업체
  // 성명 직위 연락처
  // 출입일시
  // 출입목적
  // => 사이즈 보고 조정


  return (
    <div id='entrymain-body'>
      <div id='entrymain-top'>
        <div id='entrymain-null'>
        </div>
        <div id='entrymain-title'>
          출입 등록 현황(4)
        </div>
        <div id='entrymain-button'onClick={toggleEntryRegistration}>
          <LuPlus/>
        </div>
      </div>
      <div id='entrymain-list'>
        <div>
        </div>
      </div>
      {isOpen && <EntryRegistration  toggleEntryRegistration={toggleEntryRegistration}/>}
    </div>
  )
}
