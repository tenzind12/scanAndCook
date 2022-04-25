import { Text, Linking, FlatList, StyleSheet } from 'react-native';
import React from 'react';

export default function RecipeList({ recipes }) {
  return (
    <FlatList
      data={recipes}
      renderItem={({ item, index }) => (
        <Text
          style={styles.recipesList}
          onPress={() =>
            Linking.openURL(
              `https://4e3e-82-121-4-45.eu.ngrok.io/recipe-php/recipeLists.php?ingredient=${item}&submit=Submit`
            )
          }
        >
          {item}
        </Text>
      )}
      keyExtractor={(item, index) => index}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  recipesList: {
    borderTopColor: 'grey',
    borderTopWidth: 2,
    padding: 5,
    marginHorizontal: 5,
  },
});
