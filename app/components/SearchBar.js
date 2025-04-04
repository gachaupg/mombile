import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input, InputField, Icon } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ value, onChangeText, onClear, placeholder }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          as={Ionicons}
          name="search"
          size={18}
          color="#4051B5"
          style={styles.searchIcon}
        />
        <Input
          flex={1}
          height={44}
          borderColor="#e2e8f0"
          borderWidth={1}
          borderRadius={8}
          backgroundColor="white"
          style={styles.searchInput}
        >
          <InputField
            placeholder={placeholder || "Search..."}
            value={value}
            onChangeText={onChangeText}
            fontSize={15}
            style={styles.inputField}
          />
        </Input>
        {value ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Icon as={Ionicons} name="close-circle" size={18} color="#64748b" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputField: {
    height: 44,
    paddingLeft: 36,
    paddingRight: 36,
    textAlignVertical: "center",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    zIndex: 1,
    height: 44,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchBar;
