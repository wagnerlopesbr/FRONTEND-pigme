import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAtom } from 'jotai/react';
import { userAtom, tokenAtom } from '../utils/jotai';
import { updateUser, updatePassword, logoutUserFromAll } from '../utils/crud_actions';

export default function ProfilePage() {
  const [user] = useAtom(userAtom);
  const [token] = useAtom(tokenAtom);
  const navigation = useNavigation();
  const navigateTo = (route, params = {}) => { navigation.navigate(route, params) };
  const removeNonDigits = (input) => {
    return input.replace(/\D/g, '');
  };

  const [profile, setProfile] = useState({
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    zip_code: removeNonDigits(user.zip_code || ''),
    isPremium: user.is_premium,
    email: user.user.email,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleInputChange = (field, value) => {
    const updatedValue = field === 'zip_code' ? removeNonDigits(value) : value;
    setProfile({ ...profile, [field]: updatedValue });
  };

  const handleSave = async () => {
    const updatedProfile = {
      ...profile,
      zip_code: removeNonDigits(profile.zip_code),
    };
    await updateUser(updatedProfile, token);
    Alert.alert(
      'As informações do perfil foram atualizadas.',
      'Por favor, faça login novamente para ver as alterações.',
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'As novas senhas não coincidem.');
      return;
    }

    const data = {
      old_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    };

    await updatePassword(data, token);

    Alert.alert('Sucesso', 'Senha alterada com sucesso.');
    toggleModal();
  };

  const handleLogoutAll = async () => {
    await logoutUserFromAll(token);
    navigateTo('login');
  };

  useEffect(() => {
    setProfile({
      id: user.id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      zip_code: removeNonDigits(user.zip_code || ''),
      isPremium: user.is_premium,
      email: user.user.email || '',
    });
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <Text style={styles.title}>Meus Dados</Text>
        {profile.isPremium && (
          <View style={styles.premiumContainer}>
            <Text style={styles.premiumLabel}>Premium:</Text>
            <Icon
              name="star"
              size={24}
              marginBottom={10}
              color={profile.isPremium ? 'orange' : 'gray'}
            />
          </View>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#848484"
            value={profile.first_name}
            onChangeText={(text) => handleInputChange('first_name', text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sobrenome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Sobrenome"
            placeholderTextColor="#848484"
            value={profile.last_name}
            onChangeText={(text) => handleInputChange('last_name', text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP:</Text>
          <TextInput
            style={styles.input}
            placeholder="CEP"
            placeholderTextColor="#848484"
            value={profile.zip_code}
            onChangeText={(text) => handleInputChange('zip_code', text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#ECECEC' }]}
            placeholder="Email"
            placeholderTextColor="#848484"
            value={profile.email}
            onChangeText={(text) => handleInputChange('email', text)}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.changePasswordButton} onPress={toggleModal}>
          <Text style={styles.buttonText}>Alterar Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Dados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutAll}>
          <Text style={styles.logoutButtonText}>Sair de Todos Dispositivos</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Senha Atual"
              placeholderTextColor="#848484"
              secureTextEntry
              value={currentPassword}
              onChangeText={(text) => setCurrentPassword(text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nova Senha"
              placeholderTextColor="#848484"
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar Nova Senha"
              placeholderTextColor="#848484"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={(text) => setConfirmNewPassword(text)}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginRight: 8,
  },
  premiumLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF9F9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 17,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  premiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    height: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  changePasswordButton: {
    backgroundColor: '#1926E1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    fontSize: 20,
    marginRight: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  logoutButtonContainer: {
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#E11818',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 17,
    backgroundColor: '#fff',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#E11818',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
});
