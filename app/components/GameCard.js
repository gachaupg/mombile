import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Box,
  Text,
  HStack,
  VStack,
  Image,
  Icon,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";

const GameCard = ({ game, onPress, isFavorite, onToggleFavorite }) => {
  const dateObj = new Date(game.dateEvent + "T" + (game.strTime || "00:00:00"));

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Pressable onPress={() => onPress(game)}>
      <Box
        borderWidth={1}
        borderColor="#e5e7eb"
        borderRadius={8}
        padding={16}
        marginBottom={16}
        backgroundColor="white"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1}>
            <Text color="#6b7280" fontSize={12}>
              {formattedDate} • {formattedTime}
            </Text>
            <Text fontWeight="bold" fontSize={16} marginTop={4}>
              {game.strEvent}
            </Text>
            <Text color="#4b5563" fontSize={14} marginTop={4}>
              {game.strLeague}
            </Text>
          </VStack>
          <TouchableOpacity onPress={() => onToggleFavorite(game, isFavorite)}>
            <Icon
              as={Ionicons}
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#DC2626" : "#9ca3af"}
            />
          </TouchableOpacity>
        </HStack>

        <HStack space={16} marginTop={16} alignItems="center">
          <VStack flex={2} alignItems="center">
            <Image
              source={{
                uri:
                  game.strHomeTeamBadge ||
                  "https://www.thesportsdb.com/images/media/team/badge/vrtrtp1448813175.png",
              }}
              alt={game.strHomeTeam}
              width={60}
              height={60}
              borderRadius={9999}
              fallbackSource={require("../../assets/icon.png")}
            />
            <Text fontWeight="bold" marginTop={8}>
              {game.strHomeTeam}
            </Text>
          </VStack>

          <VStack flex={1} alignItems="center">
            <Text fontWeight="bold" fontSize={18} color="#6b7280">
              VS
            </Text>
          </VStack>

          <VStack flex={2} alignItems="center">
            <Image
              source={{
                uri:
                  game.strAwayTeamBadge ||
                  "https://www.thesportsdb.com/images/media/team/badge/vrtrtp1448813175.png",
              }}
              alt={game.strAwayTeam}
              width={60}
              height={60}
              borderRadius={9999}
              fallbackSource={require("../../assets/icon.png")}
            />
            <Text fontWeight="bold" marginTop={8}>
              {game.strAwayTeam}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export default GameCard;
