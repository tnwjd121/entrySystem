import React, { useEffect, useState } from 'react'
import '../css/entrymain.css'
import { LuPlus } from "react-icons/lu";
import EntryRegistration from './EntryRegistration';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import EntryEdit from './EntryEdit';
import { FaAngleDown } from "react-icons/fa6";
import AddPersonnel from './AddPersonnel';
import { TiMinus } from "react-icons/ti";


export default function EntryMain() {

  const API_URL = "http://localhost:5000"

  const [isOpen, setIsOpen] = useState(false);
  
  const openEntryRegistration = () => {
    setIsOpen(!isOpen); 
  };
  
  // 목서버 데이터 가져오기
  const [entryList, setEntryList]= useState([]);
  const [entryData, setEntryData]= useState([]);
  const [typeOfSubmit, setTypeOfSubmit] = useState("")
  // 해당하는 id를 클릭하면
  const [addpersonnelList, setAddpersonnelList] =useState([]);
  
  useEffect(()=>{
    fetchList()
  }, [])

  const fetchList =  async () => {
    try {
      const entrylist = await axios.get(`${API_URL}/entrylist`)
      setEntryList(entrylist.data)
    } catch (error) {
      console.error("에러발생")
    }
  }
  


  
  const [openAddpersonnel, setOpenAddpersonnel] = useState(false);

  const isOpenAdd = (entry)=>{
    setOpenAddpersonnel(true)
    setEntryData(entry)
  }

  const isCloseAdd = () =>{
    setOpenAddpersonnel(false)
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
      setTypeOfSubmit("edit")
  }


  const isCloseEdit = () =>{
    setOpenEdit(false)
  }

  const [openDetail, setOpenDetail] = useState(false)
  
  const [detailId, setDetailId] = useState(null);
  const clickDetail = (id) =>{
    setOpenDetail(!openDetail);
    setDetailId(id)
    console.log(detailId)
    addList()
    // entrylistid가  위에  id랑 동일한거만 가져오기
  }

  const addList = async () => {
    try {
      const addpersonnellist = await axios.get(`${API_URL}/addpersonnel`)
      console.log(addpersonnellist.data)

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
        <div id='entrymain-button'onClick={openEntryRegistration}>
          <LuPlus/>
        </div>
      </div>
      {entryList.map((entry) => (
      <div id='entrymain-list' key={entry.id}>
        <div id='entrymain-list-top'>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입자: {entry.partnerCompany} {entry.name}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입목적: {entry.purpose}</div>
          </div>
          <div id='entrymain-list-row'>
            <div id='entrymain-text'>출입일시: {entry.entryDate} {entry.entryTime}시</div>
          </div>
        </div>
        <div id='entrymain-list-bottom'>
          <div className='entrymain-list-left'>
            <div className='entrymain-list-button entrymain-list-addpersonnel-button' onClick={()=>isOpenAdd(entry)}>인원추가</div>
          </div>
          <div className='entrymain-list-right'>
            <div className='entrymain-list-button entrymain-list-editbutton' fetchList={fetchList} entry={entry} onClick={()=>isOpenEdit(entry)}>수정</div>
            <div className='entrymain-list-button entrymain-list-deletebutton' onClick={()=>isOpenDelete(entry.id)}>삭제</div>
            <div className='entrymain-list-detail' onClick={()=>clickDetail(entry.id)}><FaAngleDown /></div>
          </div>
        </div>
      </div>
      ))}
      {
        openDetail?(
          <div id='entrymain-detail'>
            <div id='entrymain-detail-box'>
              <div id='entrymain-detail-delete'>
                <TiMinus />
              </div>
              <div id='entrymain-detail-list'>
                <div id='entrymain-detail-text'>출입자: css 변경 예정 </div>
              </div>
              <div id='entrymain-detail-list'>
                <div id='entrymain-detail-text'>출입목적:</div>
              </div>
              <div id='entrymain-detail-list'>
                <div id='entrymain-detail-text'>출입일시: </div>
              </div>
            </div>
          </div>
        ):null
      }
      {isOpen && <EntryRegistration  openEntryRegistration={openEntryRegistration} fetchList={fetchList}/>}
      {openDelete ? <DeleteConfirmModal fetchList={fetchList} isCloseDelete={isCloseDelete} deleteId={entryId}/> : null}
      {openEdit ? <EntryEdit fetchList={fetchList} isCloseEdit={isCloseEdit} entryData={entryData} typeOfSubmit={typeOfSubmit}/> : null}
      {openAddpersonnel ? <AddPersonnel fetchList={fetchList} isCloseAdd={isCloseAdd} entryData={entryData} typeOfSubmit={typeOfSubmit}/> : null}
    </div>

  )
}
