# How to Authenticate Email and Password Using React Native & Altogic


## Introduction
Altogic is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most of the modern applications using React or other libraries/frameworks require to know the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an Authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use Javascript client library, and it supports many authentication providers such as email/password, phone number, magic link, and providers like Google, Facebook, Twitter, Github, etc.,

In this tutorial, we will implement email/password authentication with React Native and take a look how as a React Native developer we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn:

- How to create sample screens to display forms like login and signup.
- How to create a home screen and authorize only logged in users.
- How to create different routes using the react-navigation.
- How to create an authentication flow by conditionally rendering between these pages whether a user is logged-in or not.
- And we will integrate Altogic authentication with the email/password method.

If you are new to React Native applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## Prerequisites
To complete this tutorial, make sure you have installed following tools and utilities on your local development environment.

- [VsCode](https://code.visualstudio.com/download)
- [NodeJS](https://nodejs.org/en/download/)
- [React Native Enviroments](https://reactnative.dev/docs/environment-setup)
- [Altogic Account](https://designer.altogic.com/)
  
## Creating an Altogic App
We will use Altogic as a backend service platform, so let’s visit [Altogic Designer](https://designer.altogic.com/) and create an account.

After creating an account, you will see the workspace where you can access your apps.

![Application](./github/1-applications.png)

Click + New app and follow the instructions;

1. In the App name field, enter a name for the app.
2. Enter your subdomain.
3. Choose the deployment location.
4. And select your free execution environment pricing plan.
   
![Create App](./github/2-create-app.png)

Then click Next and select Basic Authentication template. This template is based on session authentication and highly recommended to secure your apps.

![Choose Template](./github/3-choose-template.png)

Then click Next to confirm and create an app. Also, here we can see some of the details the about the application. Let’s click Create to finish the application creation process.

Awesome! We have created our application; now click/tap on the <strong>newly created app to launch the Designer.</storng>

> This is the only configuration we need to do in Altogic Designer. Still to access the app and use the Altogic client library, we should get envUrl and clientKey of this app.

Click the <strong>Home</strong> icon at the left sidebar to copy the envUrl and clientKey.

![Client Keys](./github/4-client-keys.png)

## Integrating with Altogic
Our backend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our React app to connect our frontend with the backend.

```sh
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a configs/ folder inside of the src/ directory to add altogic.js file.

Open altogic.js and paste below code block to export the altogic client instance.

/src/helpers/altogic.js

```javascript
import { createClient } from 'altogic';

// This `envUrl` and `clientKey` is sample you need to create your own.
let envUrl = 'https://auth.c1-na.altogic.com';
let clientKey = 'e574fee1fb2b443...a8598ca68b7d8';

const altogic = createClient(envUrl, clientKey);

export default { altogic };
```

> Replace envUrl and clientKey which is shown in the <strong>Home</strong> view of [Altogic Designer](https://designer.altogic.com/).

### Storing Session
Now, we can install the [react-native-async-storage](https://react-native-async-storage.github.io/async-storage/docs/install/) library to keep session information in app's storage.

```sh
# using npm
npm install @react-native-async-storage/async-storage
# OR is using yarn
yarn add @react-native-async-storage/async-storage
```

On iOS, use CocoaPods to add the native RNAsyncStorage to your project:

```sh
npx pod-install
```

Let's create a storage.js inside of the configs/ directory.

Open storage.js and paste below code block.
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  constructor() {
    this.KEY_AUTH = '@auth';
  }

  set = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  };

  get = async (key) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  remove = async (key) => {
    await AsyncStorage.removeItem(key);
  };
}

export default new Storage();
```
We have created a Storage class that wrapped AsyncStorage to keep the keys together and prevent doing JSON parse operations every time.

### Create an authentication context
We need to share data across our components. We can use this hook throughout our application by creating an authentication context. Passing down the authentication status to each component is redundant. It leads to prop drilling, so using context is a good option. If you are not familiar with Context API in React, check out their docs [here](https://reactjs.org/docs/context.html).

> The React Context API is a state management tool used for sharing data across React components.

Let’s create contexts/ folder inside of the src/ directory to add Auth.context.js file inside it.

![Client Keys](./github/5-storage.png)
Open Auth.context.js and copy following code.

```javascript
import React, { useState, useEffect, useContext } from 'react';
import storage from '../configs/storage';

const Context = React.createContext(null);

const useFetchAuth = () => {
  const [fetchedAuth, setFetchedAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if session information is exist in storage
    storage.get(storage.KEY_AUTH).then((authFromStorage) => {
      setFetchedAuth(authFromStorage);
      setIsLoading(false);
    });
  }, []);

  return { fetchedAuth, isLoading };
};

const Provider = ({ children }) => {
  const { fetchedAuth, isLoading } = useFetchAuth();
  const [auth, setAuth] = useState(fetchedAuth);

  useEffect(() => {
    // Set session information to auth state if it's exist in storage
    setAuth(fetchedAuth);
  }, [fetchedAuth]);

  useEffect(() => {
    // Set session information to storage when auth state's changed
    storage.set(storage.KEY_AUTH, auth);
  }, [auth]);

  return (
    <Context.Provider value={[auth, setAuth, isLoading]}>
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(Context);
  return context;
};

export default Provider;
```

### Private Route Component

To secure the application and authorize users to access specified routes let’s create PrivateRoute.js inside the components directory and paste the code below.

```javascript
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
      route.params.token
    );

    if (user) {
      setAuth(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (route.params.token && !auth) {
      // If the user come from magic link, token's handled
      handleToken();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!route.params.token && !auth && !isAuthLoading) {
      // Navigate to sign in, if the user has not session or don't come from magic link
      navigation.navigate('SignIn');
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
```

> Previously we have created our authentication context to use user information. And, here, we are controlling session to route users, whether the Login page or the children.

Now we can wrap necessary routes with the PrivateRoute component to specify access in the App.js. Let’s open it and wrap our Home page with the PrivateRoute as the screen below.










