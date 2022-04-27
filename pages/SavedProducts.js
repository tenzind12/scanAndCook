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
import { rating } from '../services/Service';

export default function SavedProducts({ setPageChange, storedItems, deleteHandler }) {
  // back to product page
  const backBtnHandler = () => {
    setPageChange(true);
    Vibration.vibrate(100);
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={backBtnHandler} />
      <Text style={styles.title}>Your Saved items</Text>
      <Text style={styles.subtitle}>You can add multiple ingredients together</Text>

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
            <View>
              {/* product name */}
              <Text style={styles.itemName}>{item.name}</Text>

              {/* rating stars */}
              {item.rating !== undefined ? (
                <Text style={styles.ratingText}>Rating: {rating(item.rating)}</Text>
              ) : (
                <Text>{rating(item.rating)}</Text>
              )}
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
  itemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#273754',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '100',
    color: '#ededed',
  },
  deleteBtn: {
    backgroundColor: '#bdbdbd',
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
});
