import React from 'react';
import { Text } from 'react-native';
import AuthProvider from './src/contexts/Auth.context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrivateRoute from './src/components/PrivateRoute';
import HomeView from './src/views/Home.view';
import SignInView from './src/views/SignIn.view';
import SignUpView from './src/views/SignUp.view';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: 'home/:token?',
    SignIn: 'sign-in',
    SignUp: 'sign-up'
  }
};

const linking = {
  prefixes: ['myapp://'],
  config
};

function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        linking={linking}
        fallback={<Text>Loading...</Text>}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{
              headerLeft: () => null,
              headerBackVisible: false
            }}
          >
            {(props) => (
              <PrivateRoute {...props}>
                <HomeView {...props} />
              </PrivateRoute>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="SignUp"
            component={SignUpView}
            options={{
              headerLeft: () => null,
              headerBackVisible: false
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInView}
            options={{
              headerLeft: () => null,
              headerBackVisible: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
