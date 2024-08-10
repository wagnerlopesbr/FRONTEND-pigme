import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai/react';
import { tokenAtom } from '../utils/jotai';
import { createList } from '../utils/crud_actions';


const { width, height } = Dimensions.get('window');

const CreateList = ({ isVisible, onClose, onCreate }) => {
  const [token] = useAtom(tokenAtom);
  const [listName, setListName] = useState('');

  const handleCreate = () => {
    if (listName.trim()) {
      const payload = { title: listName, products: [] };
      createList(payload, token);
      onCreate(listName);
      setListName('');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn='fadeIn'
      animationOut='fadeOut'
    >
      <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
        <View style={styles.container}>
          <Text style={styles.title}>Criar Nova Lista</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da lista"
            value={listName}
            onChangeText={setListName}
          />
          <Text style={{ color: 'gray', marginBottom: 25 }}>Adicione produtos à lista depois de criá-la.</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateList;
