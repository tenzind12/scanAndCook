import { StyleSheet, Text, View, Button, Vibration } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import Product from './pages/Product';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [products, setProducts] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [possibleRecipes, setPossibleRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // console.log(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const responseBody = await response.json();
      responseBody.status === 0
        ? setErrorMessage("We don't rate this type of product")
        : setProducts(responseBody);

      /** ================================================================= **
       * FOLLOWING CODES TO FETCH POSSIBLE RECIPES FROM (recipe-php site) *
       */ //=============================================================== //
      if (responseBody.status) {
        // prettier-ignore
        const filterArray = ['and','vegetable','fresh','food','marketplace','their','product','paste',]; // some keywords to exclude (filter)
        const productKeywords = responseBody.product._keywords.filter(
          (word) => filterArray.indexOf(word) == -1
        );
        // console.log(productKeywords);

        // fetch all the recipes from the site

        const recipeResponse = await fetch(
          `https://128e-82-121-4-45.eu.ngrok.io/recipe-php/api/v1/index.php?request=products`
        );
        const recipeResBody = await recipeResponse.json();

        // extract recipes found by matching keywords from scanApp and ingredients in recipe fetched
        const recipesResults = [];
        recipeResBody.data.map((recipe) => {
          for (let i = 0; i < productKeywords.length; i++) {
            if (recipe.recipeIngredient.includes(productKeywords[i])) {
              recipesResults.push(recipe.name);
            }
          }
        });
        const uniqueResult = new Set(recipesResults); //remove duplicate results
        setPossibleRecipes(Array.from(uniqueResult));
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  // console.log(possibleRecipes);

  if (hasPermission === null) return <Text>Requesting for camera permission</Text>;
  if (hasPermission === false) return <Text>No permission</Text>;

  return (
    <View style={styles.container}>
      {scanned || (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={(StyleSheet.absoluteFillObject, styles.camera)}
        />
      )}

      {/* if the product is not found */}
      {errorMessage && <Text style={styles.noProduct}>{errorMessage}</Text>}

      {scanned && !errorMessage && <Product products={products} recipes={possibleRecipes} />}

      <View style={styles.button}>
        <Button
          title={'Tap to Scan Again'}
          onPress={() => {
            setScanned(false);
            setErrorMessage(null);
            Vibration.vibrate(50);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  button: {
    marginTop: 50,
  },

  noProduct: {
    backgroundColor: 'teal',
    color: 'white',
    padding: 5,
    borderRadius: 7,
    marginTop: 100,
  },
  camera: {
    height: 500,
    width: 500,
    marginTop: 80,
  },
});
