import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet, Dimensions, PixelRatio, Platform, LogBox } from "react-native";
import { GoDash } from "react-icons/go";
import { debounce } from 'lodash';

// 참고
//https://velog.io/@bang9dev/React-Native-Scrollable-Time-Picker-%EB%A7%8C%EB%93%A4%EA%B8%B01


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const BUTTON_HEIGHT = window.innerHeight * 0.065;
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;

const getCenterPosition = (offsetY) => {
  return Math.round(offsetY / BUTTON_HEIGHT) * BUTTON_HEIGHT;
};
const getCenterPositionFromIndex = (index) =>  {
  return index * BUTTON_HEIGHT;
};

export default function DateModal({onClose,dateCount,selectedYear,setSelectedYear,selectedMonth,setSelectedMonth,selectedDay,setSelectedDay}) {

  return (
    <View style={styles.view}>
      <DatePicker
        buttonHeight={BUTTON_HEIGHT}
        visibleCount={3}
        onClose ={onClose}
        dateCount ={dateCount}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
    </View>
  );
}



const DatePicker = ({dateCount, visibleCount, onClose, selectedYear,setSelectedYear, selectedMonth, setSelectedMonth, selectedDay, setSelectedDay }) => {

  // 데이터 저장
  const [days, setDays] = useState(Array.from({ length: 31 }, (_, i) => i + 1));

  // 현재 날짜
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth() + 1;
  const currentDay = todayDate.getDate();

  const todayYearIndex = years.findIndex((y) => y === currentYear);
  const todayMonthIndex = currentMonth - 1;
  const todayDayIndex = currentDay - 1;
  
  // 년도
  const yearIndex = years.findIndex((y) => y === selectedYear) ;
  const monthIndex = selectedMonth -1 ;
  const dayIndex = selectedDay -1 ;



  const refs = useRef(Array.from({ length: 3 }).map(() => React.createRef()));

  const scrollY = useRef(new Animated.Value(0)).current;

  // 오늘 날짜 스크롤
  const scrollToToday = () => {
    if (refs.current[0]?.current && refs.current[1]?.current && refs.current[2]?.current) {
      refs.current[0]?.current?.scrollTo({
        y: getCenterPositionFromIndex(todayYearIndex),
        animated: false,
      });
      refs.current[1]?.current?.scrollTo({
        y: getCenterPositionFromIndex(todayMonthIndex),
        animated: false,
      });
      refs.current[2]?.current?.scrollTo({
        y: getCenterPositionFromIndex(todayDayIndex),
        animated: false,
      });
    }
  };

  // 선택한 날짜로 열기
  const scrollToSelect = () => {
    if (refs.current[0]?.current && refs.current[1]?.current && refs.current[2]?.current) {
      refs.current[0]?.current?.scrollTo({
        y: getCenterPositionFromIndex(yearIndex),
        animated: false,
      });
      refs.current[1]?.current?.scrollTo({
        y: getCenterPositionFromIndex(monthIndex),
        animated: false,
      });
      refs.current[2]?.current?.scrollTo({
        y: getCenterPositionFromIndex(dayIndex),
        animated: false,
      });
    }
  };

  useEffect(()=>{
    if(dateCount==1) {
      scrollToToday()

    // 상태 초기화 (오늘 날짜로 설정)
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDay(currentDay);

    }else if(dateCount > 1){
      scrollToSelect()
    }
  },[dateCount])

  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth); 
    } else if (selectedDay < 1) {
      setSelectedDay(1); 
    }
  }, [selectedYear, selectedMonth]);
  
  const scrollToPosition = (position) => {
    Animated.spring(scrollY, {
      toValue: position,
      useNativeDriver: true,
    }).start();
  };

  const getOnScrollStop = (index) => (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const CENTER_POSITION = getCenterPosition(offsetY); // 중앙 위치 계산
    const actualIndex = Math.round(CENTER_POSITION / BUTTON_HEIGHT);
    scrollToPosition(CENTER_POSITION);

    let newSelectedValue;

    if (index === 0) {
      newSelectedValue = years[actualIndex];
      setSelectedYear(newSelectedValue);
    } else if (index === 1) {
      newSelectedValue = months[actualIndex];
      setSelectedMonth(newSelectedValue);
    } else if (index === 2) {
      newSelectedValue = days[actualIndex];
      setSelectedDay(newSelectedValue);
    }

    // 스크롤 위치 조정
    refs.current[index]?.current?.scrollTo({
      y: CENTER_POSITION,
      animated: true,
    });
  };

  const getScrollProps = (index) => {
    return {
      showsVerticalScrollIndicator: false,
      ref: refs.current[index],
      onScrollBeginDrag: () => {
      },
      onScrollEndDrag: (e) => {
        getOnScrollStop(index)(e);
      },
      onMomentumScrollBegin: () => {
      },
      onMomentumScrollEnd: (e) => {
        getOnScrollStop(index)(e);
      },
    };
  };



  const [scrollProps] = useState(() => {
    return Array.from({ length: 3 }).map((_, index) => getScrollProps(index));
  });

  const fillEmpty = (visibleCount, values) => {
    const fillCount = (visibleCount - 1) / 2;
    let result = [...values];
    result = Array(fillCount).fill('').concat(values).concat(Array(fillCount).fill(''));
    return result;
  };
  const getOnPress = (scrollViewIdx, buttonIdx) => () => {
    const targetIdx = buttonIdx - 1;
    if (targetIdx < 0) return;
    const CENTER_POSITION = getCenterPositionFromIndex(targetIdx);
    scrollToPosition(CENTER_POSITION);
    scrollProps[scrollViewIdx].ref.current.scrollTo({ y: CENTER_POSITION });
  };

  
  const handleConfirm = () => {
    onClose();
  };


  return (
    <View>
      <View style={styles.background} />
      <View style={styles.body}>
        <View style={styles.dash}>
          <GoDash style={styles.dashsize} />
        </View>
        <View >
          <Text style={styles.title}>출입날짜</Text>
        </View>
        <View style={styles.view}>
          <View style={[styles.container]}>
            <ScrollView {...scrollProps[0]}
              onScroll={(e) => {
                getOnScrollStop(0)(e);
              }}
              style={[styles.row]}
            scrollEventThrottle={100}
            >
              {fillEmpty(visibleCount, years).map((year, index) => (
                year !== '' ? (
                  <CustomButton
                    key={year}
                    label={`${year}년`}
                    onPress={getOnPress(0, index)}
                    selected={year !== '' && year === selectedYear}
                  />
                ) : (
                  <View style={styles.button} key={`empty-${index}`}>
                    <Text style={styles.buttonLabel}></Text>
                  </View>
                )
              ))}
            </ScrollView>
            <ScrollView {...scrollProps[1]}
              onScroll={(e) => {
                getOnScrollStop(1)(e);
              }}
              style={[styles.row]}
            scrollEventThrottle={100}
            >
              {fillEmpty(visibleCount, months).map((month, index) => (
                month !== '' ? (
                  <CustomButton
                    key={month}
                    label={`${month}월`}
                    onPress={getOnPress(1, index)}
                    selected={month !== '' && month === selectedMonth}
                  />
                ) : (
                  <View style={styles.button} key={`empty-${index}`}>
                    <Text style={styles.buttonLabel}></Text>
                  </View>
                )
              ))}
            </ScrollView>
            <ScrollView {...scrollProps[2]}
              onScroll={(e) => {
                getOnScrollStop(2)(e);
              }}
              style={[styles.row]}
            scrollEventThrottle={100}
            >
              {fillEmpty(visibleCount, days).map((day, index) => (
                day !== '' ? (
                  <CustomButton
                    key={day}
                    label={`${day}일`}
                    onPress={getOnPress(2, index)}
                    selected={day !== '' && day === selectedDay}
                  />
                ) : (
                  <View style={styles.button} key={`empty-${index}`}>
                    <Text style={styles.buttonLabel}></Text>
                  </View>
                )
              ))}
            </ScrollView>
            <OverlayView />
          </View>
        </View>
        <View style={styles.datemodalbutton}>
          <TouchableWithoutFeedback onPress={handleConfirm}>
            <View style={styles.button}>
              <Text style={styles.buttontext}>확인</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const CustomButton = ({ label, onPress, selected }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, selected && styles.selectedButton]}>
        <Text style={[styles.buttonLabel, selected && styles.selectedButtonLabel]}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const OverlayView = () => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlay]}>
    <View style={styles.overlayVisibleView}>
      <View style={styles.overlayVisibleViewInner} />
      <View style={[styles.overlayVisibleViewInner, { marginLeft: '2vw', marginRight: '2vw' }]} />
      <View style={styles.overlayVisibleViewInner} />

    </View>
  </View>
);

