import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmpLoggedIn, setEmpIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);


  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const services = [
    { id: '1', name: 'Diagonistic', image: require('./assets/diagonistic.jpeg') },
    { id: '2', name: 'Electricians', image: require('./assets/electrician.jpg') },
    { id: '3', name: 'Plumbers', image: require('./assets/plumber.jpeg') },
    { id: '4', name: 'Painters', image: require('./assets/painter.jpeg') },
    
  ];

  const topCategories = [
    { id: '1', title: 'Ambulance', image: require('./assets/emergency-ambulance.webp') },
    { id: '2', title: 'Photographers', image: require('./assets/Photographer.jpg') },
    { id: '3', title: 'Saloon', image: require('./assets/unisex-saloon.jpeg') },
    { id: '4', title: 'Autos', image: require('./assets/auto.jpeg') },
  ];
  useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationError('Permission to access location was denied');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);

    if (reverseGeocode.length > 0) {
      const { city, country } = reverseGeocode[0];
      setLocation(`${city}, ${country}`);
    } else {
      setLocation('Location unavailable');
    }
  })();
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const emp = await AsyncStorage.getItem('loggedInEmployee');
      setEmpIsLoggedIn(!!emp);
    };
    checkLoginStatus();
  }, []);

  const handleLoginPress = () => {
    setShowDropdown(false);
    navigation.navigate('Loginas');
  };

  const handlebookings = () => {
    navigation.navigate('MyBookings');
  };

  return (
  <View style={styles.container}>
    <FlatList
      ListHeaderComponent={
        <>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Image source={require('./assets/homecare.jpg')} style={styles.logo} />
              <Text style={styles.location}>
                {location ? location : 'Fetching location...'}
              </Text>
              <View>
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowDropdown(!showDropdown)}>
                  <Text style={styles.icon}>👤</Text>
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={handleLoginPress}>
                      <Text style={styles.dropdownText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Home Services at Your Doorsteps</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Services Carousel */}
          <FlatList
            ref={flatListRef}
            data={services}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.name)}
                style={[styles.categoryCard, { width: Dimensions.get('window').width - 40 }]}
              >
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
                <View style={styles.exploreButton}>
                  <Text style={styles.exploreText}>Book Now</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Top Categories Title */}
          <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 10 }]}>Top Categories</Text>
        </>
      }

      data={topCategories}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      contentContainerStyle={{ paddingBottom: 120 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.title)}
          style={styles.gridCard}
        >
          <Image source={item.image} style={styles.categoryImage} />
          <Text style={styles.categoryText}>{item.title}</Text>
          <View style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore</Text>
          </View>
        </TouchableOpacity>
      )}
    />

    {/* Bottom Navigation */}
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={handlebookings}>
        <Text style={styles.navIcon}>📋</Text>
        <Text style={styles.navLabel}>Bookings</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'flex-start' },
  header: { padding: 20, paddingTop: 30, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 50, height: 50, borderRadius: 25 },
  appName: { fontSize: 24, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  location: { fontSize: 14, color: '#555', marginTop: 2 },
  iconButton: { marginHorizontal: 5 },
  icon: { fontSize: 22 },
  sectionHeader: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  viewAll: { fontSize: 14, color: '#007bff' },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  categoryImage: {
    width: 90,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: { textAlign: 'center', marginBottom: 8, fontWeight: '600', fontSize: 13 },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  exploreText: { color: 'white', fontSize: 12 },
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    width: 160,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 14,
  },
  gridCard: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
   navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});


