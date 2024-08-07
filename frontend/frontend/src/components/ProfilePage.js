import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAtom } from 'jotai/react';
import { userAtom } from '../utils/jotai';

export default function ProfilePage() {
  const [user] = useAtom(userAtom);
  const navigation = useNavigation();
  const navigateTo = (route) => navigation.navigate(route);
  const [profile, setProfile] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    zipCode: user.zip_code || '',
    isPremium: user.is_premium,
    email: user.email || '',
    password: user.password || '',
  });

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    Alert.alert(
      'Perfil salvo',
      'As informações do perfil foram atualizadas.',
      [
        {
          text: 'OK',
          onPress: () => navigateTo('UserLists'),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Dados</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#848484"
        value={profile.firstName}
        onChangeText={(text) => handleInputChange('firstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        placeholderTextColor="#848484"
        value={profile.lastName}
        onChangeText={(text) => handleInputChange('lastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        placeholderTextColor="#848484"
        value={profile.zipCode}
        onChangeText={(text) => handleInputChange('zipCode', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#848484"
        value={profile.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#848484"
        value={profile.password}
        secureTextEntry
        onChangeText={(text) => handleInputChange('password', text)}
      />
      <View style={styles.premiumContainer}>
        <Text style={styles.label}>Premium:</Text>
        <Icon
          name="star"
          size={24}
          color={profile.isPremium ? 'orange' : 'gray'}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
