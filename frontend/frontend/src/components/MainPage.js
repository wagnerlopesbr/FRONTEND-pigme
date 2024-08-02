import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';
import TestComponent from './TestComponent';

const Tab = createBottomTabNavigator();

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
  const username = 'Nome do Usuário';

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <View style={{ flex: 1 }}>
      <Header username={username} onLogout={handleLogout} />
      <Tab.Navigator
        initialRouteName='UserLists'
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen name="UserProfile" component={TestComponent} options={{ title: 'Perfil' } }/>
        <Tab.Screen name="UserLists" component={TestComponent} options={{ title: 'Listas' }} />
        <Tab.Screen name="CreateList" component={TestComponent} options={{ title: 'Criar Lista' }} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
