import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  View,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  Heading,
  VStack,
  Button,
  ButtonText,
  FormControl,
  Input,
  InputField,
  Avatar,
  Icon,
  Center,
  HStack,
  Divider,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../store/slices/profileSlice";
import { signOut } from "../store/slices/authSlice";

// Format date function
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  try {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "N/A";
  }
};

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading, error } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    displayName: "",
    favoriteTeam: "",
    photoURL: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserProfile(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);
      console.log("Profile photo URL:", profile.photoURL);
      setFormData({
        displayName: profile.displayName || "",
        favoriteTeam: profile.favoriteTeam || "",
        photoURL: profile.photoURL || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to update your profile picture.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      // Launch image picker with improved options
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        console.log("Image selected:", selectedImageUri);
        setProfileImage(selectedImageUri);
        // Show feedback to user
        Alert.alert(
          "Image Selected",
          "Your profile picture will be updated when you save your changes.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        "There was a problem selecting your image. Please try again."
      );
    }
  };

  const saveProfile = async () => {
    try {
      console.log("Saving profile with image:", profileImage);
      console.log("Current form data:", formData);

      const result = await dispatch(
        updateUserProfile({
          userId: user.uid,
          profileData: formData,
          profileImage,
        })
      ).unwrap();

      console.log("Profile update result:", result);

      setIsEditing(false);
      setProfileImage(null);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Profile update detailed error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(signOut()),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      await dispatch(deleteUserProfile(user.uid)).unwrap();
      Alert.alert("Success", "Your account has been deleted.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete account. Please try again.");
      console.error("Account deletion error:", error);
    }
  };

  if (loading && !profile) {
    return (
      <Center flex={1} bg="#f8fafc">
        <ActivityIndicator size="large" color="#4051B5" />
        <Text color="#64748b" marginTop={4}>
          Loading your profile...
        </Text>
      </Center>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Box padding={16}>
          <VStack space={32}>
            {/* Profile Header */}
            <Box
              backgroundColor="white"
              borderRadius={16}
              padding={24}
              style={styles.cardShadow}
            >
              <VStack alignItems="center">
                <TouchableOpacity
                  onPress={isEditing ? pickImage : undefined}
                  style={isEditing ? styles.avatarPickerActive : undefined}
                  activeOpacity={isEditing ? 0.7 : 1}
                >
                  <Box position="relative">
                    {/* Debug message for development - remove in production */}
                    {__DEV__ && (
                      <Text color="red" fontSize={10} marginBottom={4}>
                        Image Source:{" "}
                        {profileImage
                          ? "Local"
                          : profile?.photoURL
                          ? "URL"
                          : "Default"}
                      </Text>
                    )}
                    <Avatar
                      size="2xl"
                      source={
                        profileImage
                          ? { uri: profileImage }
                          : profile?.photoURL
                          ? { uri: profile.photoURL }
                          : require("../../assets/icon.png")
                      }
                      fallbackSource={require("../../assets/icon.png")}
                      style={styles.avatar}
                    />
                    {isEditing && (
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        backgroundColor="#4051B5"
                        borderRadius={9999}
                        padding={10}
                        style={styles.cameraIconContainer}
                      >
                        <Icon
                          as={Ionicons}
                          name="camera"
                          size={20}
                          color="white"
                        />
                      </Box>
                    )}
                  </Box>
                  {isEditing && (
                    <Text
                      color="#4051B5"
                      fontSize={14}
                      textAlign="center"
                      marginTop={8}
                      fontWeight="500"
                    >
                      Change Photo
                    </Text>
                  )}
                </TouchableOpacity>

                {!isEditing ? (
                  <>
                    <Heading fontSize={24} marginTop={16}>
                      {profile?.displayName || user?.displayName || "User"}
                    </Heading>
                    <Text color="#64748b" fontSize={16} marginTop={4}>
                      {user?.email}
                    </Text>
                    <HStack space={8} marginTop={16}>
                      <Button
                        variant="outline"
                        borderColor="#4051B5"
                        onPress={() => setIsEditing(true)}
                        style={styles.actionButton}
                      >
                        <HStack space={8} alignItems="center">
                          <Icon
                            as={Ionicons}
                            name="create-outline"
                            size={18}
                            color="#4051B5"
                          />
                          <ButtonText color="#4051B5">Edit Profile</ButtonText>
                        </HStack>
                      </Button>
                      <Button
                        backgroundColor="#ef4444"
                        onPress={handleLogout}
                        style={styles.actionButton}
                      >
                        <HStack space={8} alignItems="center">
                          <Icon
                            as={Ionicons}
                            name="log-out-outline"
                            size={18}
                            color="white"
                          />
                          <ButtonText color="white">Logout</ButtonText>
                        </HStack>
                      </Button>
                    </HStack>
                  </>
                ) : null}
              </VStack>
            </Box>

            {/* Profile Details */}
            {!isEditing ? (
              <Box
                backgroundColor="white"
                borderRadius={16}
                padding={24}
                style={styles.cardShadow}
              >
                <VStack space={16}>
                  <HStack alignItems="center" space={12}>
                    <Icon
                      as={Ionicons}
                      name="person"
                      size={24}
                      color="#4051B5"
                    />
                    <Heading fontSize={18} color="#0f172a">
                      Profile Information
                    </Heading>
                  </HStack>

                  <Divider />

                  <VStack space={20}>
                    <HStack space={12} alignItems="center">
                      <Box width={24} alignItems="center">
                        <Icon
                          as={Ionicons}
                          name="person-outline"
                          size={18}
                          color="#4051B5"
                        />
                      </Box>
                      <VStack>
                        <Text color="#64748b" fontSize={14}>
                          Name
                        </Text>
                        <Text fontSize={16} fontWeight="500" marginTop={2}>
                          {profile?.displayName || "Not set"}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack space={12} alignItems="center">
                      <Box width={24} alignItems="center">
                        <Icon
                          as={Ionicons}
                          name="football-outline"
                          size={18}
                          color="#4051B5"
                        />
                      </Box>
                      <VStack>
                        <Text color="#64748b" fontSize={14}>
                          Favorite Team
                        </Text>
                        <Text fontSize={16} fontWeight="500" marginTop={2}>
                          {profile?.favoriteTeam || "Not set"}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack space={12} alignItems="center">
                      <Box width={24} alignItems="center">
                        <Icon
                          as={Ionicons}
                          name="calendar-outline"
                          size={18}
                          color="#4051B5"
                        />
                      </Box>
                      <VStack>
                        <Text color="#64748b" fontSize={14}>
                          Member Since
                        </Text>
                        <Text fontSize={16} fontWeight="500" marginTop={2}>
                          {profile?.createdAt
                            ? formatDate(profile.createdAt)
                            : "N/A"}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            ) : (
              <Box
                backgroundColor="white"
                borderRadius={16}
                padding={24}
                style={styles.cardShadow}
              >
                <VStack space={16}>
                  <HStack alignItems="center" space={12}>
                    <Icon
                      as={Ionicons}
                      name="create"
                      size={24}
                      color="#4051B5"
                    />
                    <Heading fontSize={18} color="#0f172a">
                      Edit Profile
                    </Heading>
                  </HStack>

                  <Divider />

                  <VStack space={16}>
                    <FormControl isRequired>
                      <FormControlLabel>
                        <FormControlLabelText style={styles.labelText}>
                          Display Name
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
                            placeholder="Enter your name"
                            value={formData.displayName}
                            onChangeText={(text) =>
                              handleInputChange("displayName", text)
                            }
                            fontSize={15}
                            style={styles.inputField}
                          />
                        </Input>
                      </View>
                    </FormControl>

                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText style={styles.labelText}>
                          Favorite Team
                        </FormControlLabelText>
                      </FormControlLabel>
                      <View style={styles.inputContainer}>
                        <Icon
                          as={Ionicons}
                          name="football-outline"
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
                            placeholder="Enter your favorite team"
                            value={formData.favoriteTeam}
                            onChangeText={(text) =>
                              handleInputChange("favoriteTeam", text)
                            }
                            fontSize={15}
                            style={styles.inputField}
                          />
                        </Input>
                      </View>
                    </FormControl>

                    <HStack space={12} marginTop={8}>
                      <Button
                        flex={1}
                        variant="outline"
                        borderColor="#64748b"
                        onPress={() => setIsEditing(false)}
                        height={46}
                        borderRadius={8}
                        justifyContent="center"
                      >
                        <ButtonText color="#64748b" textAlign="center">
                          Cancel
                        </ButtonText>
                      </Button>
                      <Button
                        flex={1}
                        backgroundColor="#4051B5"
                        onPress={saveProfile}
                        height={46}
                        borderRadius={8}
                        justifyContent="center"
                      >
                        <ButtonText color="white" textAlign="center">
                          Save Changes
                        </ButtonText>
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Danger Zone */}
            <Box
              backgroundColor="white"
              borderRadius={16}
              padding={24}
              style={styles.cardShadow}
            >
              <VStack space={16}>
                <HStack alignItems="center" space={12}>
                  <Icon
                    as={Ionicons}
                    name="warning"
                    size={24}
                    color="#ef4444"
                  />
                  <Heading fontSize={18} color="#0f172a">
                    Danger Zone
                  </Heading>
                </HStack>

                <Divider />

                <VStack>
                  <Text
                    fontSize={14}
                    color="#64748b"
                    lineHeight={20}
                    marginBottom={16}
                  >
                    Deleting your account will remove all of your information
                    from our database. This action cannot be undone.
                  </Text>
                  <Button
                    backgroundColor="#fee2e2"
                    onPress={handleDeleteAccount}
                    height={50}
                    borderRadius={12}
                  >
                    <HStack space={8} alignItems="center">
                      <Icon
                        as={Ionicons}
                        name="trash-outline"
                        size={18}
                        color="#ef4444"
                      />
                      <ButtonText color="#ef4444">Delete Account</ButtonText>
                    </HStack>
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 4,
  },
  avatar: {
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarPickerActive: {
    opacity: 0.95,
  },
  cameraIconContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
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
  inputField: {
    height: 46,
    paddingLeft: 36,
    textAlignVertical: "center",
  },
});

export default ProfileScreen;
