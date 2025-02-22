import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '../ui/ThemedView';
import { ThemedText } from '../ui/ThemedText';
import CustomButton from '../ui/CustomButton';


interface FilterModalProps {
  bottomSheetModalRef:any;
  onApply:any;
}

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports',
  'Beauty',
];

const ratings = [4.5, 4, 3, 2, 1];

export default function FilterModal({ bottomSheetModalRef, onApply }: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<'asc'|'desc'>('asc')


  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);

  const colorScheme = useColorScheme();

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handleApply = () => {
    onApply({min:minPrice,max:maxPrice,sortBy});
    bottomSheetModalRef.current.dismiss();
  };

  const handleReset = () => {
    setSelectedRatings([]);
    setInStock(false);
    setOnSale(false);
  };

  return (
    <BottomSheetModal
    ref={bottomSheetModalRef}
    containerStyle={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    backgroundStyle={{
      backgroundColor: Colors[colorScheme ?? "light"].background,
    }}
    handleIndicatorStyle={{
      backgroundColor: Colors[colorScheme ?? "light"].text,
    }}
  >
    <BottomSheetView
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Filter Products</ThemedText>
          </View>

          

          <View style={styles.content}>
            {/* Sort Filters */}
          <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Sort By</ThemedText>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setSortBy('asc')}
              >
                <Ionicons
                  name={sortBy=='asc' ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={sortBy=='asc' ? Colors.primary : 'grey'}
                />
                <ThemedText style={styles.checkboxThemedText}>Price low to high</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setSortBy('desc')}
              >
                <Ionicons
                  name={sortBy=='desc' ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={sortBy=='desc' ? Colors.primary : 'grey'}
                />
                <ThemedText style={styles.checkboxThemedText}>Price high to low</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Price Range */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Price Range</ThemedText>
              <View style={styles.priceInputContainer}>
                <View style={styles.priceInput}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={[styles.input,{color:Colors[colorScheme??"light"].text}]}
                    placeholder="Min"
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    onChangeText={setMinPrice}
                  />
                </View>
                <ThemedText style={styles.priceSeparator}>-</ThemedText>
                <View style={styles.priceInput}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={[styles.input,{color:Colors[colorScheme??"light"].text}]}
                    placeholder="Max"
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    onChangeText={setMaxPrice}
                  />
                </View>
              </View>
            </View>

            {/* Categories */}
            {/* <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category) && styles.categoryChipSelected,
                    ]}
                    onPress={() => handleCategoryToggle(category)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryChipThemedText,
                        selectedCategories.includes(category) &&
                          styles.categoryChipThemedTextSelected,
                      ]}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}

            {/* Ratings */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Ratings</ThemedText>
              <View style={styles.ratingsContainer}>
                {ratings.map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingChip,{backgroundColor:Colors[colorScheme??'light'].gray},
                      selectedRatings.includes(rating) && {backgroundColor:Colors.primary},
                    ]}
                    onPress={() => handleRatingToggle(rating)}
                  >
                    <Text style={styles.ratingThemedText}>{rating}</Text>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingThemedText}> & up</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Filters */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Additional Filters</ThemedText>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setInStock(!inStock)}
              >
                <Ionicons
                  name={inStock ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={inStock ? Colors.primary : 'grey'}
                />
                <ThemedText style={styles.checkboxThemedText}>In Stock Only</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setOnSale(!onSale)}
              >
                <Ionicons
                  name={onSale ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={onSale ? Colors.primary : 'grey'}
                />
                <ThemedText style={styles.checkboxThemedText}>On Sale</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <CustomButton title='Reset' isOutlined onPress={handleReset} style={{flex:0.4}}/>
            <CustomButton title='Apply Filters' onPress={handleApply} style={{flex:0.6}}/>
          </View>
          </ThemedView>
          </BottomSheetView>
          </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 12,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 18,
    color: '#666',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
  },
  categoryChipThemedText: {
    color: '#666',
    fontSize: 14,
  },
  categoryChipThemedTextSelected: {
    color: '#fff',
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'center'
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  ratingThemedText: {
    color: '#666',
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  checkboxThemedText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'grey',
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    gap:10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonThemedText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonThemedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});