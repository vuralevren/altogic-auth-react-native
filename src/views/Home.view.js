import React, { useState } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator
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
  const handleUploadPhoto = async () => {
    try {
      let asset = null;
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true
      });
      if (!res.didCancel && res.errorCode !== 'permission') {
        asset = res.assets[0];
      }
      if (!asset) {
        throw new Error('No valid file');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName
      });

      setLoading(true);

      const { publicPath } = await uploadPhoto(formData, auth.email);
      await updateUserInfo({ profilePicture: publicPath });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhoto = async (file, filename) => {
    const { data, errors } = await altogic.storage
      .bucket('root')
      .upload(filename, file);

    if (errors) {
      throw errors;
    }
    return data;
  };

  const handleRemovePhoto = async () => {
    setLoading(true);
    await altogic.storage.bucket('root').deleteFiles([auth.email]);
    await updateUserInfo({ profilePicture: null });
    setLoading(false);
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
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Image
            style={styles.tinyLogo}
            source={{
              uri:
                auth.profilePicture ||
                `https://ui-avatars.com/api/?name=${auth.email}&background=0D8ABC&color=fff`
            }}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleUploadPhoto}
      >
        <Text style={styles.buttonTextStyle}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleRemovePhoto}
      >
        <Text style={styles.buttonTextStyle}>Remove Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 100
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
  tinyLogo: {
    width: 150,
    height: 150
  }
});

export default HomeView;
