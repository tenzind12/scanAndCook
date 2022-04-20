import { StyleSheet, Text, View, Button, Vibration } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useContext } from 'react';
import Product from './pages/Product';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [products, setProducts] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // console.log(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
    const responseBody = await response.json();
    responseBody.status === 0
      ? setErrorMessage("We don't rate this type of product")
      : setProducts(responseBody);

    // following code to fetch recipes
    const productKeywords = responseBody.product._keywords.filter((word) => word !== 'and'); // not only 'and' but ['vegetable', 'and', 'fresh'] find a way to remove these words from productKeywords
    console.log(productKeywords);
    const recipeResponse = await fetch(
      `https://734a-82-121-4-45.eu.ngrok.io/recipe-php/api/v1/index.php?request=products`
    );
    const recipeResBody = await recipeResponse.json();

    // const recipeFound = recipeResBody.data.map((recipe) => {
    //   for (let i = 0; i < productKeywords.length; i++) {
    //     if (recipe.recipeIngredient.includes(productKeywords[i])) {
    //       // console.log(recipe);
    //     }
    //   }
    // });
  };

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

      {scanned && !errorMessage && <Product products={products} />}

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
