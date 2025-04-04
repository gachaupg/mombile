import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Image,
  Icon,
  Center,
  Divider,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { fetchGameDetails } from "../services/api";
import { toggleFavoriteGame } from "../store/slices/gamesSlice";

const GameDetailsScreen = ({ route, navigation }) => {
  const { game: initialGame } = route.params;
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);

  const isFavorite = favorites.some((fav) => fav.idEvent === game.idEvent);

  useEffect(() => {
    loadGameDetails();
  }, []);

  const loadGameDetails = async () => {
    try {
      setLoading(true);
      const gameDetails = await fetchGameDetails(game.idEvent);
      if (gameDetails) {
        setGame(gameDetails);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading game details:", error);
      setError("Failed to load game details");
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(
      toggleFavoriteGame({
        userId: user?.uid,
        game,
        isFavorite,
      })
    );
  };

  const dateObj = new Date(game.dateEvent + "T" + (game.strTime || "00:00:00"));

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <Center flex={1} bg="#f8fafc">
        <ActivityIndicator size="large" color="#4051B5" />
        <Text color="#64748b" marginTop={4}>
          Loading match details...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1} bg="#f8fafc">
        <Icon as={Ionicons} name="alert-circle" size={60} color="#ef4444" />
        <Text color="#64748b" marginTop={16}>
          {error}
        </Text>
        <TouchableOpacity onPress={loadGameDetails} style={styles.retryButton}>
          <HStack space={2} alignItems="center">
            <Icon as={Ionicons} name="refresh" size={18} color="white" />
            <Text color="white" fontWeight="medium">
              Try Again
            </Text>
          </HStack>
        </TouchableOpacity>
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
          {/* Header with Back Button and Favorite Button */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom={20}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon as={Ionicons} name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>

            <Heading fontSize={20} color="#0f172a">
              Match Details
            </Heading>

            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}
            >
              <Icon
                as={Ionicons}
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#DC2626" : "#64748b"}
              />
            </TouchableOpacity>
          </HStack>

          {/* Match Info Card */}
          <Box
            backgroundColor="white"
            borderRadius={16}
            padding={24}
            marginBottom={24}
            style={styles.cardShadow}
          >
            {/* League */}
            <HStack justifyContent="center" marginBottom={20}>
              <Box
                paddingHorizontal={14}
                paddingVertical={8}
                backgroundColor="#f1f5f9"
                borderRadius={9999}
              >
                <Text color="#4051B5" fontWeight="semibold">
                  {game.strLeague}
                </Text>
              </Box>
            </HStack>

            {/* Teams */}
            <HStack justifyContent="space-between" alignItems="center">
              {/* Home Team */}
              <VStack alignItems="center" flex={2}>
                <Box style={styles.logoContainer}>
                  <Image
                    source={{
                      uri:
                        game.strHomeTeamBadge ||
                        "https://www.thesportsdb.com/images/media/team/badge/vrtrtp1448813175.png",
                    }}
                    alt={game.strHomeTeam}
                    width={90}
                    height={90}
                    resizeMode="contain"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={16}
                  marginTop={16}
                  textAlign="center"
                >
                  {game.strHomeTeam}
                </Text>
                <Text color="#64748b" fontSize={14} marginTop={4}>
                  Home
                </Text>
              </VStack>

              {/* VS */}
              <VStack flex={1} alignItems="center">
                <Box
                  paddingHorizontal={16}
                  paddingVertical={10}
                  backgroundColor="#f1f5f9"
                  borderRadius={9999}
                >
                  <Text fontWeight="bold" fontSize={20} color="#0f172a">
                    VS
                  </Text>
                </Box>
              </VStack>

              {/* Away Team */}
              <VStack alignItems="center" flex={2}>
                <Box style={styles.logoContainer}>
                  <Image
                    source={{
                      uri:
                        game.strAwayTeamBadge ||
                        "https://www.thesportsdb.com/images/media/team/badge/vrtrtp1448813175.png",
                    }}
                    alt={game.strAwayTeam}
                    width={90}
                    height={90}
                    resizeMode="contain"
                  />
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={16}
                  marginTop={16}
                  textAlign="center"
                >
                  {game.strAwayTeam}
                </Text>
                <Text color="#64748b" fontSize={14} marginTop={4}>
                  Away
                </Text>
              </VStack>
            </HStack>

            {/* Date & Time */}
            <VStack alignItems="center" marginTop={32} space={8}>
              <HStack space={8} alignItems="center">
                <Icon as={Ionicons} name="calendar" size={20} color="#4051B5" />
                <Text color="#0f172a" fontSize={16} fontWeight="medium">
                  {formattedDate}
                </Text>
              </HStack>
              <HStack space={8} alignItems="center">
                <Icon as={Ionicons} name="time" size={20} color="#4051B5" />
                <Text color="#0f172a" fontSize={16} fontWeight="medium">
                  {formattedTime}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Venue Section */}
          {game.strVenue && (
            <Box
              backgroundColor="white"
              borderRadius={16}
              padding={24}
              marginBottom={24}
              style={styles.cardShadow}
            >
              <VStack space={16}>
                <HStack alignItems="center" space={12}>
                  <Icon
                    as={Ionicons}
                    name="location"
                    size={24}
                    color="#4051B5"
                  />
                  <Heading fontSize={18} color="#0f172a">
                    Venue Information
                  </Heading>
                </HStack>

                <Divider />

                <VStack space={16}>
                  <HStack space={12} alignItems="center">
                    <Box width={24} alignItems="center">
                      <Icon
                        as={Ionicons}
                        name="home"
                        size={20}
                        color="#64748b"
                      />
                    </Box>
                    <Text fontSize={16}>{game.strVenue}</Text>
                  </HStack>

                  {game.strCity && (
                    <HStack space={12} alignItems="center">
                      <Box width={24} alignItems="center">
                        <Icon
                          as={Ionicons}
                          name="business"
                          size={20}
                          color="#64748b"
                        />
                      </Box>
                      <Text fontSize={16}>{game.strCity}</Text>
                    </HStack>
                  )}

                  {game.strCountry && (
                    <HStack space={12} alignItems="center">
                      <Box width={24} alignItems="center">
                        <Icon
                          as={Ionicons}
                          name="earth"
                          size={20}
                          color="#64748b"
                        />
                      </Box>
                      <Text fontSize={16}>{game.strCountry}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          )}

          {/* Match Description */}
          {game.strDescriptionEN && (
            <Box
              backgroundColor="white"
              borderRadius={16}
              padding={24}
              marginBottom={24}
              style={styles.cardShadow}
            >
              <VStack space={16}>
                <HStack alignItems="center" space={12}>
                  <Icon
                    as={Ionicons}
                    name="information-circle"
                    size={24}
                    color="#4051B5"
                  />
                  <Heading fontSize={18} color="#0f172a">
                    Match Details
                  </Heading>
                </HStack>

                <Divider />

                <Text fontSize={16} lineHeight={24} color="#334155">
                  {game.strDescriptionEN}
                </Text>
              </VStack>
            </Box>
          )}
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
  backButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  favoriteButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 4,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  retryButton: {
    backgroundColor: "#4051B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
});

export default GameDetailsScreen;
