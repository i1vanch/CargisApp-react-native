import React from 'react';
import useSWR from 'swr';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Eye from '../img/view.svg';
import Top from '../img/arrow-top.svg';
import Bottom from '../img/arrow-bottom.svg';
import From from '../img/from.svg';
import To from '../img/to.svg';
import Check from '../img/check.svg';
import Sheild from '../img/sheild.svg';
import Clock from '../img/clock.svg';

interface Order {
  id: string;
}

const fetchLocationFrom = async (lat: number, lon: number) => {
  const url =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';
  const token = '473fcaf5f3bddb22c760a14d0ddd22bf7debb686';
  const query = {lat, lon};

  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + token,
    },
    body: JSON.stringify(query),
  };

  const response = await fetch(url, options);
  const result = await response.text();
  return result;
};

const fetchLocationTo = async (lat: number, lon: number) => {
  const url =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';
  const token = '473fcaf5f3bddb22c760a14d0ddd22bf7debb686';
  const query = {lat, lon};

  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + token,
    },
    body: JSON.stringify(query),
  };

  const response = await fetch(url, options);
  const result = await response.text();
  return result;
};

const OrderCard: React.FC<{
  order: Order;
  isOpen: boolean;
  onPress: () => void}> = ({order, isOpen, onPress}) => {
  const {data: locationFromData, error: locationFromError} = useSWR(
    [
      'suggestions',
      order['coords_from']['latitude'],
      order['coords_from']['longitude'],
    ],
    () =>
      fetchLocationFrom(
        order['coords_from']['latitude'],
        order['coords_from']['longitude'],
      ),
  );
  const {data: locationToData, error: locationToError} = useSWR(
    [
      'suggestions',
      order['coords_to']['latitude'],
      order['coords_to']['longitude'],
    ],
    () =>
      fetchLocationTo(
        order['coords_to']['latitude'],
        order['coords_to']['longitude'],
      ),
  );
  const navigation = useNavigation();

  let coordsFrom: string;
  let from: any;
  if (typeof locationFromData !== 'undefined') {
    from = JSON.parse(locationFromData);
    coordsFrom = from.suggestions[0].value;
  }
  let coordsTo;
  let to;
  if (typeof locationToData !== 'undefined') {
    to = JSON.parse(locationToData);
    coordsTo = to.suggestions[0].value;
  }

  if (locationFromError || locationToError) {
    return <Text>Error loading data</Text>;
  }

  const handleNavigateToScreen = () => {
    navigation.navigate('CardInform', {
      id: order['id'],
      coordsF: coordsFrom,
      coordsT: coordsTo,
    });
  };
  function Arrow() {
    if (isOpen) {
      return <Top style={styles.arrow}/>;
    } else {
      return <Bottom style={styles.arrow}/>;
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <View style={styles.headerOrderStattusBox}>
            <Text style={styles.idText}>Заявка №{order['id']}</Text>
            <View style={styles.statusBorder}>
              <Text style={styles.statusText}>
                {order['status_1c'] === 'active'
                  ? 'Активная'
                  : '' || order['status_1c'] === 'on_pause'
                  ? 'На паузе'
                  : '' || order['status_1c'] === 'completed'
                  ? 'Завершена'
                  : ''}
              </Text>
            </View>
          </View>
          <View>
            <Arrow />
          </View>
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.headerTexts}>
            От {order['create_dt'].split(' ')[0]}
          </Text>
          <View style={styles.centerDate}>
            <Clock style={styles.clock} />
            <Text style={styles.headerTexts}>
              {order['load_dt']} - {order['ending_dt']}
            </Text>
          </View>
          <View style={styles.centerDate}>
            <Eye style={styles.clock} />
            <Text style={styles.headerTexts}>
              Просмотры: {order['views_count']}
            </Text>
          </View>
        </View>
      </View>
      {isOpen && (
        <View>
          <View style={styles.companyContainer}>
            <Text style={styles.littleTitle}>ЗАКАЗЧИК</Text>
            <View style={styles.companyBoxNameImages}>
              <Text>{order['company']['short_name']}</Text>
              <View style={styles.companyImagesContainer}>
                <Check style={styles.clock} />
                <Sheild style={styles.clock} />
              </View>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.littleTitleLocation}>МАРШРУТ ПЕРЕВОЗКИ</Text>
            <View style={styles.locationBoxes}>
              <From />
              <Text style={styles.locationTexts}>{coordsFrom}</Text>
            </View>
            <View style={styles.locationBoxes}>
              <To />
              <Text style={styles.locationTexts}>{coordsTo}</Text>
            </View>
          </View>

          <View>
            <View style={styles.otherContainerDouble}>
              <View style={styles.otherContainerTexts}>
                <Text style={styles.otherTitles}>РАССТОЯНИЕ</Text>
                <Text style={styles.otherTexts}>
                  {Math.round((order['distance_m'] / 1000).toFixed(2))} км
                </Text>
              </View>
              <View style={styles.otherContainerTexts}>
                <Text style={styles.otherTitles}>ТАРИФ</Text>
                <Text style={styles.otherTexts}>
                  {order['tariff_c']} ₽/т
                  <Text style={styles.additionalTexts}> Без НДС</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.otherContainer}>
            <View style={styles.otherContainerDouble}>
              <View style={styles.otherContainerTexts}>
                <Text style={styles.otherTitles}>ГРУЗ</Text>
                <Text style={styles.otherTexts}>{order['cargo_type']}</Text>
              </View>
              <View style={styles.otherContainerTexts}>
                <Text style={styles.otherTitles}>ВСЕГО К ПЕРЕВОЗКЕ</Text>
                <Text style={styles.otherTexts}>
                  {order['tonnage_balance_kg'] / 1000} т
                  <Text style={styles.additionalTexts}>
                    {' '}
                    / из {order['tonnage_kg'] / 1000} т
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.btnsFooterContainer}>
            <TouchableOpacity
              style={styles.btnMore}
              onPress={() => handleNavigateToScreen()}>
              <Text style={styles.btnMoreText}>Подробнее</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnResponse}>
              <Text style={styles.btnResponseText}>Оставить отклик</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  header: {
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  topHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerOrderStattusBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    color: '#232B2F',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBorder: {
    borderColor: '#E6EEF8',
    width: 68,
    height: 18,
    borderWidth: 1,
    backgroundColor: '#E6EEF8',
    borderRadius: 15,
    paddingVertical: 1,
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  statusText: {
    fontWeight: '500',
    fontSize: 11,
    color: '#0C48A1',
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  arrow: {
    width: 10,
    height: 6,
    marginRight: 10,
  },
  headerTexts: {
    fontWeight: '400',
    fontSize: 9,
    color: '#637A86',
  },
  clock: {
    width: 15,
    height: 15,
  },
  centerDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationContainer: {
    backgroundColor: '#F7F7F7',
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 16,
    borderRadius: 5,
    marginTop: 8,
  },
  locationBoxes: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginLeft: 8,
  },
  littleTitleLocation: {
    fontWeight: '500',
    fontSize: 9,
    color: '#637A86',
    marginLeft: 8,
  },
  locationTexts: {
    fontWeight: '400',
    fontSize: 12,
    color: '#232B2F',
  },
  companyContainer: {
    backgroundColor: '#F7F7F7',
    padding: 8,
    borderRadius: 5,
    paddingVertical: 8,
    paddingLeft: 14,
    marginTop: 16,
  },
  littleTitle: {
    fontWeight: '500',
    fontSize: 9,
    color: '#637A86',
  },
  companyImagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyBoxNameImages: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },
  otherContainer: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
    borderRadius: 5,
  },
  otherContainerDouble: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  otherContainerTexts: {
    backgroundColor: '#F7F7F7',
    flex: 1,
    borderRadius: 5,
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 14,
  },
  otherTitles: {
    fontWeight: '500',
    fontSize: 9,
    color: '#637A86',
  },
  otherTexts: {
    fontWeight: '500',
    fontSize: 13,
    color: '#232B2F',
    marginTop: 8,
  },
  additionalTexts: {
    fontWeight: '400',
    fontSize: 13,
    color: '#BBC5CB',
  },
  btnsFooterContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  btnMore: {
    width: 152,
    height: 40,
    borderWidth: 1,
    borderColor: '#E9EDEF',
    borderStyle: 'solid',
    borderRadius: 999,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnMoreText: {
    marginLeft: 37,
    color: '#0C48A1',
    fontWeight: '600',
    fontSize: 14,
  },
  btnResponse: {
    width: 152,
    height: 40,
    borderWidth: 1,
    borderColor: '#0C48A1',
    borderStyle: 'solid',
    borderRadius: 999,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C48A1',
  },
  btnResponseText: {
    marginLeft: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default OrderCard;
