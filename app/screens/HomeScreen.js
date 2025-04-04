import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text, Heading, VStack, Icon, Center } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchUpcomingGames,
  setSearchTerm,
  clearSearchTerm,
  toggleFavoriteGame,
} from "../store/slices/gamesSlice";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { filteredGames, searchTerm, favorites, loading, error } = useSelector(
    (state) => state.games
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      await dispatch(fetchUpcomingGames()).unwrap();
    } catch (error) {
      console.error("Error loading games:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    dispatch(setSearchTerm(text));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchTerm());
  };

  const navigateToGameDetails = (game) => {
    navigation.navigate("GameDetails", { game });
  };

  const handleToggleFavorite = (game, isFavorite) => {
    dispatch(
      toggleFavoriteGame({
        userId: user.uid,
        game,
        isFavorite,
      })
    );
  };

  const isGameFavorite = (gameId) => {
    return favorites.some((fav) => fav.idEvent === gameId);
  };

  if (loading && !refreshing && filteredGames.length === 0) {
    return (
      <Center flex={1} bg="#f8fafc">
        <ActivityIndicator size="large" color="#4051B5" />
        <Text color="#64748b" marginTop={4}>
          Loading upcoming matches...
        </Text>
      </Center>
    );
  }

  const renderEmptyState = () => (
    <Center flex={1} padding={16}>
      <Icon as={Ionicons} name="football-outline" size={60} color="#cbd5e1" />
      <Text color="#64748b" fontSize={16} textAlign="center" marginTop={16}>
        {error
          ? "Couldn't load matches. Pull down to try again."
          : searchTerm
          ? "No matches found. Try a different search term."
          : "No upcoming matches found."}
      </Text>
    </Center>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <Box flex={1} backgroundColor="#f8fafc" padding={16}>
        <VStack space={16}>
          <Box>
            <Text fontSize={16} color="#64748b" marginTop={4}>
              Upcoming Major League Soccer games
            </Text>
          </Box>

          <SearchBar
            value={searchTerm}
            onChangeText={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search teams or matches..."
          />

          <FlatList
            data={filteredGames}
            keyExtractor={(item) => item.idEvent}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                onPress={navigateToGameDetails}
                isFavorite={isGameFavorite(item.idEvent)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4051B5"]}
                tintColor="#4051B5"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              filteredGames.length === 0 && { flex: 1 },
            ]}
            ListEmptyComponent={renderEmptyState}
          />
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContent: {
    paddingBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4051B5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
  },
});

export default HomeScreen;
