import { Text, Linking, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { BASE_URL } from '../services/Service';

export default function RecipeList({ recipes }) {
  return (
    <>
      <FlatList
        data={recipes}
        renderItem={({ item, index }) => (
          <Text
            style={styles.recipesList}
            onPress={() =>
              Linking.openURL(
                `${BASE_URL}recipe-php/recipeLists.php?ingredient=${item}&submit=Submit`
              )
            }
          >
            {item}
          </Text>
        )}
        keyExtractor={(_, index) => index}
      >
        {' '}
      </FlatList>
      <Text style={styles.theEndText}>Press on a link to open recipe guide </Text>
    </>
  );
}

const styles = StyleSheet.create({
  recipesList: {
    borderTopColor: 'grey',
    borderTopWidth: 2,
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  theEndText: {
    color: 'whitesmoke',
    textAlign: 'center',
    marginBottom: 3,
    backgroundColor: 'black',
  },
});
