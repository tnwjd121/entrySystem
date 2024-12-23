import React, { useEffect, useState } from "react";
import { Animated, Button, ScrollView, Text, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { GoDash } from "react-icons/go";
import { debounce } from 'lodash';
import Constants from 'expo-constants';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const BUTTON_HEIGHT = "10vw";
const VIEW_HEIGHT = BUTTON_HEIGHT * 3;
const VIEW_WIDTH = "60vw";

const getCenterPosition = (offsetY) => {
  return Math.round(offsetY / BUTTON_HEIGHT) * BUTTON_HEIGHT;
}

const getCenterPositionFromIndex = (index) => {
  return index * BUTTON_HEIGHT;
}
const fillEmpty = (visibleCount, values) => {
  const fillCount = (visibleCount - 1) / 2;
  for (let i = 0; i < fillCount; i++) {
    values.unshift('');
    values.push('');
  }
  return values;
}

export default function DateModal({ isOpenDate }) {
  const [day, setDay] = React.useState((new Date().getFullYear()));
  return (
    <View style={styles.view}>
      <TimePicker
        value={day}
        onChange={setDay}
        width={VIEW_WIDTH}
        buttonHeight={BUTTON_HEIGHT}
        visibleCount={3}
      />
    </View>
  );
}

const TimePicker = ({ width, buttonHeight, visibleCount }) => {
  if (visibleCount % 2 === 0) throw new Error('visibleCount must be odd');

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const refs = React.useRef(
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

  const [scrollProps] = React.useState(() => {
    return Array.from({ length: 3 }).map((_, index) => getScrollProps(index));
  });

  const getOnPress = (scrollViewIdx, buttonIdx) => () => {
    const targetIdx = buttonIdx - 1;
    if (targetIdx < 0) return;
    const CENTER_POSITION = getCenterPositionFromIndex(targetIdx);
    scrollProps[scrollViewIdx].ref.current.scrollTo({ y: CENTER_POSITION });
  };

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

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
            <View style={[
              styles.container,
              { width, height: visibleCount * buttonHeight },
            ]}
            >
              <ScrollView {...scrollProps[0]}>
                {fillEmpty(visibleCount, years).map((year, index) => (
                  <CustomButton
                    key={year}
                    label={`${year}년`}
                    onPress={() => setSelectedDay(0, index)}
                    selected={year === selectedYear}
                  />
                ))}
              </ScrollView>
              <ScrollView {...scrollProps[0]}>
                {fillEmpty(visibleCount, months).map((month, index) => (
                  <CustomButton
                    key={month}
                    label={`${month}월`}
                    onPress={() => setSelectedDay(1, index)}
                    selected={month === selectedMonth}
                  />
                ))}
              </ScrollView>
              <ScrollView {...scrollProps[0]}>
                {fillEmpty(visibleCount, days).map((day, index) => (
                  <CustomButton
                    key={day}
                    label={`${day}일`}
                    onPress={() => setSelectedDay(2, index)}
                    selected={day === selectedDay}
                  />
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
}

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
        <View style={[styles.overlayVisibleViewInner, { marginLeft: 12 }]} />
        <View style={[styles.overlayVisibleViewInner, { marginLeft: 12 }]} />
        <View style={styles.overlayVisibleViewInner} />
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
    height: '100vw',
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
    justifyContent:'center',
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
    // paddingTop: Constants.statusBarHeight,
    padding: '4vw',
    width:'80vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '10vw'
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontFamily: 'PretendardMedium',
  },
  button: {
    height: "10vw",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayVisibleView: {
    width: '100%',
    height: "10vw",
    flexDirection: 'row',
  },
  overlayVisibleViewInner: {
    width: "20vw",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#c8c8c8',
  },
});
