import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import { deleteList } from '../utils/crud_actions';
import tinycolor from 'tinycolor2';

const ListCard = ({ index, item, isPremium, onEdit, onBuy, onDelete }) => {
  const [token] = useAtom(tokenAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleConfirm = async () => {
    await deleteList(item.id, token);
    onDelete(item.id);
    toggleModal();
  };

  const mainColor = (!isPremium && index > 2) ? 'black' : `#DBBC7F`;
  const titleColor = (!isPremium && index > 2) ? 'black' : tinycolor(mainColor).lighten(25).toString();
  const backgroundColor = (!isPremium && index > 2) ? `rgba(0, 0, 0, 0.5)` : tinycolor(mainColor).lighten(25).toString();
  const titleFontColor = "#2F2F2F";

  const progressPercentage = (item.products?.length || 0) / 40 * 100;
  const progressWidth = `${progressPercentage}%`;
  const remainingPercentage = 100 - progressPercentage;
  const remainingBar = `${remainingPercentage}%`

  return (
    <View
        style={[
          styles.itemContainer,
          (!isPremium && index > 2) && styles.notPremiumItemContainer,
          { borderColor: mainColor }
        ]}
      >
        <View
          style={[
            styles.itemTitleContainer,
            { backgroundColor: titleColor }
          ]}
        >
          <Text style={[styles.itemTitle, { color: titleFontColor, fontWeight: '900'}]}>
            {(!isPremium && index > 2) ? `${item.title}` : `${item.title}`}
          </Text>
          <TouchableOpacity disabled={(!isPremium && index > 2)} style={{ marginRight: 0 }} onPress={() => onEdit(item)}>
          <Icon name="file-document-edit-outline" size={23} color="#2F2F2F" marginRight={10} />
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonsContainer, { backgroundColor: backgroundColor }]}>
          <TouchableOpacity disabled={(!isPremium && index > 2)} style={[styles.button, { flexDirection: 'row'}]} onPress={() => onBuy(item)}>
          <Icon name="cursor-default-click" size={25} color="#2F2F2F" />
          <Text style={{ color: `#2F2F2F`, fontSize: 22, fontWeight: '900' }} > Comprar </Text>
          </TouchableOpacity>
        </View>
        {(!isPremium && index > 3) && (
          <View style={styles.iconContainer}>
            <Icon name="lock" size={60} color="yellow" />
          </View>
        )}
        <View
          style={[
            styles.itemTitleContainer,
            { backgroundColor: titleColor, paddingBottom: 15 }
          ]}
        >
          <TouchableOpacity onPress={toggleModal} style={{ marginLeft: -3 }}>
          <Icon name="trash-can-outline" size={23} color="#2F2F2F" />
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: progressWidth }]} />
            <View style={[styles.remainingBar, { width: remainingBar }]} />
            <Text style={styles.progressText}>{`${item.products?.length || 0}/40 produtos`}</Text>
          </View>
        </View>
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
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 20,
    backgroundColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2F2F2F',
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
  },
  remainingBar: {
    height: '100%',
    backgroundColor: '#978F8E',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
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
    borderWidth: 2,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '105%',
    height: 40,
    backgroundColor: 'black',
    paddingLeft: 15,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: 'black',
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
