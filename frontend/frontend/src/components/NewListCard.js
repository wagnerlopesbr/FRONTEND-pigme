import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const NewListCard = ({ isPremium }) => {
  const titleColor = isPremium ? 'black' : '#478BFF';
  const borderColor = isPremium ? 'black' : `${titleColor}`;
  const backgroundColor = isPremium ? `rgba(0, 0, 0, 0.5)` : `${titleColor}50`;
  const titleFontColor = isPremium ? `#41413E` : `white`;
  const navigation = useNavigation();

  const navigateTo = (route) => {
    navigation.navigate(route);
  };

  return (
    <View
      style={[
        styles.itemContainer,
        isPremium && styles.premiumItemContainer,
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
          {isPremium ? `Nova Lista Premium` : `Nova Lista`}
        </Text>
      </View>
      <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity disabled={isPremium} style={styles.button} onPress={() => navigateTo('not-found-page')}>
          <Icon name="file-plus-outline" size={55} color="#4E4E11" />
        </TouchableOpacity>
      </View>
      {isPremium && (
        <View style={styles.iconContainer}>
          <Icon name="lock" size={60} color="yellow" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '48%',
    height: 130,
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
    backdropFilter: 'blur(10px)',
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
