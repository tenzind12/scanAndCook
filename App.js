import { StyleSheet, Text, View, Vibration, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import Product from './pages/Product';
import { BASE_URL, filterArray } from './services/Service';
import SavedProducts from './pages/SavedProducts';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [products, setProducts] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [possibleRecipes, setPossibleRecipes] = useState([]);
  const [recipeIngredient, setRecipeIngredient] = useState([]);

  // // bookmark handler
  // const [pageChange, setPageChange] = useState(true);

  // clean up function
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (isMounted) setHasPermission(status === 'granted');
    })();

    return () => (isMounted = false);
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const responseBody = await response.json();
      // console.log(responseBody);
      responseBody.status === 0
        ? setErrorMessage("We don't rate this type of product")
        : setProducts(responseBody);

      /** ================================================================= **
       * FOLLOWING CODES TO FETCH POSSIBLE RECIPES FROM (recipe-php site) *
       */ //=============================================================== //
      if (responseBody.status) {
        const productKeywords = responseBody.product._keywords.filter(
          (word) => filterArray.indexOf(word) === -1
        );

        console.log('keywords => ', productKeywords);

        // F I R S T   I N G R E D I E N T
        if (recipeIngredient.length <= 0) {
          const recipeResponse = await fetch(`${BASE_URL}/api/v1/index.php?request=products`);
          const recipeResBody = await recipeResponse.json();

          // extract recipes found by matching keywords from scanApp and ingredients in recipe fetched
          const recipesResults = [];
          recipeResBody.data.map((recipe) => {
            for (let i = 0; i < productKeywords.length; i++) {
              if (recipe.recipeIngredient.includes(productKeywords[i])) {
                const recipeObject = {};
                recipeObject['01'] = recipe.name;
                recipeObject['02'] = recipe.recipeIngredient;
                recipesResults.push(recipeObject);
              }
            }
          });

          // console.log('recipesResult', recipesResults);
          // SENDING unique RECIPES NAMES TO RECIPELIST.JSX
          const name = [];
          recipesResults.forEach((recipeObj) => {
            name.push(recipeObj['01']);
            const uniqueRecipeName = new Set(name);
            setPossibleRecipes(Array.from(uniqueRecipeName));
          });

          // setting recipes
          setRecipeIngredient([recipesResults]);
        } else {
          // S E C O N D   T I M E    S C A N N I N G
          // console.log(recipeIngredient);
          const recipesResults = [];
          recipeIngredient[0].map((recipe) => {
            for (let i = 0; i < productKeywords.length; i++) {
              if (recipe['02'].includes(productKeywords[i])) {
                // return recipe['01'];
                const recipeObj = {};
                recipeObj['01'] = recipe['01'];
                recipeObj['02'] = recipe['02'];
                recipesResults.push(recipeObj);
              }
            }
          });

          // SENDING unique RECIPES NAMES TO RECIPELIST.JSX
          const name = [];
          // const ingredients = [];
          recipesResults.forEach((recipeObj) => {
            name.push(recipeObj['01']);
            const uniqueRecipeName = new Set(name);
            setPossibleRecipes(Array.from(uniqueRecipeName));
          });
          // setting recipes
          setRecipeIngredient([recipesResults]);
        }
      }
    } catch (e) {
      console.log('App.js Catch error =>', e.message);
    }
  };

  if (hasPermission === null) return <Text>Requesting for camera permission</Text>;
  if (hasPermission === false) return <Text>No permission</Text>;

  // if (pageChange === false) return <SavedProducts />;
  // else
  return (
    <View style={styles.container}>
      {scanned || (
        // <>
        //   {/* bookmark link */}
        //   <TouchableOpacity
        //     style={styles.bookmarkLink}
        //     onPress={() => {
        //       setPageChange(false);
        //       Vibration.vibrate(50);
        //     }}
        //   >
        //     <Text style={{ color: 'grey' }}>Bookmarked Items</Text>
        //   </TouchableOpacity>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={(StyleSheet.absoluteFillObject, styles.camera)}
        >
          <View style={styles.layerTop} />
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom} />
        </BarCodeScanner>
        // </>
      )}

      {/* if the product is not found */}
      {errorMessage && <Text style={styles.noProduct}>{errorMessage}</Text>}

      {scanned && !errorMessage && (
        <Product
          products={products}
          recipes={possibleRecipes}
          setRecipeIngredient={setRecipeIngredient}
          setPossibleRecipes={setPossibleRecipes}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
          setErrorMessage(null);
          Vibration.vibrate(50);
        }}
      >
        <Text style={styles.scanText}>&#128257; Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const opacity = 'rgba(0, 0, 0, 0.5)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  // bookmarkLink: {
  //   zIndex: 10,
  //   elevation: 10,
  //   position: 'absolute',
  //   top: '13.5%',
  //   right: -30,
  //   transform: [{ rotate: '45deg' }],
  //   borderColor: 'grey',
  //   borderBottomWidth: 1,
  //   borderRightWidth: 1,
  //   paddingHorizontal: 5,
  //   backgroundColor: '#dee3e0',
  //   marginRight: 10,
  //   borderRadius: 20,
  // },
  button: {
    backgroundColor: '#00b894',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  noProduct: {
    backgroundColor: 'teal',
    color: 'white',
    padding: 5,
    borderRadius: 7,
    marginTop: 100,
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
  scanText: {
    color: 'white',
    fontSize: 20,
  },
});
