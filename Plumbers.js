import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import apiurl from './utils/config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from './UserContext';

const PlumbersScreen = ({ navigation }) => {
  const { userEmail } = useContext(UserContext);

  const [plumbers, setPlumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlumber, setSelectedPlumber] = useState(null);
  const [name, setName] = useState('');
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

  const fetchPlumbers = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/authRoutes/employeesByField`, {
        params: { fieldOfWork: 'Plumbers' },
      });
      if (res.data.success) {
        setPlumbers(res.data.employees);
      } else {
        setPlumbers([]);
      }
    } catch (error) {
      console.error('Error fetching plumbers:', error);
      setPlumbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlumbers();
  }, []);

  const openBookingForm = (plumber) => {
    setSelectedPlumber(plumber);
    setModalVisible(true);
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
        employeeId: selectedPlumber._id,
      });
      if (res.data.success) {
        Alert.alert('Success', 'Booking confirmed!');
        navigation.navigate('MyBookings', { email: userEmail });
      } else {
        Alert.alert('Error', 'Booking failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error.');
    }
  };


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

  const confirmBooking = () => {
    if (!phone || !address || !city || !pincode || !dateTime || !description) {
      Alert.alert('Error', 'Please fill all the fields except name.');
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

    // Directly confirm booking without OTP
    confirmFinalBooking();
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setCity('');
    setPincode('');
    setDateTime('');
    setDescription('');
    setSelectedPlumber(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Phone: {item.phone}</Text>
      <Text style={styles.itemDetails}>Email: {item.email}</Text>
      <TouchableOpacity style={styles.bookButton} onPress={() => openBookingForm(item)}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plumbers</Text>
      </View>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#1abc9c" />
        ) : plumbers.length === 0 ? (
          <Text style={styles.bodyText}>No plumbers found.</Text>
        ) : (
          <FlatList
            data={plumbers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Booking Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Book Service - {selectedPlumber?.name}</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
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
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={[styles.confirmButtonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: '#e0f7f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1abc9c',
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#1abc9c',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
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

export default PlumbersScreen;
