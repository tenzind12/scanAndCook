import {
  View,
  Text,
  Button,
  Vibration,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { BASE_URL, filterArray, rating } from '../services/Service';
import RecipeList from './RecipeList';

export default function SavedProducts({ setPageChange, storedItems, deleteHandler }) {
  const [keywords, setKeywords] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeNames, setRecipeNames] = useState([]);
  const [showRecipeList, setShowRecipeList] = useState(false);
  // back to product page
  const backBtnHandler = () => {
    setPageChange(true);
    Vibration.vibrate(100);
  };

  // A D D   I N G R E D I E N T   H A N D L E R
  const addKeywordHandler = (itemKeywords) => {
    const productKeywords = itemKeywords.filter((word) => filterArray.indexOf(word) == -1);
    setKeywords(productKeywords);
    console.log(productKeywords);
  };

  // FUNCTION TO FETCH RECIPES
  useEffect(() => {
    // F I R S T   I N G R E D I E N T
    if (recipes.length <= 0) {
      const fetchRecipes = async () => {
        const recipesResponse = await fetch(
          `${BASE_URL}recipe-php/api/v1/index.php?request=products`
        );
        const responseData = await recipesResponse.json();
        const allRecipes = responseData.data;

        // extract recipes found by matching keywords from scanApp and ingredients in recipe fetched
        const recipesResults = [];
        const recipesResultsName = [];
        allRecipes.map((recipe) => {
          for (let i = 0; i < keywords.length; i++) {
            if (recipe.recipeIngredient.includes(keywords[i])) {
              const recipeObject = [];
              recipeObject.push(recipe.name);
              recipeObject.push(recipe.recipeIngredient);
              recipesResults.push(recipeObject);
              recipesResultsName.push(recipe.name);
            }
          }
        });

        // console.log(recipesResults);
        setRecipes(recipesResults);
        const uniqueName = new Set(recipesResultsName);
        setRecipeNames(Array.from(uniqueName));
      };
      fetchRecipes().catch((error) => console.log(error.message));
    } else {
      const recipesResults = [];
      const recipesResultsName = [];
      recipes.map((recipe) => {
        for (let i = 0; i < keywords.length; i++) {
          if (recipe[1].includes(keywords[i])) {
            const recipeObject = [];
            recipeObject.push(recipe[0]);
            recipeObject.push(recipe[1]);
            recipesResults.push(recipeObject);
            recipesResultsName.push(recipe[0]);
          }
        }
      });
      setRecipes(recipesResults);
      const uniqueName = new Set(recipesResultsName);
      setRecipeNames(Array.from(uniqueName));
    }
  }, [keywords]);

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={backBtnHandler} />
      <Text style={styles.title}>Your Saved items</Text>
      <Text style={styles.subtitle}>
        Search recipes with <Text style={{ fontWeight: 'bold' }}>'Add to ingredient'</Text> button
      </Text>

      {/* show recipe button */}
      {recipeNames.length > 0 && (
        <TouchableOpacity onPress={() => setShowRecipeList(!showRecipeList)}>
          <Text style={styles.recipeTitle}>{recipeNames.length} recipes found</Text>
        </TouchableOpacity>
      )}
      {showRecipeList && <RecipeList recipes={recipeNames} />}
      <FlatList
        data={storedItems}
        renderItem={({ item, index }) => (
          // each list container
          <View style={styles.itemContainer}>
            <View>
              {item.image !== undefined && (
                <Image source={{ uri: item.image }} style={styles.image} />
              )}
              {item.image === undefined && (
                <Image
                  source={{
                    uri: 'https://ps.w.org/replace-broken-images/assets/icon-256x256.png?rev=2561727',
                  }}
                  style={styles.image}
                />
              )}
            </View>
            <View style={{ flexShrink: 1 }}>
              {/* product name */}
              <Text style={styles.itemName}>{item.name}</Text>

              {/* rating stars */}
              {item.rating !== undefined ? (
                <Text style={styles.ratingText}>Rating: {rating(item.rating)}</Text>
              ) : (
                <Text style={styles.ratingText}>{rating(item.rating)}</Text>
              )}

              <TouchableOpacity
                style={styles.addIngredientBtn}
                onPress={() => addKeywordHandler(item.keywords)}
              >
                <Text style={styles.addIngredientBtnText}>Add to ingredient list</Text>
              </TouchableOpacity>
            </View>
            {/* delete button  */}
            <TouchableOpacity onPress={deleteHandler(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>❌</Text>
            </TouchableOpacity>
          </View>
          // end of container
        )}
        keyExtractor={(_, index) => index}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    color: 'grey',
  },
  subtitle: {
    color: 'grey',
    borderTopWidth: 1,
    borderBottomColor: 'grey',
    borderTopColor: 'grey',
    borderBottomWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
  },

  recipeTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'teal',
    paddingVertical: 5,
    borderBottomWidth: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#273754',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '100',
    color: '#ededed',
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 50,
    padding: 3,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  deleteIcon: {
    fontSize: 10,
  },
  ratingText: {
    color: '#b9babd',
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  addIngredientBtn: {
    backgroundColor: 'teal',
    padding: 8,
    marginTop: 5,
    minWidth: '100%',
  },
  addIngredientBtnText: {
    textAlign: 'center',
    color: 'white',
  },
});
