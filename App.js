import 'react-native-gesture-handler';
import React from 'react'
import { Image } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './components/Home'
import CaptureScreen from './components/Capture'


const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
function StackScreen() {
  return (
    <Tab.Navigator style={{ borderWidth: 0, borderTopColor: 'transparent', shadowColor: 'transparent', elevation: 0 }} tabBarOptions={{
      style: {
        // Remove border top on both android & ios
        borderTopWidth: 0,
        borderTopColor: "transparent",

        elevation: 0,
        shadowColor: '#5bc4ff',
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
      }

    }, { tabStyle: { borderTopWidth: 0 }, style: { borderTopWidth: 0 } }}>
      <Tab.Screen name="Points" component={HomeScreen}  options={{title:'My Points'}}/>
      <Tab.Screen name="Purchase" component={CaptureScreen} options={{title:'New Purchase'}} />
    </Tab.Navigator>)
}

function MyTabs() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Stack" component={StackScreen} options={{
            headerStyle: { height: 150, elevation: 0 },
            headerTitle: () => (
              <Image
                style={{ height: 70, margin: 20, alignSelf: 'center' }}
                source={require('./assets/logo.png')}
                resizeMode='contain'
              />
            ),
            headerTitleStyle: { flex: 1, textAlign: 'center' },

          }} />
        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default MyTabs;