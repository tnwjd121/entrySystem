import React from 'react'
import '../css/deleteconfirmmodal.css'

export default function DeleteConfirmModal({isOpenDelete}) {
    return (
        <div>
            <div id='deletemodal-background'></div>
            <div id='deletemodal-body'>
                <div id='deletemodal-top'>
                    <div id='deletemodal-title'>삭제</div>
                    <div id='deletemodal-text'>해당 리스트를 삭제하시겠습니까?</div>
                </div>
                <div id='deletemodal-bottom'>
                    <div id='deletemodal-canclebutton' onClick={isOpenDelete}>취소</div>
                    <div id='deletemodal-confirmbutton'>확인</div>
                </div>
            </div>
        </div>
    )
}
