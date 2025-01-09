import React from 'react'
import '../css/failedauthentication.css'

export default function FailedAuthentication({closeError}) {

    // 실패 사유, 코드 없을 경우 변경
  return (
    <div>
      <div id='failedauthentication-background'></div>
      <div id='failedauthentication-body'>
        <div id='failedauthentication-title'>본인인증 실패</div>
        <div id='failedauthentication-text'>실패사유[실패코드]</div>
        <div id='failedauthentication-checkbutton' onClick={closeError()}>확인</div>
      </div>
    </div>
  )
}
