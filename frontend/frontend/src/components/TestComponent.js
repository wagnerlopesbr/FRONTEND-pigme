import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const colors = ['#FFABAB', '#FFC3A0', '#D5AAFF', '#A1C4FD', '#C2E6F4'];

const TestComponent = () => {
  const items = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.listContainer}>
          {items.map((item, index) => {
            const isPremium = index >= 3;
            const titleColor = isPremium ? 'black' : colors[index % colors.length];
            const borderColor = isPremium ? 'black' : `${titleColor}`;
            const backgroundColor = isPremium ? `rgba(0, 0, 0, 0.5)` : `${titleColor}50`;
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
                  <Text style={styles.itemTitle}>
                    {isPremium ? `Lista Premium ${item}` : `Lista ${item}`}
                  </Text>
                </View>
                <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
                  <TouchableOpacity style={styles.button} onPress={() => console.log(`Editar Lista ${item}`)}>
                    <Icon name="edit" size={40} color={isPremium ? "#41413E" : "#4E4E11"} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => console.log(`Comprar Lista ${item}`)}>
                    <Icon name="shopping-cart" size={40} color={isPremium ? "#41413E" : "#4E4E11"} />
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
    paddingHorizontal: 20,
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
    height: '17%',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: 'transparent',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  premiumItemContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
  },
  itemTitleContainer: {
    width: '110%',
    backgroundColor: 'black',
    padding: 8,
    overflow: 'hidden',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 15,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: 'transparent',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TestComponent;
