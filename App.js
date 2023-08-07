import firebase from 'firebase/app';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect } from "react";
import messaging from '@react-native-firebase/messaging';

export default function App() {
  firebase.initializeApp();
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      try {
        //return fcm token for the device
        const token = async() => await messaging().getToken();
        console.log(token);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Fieled token status", authStatus);
    }

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    // To listen to messages in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // return unsubscribe;

    // // check whether an initial notifiction is available
    // try {
    //   const remoteMessge = await messaging().getInitilNotifiction();
    //   if(remoteMessge) console.log('Notifiction caused app to open from quit state:',remoteMessge.notification);
    // } catch (error) {
    //   console.log(error);
    // }

    // try {
    //   const remoteMessge = await messaging().onNotifictionOpenedApp();
    //   if(remoteMessge) console.log('Notifiction caused app to open from background state:',remoteMessge.notification);
    // } catch (error) {
    //   console.log(error);
    // }

    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>FCM Tutorial using React Native & Expo </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
