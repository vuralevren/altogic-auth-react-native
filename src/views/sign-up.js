// SignUp.js
import { Link } from '@react-navigation/native';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function SignUpView({ navigation }) {
  const { setAuth, setSession } = useAuthContext();

  const [inpName, setInpName] = useState('');
  const [inpEmail, setInpEmail] = useState('');
  const [inpPassword, setInpPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      const { user, session, errors } = await altogic.auth.signUpWithEmail(
        inpEmail,
        inpPassword,
        inpName
      );

      if (errors) {
        throw errors;
      }

      if (session) {
        setAuth(user);
        setSession(session);
        navigation.navigate('Profile');
      } else {
        setSuccess(`We sent a verification link to ${inpEmail}`);
        setError(null);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setInpName(val)}
        value={inpName}
      />
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
