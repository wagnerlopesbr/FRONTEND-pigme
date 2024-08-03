import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    image: require('../assets/premium ad 1.png'),
  },
  {
    key: '2',
    image: require('../assets/premium ad 2.png'),
  },
  {
    key: '3',
    image: require('../assets/premium ad 3.png'),
  }
];

function Slide() {
  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      autoplay={true}
      loop={true}
      autoplayTimeout={6}
      dotStyle={styles.hiddenDot}
      activeDotStyle={styles.hiddenDot}
      paginationStyle={styles.hiddenPagination}
    >
      {slides.map((slide) => (
        <View style={styles.slide} key={slide.key}>
          <Image source={slide.image} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
}

// Estilos
const styles = StyleSheet.create({
  wrapper: {
    height: height,
    bottom: -22,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  hiddenDot: {
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderRadius: 0,
  },
  hiddenPagination: {
    bottom: -20,
  },
});

export default Slide;
