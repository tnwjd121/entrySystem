import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet, Dimensions, PixelRatio, Platform, LogBox } from "react-native";
import { GoDash } from "react-icons/go";
import { debounce } from 'lodash';

// 참고
//https://velog.io/@bang9dev/React-Native-Scrollable-Time-Picker-%EB%A7%8C%EB%93%A4%EA%B8%B01

// 1. 현재 날짜에서 이동 안되는 문제 해결
// 2. 현재 날짜 보여줄때 천천히 이동해서 그냥 바로 해당 위치로 뜨게 하고싶음


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const BUTTON_HEIGHT = window.innerHeight * 0.065;
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;

const getCenterPosition = (offsetY) => {
  return Math.round(offsetY / BUTTON_HEIGHT) * BUTTON_HEIGHT;
};

const getCenterPositionFromIndex = (index) => {
  return index * BUTTON_HEIGHT;
};


export default function DateModal({ onSelectDate }) {

  return (
    <View style={styles.view}>
      <DatePicker
        buttonHeight={BUTTON_HEIGHT}
        visibleCount={3}
        onSelectDate ={onSelectDate}
      />
    </View>
  );
}



const DatePicker = ({ buttonHeight,visibleCount, onSelectDate }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();


  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [days, setDays] = useState(Array.from({ length: 31 }, (_, i) => i + 1));

  const refs = useRef(Array.from({ length: 3 }).map(() => React.createRef()));

  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollToPosition = (position) => {
    Animated.spring(scrollY, {
      toValue: position,
      useNativeDriver: true,
    }).start();
  };



  useEffect(() => {
    // 선택된 연도와 월에 맞는 최대 일수를 구함
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // selectedDay가 그 월의 최대 일수를 초과하면, 최대 일수로 설정
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth); // 초과하면 최대 일자로 설정
    } else if (selectedDay < 1) {
      setSelectedDay(1); // 1일 미만이면 1일로 설정
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    // 오늘 날짜를 기반으로 연도, 월, 일을 설정
    const todayYear = currentDate.getFullYear();
    const todayMonth = currentDate.getMonth() + 1;
    const todayDay = currentDate.getDate();

  
    // 선택된 날짜를 기준으로 스크롤을 설정
    const todayYearIndex = years.indexOf(todayYear);
    const todayMonthIndex = months.indexOf(todayMonth);
    const todayDayIndex = todayDay - 1; // 0부터 시작하므로
  
    // refs가 준비된 이후에 스크롤을 실행
    const scrollToToday = () => {
      if (refs.current[0]?.current && refs.current[1]?.current && refs.current[2]?.current) {
        refs.current[0]?.current?.scrollTo({
          y: getCenterPositionFromIndex(todayYearIndex),
          animated: true,
        });
        refs.current[1]?.current?.scrollTo({
          y: getCenterPositionFromIndex(todayMonthIndex),
          animated: true,
        });
        refs.current[2]?.current?.scrollTo({
          y: getCenterPositionFromIndex(todayDayIndex),
          animated: true,
        });
      }
    };
  
    // 첫 번째 실행에서 scrollToToday 호출
    scrollToToday();
  
  }, []);  // 상태값이 변경될 때만 실행


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
        getOnScrollStop(index)(e); // 직접 이벤트 처리
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

    let date = `${selectedYear}`;

    if(selectedMonth.toString().length<2){
      date += `-0${selectedMonth}`;
    }else{
      date += `-${selectedMonth}`;
    }

    if(selectedDay.toString().length<2){
      date += `-0${selectedDay}`;
    }else{
      date += `-${selectedDay}`;
    }
    onSelectDate(date)
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
