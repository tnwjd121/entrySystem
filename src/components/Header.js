import React from 'react'
import "../css/header.css"

export default function Header() {
  return (
    <header>
      <div id='header-body'>
        <div id='header-logo'>
            <img src={require('../imgs/logo_01.png')}/>
        </div>
      </div>
    </header>
  )
}
