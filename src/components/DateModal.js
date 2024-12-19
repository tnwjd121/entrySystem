import React, { useEffect, useState } from 'react'
import '../css/datemodal.css'
import { GoDash } from "react-icons/go";

export default function DateModal() {

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear  + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    //  윤년이거나 월에 따라 일자 다르게 설정

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);

    useEffect(() => {
        // 기본 선택 위치를 스크롤 중앙에 배치
        const yearElement = document.querySelector(".scroll-container-year");
        const monthElement = document.querySelector(".scroll-container-month");
        const dayElement = document.querySelector(".scroll-container-day");
    
        if (yearElement) yearElement.scrollTop = years.indexOf(selectedYear) * 40;
        if (monthElement) monthElement.scrollTop = (selectedMonth - 1) * 40;
        if (dayElement) dayElement.scrollTop = (selectedDay - 1) * 40;
      }, []);
      // 가운데 라인이 있고 거기에 고정되면 스크롤
      // 

      const handleScroll = (type, index) => {
        switch (type) {
          case "year":
            setSelectedYear(years[index]);
            break;
          case "month":
            setSelectedMonth(months[index]);
            break;
          case "day":
            setSelectedDay(days[index]);
            break;
          default:
            break;
        }
      };
    
  return (
    <div>
      <div id='datemodal-background'></div>
      <div id='datemodal-body'>
        <div id='dash'><GoDash /></div>
        <div id='datemodal-title'>
            <p>출입날짜</p>
        </div>
        <div id='datemodal-date'>
                <div className='scroll-container scroll-container-year'>
                        {years.map((year) => (
                            <div key={year}
                            className={`scroll-item ${year === selectedYear ? 'selected' : ""}`}
                            onClick={() => setSelectedYear(year)}>
                                {year}년
                            </div>
                        ))}
                </div>
                <div className='scroll-container scroll-container-month'>
                        {months.map((month) => (
                            <div key={month}
                            className={`scroll-item ${month === selectedMonth ? 'selected' : ""}`}
                            onClick={() => setSelectedMonth(month)}>
                                {month}월
                            </div>
                        ))}
                </div>
                <div className='scroll-container scroll-container-day'>
                        {days.map((day) => (
                            <div key={day}
                            className={`scroll-item ${day === selectedDay ? 'selected' : ""}`}
                            onClick={() => setSelectedDay(day)}>
                                {day}일
                            </div>
                        ))}
                </div>
        </div>
        <div id='datemodal-button'>확인</div>
      </div>
    </div>
  )
}
