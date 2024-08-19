import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';
import ProfilePage from './ProfilePage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListsPage from './ListsPage';
import PremiumPage from './PremiumPage';
import { userAtom, tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import { logoutUser } from '../utils/crud_actions';


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

export default function MainPage() {
  const navigate = useNavigation();
  const [user] = useAtom(userAtom);
  const [token] = useAtom(tokenAtom);

  const navigateTo = (route, params = {}) => { navigate.navigate(route, params) };

  const handleLogout = async () => {
    await logoutUser(token);
    navigateTo('login');
  };

  return (
    <View style={{ flex: 1 }}>
      <Header username={user.first_name || "Bem-Vindo(a)!"} onLogout={handleLogout} />
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
          component={ListsPage}
          options={{ 
            title: 'Listas',
            tabBarIcon: ({ size }) => (
              <Icon name="beaker" size={size} color='black' />
            ),
          }} 
        />
        {user.is_premium && (
          <Tab.Screen 
            name="Premium" 
            component={PremiumPage} 
            options={{ 
              title: 'Premium',
              tabBarIcon: ({ size }) => (
                <Icon name="star" size={size} color='black' />
              ),
            }} 
          />
        )}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
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
