import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tinycolor from 'tinycolor2';


const NewListCard = ({ index, isPremium, onPress }) => {
  const mainColor = (!isPremium && index > 2) ? 'black' : `#86DE60`;
  const backgroundColor = (!isPremium && index > 2) ? `rgba(0, 0, 0, 0.5)` : tinycolor(mainColor).lighten(25).toString();
  const titleFontColor = "#2F2F2F";

  return (
    <View
      style={[
        styles.itemContainer,
        (!isPremium && index > 2) && styles.premiumItemContainer,
        { borderColor: mainColor }
      ]}
    >
      <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity disabled={(!isPremium && index > 2)} style={styles.button} onPress={onPress}>
          <Icon name="file-plus-outline" size={55} color={tinycolor('#5FAF3D').lighten(5).toString()} />
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
    borderWidth: 2,
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
    height: '100%',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
