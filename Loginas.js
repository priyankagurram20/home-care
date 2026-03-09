import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Homecare</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Employeelogin')}
      >
        <Text style={styles.buttonText}>Login as Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3498db' }]}
        onPress={() => navigation.navigate('login')}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 40,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
