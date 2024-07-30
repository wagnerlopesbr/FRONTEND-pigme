import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


export default function RememberAccountPage() {
  const [form, setForm] = useState({
    email: ''
  });

  const navigation = useNavigation();

  function navigateTo(route) {
    navigation.navigate(route);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E2CEAF' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              style={styles.headerImg}
              source={require('../assets/pigme knocked out.png')}
              />
            <Text style={styles.title}>
              Recupere sua conta
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ email })}
                placeholder="Digite seu email"
                placeholderTextColor="#848484"
                style={styles.inputControl}
                value={form.email} />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Enviar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            navigateTo('login')
          }}
          style={styles.footer}>
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
});