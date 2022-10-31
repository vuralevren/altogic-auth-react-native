import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function HomeView({ navigation }) {
  const [auth, setAuth] = useAuthContext();

  const handleSignOut = async () => {
    await altogic.auth.signOut();
    setAuth(null);
    navigation.navigate('SignIn');
  };

  return (
    <View>
      <Text>{auth && JSON.stringify(auth, null, 3)}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HomeView;
