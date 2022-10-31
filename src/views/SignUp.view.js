// SignUp.js
import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Text
} from 'react-native';
import altogic from '../configs/altogic';

function SignUpView() {
  const [inpEmail, setInpEmail] = useState('');
  const [inpPassword, setInpPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      const { user, errors } = await altogic.auth.signUpWithEmail(
        inpEmail,
        inpPassword
      );

      if (errors) {
        throw errors;
      }

      setSuccess(`We sent a verification link to ${inpEmail}`);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setInpEmail(val)}
        value={inpEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setInpPassword(val)}
        value={inpPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={styles.alreadyLabel}>
        Already have an account?{' '}
        <Link style={styles.linkLabel} to="/sign-in">
          Login
        </Link>
      </Text>
      <Text style={styles.successLabel}>{success && success}</Text>
      <Text>{error && JSON.stringify(error, null, 3)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successLabel: {
    color: 'green'
  },
  alreadyLabel: {
    marginTop: 20
  },
  linkLabel: {
    color: 'blue'
  }
});

export default SignUpView;
