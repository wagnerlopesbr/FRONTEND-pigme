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
      <Text style={styles.title}>Meus Dados</Text>
      
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

      <View style={styles.row}>
        <View style={styles.premiumContainer}>
          <Text style={styles.label}>Premium:</Text>
          <Icon
            name="star"
            size={24}
            marginBottom={8}
            color={profile.isPremium ? 'orange' : 'gray'}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ width: 170 }}>
          <TouchableOpacity style={styles.changePasswordButton} onPress={toggleModal}>
            <Text style={styles.changePasswordButtonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 170 }}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Dados</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ width: 150, alignSelf: 'center', paddingTop: 130 }}>
        <Button
          title="Sair de Todos Dispositivos"
          onPress={handleLogoutAll}
          color={'#E11818'}
        />
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
            <View style={[styles.row, { paddingTop: 20 }]}>
              <View style={{ width: 120 }}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                  <Text style={styles.closeButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 120 }}>
                <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
                  <Text style={styles.submitButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF9F9',
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
    fontSize: 17,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  premiumContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    backgroundColor: '#1926E1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 17,
    width: '100%',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
