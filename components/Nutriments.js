import { View, Text, StyleSheet } from 'react-native';

export default function Nutriments({ nutriments }) {
  return (
    <View style={styles.nutrimentsContainer}>
      <View style={styles.nutriment}>
        <Text>Carbohydrates</Text>
        <Text>
          {nutriments.carbohydrates_100g ? nutriments.carbohydrates_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>

      <View style={styles.nutriment}>
        <Text>Proteins</Text>
        <Text>
          {nutriments.proteins_100g ? nutriments.proteins_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>

      <View style={styles.nutriment}>
        <Text>Fats</Text>
        <Text>
          {nutriments.fat_100g ? nutriments.fat_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>

      <View style={styles.nutriment}>
        <Text>Fiber</Text>
        <Text>
          {nutriments.fiber_100g ? nutriments.fiber_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>

      <View style={styles.nutriment}>
        <Text>Salt</Text>
        <Text>
          {nutriments.salt_100g ? nutriments.salt_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>

      <View style={styles.nutriment}>
        <Text>Sugar</Text>
        <Text>
          {nutriments.sugars_100g ? nutriments.sugars_100g.toFixed(2) : '0.00'}
          <Text style={styles.spanText}>/100g</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nutrimentsContainer: {
    marginHorizontal: 10,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
  },
  nutriment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spanText: {
    color: 'grey',
    fontSize: 10,
  },
});
