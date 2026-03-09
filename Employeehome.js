import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiurl from './utils/config';

const EmployeeHomeScreen = ({ navigation, route }) => {
  const [employee, setEmployee] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(null);

  const userEmail = route?.params?.email;

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) {
        setError('No user email provided');
        setLoading(false);
        return;
      }

      try {
        const resEmployee = await fetch(`${apiurl}/api/authRoutes/employee?email=${encodeURIComponent(userEmail)}`);
        const dataEmployee = await resEmployee.json();

        if (!dataEmployee.success) throw new Error(dataEmployee.message || 'Failed to fetch employee data');
        setEmployee(dataEmployee.employee);

        const resOrders = await fetch(`${apiurl}/api/bookings/employee/${dataEmployee.employee._id}`);
        const dataOrders = await resOrders.json();

        if (!dataOrders.success) throw new Error(dataOrders.message || 'Failed to fetch orders');

        setOrders(dataOrders.bookings || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.replace('Loginas') },
    ]);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${apiurl}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

        if (data.success) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === bookingId ? { ...order, status: newStatus } : order
            )
          );
          if (newStatus === 'Accepted') {
            // Do not open OTP modal immediately, show Validate OTP button instead
            Alert.alert('Success', `Booking accepted! Please validate OTP to confirm.`);
          } else {
            Alert.alert('Success', `Booking ${newStatus.toLowerCase()}!`);
          }
        } else {
          Alert.alert('Error', data.message || 'Failed to update status');
        }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const validateOtp = async () => {
    if (!enteredOtp) {
      setOtpError('Please enter the OTP');
      return;
    }

    try {
      const res = await fetch(`${apiurl}/api/bookings/${currentBookingId}/validate-otp`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === currentBookingId ? { ...order, status: 'Confirmed' } : order
          )
        );
        setOtpModalVisible(false);
        Alert.alert('Success', 'OTP validated successfully. Booking confirmed!');
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError(err.message || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1abc9c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.replace('login')} style={{ marginTop: 20 }}>
          <Text style={{ color: '#1abc9c', fontSize: 16 }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hi, {employee?.name || 'Employee'}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#c0392b" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{employee?.name}</Text>

        <Text style={styles.label}>Field of Work:</Text>
        <Text style={styles.value}>{employee?.fieldOfWork}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{employee?.email}</Text>

        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{employee?.phone || 'Not provided'}</Text>
      </View>

      <Text style={styles.sectionTitle}>My Orders</Text>
      {orders.length === 0 && (
        <Text style={styles.noOrders}>No orders found.</Text>
      )}
    </>
  );

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        data={orders}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>📍 {item.address}, {item.city} - {item.pincode}</Text>
            <Text style={styles.orderText}>📅 {new Date(item.dateTime).toLocaleString()}</Text>
            <Text style={styles.orderText}>📝 {item.description}</Text>
            <Text style={styles.orderText}>📞 {item.phone}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>

            {item.status === 'Pending' && (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => updateBookingStatus(item._id, 'Accepted')}
                  style={[styles.statusButton, { backgroundColor: '#2ecc71', marginRight: 10 }]}
                >
                  <Text style={styles.statusButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateBookingStatus(item._id, 'Rejected')}
                  style={[styles.statusButton, { backgroundColor: '#e74c3c' }]}
                >
                  <Text style={styles.statusButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.status === 'Accepted' && (
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentBookingId(item._id);
                    setOtpModalVisible(true);
                    setEnteredOtp('');
                    setOtpError(null);
                  }}
                  style={[styles.statusButton, { backgroundColor: '#2980b9' }]}
                >
                  <Text style={styles.statusButtonText}>Validate OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter OTP to confirm booking</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              keyboardType="numeric"
            />
            {otpError && <Text style={styles.otpError}>{otpError}</Text>}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={validateOtp}
                style={[styles.statusButton, { backgroundColor: '#3498db', flex: 1, marginRight: 5 }]}
              >
                <Text style={styles.statusButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOtpModalVisible(false)}
                style={[styles.statusButton, { backgroundColor: '#95a5a6', flex: 1, marginLeft: 5 }]}
              >
                <Text style={styles.statusButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495e',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  label: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  value: {
    fontSize: 17,
    color: '#2c3e50',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1abc9c',
    marginBottom: 10,
  },
  noOrders: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  orderItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderText: {
    fontSize: 15,
    color: '#34495e',
  },
  statusButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusButtonText: {
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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  otpError: {
    color: 'red',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
