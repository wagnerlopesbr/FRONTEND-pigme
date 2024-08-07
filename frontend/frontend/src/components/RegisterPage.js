import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../utils/crud_actions';


const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Usuário é obrigatório')
    .min(4, 'Usuário deve ter pelo menos 4 caracteres'),
  email: Yup.string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export default function RegisterPage() {
  const navigation = useNavigation();

  function navigateTo(route) {
    navigation.navigate(route);
  }

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await registerUser(values);
      navigateTo('login');
    } catch (error) {
      console.error('Handle Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFE84C' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Animatable.Image
              animation="flash"
              delay={500}
              style={styles.headerImg}
              source={require('../assets/pigme icon.png')}
            />
            <Text style={styles.title}>
              Crie sua conta na <Text style={{ color: '#FF9A00', fontWeight: '900' }}>Pigme</Text>
            </Text>
          </View>

          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={validationSchema}
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
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
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

                <View style={styles.formAction}>
                  <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Cadastrar</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
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
  container: {
    paddingTop: 64,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 20,
  },
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
    backgroundColor: '#fff',
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
    backgroundColor: '#FF9A00',
    borderColor: '#FF9A00',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  /** Error Text */
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
