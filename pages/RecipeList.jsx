import { Text, Linking, FlatList } from 'react-native';
import React from 'react';

export default function RecipeList({ recipes }) {
  return (
    <FlatList
      data={recipes}
      renderItem={({ item, index }) => (
        <Text
          onPress={() =>
            Linking.openURL(
              `https://36cb-82-121-4-45.eu.ngrok.io/recipe-php/recipeLists.php?ingredient=${item}&submit=Submit`
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
