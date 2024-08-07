import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import ListCard from './ListCard';
import NewListCard from './NewListCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Slide from './Slide';
import * as Animatable from 'react-native-animatable';
import CreateList from './CreateList';
import { getLists } from '../utils/crud_actions';
import { tokenAtom, userAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';


function ListsPage({ refreshLists }) {
  const [isCreateListVisible, setIsCreateListVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lists, setLists] = useState([]);
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const navigate = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };

  const fetchLists = async () => {
    try {
      const fetchedLists = await getLists(token);
      setLists(fetchedLists || []);
    } catch (error) {
      console.error('Erro ao buscar listas:', error.message || error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLists();
    }, [token])
  );

  const navigateTo = (route, params = {}) => { navigate.navigate(route, params) };

  const handleEdit = (item) => {
    console.log('Editar Lista:', item);
    navigateTo('edit-list', { listId: item.id });
  };

  const handleBuy = (item) => {
    console.log('Comprar Lista:', item);
  };

  const handleCreateList = (listName) => {
    setIsCreateListVisible(false);
    console.log('Lista criada:', listName);
  };


  return (
    <View style={styles.userListsContainer}>
      <ScrollView
        contentContainerStyle={styles.listContainer}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {lists.slice(0, 10).map((item, index) => (
          <ListCard
            index={index}
            key={item.id}
            item={item}
            isPremium={user.is_premium}
            onEdit={handleEdit}
            onBuy={handleBuy}
          />
        ))}
        {lists.length < 10 && (
          <NewListCard
            isPremium={user.is_premium}
            onPress={() => setIsCreateListVisible(true)}
          />
        )}
      </ScrollView>
      {!user.is_premium &&
        <Animatable.Text
          animation="pulse"
          duration={1000}
          style={styles.button}
          iterationCount="infinite"
          direction="alternate"
          onPress={() => navigateTo('not-found-page')}
        >
          <Text style={styles.buttonText}>Assinar Premium</Text>
        </Animatable.Text>
      }
      {!user.is_premium && <Slide />}
      <CreateList 
        isVisible={isCreateListVisible} 
        onClose={() => setIsCreateListVisible(false)} 
        onCreate={handleCreateList} 
      />
    </View>
  );
}

export default ListsPage;


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF005E',
    width: '93%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
});