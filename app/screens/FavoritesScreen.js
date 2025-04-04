import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  Heading,
  VStack,
  Center,
  HStack,
  Icon,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchFavoriteGames,
  toggleFavoriteGame,
} from "../store/slices/gamesSlice";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";

const FavoritesScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { favorites, loading } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.uid) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorites(favorites);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFavorites(
        favorites.filter(
          (game) =>
            game.strHomeTeam?.toLowerCase().includes(term) ||
            game.strAwayTeam?.toLowerCase().includes(term) ||
            game.strEvent?.toLowerCase().includes(term) ||
            game.strLeague?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, favorites]);

  const loadFavorites = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchFavoriteGames(user.uid)).unwrap();
      setRefreshing(false);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setRefreshing(false);
    }
  };

  const handleRemoveFavorite = (game) => {
    dispatch(
      toggleFavoriteGame({
        userId: user.uid,
        game,
        isFavorite: true,
      })
    );
  };

  const navigateToGameDetails = (game) => {
    navigation.navigate("GameDetails", { game });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (loading && !refreshing && favorites.length === 0) {
    return (
      <Center flex={1} bg="#f8fafc">
        <ActivityIndicator size="large" color="#4051B5" />
        <Text color="#64748b" marginTop={4}>
          Loading your favorites...
        </Text>
      </Center>
    );
  }

  const renderEmptyFavorites = () => (
    <Center flex={1} padding={16}>
      <Icon as={Ionicons} name="heart-outline" size={60} color="#cbd5e1" />
      <Text color="#64748b" fontSize={16} textAlign="center" marginTop={16}>
        {searchTerm
          ? "No matching favorites found."
          : "You haven't added any matches to your favorites yet."}
      </Text>
      {!searchTerm && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.browseButton}
        >
          <HStack space={2} alignItems="center">
            <Icon
              as={Ionicons}
              name="football-outline"
              size={18}
              color="white"
            />
            <Text color="white" fontWeight="bold">
              Browse Matches
            </Text>
          </HStack>
        </TouchableOpacity>
      )}
    </Center>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <Box flex={1} backgroundColor="#f8fafc" padding={16}>
        <VStack space={16}>
          <Box>
          
            <Text fontSize={16} color="#64748b" marginTop={4}>
              Matches you've saved
            </Text>
          </Box>

          {favorites.length > 0 && (
            <SearchBar
              value={searchTerm}
              onChangeText={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search your favorites..."
            />
          )}

          <FlatList
            data={filteredFavorites}
            keyExtractor={(item) => item.idEvent}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                onPress={navigateToGameDetails}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              filteredFavorites.length === 0 && { flex: 1 },
            ]}
            ListEmptyComponent={renderEmptyFavorites}
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
  browseButton: {
    backgroundColor: "#4051B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
  },
});

export default FavoritesScreen;
