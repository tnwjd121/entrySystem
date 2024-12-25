import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet, Dimensions } from "react-native";
import { GoDash } from "react-icons/go";
import { debounce } from 'lodash';

// 참고
//https://velog.io/@bang9dev/React-Native-Scrollable-Time-Picker-%EB%A7%8C%EB%93%A4%EA%B8%B01

// 1. 중간에 위치되는 값으로 값 저장
// 2. 중간에 위치 될 경우 색깔 표시
// 3. 현재 날짜 기준으로 반영
// 월 선택할 경우 일자 해당하는 일자까지 나오게(이거는 만들 수 있으면 만들기)


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const { height: viewportHeight } = Dimensions.get('window');

const BUTTON_HEIGHT = Math.min(viewportHeight * 0.18, 100);
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;
const VIEW_WIDTH = '75vw';

const getCenterPosition = (offsetY) => {
  const CENTER_OFFSET = offsetY % BUTTON_HEIGHT; // 중앙 위치 오프셋 계산
  const center = offsetY - CENTER_OFFSET + BUTTON_HEIGHT / 2; // 중앙 위치로 조정
  console.log(`Center Offset: ${CENTER_OFFSET}, Final Center: ${center}`); // 위치 확인
  return center;
};




export default function DateModal({ isOpenDate }) {
  return (
    <View style={styles.view}>
      <DatePicker
        width={VIEW_WIDTH}
        buttonHeight={BUTTON_HEIGHT}
        visibleCount={3}
      />
    </View>
  );
}



const DatePicker = ({ width, buttonHeight, visibleCount }) => {
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
    console.log('Scrolling to position:', position); // 스크롤할 위치를 출력
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
    // 오늘 날짜의 연도, 월, 일을 각각 찾음
    const todayYearIndex = years.indexOf(currentYear);
    const todayMonthIndex = months.indexOf(currentMonth); // 1부터 시작
    const todayDayIndex = currentDay - 1; // 0부터 시작
  
    // 각 ScrollView 초기 스크롤 설정
    refs.current[0]?.current?.scrollTo({
      y: getCenterPositionFromIndex(todayYearIndex, visibleCount),
      animated: true,
    });
    refs.current[1]?.current?.scrollTo({
      y: getCenterPositionFromIndex(todayMonthIndex, visibleCount),
      animated: true,
    });
    refs.current[2]?.current?.scrollTo({
      y: getCenterPositionFromIndex(todayDayIndex, visibleCount),
      animated: true,
    });

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDay(currentDay);
  
  }, []);
  
  
  const getCenterPositionFromIndex = (index, visibleCount) => {
    const offset = Math.floor((visibleCount - 1) / 2); // 중앙 위치 오프셋
    const adjustedIndex = Math.max(index - offset, 0); // 최소값 보정
    const centerPosition = adjustedIndex * BUTTON_HEIGHT;
  
    return centerPosition;
  };
  
  
  
  
  
  
  

  

  
  const getOnScrollStop = (index) => (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const CENTER_POSITION = getCenterPosition(offsetY); // 중앙 위치 계산
  
    console.log(`Scroll Y: ${offsetY}, Center Position: ${CENTER_POSITION}`);  // e.nativeEvent.contentOffset.y와 getCenterPosition을 로그로 찍어봄
    
    const actualIndex = Math.round(CENTER_POSITION / BUTTON_HEIGHT);
    console.log(`Actual Index: ${actualIndex}`);
    
    let newSelectedValue;
  
    if (index === 0) {
      newSelectedValue = years[actualIndex];
      setSelectedYear(newSelectedValue);
      console.log(`Selected Year: ${newSelectedValue}`);
    } else if (index === 1) {
      newSelectedValue = months[actualIndex];
      setSelectedMonth(newSelectedValue);
      console.log(`Selected Month: ${newSelectedValue}`);
    } else if (index === 2) {
      newSelectedValue = days[actualIndex];
      setSelectedDay(newSelectedValue);
      console.log(`Selected Day: ${newSelectedValue}`);
    }
  
    // 스크롤 위치 조정
    refs.current[index]?.current?.scrollTo({
      y: CENTER_POSITION,
      animated: true,
    });
    console.log(`Scrolled to position: ${CENTER_POSITION}`);
  };
  
  
  
  
  

  const getScrollProps = (index) => {
    return {
      showsVerticalScrollIndicator: false,
      ref: refs.current[index],
      onScrollBeginDrag: () => {
        console.log("onScrollBeginDrag triggered");
        // 스크롤 시작 시 debounce 취소
      },
      onScrollEndDrag: (e) => {
        console.log("onScrollEndDrag triggered");
        getOnScrollStop(index)(e); // 직접 이벤트 처리
      },
      onMomentumScrollBegin: () => {
        console.log("onMomentumScrollBegin triggered");
        // 관성 스크롤 시작 시 처리
      },
      onMomentumScrollEnd: (e) => {
        console.log("onMomentumScrollEnd triggered");
        getOnScrollStop(index)(e); // 직접 이벤트 처리
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
    const CENTER_POSITION = getCenterPositionFromIndex(targetIdx, visibleCount);

    scrollProps[scrollViewIdx].ref.current.scrollTo({ y: CENTER_POSITION });
  };

  const handleConfirm = () => {
    console.log('Selected Date:', selectedYear, selectedMonth, selectedDay);
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
                  console.log('Scroll Y:', e.nativeEvent.contentOffset.y); // 로그 추가
                  getOnScrollStop(0)(e); // 호출 확인
                }}
            >
              {fillEmpty(visibleCount, years).map((year, index) => (
                year !== '' ? (
                  <CustomButton
                    key={year}
                    label={`${year}년`}
                    onPress={getOnPress(0,index)}
                    selected={year !== '' && year === selectedYear}
                  />
                ) : (
                  <View style={styles.button} key={`empty-${index}`}>
                    <Text style={styles.buttonLabel}></Text>
                  </View>
                )
              ))}
            </ScrollView>
            <ScrollView {...scrollProps[1]}>
              {fillEmpty(visibleCount, months).map((month, index) => (
                month !== '' ? (
                  <CustomButton
                    key={month}
                    label={`${month}월`}
                    onPress={getOnPress(1,index)}
                    selected={month !== '' && month === selectedMonth}
                  />
                ) : (
                  <View style={styles.button} key={`empty-${index}`}>
                    <Text style={styles.buttonLabel}></Text>
                  </View>
                )
              ))}
            </ScrollView>
            <ScrollView {...scrollProps[2]}>
              {fillEmpty(visibleCount, days).map((day, index) => (
                day !== '' ? (
                  <CustomButton
                    key={day}
                    label={`${day}일`}
                    onPress={getOnPress(2,index)}
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
      <View style={[styles.overlayVisibleViewInner, { marginLeft: '4vw' }]} />
      <View style={[styles.overlayVisibleViewInner, { marginLeft: '4vw' }]} />
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
    height: '50vh',
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
    backgroundColor: '#bccae8',
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
    fontSize: '20vw',
    height: '5vw',
    color: '#e5e7eb',
    marginTop: '1vw'
  },
  dashsize: {
    fontSize: '20vw',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    padding: '4vw',
    width: '90vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontFamily: 'PretendardMedium',
    width:'75vw',
    height:'21vh'
  },
  button: {
    height: "7vh",
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
    height:'21vh',

  },
  overlayVisibleView: {
    display: 'flex',
    justifyContent: 'center',
    width: '75vw',
    height: "7vh",
    flexDirection: 'row',
  },
  overlayVisibleViewInner: {
    width: "21vw",
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
