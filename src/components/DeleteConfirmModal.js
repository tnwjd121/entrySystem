import React from 'react'
import '../css/deleteconfirmmodal.css'
import axios from 'axios'

export default function DeleteConfirmModal({isCloseDelete,deleteId, fetchList}) {

    const DELETE_URL = 'http://localhost:5000/entrylist/'

    const deleteSubmit = async(deleteId) => {
        try {
            const response = await axios.delete(`${DELETE_URL}${deleteId}`)
            console.log(`${deleteId} 삭제됨`)
            fetchList();
            isCloseDelete();
        } catch (error) {
            console.error("삭제")
        }
    }

    return (
        <div>
            <div id='deletemodal-background'></div>
            <div id='deletemodal-body'>
                <div id='deletemodal-top'>
                    <div id='deletemodal-title'>삭제</div>
                    <div id='deletemodal-text'>해당 리스트를 삭제하시겠습니까?</div>
                </div>
                <div id='deletemodal-bottom'>
                    <div id='deletemodal-canclebutton' onClick={isCloseDelete}>취소</div>
                    <div id='deletemodal-confirmbutton' onClick={() => deleteSubmit(deleteId)}>확인</div>
                </div>
            </div>
        </div>
    )
}
