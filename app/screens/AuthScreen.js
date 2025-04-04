import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
  Box,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Image,
  Center,
  Icon,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { signIn, signUp, clearError } from "../store/slices/authSlice";
import { createUserProfile } from "../store/slices/profileSlice";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("Authentication Error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter your email and password");
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        Alert.alert("Validation Error", "Passwords do not match");
        return;
      }

      if (!name) {
        Alert.alert("Validation Error", "Please enter your name");
        return;
      }

      // Create new account
      try {
        const result = await dispatch(
          signUp({ email, password, displayName: name })
        ).unwrap();
        await dispatch(
          createUserProfile({
            userId: result.uid,
            userData: {
              displayName: name,
              email: result.email,
            },
          })
        ).unwrap();
      } catch (error) {
        console.error("Registration failed:", error);
      }
    } else {
      // Login
      try {
        await dispatch(signIn({ email, password })).unwrap();
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3949ab" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.formInner}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/icon.png")}
                  alt="Logo"
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Header */}
              <Heading
                fontSize={24}
                color="#1e293b"
                textAlign="center"
                fontWeight="bold"
                marginBottom={8}
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </Heading>
              <Text
                color="#64748b"
                textAlign="center"
                fontSize={14}
                marginBottom={20}
              >
                {isLogin
                  ? "Sign in to access your soccer matches"
                  : "Sign up to start tracking soccer matches"}
              </Text>

              {/* Form Fields */}
              {!isLogin && (
                <FormControl isRequired marginBottom={16}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.labelText}>
                      Full Name
                    </FormControlLabelText>
                  </FormControlLabel>
                  <View style={styles.inputContainer}>
                    <Icon
                      as={Ionicons}
                      name="person-outline"
                      size={18}
                      color="#4051B5"
                      style={styles.inputIcon}
                    />
                    <Input
                      flex={1}
                      height={46}
                      borderColor="#e2e8f0"
                      borderWidth={1}
                      borderRadius={8}
                      backgroundColor="white"
                    >
                      <InputField
                        autoCapitalize="words"
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        fontSize={15}
                        style={styles.inputField}
                      />
                    </Input>
                  </View>
                </FormControl>
              )}

              <FormControl isRequired marginBottom={16}>
                <FormControlLabel>
                  <FormControlLabelText style={styles.labelText}>
                    Email Address
                  </FormControlLabelText>
                </FormControlLabel>
                <View style={styles.inputContainer}>
                  <Icon
                    as={Ionicons}
                    name="mail-outline"
                    size={18}
                    color="#4051B5"
                    style={styles.inputIcon}
                  />
                  <Input
                    flex={1}
                    height={46}
                    borderColor="#e2e8f0"
                    borderWidth={1}
                    borderRadius={8}
                    backgroundColor="white"
                  >
                    <InputField
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      fontSize={15}
                      style={styles.inputField}
                    />
                  </Input>
                </View>
              </FormControl>

              <FormControl isRequired marginBottom={16}>
                <FormControlLabel>
                  <FormControlLabelText style={styles.labelText}>
                    Password
                  </FormControlLabelText>
                </FormControlLabel>
                <View style={styles.inputContainer}>
                  <Icon
                    as={Ionicons}
                    name="lock-closed-outline"
                    size={18}
                    color="#4051B5"
                    style={styles.inputIcon}
                  />
                  <Input
                    flex={1}
                    height={46}
                    borderColor="#e2e8f0"
                    borderWidth={1}
                    borderRadius={8}
                    backgroundColor="white"
                  >
                    <InputField
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      fontSize={15}
                      style={styles.inputField}
                    />
                  </Input>
                  <TouchableOpacity
                    onPress={toggleShowPassword}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      as={Ionicons}
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#4051B5"
                    />
                  </TouchableOpacity>
                </View>
              </FormControl>

              {!isLogin && (
                <FormControl isRequired marginBottom={16}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.labelText}>
                      Confirm Password
                    </FormControlLabelText>
                  </FormControlLabel>
                  <View style={styles.inputContainer}>
                    <Icon
                      as={Ionicons}
                      name="lock-closed-outline"
                      size={18}
                      color="#4051B5"
                      style={styles.inputIcon}
                    />
                    <Input
                      flex={1}
                      height={46}
                      borderColor="#e2e8f0"
                      borderWidth={1}
                      borderRadius={8}
                      backgroundColor="white"
                    >
                      <InputField
                        secureTextEntry={!showPassword}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        fontSize={15}
                        style={styles.inputField}
                      />
                    </Input>
                  </View>
                </FormControl>
              )}

              {/* Login/Register Button */}
              <Button
                onPress={handleAuth}
                isDisabled={loading}
                style={styles.authButton}
                backgroundColor="white"
                height={50}
                borderRadius={8}
                marginTop={16}
                marginBottom={20}
                borderWidth={1}
                borderColor="#e2e8f0"
                alignSelf="center"
                width="100%"
                justifyContent="center"
              >
                {loading ? (
                  <Spinner color="#4051B5" size="small" />
                ) : (
                  <ButtonText
                    fontSize={16}
                    fontWeight="600"
                    color="#4051B5"
                    textAlign="center"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </ButtonText>
                )}
              </Button>

              {/* Toggle Mode */}
              <HStack space={1} justifyContent="center">
                <Text fontSize={14} color="#64748b">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Text>
                <TouchableOpacity
                  onPress={toggleMode}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Text color="#4051B5" fontWeight="bold" fontSize={14}>
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </HStack>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4051B5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  formInner: {
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
  },
  inputField: {
    height: 46,
    paddingLeft: 36,
    textAlignVertical: "center",
  },
  authButton: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: 46,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});

export default AuthScreen;
