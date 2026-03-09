import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import apiurl from './utils/config';
import { UserContext } from './UserContext';

const BookingModal = ({ visible, onClose, selectedEmployee, serviceName, navigation }) => {
  const { userEmail } = useContext(UserContext);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date());
  const [pickedTime, setPickedTime] = useState(new Date());
  const [dateTime, setDateTime] = useState(''); // final combined date-time string

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickedDate(selectedDate);
      updateDateTime(selectedDate, pickedTime);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPickedTime(selectedTime);
      updateDateTime(pickedDate, selectedTime);
    }
  };

  const updateDateTime = (date, time) => {
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    setDateTime(combinedDateTime.toISOString().slice(0, 16).replace('T', ' '));
  };

  const resetForm = () => {
    setPhone('');
    setAddress('');
    setCity('');
    setPincode('');
    setDateTime('');
    setDescription('');
  };

  const confirmFinalBooking = async () => {
    try {
      const res = await axios.post(`${apiurl}/api/bookings`, {
        userEmail,
        phone,
        address,
        city,
        pincode,
        dateTime,
        description,
        employeeId: selectedEmployee._id,
      });
      if (res.data.success) {
        Alert.alert('Success', 'Booking confirmed!');
        onClose();
        navigation.navigate('MyBookings', { email: userEmail });
      } else {
        Alert.alert('Error', 'Booking failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error.');
    }
  };

  const confirmBooking = () => {
    if (!phone || !address || !city || !pincode || !dateTime || !description) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone number must be 10 digits.');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Error', 'Pincode must be 6 digits.');
      return;
    }

    confirmFinalBooking();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        onClose();
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Book Service - {selectedEmployee?.name} ({serviceName})</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />

          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{dateTime ? dateTime.split(' ')[0] : 'Select Date'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
              <Text>{dateTime ? dateTime.split(' ')[1] : 'Select Time'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={pickedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={pickedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}
          </View>

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description of Work"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#ccc', marginTop: 10 }]}
            onPress={() => {
              onClose();
              resetForm();
            }}
          >
            <Text style={[styles.confirmButtonText, { color: '#333' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1abc9c',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#1abc9c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookingModal;
