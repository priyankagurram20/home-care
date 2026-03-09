import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import apiurl from './utils/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';

const HomecareAuthScreen = ({ navigation }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [fieldOfWork, setFieldOfWork] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Ambulance', value: 'Ambulance' },
    { label: 'Autos', value: 'Autos' },
    { label: 'Diagonistic', value: 'Diagonistic' },
    { label: 'Electricians', value: 'Electricians' },
    { label: 'Painters', value: 'Painters' },
    { label: 'Photographers', value: 'Photographers' },
    { label: 'Plumbers', value: 'Plumbers' },
    { label: 'Saloon', value: 'Saloon' },
  ]);

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
  const isValidBankAccount = (acc) => /^\d{9,18}$/.test(acc);

  
  const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidName = (name) =>
  /^[a-zA-Z\s]{3,}$/.test(name.trim()); // At least 3 letters, spaces allowed

const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const handleAuth = async () => {
  // Trim all input values
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  const trimmedAadhar = aadhar.trim();
  const trimmedBankAccount = bankAccount.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  if (
    !trimmedEmail ||
    !trimmedPassword ||
    (mode === 'signup' &&
      (!trimmedConfirmPassword || !trimmedName || !trimmedPhone || !trimmedAadhar || !trimmedBankAccount || !fieldOfWork))
  ) {
    Alert.alert('Error', 'Please fill in all fields.');
    return;
  }

  if (!isValidEmail(trimmedEmail)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    return;
  }

  if (mode === 'signup' && !isValidName(trimmedName)) {
    Alert.alert('Invalid Name', 'Name must be at least 3 letters and contain only letters and spaces.');
    return;
  }

  if (mode === 'signup' && !isValidPhone(trimmedPhone)) {
    Alert.alert('Invalid Phone', 'Phone number must be exactly 10 digits.');
    return;
  }

  if (mode === 'signup' && !isValidAadhar(trimmedAadhar)) {
    Alert.alert('Invalid Aadhar', 'Aadhar number must be exactly 12 digits.');
    return;
  }

  if (mode === 'signup' && !isValidBankAccount(trimmedBankAccount)) {
    Alert.alert('Invalid Bank Account', 'Bank account number must be between 9 and 18 digits.');
    return;
  }

  if (!isValidPassword(trimmedPassword)) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    );
    return;
  }

  if (mode === 'signup' && trimmedPassword !== trimmedConfirmPassword) {
    Alert.alert('Error', 'Passwords do not match.');
    return;
  }

  if (mode === 'signup' && !fieldOfWork) {
    Alert.alert('Error', 'Please select a field of work.');
    return;
  }

  try {
    if (mode === 'login') {
      const res = await axios.post(`${apiurl}/api/authRoutes/login`, {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (res.data.success) {
        Alert.alert('Login Successful', `Welcome back, ${res.data.name}`);
        // Navigate to Employeehome and pass email for fetching details
        navigation.replace('Employeehome', { email: trimmedEmail });

      } else {
        Alert.alert('Login Failed', res.data.message || 'Invalid credentials');
      }
    } else {
      const res = await axios.post(`${apiurl}/api/authRoutes/signup`, {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        phone: trimmedPhone,
        aadhar: trimmedAadhar,
        bankAccount: trimmedBankAccount,
        fieldOfWork,
      });

      if (res.data.success) {
        Alert.alert('Registration Successful', `Welcome, ${trimmedName}`);
        // Navigate to Employeehome and pass email for fetching details
        navigation.replace('Employeehome', { email: trimmedEmail });

      } else {
        Alert.alert('Signup Failed', res.data.message || 'Something went wrong');
      }
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Server error or network issue.');
  }
};


  const maskValue = (value) => value.replace(/\d(?=\d{4})/g, '*');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setAadhar('');
    setBankAccount('');
    setFieldOfWork('');
    setValue(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>
            {mode === 'login' ? 'Employee Login' : 'Employee Registration'}
          </Text>

          {mode === 'signup' && (
            <>
              <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Aadhar Number"
              keyboardType="numeric"
              value={aadhar}
              onChangeText={setAadhar}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {mode === 'signup' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Bank Account Number"
                keyboardType="numeric"
                value={bankAccount}
                onChangeText={setBankAccount}
              />
              <View style={{ zIndex: 1000, marginBottom: open ? 250 : 16 }}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    const selected = callback(value);
                    setValue(selected);
                    setFieldOfWork(selected);
                  }}
                  
                  setItems={setItems}
                  placeholder="Select Field of Work"
                  listMode="SCROLLVIEW"
                  style={{ borderColor: '#bdc3c7' }}
                  dropDownContainerStyle={{ borderColor: '#bdc3c7', maxHeight: 400 }}
                />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomecareAuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f6f3',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#2980b9',
    fontSize: 14,
  },
  backButtonContainer: {
    marginTop: 30,
    paddingLeft: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 200,
  },
});
