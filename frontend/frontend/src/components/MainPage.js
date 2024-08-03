import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';
import ListCard from './ListCard';
import NewListCard from './NewListCard';
import ProfilePage from './ProfilePage';
import NotFoundPage from './notFoundPage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slide from './Slide';
import * as Animatable from 'react-native-animatable';


const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('window');

function Header({ username, onLogout }) {
  return (
    <Appbar.Header style={styles.headerContainer}>
      <View style={styles.headerSectionLeft}>
        <Text style={styles.headerTitle}>Olá,</Text>
        <Text style={styles.headerSubtitle}>{username}</Text>
      </View>
      <View style={styles.headerSectionRight}>
        <Appbar.Action icon="logout" onPress={onLogout} />
      </View>
    </Appbar.Header>
  );
}

function UserListsScreen() {
  // const items = Array.from({ length: 10 }, (_, index) => index + 1);
  const [listCards, setListCards] = useState([1, 2, 3]);

  const navigate = useNavigation();
  const navigateTo = (route) => {navigate.navigate(route)};

  const handleEdit = (item) => {
    console.log(`Editar Lista ${item}`);
  };

  const handleBuy = (item) => {
    console.log(`Comprar Lista ${item}`);
  };

  // const addListCard = () => {
  //   if (listCards.length < 10) {
  //     setListCards([...listCards, listCards.length + 1]);
  //   }
  // };

  const test_isPremium = false;

  return (
    <View style={styles.userListsContainer}>
      <ScrollView contentContainerStyle={styles.listContainer} style={styles.scrollView}>
        {listCards.slice(0, 10).map((item, index) => (
          <ListCard
            key={item}
            item={item}
            isPremium={index >= 3}
            onEdit={handleEdit}
            onBuy={handleBuy}
          />
        ))}
        {listCards.length < 10 && (
          <NewListCard isPremium={listCards.length <= 2 ? false : true} />
        )}
      </ScrollView>
      {!test_isPremium &&
        <Animatable.Text
          animation="pulse"
          duration={1000}
          style={styles.button}
          iterationCount="infinite"
          direction="alternate"
          onPress={() => navigateTo('not-found-page')}
        >
          <Text style={styles.buttonText}>Comprar Premium</Text>
        </Animatable.Text>
        // <TouchableOpacity style={styles.button} onPress={() => navigateTo('not-found-page')}>
        //  <Text style={styles.buttonText}>Comprar Premium</Text>
        // </TouchableOpacity>
      }
      {!test_isPremium && <Slide />}
    </View>
  );
}

export default function MainPage() {
  const navigate = useNavigation();

  const navigateTo = (route) => {
    navigate.navigate(route);
  }

  const handleLogout = () => {
    console.log('Logout');
    navigateTo('login');
  };

  return (
    <View style={{ flex: 1 }}>
      <Header username={'Nome do Usuário'} onLogout={handleLogout} />
      <Tab.Navigator
        initialRouteName='UserLists'
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen 
          name="UserProfile" 
          component={ProfilePage} 
          options={{ 
            title: 'Perfil',
            tabBarIcon: ({ size }) => (
              <Icon name="account" size={size} color='black' />
            ),
          }} 
        />
        <Tab.Screen 
          name="UserLists" 
          component={UserListsScreen} 
          options={{ 
            title: 'Listas',
            tabBarIcon: ({ size }) => (
              <Icon name="beaker" size={size} color='black' />
            ),
          }} 
        />
        <Tab.Screen 
          name="Premium" 
          component={NotFoundPage} 
          options={{ 
            title: 'Premium',
            tabBarIcon: ({ size }) => (
              <Icon name="star" size={size} color='black' />
            ),
          }} 
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF005E',
    width: '93%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 5,
    elevation: 30,
    bottom: -8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  userListsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: '#FFE84C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    elevation: 4,
  },
  headerSectionLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSectionCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSectionRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    paddingLeft: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  icon: {
    width: 60,
    height: 60,
  },
  tabBar: {
    backgroundColor: '#FFCA36',
    borderTopWidth: 1,
    borderTopColor: '#FFCA36',
    color: 'black',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
    paddingBottom: 2,
  },
});
