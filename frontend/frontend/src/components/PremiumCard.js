import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import tinycolor from 'tinycolor2';

const PremiumCard = ({ item, supermarkets, supermarketsIds }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigate = useNavigation();
  const navigateTo = (route, params = {}) => { navigate.navigate(route, params) };
  const handleBuy = (itemId, supermarketId) => {
    navigateTo('premium-check-list', { listId: itemId, supermarketId });
  };
  const supermarketDict = useMemo(() => {
    const dict = {};
    supermarkets.forEach(({ id, name }) => {
      dict[id] = name;
    });
    return dict;
  }, [supermarkets]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const mainColor = `#DBBC7F`;
  const titleColor = tinycolor(mainColor).lighten(25).toString();
  const backgroundColor = tinycolor(mainColor).lighten(25).toString();
  const flatListLineColor = tinycolor(mainColor).lighten(15).toString();
  const titleFontColor = "#2F2F2F";
  const rowColor = tinycolor(mainColor).lighten(30).toString();

  const baseHeight = isExpanded ? 51 : 44;
  const rowHeight = isExpanded ? 51 : 44;

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [baseHeight, baseHeight + supermarketsIds.size * rowHeight],
  });

  const calculateTotalPrice = (supermarketId) => {
    return item.products.reduce((total, product) => {
      const price = product.prices[supermarketId];
      return total + (price || 0) * product.quantity;
    }, 0);
  };

  const stringifiedPrice = (price) => {
    const strPrice = price.toString();
    const stringifiedPrice = strPrice.slice(0, -2) + ',' + strPrice.slice(-2);
    return stringifiedPrice;
  };

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        { borderColor: mainColor, height: heightInterpolation }
      ]}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        style={[
          styles.itemTitleContainer,
          { backgroundColor: titleColor }
        ]}
      >
        <Text style={[styles.itemTitle, { color: titleFontColor, fontWeight: '900' }]}>
          {`${item.title}`}
        </Text>
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={23} color='black' />
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
          {Array.from(supermarketsIds).map((supermarketId, index) => {
            const total = calculateTotalPrice(supermarketId);
            const supermarketName = supermarketDict[supermarketId];
            return (
              <View key={supermarketId} style={styles.supermarketRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: rowColor, borderBottomColor: flatListLineColor }]}
                  onPress={() => handleBuy(item.id, supermarketId)}
                >
                  <Text style={{ color: 'black', fontSize: 16 }}>{supermarketName}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text style={{ marginRight: 10, alignSelf: 'center', fontSize: 14, fontWeight: 'bold' }}>{`R$ ${stringifiedPrice(total)}`}</Text> 
                    <Icon name="cart-variant" size={30} color={"#2F2F2F"} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  supermarketRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
  },
  itemContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  itemTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    backgroundColor: 'black',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#B5B5B5',
    borderBottomWidth: 1,
  },
});

export default PremiumCard;
