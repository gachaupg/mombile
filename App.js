import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./app/utils/gluestack-config";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./app/services/firebase";
import { store } from "./app/store";
import { setUser } from "./app/store/slices/authSlice";
import { fetchUserProfile } from "./app/store/slices/profileSlice";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./app/navigation/AppNavigator";
import GameDetailsScreen from "./app/screens/GameDetailsScreen";

const Stack = createStackNavigator();

// Navigation component separated to ensure proper gesture handler context
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={AppNavigator} />
        <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || "", // Ensure photoURL is included and never null
        };
        store.dispatch(setUser(userData));
        store.dispatch(fetchUserProfile(user.uid));
      } else {
        // User is signed out
        store.dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider config={config}>
          <StatusBar style="auto" />
          <Navigation />
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
