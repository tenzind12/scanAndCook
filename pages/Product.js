import { View, Text, Image, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { useState, useEffect } from 'react';
import Nutriments from '../components/Nutriments';
import Nutriscore from '../components/Nutriscore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SavedProducts from './SavedProducts';
import RecipeList from './RecipeList';

export default function Product({ products, recipes, setRecipeIngredient, setPossibleRecipes }) {
  const [currentProducts, setCurrentProducts] = useState([]);
  const [pageChange, setPageChange] = useState(true);

  const [showRecipePage, setShowRecipePage] = useState(false);

  // A D D   B U T T O N   H A N D L E R
  const saveItemHandler = () => {
    const newCurrentProducts = [
      ...currentProducts,
      {
        id: Date.now(),
        name: products.product.product_name,
        image: products.product.image_front_small_url,
        rating: products.product.nutriscore_grade,
      },
    ];
    // check if already saved
    if (currentProducts.length > 0) {
      currentProducts.forEach((product) => {
        if (product.name === products.product.product_name) {
          alert('This product is already saved');
        } else {
          setCurrentProducts(newCurrentProducts);
          alert('Item has been saved to your list');
        }
      });
    } else {
      setCurrentProducts(newCurrentProducts);
      alert('Item has been saved to your list');
    }
    Vibration.vibrate(100);
  };

  // D E L E T E   B U T T O N   H A N D L E R
  const deleteHandler = (id) => {
    return () => {
      const newCurrentProducts = currentProducts.filter((item) => item.id !== id);
      setCurrentProducts(newCurrentProducts);
    };
  };

  // getting localstorage
  useEffect(() => {
    getLocalStorage();
  }, []);

  const getLocalStorage = () => {
    AsyncStorage.getItem('items')
      .then((response) => JSON.parse(response || '[]'))
      .then((data) => setCurrentProducts(data));
  };

  // localstorage saving
  const saveLocalStorage = () => {
    AsyncStorage.setItem('items', JSON.stringify(currentProducts));
  };

  useEffect(() => {
    saveLocalStorage();
  }, [currentProducts]);

  if (pageChange) {
    return (
      products !== null && (
        <View style={styles.container}>
          {/* saved items list */}
          <TouchableOpacity
            style={styles.listBtn}
            onPress={() => {
              setPageChange(false);
              Vibration.vibrate(50);
            }}
          >
            <Text>Bookmarked Items</Text>
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: products.product.image_front_small_url
                  ? products.product.image_front_small_url
                  : 'https://orbis-alliance.com/wp-content/themes/consultix/images/no-image-found-360x260.png',
              }}
              style={styles.image}
            />
            <View style={styles.name_scoreContainer}>
              <Text style={styles.name}>{products.product.product_name}</Text>

              {/* nutriscore = undefined ? errorMessage : afficher le score */}
              {products.product.nutriscore_grade === undefined ? (
                <Text style={styles.noScoreMessage}>This item doesn't have a nutriscore value</Text>
              ) : (
                <Nutriscore nutriscore_grade={products.product.nutriscore_grade} />
              )}
            </View>
          </View>

          {/* ============== link button for viewing recipe results ============ */}
          <View style={styles.threeBtnContainer}>
            <View style={styles.recipeBtnContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowRecipePage(!showRecipePage);
                  Vibration.vibrate(50);
                }}
              >
                <Text style={styles.recipeButton}>
                  {' '}
                  {showRecipePage ? 'Go back' : recipes.length + ' Recipes Found'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setRecipeIngredient([]);
                  setPossibleRecipes([]);
                  Vibration.vibrate(50);
                }}
              >
                <Text style={styles.recipeResetButton}>Reset</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.bookmarkBtn} onPress={saveItemHandler}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>

          {showRecipePage && <RecipeList recipes={recipes} />}

          {/* show nutrivalue and three buttons if recipes are hidden */}
          {!showRecipePage && (
            <>
              {/* nutrition scores component*/}
              <Nutriments nutriments={products.product.nutriments} />
              {/* <View style={styles.buttonContainer}>
                
              </View> */}
            </>
          )}
        </View>
      )
    );
  } else {
    return (
      <SavedProducts
        setPageChange={setPageChange}
        storedItems={currentProducts}
        deleteHandler={deleteHandler}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
  },
  listBtn: {
    alignSelf: 'flex-end',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginRight: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    shadowColor: '#77a8a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    color: '#303331',
  },
  name_scoreContainer: {
    width: '50%',
    justifyContent: 'space-evenly',
  },
  recipeButton: {
    color: 'white',
    padding: 5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#47b3b3',
    borderRadius: 5,
    marginTop: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recipeResetButton: {
    backgroundColor: '#f26363',
    color: 'white',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  bookmarkBtn: {
    backgroundColor: '#47b3b3',
    padding: 5,
    marginTop: 5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
  },
  threeBtnContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  recipeBtnContainer: {
    flexDirection: 'row',
  },
});
