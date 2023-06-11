import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainList from './src/list-screen/MainList';
import CardInform from './src/card-screen/Card';
import {NavigationContainer} from '@react-navigation/native';

function App(): JSX.Element {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="App">
        <Stack.Screen name="MainList" component={MainList} />
        <Stack.Screen name="CardInform" component={CardInform} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
