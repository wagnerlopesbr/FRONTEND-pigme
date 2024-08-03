import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const NotFoundPage = () => {
  const navigation = useNavigation();
  const navigateTo = (route) => navigation.navigate(route);
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/pigme under work.png')}
        style={{ width: '50%', height: '50%', resizeMode: 'contain', alignSelf: 'center', marginTop: -100 }}
      />
      <Text style={styles.title}>
        Página em construção
      </Text>
      <TouchableOpacity style={styles.saveButton} onPress={() => navigateTo('UserLists')}>
        <Icon name="arrow-back" size={25} color="#fff" />
        <Text style={styles.saveButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#D6D7DA',
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  saveButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NotFoundPage;
