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
import { useLocation } from 'react-router-dom';
import AddPDeleteConfirmModal from './AddPDeleteConfirmModal';


export default function EntryMain() {

  const API_URL = "http://localhost:5000"

  const location = useLocation();
  const { verificationData } = location.state || {}; 
  console.log(verificationData)


  const [isOpen, setIsOpen] = useState(false);
  const [typeOfSubmit, setTypeOfSubmit] = useState("")

  const openEntryRegistration = () => {
    setIsOpen(!isOpen);
    setTypeOfSubmit("add")
  };

  // 목서버 데이터 가져오기
  const [entryList, setEntryList] = useState([]);
  const [entryData, setEntryData] = useState([]);
  const [joinData, setJoinData] = useState([]);

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    try {
      const entrylist = await axios.get(`${API_URL}/entrylist`);
      
      const filteredList = verificationData?.callNumber
        ? entrylist.data.filter((entry) => entry.keyCallNumber === verificationData.callNumber)
        : entrylist.data;
  
      setEntryList(filteredList);
      
      const addlist = await axios.get(`${API_URL}/addpersonnel`);
      setJoinData(getJoinedData(filteredList, addlist.data));
    } catch (error) {
      console.error("에러 발생", error);
    }
  };
  

  const getJoinedData = (entrylist, addpersonnel) => {
    return entrylist.map((entry) => {
      const personnel = addpersonnel.filter(
        (person) => person.entrylistId === entry.id
      );
      return {
        ...entry,
        personnel,
      };
    });
  };





  const [openAddpersonnel, setOpenAddpersonnel] = useState(false);

  const isOpenAdd = (entry) => {
    setOpenAddpersonnel(true)
    setEntryData(entry)
    setTypeOfSubmit("addP")
  }

  const isCloseAdd = () => {
    setOpenAddpersonnel(false)
  }


  const [openDelete, setOpenDelete] = useState(false);
  const [entryId, setEntryId] = useState(null);

  const isOpenDelete = (id) => {
    setOpenDelete(true)
    setEntryId(id)
  }

  const isCloseDelete = () => {
    setOpenDelete(false)
  }

  const [openAddPDelete, setOpenAddPDelete] = useState(false);
  const [entryAddPId, setEntryAddPId] = useState(null);

  const isOpenAddPDelete = (id) => {
    setOpenAddPDelete(true)
    setEntryAddPId(id)
  }

  const isCloseAddPDelete = () => {
    setOpenAddPDelete(false)
  }

  const [openEdit, setOpenEdit] = useState(false);

  const isOpenEdit = (entry) => {
    setOpenEdit(true)
    setEntryData(entry)
    setTypeOfSubmit("edit")
    console.log("호출확인")
  }


  const isCloseEdit = () => {
    setOpenEdit(false)
  }

  const [openDetails, setOpenDetails] = useState({});

  const toggleDetail = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div id='entrymain-body'>
      <div id='entrymain-top'>
        <div id='entrymain-null'>
        </div>
        <div id='entrymain-title'>
          출입 등록 현황({entryList.length})
        </div>
        <div id='entrymain-button' onClick={openEntryRegistration}>
          <LuPlus />
        </div>
      </div>
      {joinData.map((entry) => (
        <div>
          <div id='entrymain-list' key={entry.id}>
            <div id='entrymain-list-top'>
              <div id='entrymain-list-row'>
                <div id='entrymain-text'>출입자: {entry.partnerCompany} {entry.name} {entry.personnel.length > 0 && ` 외 ${entry.personnel.length}명`}</div>
              </div>
              <div id='entrymain-list-row'>
                <div id='entrymain-text'>출입목적: {entry.purpose} {entry.personnel.length > 0 && ` 등`}</div>
              </div>
              <div id='entrymain-list-row'>
                <div id='entrymain-text'>출입일시: {entry.entryDate} {entry.entryTime}시</div>
              </div>
            </div>
            <div id='entrymain-list-bottom'>
              <div className='entrymain-list-left'>
                <div className='entrymain-list-button entrymain-list-addpersonnel-button' onClick={() => isOpenAdd(entry)}>인원추가</div>
              </div>
              <div className='entrymain-list-right'>
                <div className='entrymain-list-button entrymain-list-editbutton' fetchList={fetchList} entry={entry} onClick={() => isOpenEdit(entry)}>수정</div>
                <div className='entrymain-list-button entrymain-list-deletebutton' onClick={() => isOpenDelete(entry.id)}>삭제</div>
                {entry.personnel.length > 0 && (
                  <div className='entrymain-list-detail' onClick={() => toggleDetail(entry.id)}>
                    <FaAngleDown className={openDetails[entry.id] ? 'icon-rotate' : 'icon-normal'}/>
                  </div>
                )}
              </div>
            </div>
          </div>
          {openDetails[entry.id] && (
            <div id='entrymain-detail'>
              {entry.personnel.map((person, index) => (
                <div id='entrymain-detail-box'>
                  <div id='entrymain-detail-delete' onClick={() => isOpenAddPDelete(person.id)}>
                    <TiMinus />
                  </div>
                  <div id='entrymain-detail-list'>
                    <div id='entrymain-detail-text'>출입자: {person.partnerCompany} {person.name} </div>
                  </div>
                  <div id='entrymain-detail-list'>
                    <div id='entrymain-detail-text'>출입목적: {person.purpose}</div>
                  </div>
                  <div id='entrymain-detail-list'>
                    <div id='entrymain-detail-text'>출입일시: {person.entryDate} {person.entryTime}시 </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {isOpen && <EntryRegistration openEntryRegistration={openEntryRegistration} fetchList={fetchList} typeOfSubmit={typeOfSubmit} />}
      {openDelete ? <DeleteConfirmModal fetchList={fetchList} isCloseDelete={isCloseDelete} deleteId={entryId} /> : null}
      {openEdit ? <EntryEdit fetchList={fetchList} isCloseEdit={isCloseEdit} entryData={entryData} typeOfSubmit={typeOfSubmit} /> : null}
      {openAddpersonnel ? <AddPersonnel fetchList={fetchList} isCloseAdd={isCloseAdd} entryData={entryData} typeOfSubmit={typeOfSubmit} /> : null}
      {openAddPDelete ? <AddPDeleteConfirmModal fetchList={fetchList} isCloseAddPDelete={isCloseAddPDelete} deleteId={entryAddPId} /> : null}
    </div>

  )
}
