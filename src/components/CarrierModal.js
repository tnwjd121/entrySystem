import React, { useState } from 'react'
import '../css/carriermodal.css'
import { GoDash } from "react-icons/go";

export default function CarrierModal() {

  const [selectedCarrier, setSelectedCarrier] = useState("");

  // const handleCarrierSelect = (carrierName) => {
  //     setSelectedCarrier(carrierName);
  //     console.log("선택된 통신사:", carrierName); 
  //   };

  return (
    <div>
    <div id='carriermodal-background'></div>
    <div id='carriermodal-body'>
      <div id='dash'><GoDash /></div>
      <div id='carriermodal-title'>
      <p>통신사를 선택해주세요</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('SKT')}>
        <p>SKT</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('KT')}>
        <p>KT</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('LGU+')}>
        <p>LGU+</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('SKT 알뜰폰')}>
        <p>SKT 알뜰폰</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('KT 알뜰폰')}>
        <p>KT 알뜰폰</p>
      </div>
      <div id='carriermodal-field' onClick={handleCarrierSelect('LGU+ 알뜰폰')}>
        <p>LGU+ 알뜰폰</p>
      </div>
    </div>

    </div>
  )
}
