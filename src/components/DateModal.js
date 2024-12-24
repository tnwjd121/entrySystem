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
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const { height: viewportHeight } = Dimensions.get('window');
const { width: viewportWidth } = Dimensions.get('window');

const BUTTON_HEIGHT = viewportHeight * 0.18;
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;
const VIEW_WIDTH = '75vw';

const getCenterPosition = (offsetY) => {
  return Math.round(offsetY / BUTTON_HEIGHT) * BUTTON_HEIGHT;
}

const getCenterPositionFromIndex = (index) => {
  return index * BUTTON_HEIGHT;
}

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



const DatePicker = ({ width, buttonHeight, visibleCount, viewHeight }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  console.log(currentYear)

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const refs = useRef(
    Array.from({ length: 3 }).map(() => React.createRef())
  );

  const getOnScrollStop = (index) => (offsetY, label) => {
    const CENTER_POSITION = getCenterPosition(offsetY);
    refs.current[index].current.scrollTo({ y: CENTER_POSITION });
  };

  const getScrollProps = (index) => {
    const onScrollStop = debounce(getOnScrollStop(index), 200, {
      leading: false,
      trailing: true,
    });
    return {
      showsVerticalScrollIndicator: false,
      contentContainerStyle: {
        left: 0,
        right: 0,
        position: 'absolute',
      },
      ref: refs.current[index],
      onScrollBeginDrag: () => {
        onScrollStop.cancel();
      },
      onScrollEndDrag: (e) => {
        onScrollStop.cancel();
        onScrollStop(e.nativeEvent.contentOffset.y, 'onScrollEndDrag');
      },
      onMomentumScrollBegin: () => {
        onScrollStop.cancel();
      },
      onMomentumScrollEnd: (e) => {
        onScrollStop.cancel();
        onScrollStop(e.nativeEvent.contentOffset.y, 'onMomentumScrollEnd');
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
    scrollProps[scrollViewIdx].ref.current.scrollTo({ y: CENTER_POSITION });
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
            <ScrollView {...scrollProps[0]}>
              {fillEmpty(visibleCount, years).map((year, index) => (
                year !== '' ? (
                  <CustomButton
                    key={year}
                    label={`${year}년`}
                    onPress={getOnPress(0,index)}
                    selected={year === selectedYear}
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
                    selected={month === selectedMonth}
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
                    selected={day === selectedDay}
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
          <Text style={styles.buttontext}>확인</Text>
        </View>
      </View>
    </View>
  );
};

const CustomButton = ({ label, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const OverlayView = () => {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.overlayVisibleView}>
        <View style={styles.overlayVisibleViewInner} />
        <View style={[styles.overlayVisibleViewInner, { marginLeft: '4vw' }]} />
        <View style={[styles.overlayVisibleViewInner, { marginLeft: '4vw' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#00000033'
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
});
