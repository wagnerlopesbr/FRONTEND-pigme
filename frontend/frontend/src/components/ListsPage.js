import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const colors = ['#FFABAB', '#FFC3A0', '#D5AAFF', '#A1C4FD', '#C2E6F4'];

const ListsPage = ({ items }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.listContainer}>
          {items.map((item, index) => {
            const isPremium = index >= 3;
            const titleColor = isPremium ? 'black' : colors[index % colors.length];
            const borderColor = isPremium ? 'black' : `${titleColor}`;
            const backgroundColor = isPremium ? `rgba(0, 0, 0, 0.5)` : `${titleColor}50`;
            const titleFontColor = isPremium ? `#41413E` : `white`;

            return (
              <View
                key={item}
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
                    {isPremium ? `Lista Premium ${item}` : `Lista ${item}`}
                  </Text>
                </View>
                <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
                  <TouchableOpacity disabled={isPremium} style={styles.button} onPress={() => console.log(`Editar Lista ${item}`)}>
                    <Icon name="file-document-edit-outline" size={35} color={isPremium ? "#41413E" : "#4E4E11"} />
                  </TouchableOpacity>
                  <TouchableOpacity disabled={isPremium} style={styles.button} onPress={() => console.log(`Comprar Lista ${item}`)}>
                    <Icon name="cart-variant" size={35} color={isPremium ? "#41413E" : "#4E4E11"} />
                  </TouchableOpacity>
                </View>
                {isPremium && (
                  <View style={styles.iconContainer}>
                    <Icon name="lock" size={50} color="yellow" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '48%',
    height: 110,
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
    width: '100%',
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
    transform: [{ translateX: -25 }],
    backgroundColor: 'transparent',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListsPage;
