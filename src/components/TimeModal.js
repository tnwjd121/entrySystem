import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet, Dimensions, PixelRatio, Platform, LogBox } from "react-native";
import { GoDash } from "react-icons/go";
import { debounce } from 'lodash';


const times = Array.from({ length: 24 }, (_, i) => i + 1);
const BUTTON_HEIGHT = window.innerHeight * 0.065;
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;

const getCenterPosition = (offsetY) => {
  return Math.round(offsetY / BUTTON_HEIGHT) * BUTTON_HEIGHT;
};
const getCenterPositionFromIndex = (index) => {
  return index * BUTTON_HEIGHT;
};

export default function TimeModal({typeOfSubmit, timeCount, selectedTime, setSelectedTime, onClose}) {

  return (
    <View style={styles.view}>
      <TimePicker
        buttonHeight={BUTTON_HEIGHT}
        visibleCount={3}
        timeCount = {timeCount}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        onClose={onClose}
        typeOfSubmit={typeOfSubmit}
      />
    </View>
  );
}

const TimePicker = ({typeOfSubmit, visibleCount, timeCount, setSelectedTime, selectedTime, onClose }) => {

  const options = {
    hour: '2-digit',
    hour12: false
   };
  
  const todayTime = new Date().toLocaleTimeString('ko-KR', options);
  const currentTime = todayTime.split('시')[0];
  const TodayIndex = currentTime - 1;
  const TimeIndex = selectedTime -1;

  const refs = useRef(Array.from({ length: 1 }).map(() => React.createRef()));

  const scrollY = useRef(new Animated.Value(0)).current;

  // 기본 오늘 날짜로 고정 
  const scrollToToday = () => {
    if(refs.current[0]?.current){
      refs.current[0]?.current?.scrollTo({
        y: getCenterPositionFromIndex(TodayIndex),
        animated: false,
      })
    }
  }
  // 선택한 날짜로 열기
  const scrollToSelect = () => {
    if(refs.current[0]?.current){
      refs.current[0]?.current?.scrollTo({
        y: getCenterPositionFromIndex(TimeIndex),
        animated: false,
      })
    }
  }

  //오늘 날짜 보여주기
  useEffect(()=>{
    if(typeOfSubmit=="edit"){
      scrollToSelect()
    }else{
      if(timeCount==1) {
        scrollToToday()
      }else if(timeCount > 1){
        scrollToSelect()
      }
    }
  }, [timeCount])

  const scrollToPosition = (position) => {
    Animated.spring(scrollY, {
      toValue: position,
      useNativeDriver: true,
    }).start();
  };

  const getOnScrollStop = (index) => (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const CENTER_POSITION = getCenterPosition(offsetY)
    const actualIndex = Math.round(CENTER_POSITION / BUTTON_HEIGHT);
    scrollToPosition(CENTER_POSITION);

    let newSelectedValue;

    if (index === 0) {
      newSelectedValue = times[actualIndex];
      setSelectedTime(newSelectedValue);
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
      bounces: false,
      decelerationRate: "fast",
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
          —
        </View>
        <View >
          <Text style={styles.title}>출입시간</Text>
        </View>
        <View style={styles.view}>
          <View style={[styles.container]}>
            <ScrollView 
              {...scrollProps[0]}
              bounces={false}
              overScrollMode="never"  
              onScroll={(e) => {
                getOnScrollStop(0)(e);
              }}
              style={[styles.row]}
            scrollEventThrottle={100}
            >
              {fillEmpty(visibleCount, times).map((time, index) => (
                time !== '' ? (
                  <CustomButton
                    key={time}
                    label={`${time}`}
                    onPress={getOnPress(0, index)}
                    selected={time !== '' && time === selectedTime}
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
        <View style={styles.timemodalbutton}>
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
  timemodalbutton: {
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
    zIndex: '2'
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
    height: '5vw',
    color: '#e5e7eb',
    marginTop: '1vw',
    fontSize: '20vw'
  },
  dashsize: {
    fontSize: '20vw',

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
