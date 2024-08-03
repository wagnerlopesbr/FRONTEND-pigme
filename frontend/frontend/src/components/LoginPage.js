import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../utils/crud_actions';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('O usuário é obrigatório')
    .min(4, 'O usuário deve ter pelo menos 4 caracteres'),
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  function navigateTo(route) {
    navigation.navigate(route);
  }

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setErrorMessage('');
      // const response = await loginUser(values);
      // console.log('Handle Success:', response);
      navigateTo('main');
    } catch (error) {
      setErrorMessage('Credenciais incorretas ou conta inexistente.');
      console.error(`Handle Error: ${errorMessage}`, error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Animatable.Image
              animation="zoomIn"
              style={styles.headerImg}
              source={require('../assets/pigme full body no shadow.png')}
            />
          </View>

          <Formik
            initialValues={{ username: '', password: '' }}
            // validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Usuário</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    keyboardType="default"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    placeholder="Digite seu usuário"
                    placeholderTextColor="#848484"
                    style={styles.inputControl}
                    value={values.username}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Senha</Text>
                  <TextInput
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#848484"
                    style={styles.inputControl}
                    secureTextEntry={true}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.formAction}>
                  <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Entrar</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    navigateTo('remember-account');
                  }}
                >
                  <Text style={styles.formLink}>Esqueceu sua senha?</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

        </KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={() => {
            navigateTo('register');
          }}
          style={styles.footer}
        >
          <Text style={styles.formFooter}>
            Ainda não tem uma conta?{' '}
            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>Cadastre-se!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginVertical: 40,
  },
  headerImg: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 2,
  },
  /** Footer **/
  footer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#FFE84C',
    backgroundColor: '#FFE84C',
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
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D8A600',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
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
    backgroundColor: '#FFCA36',
    borderColor: '#FFCA36',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#707018',
  },
});
