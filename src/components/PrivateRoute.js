import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function PrivateRoute({ children, route, navigation }) {
  const [auth, setAuth, isAuthLoading] = useAuthContext();

  const [isLoading, setLoading] = useState(true);

  const handleToken = async () => {
    setLoading(true);
    const { user } = await altogic.auth.getAuthGrant(
      route.params?.token
    );

    if (user) {
      setAuth(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (route.params?.token && !auth) {
      // If the user come from magic link, token's handled
      handleToken();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!route.params?.token && !auth && !isAuthLoading) {
      // Navigate to sign in, if the user has not session or don't come from magic link
      navigation.navigate('SignUp');
    }
  }, [isAuthLoading, auth]);

  return (
    <View>
      {isLoading || isAuthLoading ? (
        <Text>Loading...</Text>
      ) : auth ? (
        children
      ) : (
        <Text>You are redirecting to the login...</Text>
      )}
    </View>
  );
}

export default PrivateRoute;
