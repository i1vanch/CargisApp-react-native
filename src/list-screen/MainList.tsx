import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import OrdersList from './MainListOrders';

function MainList(): JSX.Element {
  const [activeButton, setActiveButton] = useState('list');
  const [activeFilter, setActiveFilter] = useState('all');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleListPress = () => {
    setActiveButton('list');
    setActiveFilter('all');
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  const handleMapPress = () => {
    setActiveButton('map');
  };

  const handleAllPress = () => {
    setActiveFilter('all');
  };

  const handleActivePress = () => {
    setActiveFilter('active');
  };

  const handlePausePress = () => {
    setActiveFilter('pause');
  };

  const handleCompletedPress = () => {
    setActiveFilter('completed');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Заявки на перевозки</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 'map' && {
              borderBottomColor: '#0C48A1',
              borderBottomWidth: 2,
            },
          ]}
          onPress={handleMapPress}>
          <Text
            style={[
              styles.buttonText,
              activeButton === 'map' && {color: '#0C48A1'},
            ]}>
            Карта
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 'list' && {
              borderBottomColor: '#0C48A1',
              borderBottomWidth: 2,
            },
          ]}
          onPress={handleListPress}>
          <Text
            style={[
              styles.buttonText,
              activeButton === 'list' && {color: '#0C48A1'},
            ]}>
            Список
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && {
              borderColor: '#0C48A1',
            },
          ]}
          onPress={handleAllPress}>
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === 'all' && {color: '#0C48A1'},
            ]}>
            Все
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'active' && {
              borderColor: '#0C48A1',
            },
          ]}
          onPress={handleActivePress}>
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === 'active' && {color: '#0C48A1'},
            ]}>
            Активные
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'pause' && {
              borderColor: '#0C48A1',
            },
          ]}
          onPress={handlePausePress}>
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === 'pause' && {color: '#0C48A1'},
            ]}>
            На паузе
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'completed' && {
              borderColor: '#0C48A1',
            },
          ]}
          onPress={handleCompletedPress}>
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === 'completed' && {color: '#0C48A1'},
            ]}>
            Завершенные
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <OrdersList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  titleContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginTop: 16,
    marginLeft: 24,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    width: 160,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#637A86',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    gap: 8,
    backgroundColor: '#ffff',
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
  },
  filterButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9EDEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 70,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#637A86',
  },
});

export default MainList;
