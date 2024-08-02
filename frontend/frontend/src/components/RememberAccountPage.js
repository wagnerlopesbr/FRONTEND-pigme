import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
});

export default function RememberAccountPage() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  function navigateTo(route) {
    navigation.navigate(route);
  }

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Animatable.Image
              animation="rubberBand"
              style={styles.headerImg}
              source={require('../assets/pigme knocked out.png')}
            />
            <Text style={styles.title}>
              Recupere sua conta
            </Text>
          </View>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const emailMessage = (
                <>
                  <Text style={styles.modalText}>Email enviado para: </Text>
                  <Text style={styles.modalMail}>
                    {values.email}
                  </Text>
                </>
              );
              showCustomAlert(emailMessage);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Digite seu email"
                    placeholderTextColor="#848484"
                    style={styles.inputControl}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <View style={styles.formAction}>
                  <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Enviar</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {alertMessage}
                <Button
                  title="     OK     "
                  onPress={() => {
                    setModalVisible(false)
                    navigateTo('login');
                  }}
                  color="#FF4A36"
                />
              </View>
            </View>
          </Modal>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            navigateTo('login');
          }}
          style={styles.footer}
        >
          <Text style={styles.formFooter}>
            <Icon name="arrow-back" size={20} color="black" />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E2CEAF',
  },
  container: {
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  headerImg: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 20,
  },
  /** Footer **/
  footer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#e8ecf4',
    backgroundColor: '#e8ecf4',
    width: '100%',
    marginTop: 'auto',
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'right',
    marginEnd: 24,
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    borderWidth: 0,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FF4A36',
    borderColor: '#FF4A36',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  /** Error Text */
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF4A36',
    marginTop: 8,
  },
  /** Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    width: '600',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalMail: {
    fontSize: 22,
    marginBottom: 20,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});
