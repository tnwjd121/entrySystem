import React, { useEffect, useState } from "react";
import "../css/datemodal.css";
import { GoDash } from "react-icons/go";

export default function DateModal({ isOpenDate }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const itemHeight = 30; // 각 항목의 높이(px)

  const handleScroll = (type, container, items, setSelected) => {
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / itemHeight); // 가장 가까운 인덱스 계산
    setSelected(items[index]);

    // 스크롤 위치 보정 (중앙 정렬)
    container.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const yearElement = document.querySelector(".scroll-container-year");
    const monthElement = document.querySelector(".scroll-container-month");
    const dayElement = document.querySelector(".scroll-container-day");

    const handleYearScroll = () =>
      handleScroll("year", yearElement, years, setSelectedYear);
    const handleMonthScroll = () =>
      handleScroll("month", monthElement, months, setSelectedMonth);
    const handleDayScroll = () =>
      handleScroll("day", dayElement, days, setSelectedDay);

    // 스크롤 이벤트 등록
    yearElement.addEventListener("scroll", handleYearScroll);
    monthElement.addEventListener("scroll", handleMonthScroll);
    dayElement.addEventListener("scroll", handleDayScroll);

    // 초기 스크롤 위치 설정 (중앙 정렬)
    yearElement.scrollTop = years.indexOf(selectedYear) * itemHeight;
    monthElement.scrollTop = (selectedMonth - 1) * itemHeight;
    dayElement.scrollTop = (selectedDay - 1) * itemHeight;

    return () => {
      // 이벤트 제거
      yearElement.removeEventListener("scroll", handleYearScroll);
      monthElement.removeEventListener("scroll", handleMonthScroll);
      dayElement.removeEventListener("scroll", handleDayScroll);
    };
  }, [selectedYear, selectedMonth, selectedDay]);

  const submitDate = () => {
    console.log("선택된 날짜:", `${selectedYear}-${selectedMonth}-${selectedDay}`);
    isOpenDate();
  };

  return (
    <div>
      <div id="datemodal-background"></div>
      <div id="datemodal-body">
        <div id="dash">
          <GoDash />
        </div>
        <div id="datemodal-title">
          <p>출입날짜</p>
        </div>
        <div id="datemodal-date">
          <div className="scroll-container scroll-container-year">
            {years.map((year) => (
              <div
                key={year}
                className={`scroll-item ${
                  year === selectedYear ? "selected" : ""
                }`}
              >
                {year}년
              </div>
            ))}
          </div>
          <div className="scroll-container scroll-container-month">
            {months.map((month) => (
              <div
                key={month}
                className={`scroll-item ${
                  month === selectedMonth ? "selected" : ""
                }`}
              >
                {month}월
              </div>
            ))}
          </div>
          <div className="scroll-container scroll-container-day">
            {days.map((day) => (
              <div
                key={day}
                className={`scroll-item ${
                  day === selectedDay ? "selected" : ""
                }`}
              >
                {day}일
              </div>
            ))}
          </div>
        </div>
        <div id="datemodal-button" onClick={submitDate}>
          확인
        </div>
      </div>
    </div>
  );
}
