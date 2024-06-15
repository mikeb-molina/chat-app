import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//initialize import from firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
//Create the navigator
const Stack = createNativeStackNavigator();


const App = () => {
  //Web's Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAaNI73KnoUK6LSHDAODGwgXOsMKNNsfXA",
    authDomain: "chatapp-cf0e0.firebaseapp.com",
    projectId: "chatapp-cf0e0",
    storageBucket: "chatapp-cf0e0.appspot.com",
    messagingSenderId: "369537384633",
    appId: "1:369537384633:web:afcb67fdb401c2077f1b68",
    measurementId: "G-189BKMK18P"
  };
  
  //Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //Initialize cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Start'
      >
      <Stack.Screen
      name="Start"
      component={Start}
      />
      <Stack.Screen name="Chat">
       {(props) => <Chat db={db} {...props} />} 
      </Stack.Screen>
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;