import React, { useEffect, useState } from 'react'
import '../css/entrymain.css'
import { LuPlus } from "react-icons/lu";
import EntryRegistration from './EntryRegistration';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';


export default function EntryMain() {

  const API_URL = "http://localhost:5000"

  const [isOpen, setIsOpen] = useState(false);

  const toggleEntryRegistration = () => {
    setIsOpen(!isOpen); 
  };
  
  // 목서버 데이터 가져오기
  const [entryList, setEntryList]= useState([]);

  useEffect(()=>{
    fetchList()
  }, [])

  const fetchList =  async () => {
    try {
      const response = await axios.get(`${API_URL}/entrylist`)
      setEntryList(response.data)
    } catch (error) {
      console.error("에러발생")
    }
  }


  const [openDelete, setOpenDelete] = useState(false);

  const isOpenDelete = (()=>{
      setOpenDelete(!openDelete)
      console.log(openDelete)
  })

  // 전화번호 가져올때 양식 - - 반영
  // 수정버튼 모달
  // 삭제 버튼, 삭제 전 경고창 띄우고 ok누르면 삭제


  


  return (
    <div id='entrymain-body'>
      <div id='entrymain-top'>
        <div id='entrymain-null'>
        </div>
        <div id='entrymain-title'>
          출입 등록 현황({entryList.length})
        </div>
        <div id='entrymain-button'onClick={toggleEntryRegistration}>
          <LuPlus/>
        </div>
      </div>
      {entryList.map((entry) => (
      <div id='entrymain-list' key={entry.id}>
        <div id='entrymain-list-top'>
          <div id='entrymain-list-row'>
            <div id='entrymain-left'>고객사명: {entry.clientName}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-right'>협력업체: {entry.partnerCompany}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-left'>성명: {entry.name}</div>
            <div id='entrymain-right'>직위: {entry.position}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>연락처: {entry.callNumber}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입일시: {entry.entryDate} {entry.entryTime}시</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입목적: {entry.purpose}</div>
          </div>
        </div>
        <div id='entrymain-list-bottom'>
          <div className='entrymain-list-button entrymain-list-editbutton' onClick={isOpenDelete}>수정</div>
          <div className='entrymain-list-button entrymain-list-deletebutton'>삭제</div>
        </div>
      </div>
      ))}
      {isOpen && <EntryRegistration  toggleEntryRegistration={toggleEntryRegistration}/>}
      {isOpenDelete ? <DeleteConfirmModal isOpenDelete={isOpenDelete}/> : null}
    </div>
    // 삭제가 모달창이 계속 떠 있음 수정필요
  )
}