const styles = StyleSheet.create({
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#00000033',
  },
  body: {
    margin: 'auto',
    position: 'fixed',
    bottom: '2%',
    left: '2%',
    width: '96%',
    height: '85vw',
    backgroundColor: '#ffffff',
    borderRadius: '8vw',
    zIndex: '1000'

  },
  title: {
    fontFamily: 'PretendardMedium',
    fontSize: '6vw',
    paddingLeft: '5vw',
    marginTop: '3vw',
    marginBottom: '3vw'
  },
  datemodalbutton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '2vw',
    position: 'fixed',
    width: '90%',
    left: '5%',
    bottom: '5%',
    backgroundColor: '#2150b2',
    zIndex: '1000'
  },
  buttontext: {
    fontFamily: 'PretendardMedium',
    fontSize: '5vw',
    color: '#ffffff'
  },
  dash: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '25vw',
    height: '5vw',
    color: '#e5e7eb',
    marginTop: '1vw',
  },
  dashsize: {
    fontSize: '25vw',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    padding: '2vw',
    width: '81vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontFamily: 'PretendardMedium',
    width: '81vw',
    height: VIEW_HEIGHT
  },
  row: {
    width: '25vw'
  },
  button: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: '5vw'
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: VIEW_HEIGHT,

  },
  overlayVisibleView: {
    display: 'flex',
    justifyContent: 'center',
    width: '81vw',
    height: BUTTON_HEIGHT,
    flexDirection: 'row',
  },
  overlayVisibleViewInner: {
    width: "25vw",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3579f6',
  },
  selectedButton: {
    borderRadius: 10,
  },
  selectedButtonLabel: {
    color: '#3579f6',
    fontWeight: 'bold',
  },
});
