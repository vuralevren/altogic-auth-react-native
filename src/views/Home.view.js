import React, { useState } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function HomeView({ navigation }) {
  const [auth, setAuth] = useAuthContext();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    await altogic.auth.signOut();
    setAuth(null);
    navigation.navigate('SignIn');
  };

  // Bonus

  const onChangeHandler = async () => {
    try {
      let file = null;
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true
      });
      if (!res.didCancel && res.errorCode !== 'permission') {
        // file = res.assets[0].base64;
        file = res;
      }
      if (!file) {
        throw new Error('No valid file');
      }
      setLoading(true);
      const { publicPath } = await uploadPhoto(file);
      await updateUserInfo({ profilePicture: publicPath });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhoto = async (file) => {
    const { data, errors } = await altogic.storage
      .bucket('root')
      .upload(auth.email, file);

    if (errors) {
      throw errors;
    }
    return data;
  };

  const updateUserInfo = async (data) => {
    const { data: userFromDB, errors } = await altogic.db
      .model('users')
      .object(auth._id)
      .update(data);

    if (errors) {
      throw errors;
    }
    setAuth(userFromDB);
  };

  return (
    <View>
      <Text>{auth && JSON.stringify(auth, null, 3)}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <View style={styles.mainBody}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 30, textAlign: 'center' }}>
            React Native File Upload Example
          </Text>
          <Text
            style={{
              fontSize: 25,
              marginTop: 20,
              marginBottom: 30,
              textAlign: 'center'
            }}
          >
            www.aboutreact.com
          </Text>
        </View>
        {/* Showing the data of selected Single file
        {singleFile != null ? (
          <Text style={styles.textStyle}>
            File Name: {singleFile.name ? singleFile.name : ''}
            {'\n'}
            Type: {singleFile.type ? singleFile.type : ''}
            {'\n'}
            File Size: {singleFile.size ? singleFile.size : ''}
            {'\n'}
            URI: {singleFile.uri ? singleFile.uri : ''}
            {'\n'}
          </Text>
        ) : null} */}
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={onChangeHandler}
        >
          <Text style={styles.buttonTextStyle}>Select File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={onChangeHandler}
        >
          <Text style={styles.buttonTextStyle}>Upload File</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center'
  }
});

export default HomeView;
