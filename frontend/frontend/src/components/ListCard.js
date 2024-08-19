import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import { deleteList } from '../utils/crud_actions';


const ListCard = ({ index, item, isPremium, onEdit, onBuy }) => {
  const [token] = useAtom(tokenAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleConfirm = async () => {
    await deleteList(item.id, token);
    toggleModal();
  };

  const titleColor = (!isPremium && index > 2) ? 'black' : '#FFB047';
  const borderColor = (!isPremium && index > 2) ? 'black': `${titleColor}`;
  const backgroundColor = (!isPremium && index > 2) ? `rgba(0, 0, 0, 0.5)` : `${titleColor}50`;
  const titleFontColor = (!isPremium && index > 2) ? `#41413E` : `white`;

  return (
    <View
      style={[
        styles.itemContainer,
        (!isPremium && index > 2) && styles.notPremiumItemContainer,
        { borderColor: borderColor }
      ]}
    >
      <View
        style={[
          styles.itemTitleContainer,
          { backgroundColor: titleColor }
        ]}
      >
        <Text style={[styles.itemTitle, {color: titleFontColor}]}>
          {(!isPremium && index > 2) ? `${item.title}` : `${item.title}`}
        </Text>
        <TouchableOpacity onPress={toggleModal} style={{ marginRight: -5 }}>
          <Icon name="delete-circle" size={23} color='black' marginRight={10} />
        </TouchableOpacity>

      </View>
      <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity disabled={(!isPremium && index > 2)} style={styles.button} onPress={() => onEdit(item)}>
          <Icon name="file-document-edit-outline" size={55} color={isPremium ? "#41413E" : "#4E4E11"} />
        </TouchableOpacity>
        <TouchableOpacity disabled={(!isPremium && index > 2)} style={styles.button} onPress={() => onBuy(item)}>
          <Icon name="cart-variant" size={55} color={isPremium ? "#41413E" : "#4E4E11"} />
        </TouchableOpacity>
      </View>
      {(!isPremium && index > 3) && (
        <View style={styles.iconContainer}>
          <Icon name="lock" size={60} color="yellow" />
        </View>
      )}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Deletar Lista <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={toggleModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    height: 160,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 22,
    marginBottom: 25,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  listContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '48%',
    height: 125,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'transparent',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  notPremiumItemContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
  },
  itemTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '105%',
    backgroundColor: 'black',
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'transparent',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListCard;
