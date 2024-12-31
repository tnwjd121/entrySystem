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
  
  const [entryCount, setEntryCount] = useState(0); 

  const fetchList =  async () => {
    try {
      const response = await axios.get(`${API_URL}/entrylist`)
      setEntryList(response.data)
    } catch (error) {
      console.error("에러발생")
    }
  }


  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const isOpenDelete = (id)=>{
      setOpenDelete(true)
      setDeleteId(id)
  }

  const isCloseDelete = () =>{
    setOpenDelete(false)
  }

  return (
    <div id='entrymain-body'>
      <div id='entrymain-top'>
        <div id='entrymain-null'>
        </div>
        <div id='entrymain-title'>
          출입 등록 현황({entryList.length})
        </div>
        <div id='entrymain-button'onClick={() => { toggleEntryRegistration(); setEntryCount(entryCount + 1); }}>
          <LuPlus/>
        </div>
      </div>
      {entryList.map((entry) => (
      <div id='entrymain-list' key={entry.id}>
        <div id='entrymain-list-top'>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>고객사명: {entry.clientName}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>협력업체: {entry.partnerCompany}</div>
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
          <div className='entrymain-list-button entrymain-list-editbutton' fetchList={fetchList}>수정</div>
          <div className='entrymain-list-button entrymain-list-deletebutton' onClick={()=>isOpenDelete(entry.id)}>삭제</div>
        </div>
      </div>
      ))}
      {isOpen && <EntryRegistration  toggleEntryRegistration={toggleEntryRegistration} fetchList={fetchList} entryCount={entryCount}/>}
      {openDelete ? <DeleteConfirmModal fetchList={fetchList} isCloseDelete={isCloseDelete} deleteId={deleteId}/> : null}
    </div>

  )
}
