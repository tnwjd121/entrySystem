import React, { useEffect, useState } from 'react'
import '../css/entrymain.css'
import { LuPlus } from "react-icons/lu";
import EntryRegistration from './EntryRegistration';
import { LuMenu } from "react-icons/lu";
import axios from 'axios';


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
        <div id='entrymain-list-left'>
          <div id='entrymain-list-row'>
            <div id='entrymain-left'>고객사명: {entry.clientName}</div>
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
        <div id='entrymain-list-right'>
          <LuMenu />
        </div>
      </div>
      ))}
      {isOpen && <EntryRegistration  toggleEntryRegistration={toggleEntryRegistration}/>}
    </div>
  )
}
