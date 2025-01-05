import React, { useEffect, useState } from 'react'
import '../css/entrymain.css'
import { LuPlus } from "react-icons/lu";
import EntryRegistration from './EntryRegistration';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import EntryEdit from './EntryEdit';


export default function EntryMain() {

  const API_URL = "http://localhost:5000"

  const [isOpen, setIsOpen] = useState(false);
  
  const openEntryRegistration = () => {
    setIsOpen(!isOpen); 
  };
  
  // 목서버 데이터 가져오기
  const [entryList, setEntryList]= useState([]);
  const [entryData, setEntryData]= useState([]);
  
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
  const [entryId, setEntryId] = useState(null);

  const isOpenDelete = (id)=>{
      setOpenDelete(true)
      setEntryId(id)
  }

  const isCloseDelete = () =>{
    setOpenDelete(false)
  }

  const [openEdit, setOpenEdit] = useState(false);

  const isOpenEdit = (entry)=>{
      setOpenEdit(true)
      setEntryData(entry)
  }


  const isCloseEdit = () =>{
    setOpenEdit(false)
  }

  // 연락처 단위 조정
  function formatPhoneNumber(phonenumber) {
    let formatphonenumber;
    if(phonenumber.slice(0,2)==="01"){
      formatphonenumber = `${phonenumber.slice(0,3)}-${phonenumber.slice(3,7)}-${phonenumber.slice(7,12)}`
    }else if(phonenumber.slice(0,2)==="02"){
      if(phonenumber.length===10){
        formatphonenumber = `${phonenumber.slice(0,2)}-${phonenumber.slice(2,6)}-${phonenumber.slice(6,11)}`
      }else if(phonenumber.length===9){
        formatphonenumber = `${phonenumber.slice(0,2)}-${phonenumber.slice(2,5)}-${phonenumber.slice(5,10)}`
      }
    }else{
      if(phonenumber.length===11){
        formatphonenumber = `${phonenumber.slice(0,3)}-${phonenumber.slice(3,7)}-${phonenumber.slice(7,12)}`
      }else if(phonenumber.length===10){
        formatphonenumber = `${phonenumber.slice(0,3)}-${phonenumber.slice(3,6)}-${phonenumber.slice(6,11)}`
      }
    }
    return formatphonenumber;
  }

  return (
    <div id='entrymain-body'>
      <div id='entrymain-top'>
        <div id='entrymain-null'>
        </div>
        <div id='entrymain-title'>
          출입 등록 현황({entryList.length})
        </div>
        <div id='entrymain-button'onClick={openEntryRegistration}>
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
            <div id='entrymain-text'>연락처: {formatPhoneNumber(entry.callNumber)}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입일시: {entry.entryDate} {entry.entryTime}시</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입목적: {entry.purpose}</div>
          </div>
        </div>
        <div id='entrymain-list-bottom'>
          <div className='entrymain-list-button entrymain-list-editbutton' fetchList={fetchList} entry={entry} onClick={()=>isOpenEdit(entry)}>수정</div>
          <div className='entrymain-list-button entrymain-list-deletebutton' onClick={()=>isOpenDelete(entry.id)}>삭제</div>
        </div>
      </div>
      ))}
      {isOpen && <EntryRegistration  openEntryRegistration={openEntryRegistration} fetchList={fetchList}/>}
      {openDelete ? <DeleteConfirmModal fetchList={fetchList} isCloseDelete={isCloseDelete} deleteId={entryId}/> : null}
      {openEdit ? <EntryEdit fetchList={fetchList} isCloseEdit={isCloseEdit} entryData={entryData}/> : null}

    </div>

  )
}
