import React, { useState } from 'react'
import '../css/carriermodal.css'
import { GoDash } from "react-icons/go";

export default function CarrierModal({ onSelectCarrier }) {

  const carriers = ["SKT", "KT", "LGU+", "SKT 알뜰폰", "KT 알뜰폰", "LGU+ 알뜰폰"];

  return (
    <div>
    <div id='carriermodal-background'></div>
    <div id='carriermodal-body'>
      <div id='dash'><GoDash /></div>
      <div id='carriermodal-title'>
      <p>통신사를 선택해주세요</p>
      </div>
      {carriers.map((carrier) => (
      <div 
      id='carriermodal-field' 
      key={carrier}
      onClick={()=>onSelectCarrier(carrier)}>
        <p>{carrier}</p>
      </div>
      ))}
    </div>

    </div>
  )
}
