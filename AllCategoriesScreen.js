import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  'Electricians',
  'Plumbers',
  'Painters',
  'Autos',
  'Ambulance',
  'Saloon Services',
  'Photographers',
  'Diagnostic Centers',
];

const screenMap = {
  Electricians: 'Electricians',
  Plumbers: 'Plumbers',
  Painters: 'Painters',
  Ambulance: 'Ambulance',
  'Saloon Services': 'Saloon',
  Photographers: 'Photographers',
  'Diagnostic Centers': 'Diagonistic',
  Autos: 'Autos',
};

export default function AllCategoriesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {filteredCategories.length === 0 ? (
        <Text style={styles.noResults}>No categories found.</Text>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const targetScreen = screenMap[item];
                if (targetScreen) {
                  navigation.navigate(targetScreen);
                } else {
                  alert(`${item} screen is not available`);
                }
              }}
            >
              <Text style={styles.categoryItem}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefbff', paddingHorizontal: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    marginHorizontal: 10,
    color: '#333',
  },
  categoryItem: {
    paddingVertical: 15,
    fontSize: 16,
    color: '#222',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
});
