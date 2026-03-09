import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from './UserContext';

import Splash from './Splash';
import HomeScreen from './HomeScreen';
import Login from './Login';
import AllCategoriesScreen from './AllCategoriesScreen';
import Employeelogin from './employeelogin';
import MyBookings from './MyBookings';
import ElectriciansScreen from './Electricians';
import PlumbersScreen from './Plumbers';
import PaintersScreen from './Painters';
import AmbulanceScreen from './Ambulance';
import SaloonScreen from './Saloon';
import PhotographersScreen from './Photographers';
import DiagonisticScreen from './Diagonistic';
import AutosScreen from './Autos';
import Homepages from './Homepage';
import EmployeeHomeScreen from './Employeehome';
import Loginas from './Loginas';

 // Make sure path is correct

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {                                  
    const timeout = setTimeout(() => {     
      setIsLoading(false);
    }, 2000);    

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
          <Stack.Screen name="Employeelogin" component={Employeelogin} />
          <Stack.Screen name="MyBookings" component={MyBookings} />
          <Stack.Screen name="Electricians" component={ElectriciansScreen} />
          <Stack.Screen name="Plumbers" component={PlumbersScreen} />
          <Stack.Screen name="Painters" component={PaintersScreen} />
          <Stack.Screen name="Ambulance" component={AmbulanceScreen} />
          <Stack.Screen name="Saloon" component={SaloonScreen} />
          <Stack.Screen name="Photographers" component={PhotographersScreen} />
          <Stack.Screen name="Diagonistic" component={DiagonisticScreen} />
          <Stack.Screen name="Autos" component={AutosScreen} />
          <Stack.Screen name="Homepage" component={Homepages} />
          <Stack.Screen name = "Employeehome" component={EmployeeHomeScreen}/>
          <Stack.Screen name = "Loginas" component={Loginas}/>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
