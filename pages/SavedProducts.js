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
  const [keywords, setKeywords] = useState([]); // recipes keywords recieved from 'add' Button
  const [isAdded, setIsAdded] = useState([]); // ingredients object stored in array

  const [currentAddedIndex, setCurrentAddedIndex] = useState([]); // state storing index to update the container color when added to ingredient

  const [recipes, setRecipes] = useState([]); // state to store all recipes extracted with keywords
  const [recipeNames, setRecipeNames] = useState([]); // recipe names to pass to recipeList.js
  const [showRecipeList, setShowRecipeList] = useState(false);

  // test
  // useEffect(() => {
  //   console.log(isAdded);
  // }, [isAdded]);

  // B A C K   H A N D L E R
  const backBtnHandler = () => {
    let isMounted = true;
    if (isMounted) setPageChange(true);

    return () => (isMounted = false);
    Vibration.vibrate(100);
  };

  // A D D   I N G R E D I E N T   H A N D L E R
  const addKeywordHandler = (itemKeywords, index) => {
    const productKeywords = itemKeywords.filter((word) => filterArray.indexOf(word) == -1);
    setKeywords(productKeywords);

    // object of item added in array
    const newIsAdded = [...isAdded, storedItems[index]];
    let count = 0;
    if (isAdded) {
      isAdded.forEach((itemObj) => {
        if (itemObj.id === storedItems[index].id) {
          alert('Ingredient already added');
          count++;
        }
      });
    }
    if (!count) {
      setIsAdded(newIsAdded);
      const newCurrentAddedIndex = [...currentAddedIndex, index];
      setCurrentAddedIndex(newCurrentAddedIndex);
    }

    Vibration.vibrate(50);
  };

  // R E S E T  R E C I P E   R E S U L T
  const resetHandler = () => {
    setRecipes([]);
    setRecipeNames([]);
    setIsAdded([]);
    setCurrentAddedIndex([]);
    Vibration.vibrate(50);
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

        const recipesResults = [];
        const recipesResultsName = [];

        // loop through allRecipes recieved from site-php and extract those matching with the keywords from addToIngredient button
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
      // SECOND TIME CLICKING ADD BUTTON
      const recipesResults = [];
      const recipesResultsName = [];
      // loop through recipes in recipesState and extract those matching with the keywords from addToIngredient button
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
      {/* TITLE AND SUBTITLE*/}
      <Button title="Back" onPress={backBtnHandler} />
      <Text style={styles.title}>Your Saved items</Text>
      <Text style={styles.subtitle}>
        Search recipes with <Text style={{ fontWeight: 'bold' }}>'Add to ingredient'</Text> button
      </Text>
      {/* END OF TITLE AND SUBTITLE*/}

      {/* RECIPES LIST SECTION */}
      {recipeNames.length > 0 && (
        <View style={styles.recipeBtnContainer}>
          <TouchableOpacity onPress={() => setShowRecipeList(!showRecipeList)}>
            <Text style={styles.recipeShowBtn}>{recipeNames.length} recipes found</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetHandler}>
            <Text style={styles.resetBtn}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
      {showRecipeList && recipeNames.length > 0 && <RecipeList recipes={recipeNames} />}
      {/* END OF RECIPES LIST SECTION */}

      {/* BOOKMARKED LIST */}
      <FlatList
        data={storedItems}
        renderItem={({ item, index }) => (
          // each list container
          <View
            style={[styles.itemContainer, currentAddedIndex.includes(index) ? styles.added : '']}
          >
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

              {/* A D D   B U T T O N  */}
              <TouchableOpacity
                style={styles.addIngredientBtn}
                onPress={() => addKeywordHandler(item.keywords, index)}
              >
                <Text style={styles.addIngredientBtnText}>
                  {currentAddedIndex.includes(index) ? 'ADDED' : 'ADD TO INGREDIENT'}
                </Text>
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
      {/* END OF BOOKMARKED LIST */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
    // backgroundColor: 'transparent',
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
  recipeBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeShowBtn: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'teal',
    paddingVertical: 2,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderRadius: 5,
  },
  resetBtn: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    backgroundColor: '#cf3f38',
    paddingVertical: 2,
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    borderRightWidth: 2,
    borderRadius: 5,
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
  added: {
    backgroundColor: '#4a317d',
  },
});
