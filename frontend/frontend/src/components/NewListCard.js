import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NewListCard = ({ index, isPremium, onPress }) => {
  const titleColor = (!isPremium && index > 2) ? 'black' : '#478BFF';
  const borderColor = (!isPremium && index > 2) ? 'black' : `${titleColor}`;
  const backgroundColor = (!isPremium && index > 2) ? `rgba(0, 0, 0, 0.5)` : `${titleColor}50`;
  const titleFontColor = (!isPremium && index > 2) ? `#41413E` : `white`;

  return (
    <View
      style={[
        styles.itemContainer,
        (!isPremium && index > 2) && styles.premiumItemContainer,
        { borderColor: borderColor }
      ]}
    >
      <View
        style={[
          styles.itemTitleContainer,
          { backgroundColor: titleColor }
        ]}
      >
        <Text style={[styles.itemTitle, {color: titleFontColor}]}>
          {(!isPremium && index > 2) ? `Nova Lista Premium` : `Nova Lista`}
        </Text>
      </View>
      <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity disabled={(!isPremium && index > 2)} style={styles.button} onPress={onPress}>
          <Icon name="file-plus-outline" size={55} color="#4E4E11" />
        </TouchableOpacity>
      </View>
      {(!isPremium && index > 2) && (
        <View style={styles.iconContainer}>
          <Icon name="lock" size={60} color="yellow" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '48%',
    height: 125,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'transparent',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  premiumItemContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  itemTitleContainer: {
    width: '105%',
    backgroundColor: 'black',
    padding: 5,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'transparent',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewListCard;
