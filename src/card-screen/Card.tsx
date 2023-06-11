import React, {useState} from 'react';
import useSWR from 'swr';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Phone from '../img/phone.svg';
import Check from '../img/check.svg';
import Sheild from '../img/sheild.svg';
import Top from '../img/arrow-top.svg';
import Bottom from '../img/arrow-bottom.svg';
import From from '../img/from.svg';
import To from '../img/to.svg';
import ArrowBottomBlue from '../img/arrow-bottom-blue.svg';
import Eye from '../img/view.svg';
import Back from '../img/back.svg';

interface Card {
  id: string;
}

const fetchCard = async (id: string) => {
  const url = `https://admin-ct.cargis.pro/api/client/v1/orders/${id}`;
  let response = await fetch(url, {
    headers: {
      Authorization: 'Bearer dZhzHlw8Flpsf8W9Duq4rsJ1UVT4dRlW',
    },
  });
  const data = await response.json();
  return data;
};

const CardInform: React.FC = () => {
  const [activeButton, setActiveButton] = useState('information');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isShippingDetailsVisible, setIsShippingDetailsVisible] =
    useState(false);
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const [isUnloadingVisible, setIsUnloadingVisible] = useState(false);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };
  const toggleShippingDetails = () => {
    setIsShippingDetailsVisible(!isShippingDetailsVisible);
  };
  const toggleLoading = () => {
    setIsLoadingVisible(!isLoadingVisible);
  };
  const toggleUnloading = () => {
    setIsUnloadingVisible(!isUnloadingVisible);
  };
  const handleShippingsPress = () => {
    setActiveButton('shippings');
  };
  const handleInformationPress = () => {
    setActiveButton('information');
  };

  const route = useRoute();
  const {id} = route.params;
  const {coordsF} = route.params;
  const {coordsT} = route.params;
  const navigation = useNavigation();

  const {data: cardData, error: cardError} = useSWR<Card[]>(
    ['orders', id],
    () => fetchCard(id),
  );

  if (cardError) {
    return <Text>Error loading data</Text>;
  }

  if (!cardData) {
    return <Text>Loading...</Text>;
  }
  function ArrowUnloading() {
    if (isUnloadingVisible) {
      return <Top style={styles.informImage}/>;
    } else {
      return <Bottom style={styles.informImage}/>;
    }
  }
  function ArrowLoading() {
    if (isLoadingVisible) {
      return <Top style={styles.informImage}/>;
    } else {
      return <Bottom style={styles.informImage}/>;
    }
  }
  function ArrowShipping() {
    if (isShippingDetailsVisible) {
      return <Top style={styles.informImage}/>;
    } else {
      return <Bottom style={styles.informImage}/>;
    }
  }
  function ArrowDetails() {
    if (isDetailsVisible) {
      return <Top style={styles.informImage}/>;
    } else {
      return <Bottom style={styles.informImage}/>;
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.touchableBack}
        onPress={() => navigation.goBack()}>
        <Back style={styles.imageBack} />
        <View>
          <View style={styles.header}>
            <Text style={styles.idText}>Заявка №{cardData['id']}</Text>
            <View style={styles.statusBorder}>
              <Text style={styles.statusText}>
                {cardData['status_1c'] === 'active'
                  ? 'Активная'
                  : '' || cardData['status_1c'] === 'on_pause'
                  ? 'На паузе'
                  : '' || cardData['status_1c'] === 'completed'
                  ? 'Завершена'
                  : ''}
              </Text>
            </View>
          </View>
          <View style={styles.headerDates}>
            <Text style={styles.headerTexts}>
              От {cardData['create_dt'].split(' ')[0]}
            </Text>
            <View style={styles.centerDate}>
              <Eye style={styles.clock} />
              <Text style={styles.headerTexts}>
                Просмотры: {cardData['views_count']}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 'information' && {
              borderBottomColor: '#0C48A1',
              borderBottomWidth: 2,
            },
          ]}
          onPress={handleInformationPress}>
          <Text
            style={[
              styles.buttonText,
              activeButton === 'information' && {color: '#0C48A1'},
            ]}>
            Информация
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === 'shippings' && {
              borderBottomColor: '#0C48A1',
              borderBottomWidth: 2,
            },
          ]}
          onPress={handleShippingsPress}>
          <View style={styles.shippingsContainer}>
            <Text
              style={[
                styles.buttonText,
                activeButton === 'shippings' && {color: '#0C48A1'},
              ]}>
              Мои перевозки
            </Text>
            <View style={styles.shippingsBorder}>
              <Text style={styles.shippingsText}>0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollingContainer}>
        <TouchableOpacity style={styles.calendarContainer}>
          <Text style={styles.calendarText}>Календарь суточной загрузки</Text>
          <Bottom style={styles.calendarImage} />
        </TouchableOpacity>
        <View style={styles.detailsBox}>
          <TouchableOpacity
            style={styles.informContainer}
            onPress={toggleDetails}>
            <Text style={styles.informText}>Детали заявки</Text>
            <ArrowDetails />
          </TouchableOpacity>
          {isDetailsVisible && (
            <View>
              <View style={styles.companyContainer}>
                <Text style={styles.littleTitle}>ЗАКАЗЧИК</Text>
                <View style={styles.companyBoxNameImages}>
                  <Text style={styles.companyName}>
                    {cardData['shipper_company_shortname']}
                  </Text>
                  <View style={styles.companyImagesContainer}>
                    <Check style={styles.clock} />
                    <Sheild style={styles.clock} />
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.detailsContacts}>
                <Text style={styles.contactsText}>Показать контакты</Text>
                <ArrowBottomBlue style={styles.contactsImage} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsBox}>
          <TouchableOpacity
            style={styles.informContainer}
            onPress={toggleShippingDetails}>
            <Text style={styles.informText}>Детали перевозки</Text>
            <ArrowShipping />
          </TouchableOpacity>
          {isShippingDetailsVisible && (
            <View>
              <View style={styles.locationContainer}>
                <Text style={styles.littleTitleLocation}>
                  МАРШРУТ ПЕРЕВОЗКИ
                </Text>
                <View style={styles.locationBoxes}>
                  <From />
                  <Text style={styles.locationTexts}>{coordsF}</Text>
                </View>
                <View style={styles.locationBoxes}>
                  <To />
                  <Text style={styles.locationTexts}>{coordsT}</Text>
                </View>
              </View>

              <View>
                <View style={styles.otherContainerDouble}>
                  <View style={styles.otherContainerTexts}>
                    <Text style={styles.otherTitles}>РАССТОЯНИЕ</Text>
                    <Text style={styles.otherTexts}>
                      {Math.round((cardData['distance_m'] / 1000).toFixed(2))}{' '}
                      км
                    </Text>
                  </View>
                  <View style={styles.otherContainerTexts}>
                    <Text style={styles.otherTitles}>ТАРИФ</Text>
                    <Text style={styles.otherTexts}>
                      {cardData['tariff_c']} ₽/т
                      <Text style={styles.additionalTexts}> Без НДС</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.otherContainerDouble}>
                  <View style={styles.otherContainerTexts}>
                    <Text style={styles.otherTitles}>ГРУЗ</Text>
                    <Text style={styles.otherTexts}>
                      {cardData['cargo_type']}
                    </Text>
                  </View>
                  <View style={styles.otherContainerTexts}>
                    <Text style={styles.otherTitles}>ВСЕГО К ПЕРЕВОЗКЕ</Text>
                    <Text style={styles.otherTexts}>
                      {cardData['tonnage_balance_kg'] / 1000} т
                      <Text style={styles.additionalTexts}>
                        {' '}
                        / из {cardData['tonnage_kg'] / 1000} т
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.littleTitleLocation}>КОММЕНТАРИЙ</Text>
                <View style={styles.locationBoxes}>
                  <Text style={styles.locationTexts}>
                    Погружаем зернометом, при отклике убедитесь, что тип прицепа
                    соответствует
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.detailsContacts}>
                <Text style={styles.contactsText}>Все детали</Text>
                <ArrowBottomBlue style={styles.contactsImage} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsBox}>
          <TouchableOpacity
            style={styles.informContainer}
            onPress={toggleLoading}>
            <Text style={styles.informText}>Погрузка</Text>
            <ArrowLoading />
          </TouchableOpacity>
          {isLoadingVisible && (
            <View>
              <View style={styles.companyContainer}>
                <Text style={styles.littleTitle}>ГРУЗООТПРАВИТЕЛЬ</Text>
                <View style={styles.companyBoxNameImages}>
                  <Text style={styles.companyName}>ООО «ТМК энергострой»</Text>
                  <View style={styles.companyImagesContainer}>
                    <Check style={styles.clock} />
                    <Sheild style={styles.clock} />
                  </View>
                </View>
                <Text style={[styles.littleTitle, {marginTop: 8}]}>
                  ИНН: {cardData['company_inn']}
                </Text>
              </View>
              <View style={styles.companyContainer}>
                <Text style={styles.littleTitle}>
                  ОТВЕТСТВЕННЫЙ ПРЕДСТАВИТЕЛЬ
                </Text>
                <View style={[styles.companyBoxNameImages, styles.phone]}>
                  <Text style={styles.companyName}>
                    Лавров Константин Иванович
                  </Text>
                  <View style={styles.companyImagesContainer}>
                    <Phone style={[styles.phone, {marginRight: 8}]} />
                  </View>
                </View>
                <Text style={[styles.phoneText, {marginTop: 8}]}>
                  +7 (999)-435-77-77
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.detailsBox}>
          <TouchableOpacity
            style={styles.informContainer}
            onPress={toggleUnloading}>
            <Text style={styles.informText}>Выгрузка</Text>
            <ArrowUnloading />
          </TouchableOpacity>
          {isUnloadingVisible && (
            <View>
              <View style={styles.companyContainer}>
                <Text style={styles.littleTitle}>ГРУЗООТПРАВИТЕЛЬ</Text>
                <View style={styles.companyBoxNameImages}>
                  <Text style={styles.companyName}>
                    ООО «НижЭнергоКомбинат»
                  </Text>
                  <View style={styles.companyImagesContainer}>
                    <Check style={styles.clock} />
                    <Sheild style={styles.clock} />
                  </View>
                </View>
                <Text style={[styles.littleTitle, {marginTop: 8}]}>
                  ИНН: {cardData['company_inn']}
                </Text>
              </View>
              <View style={styles.companyContainer}>
                <Text style={styles.littleTitle}>
                  ОТВЕТСТВЕННЫЙ ПРЕДСТАВИТЕЛЬ
                </Text>
                <View style={[styles.companyBoxNameImages, styles.phone]}>
                  <Text style={styles.companyName}>Иванов Иван Иванович</Text>
                  <View style={styles.companyImagesContainer}>
                    <Phone style={[styles.phone, {marginRight: 8}]} />
                  </View>
                </View>
                <Text style={[styles.phoneText, {marginTop: 8}]}>
                  +7 (977)-232-12-96
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.cardFooter}>
        <View style={styles.cardFooterBoxBtn}>
          <TouchableOpacity style={styles.cardFooterBtn}>
            <Text style={styles.cardFooterBtnText}>Отправить отклик</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchableBack: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBack: {
    marginHorizontal: 21,
  },
  idText: {
    color: '#232B2F',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTexts: {
    fontWeight: '400',
    fontSize: 9,
    color: '#637A86',
  },
  headerDates: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  centerDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  clock: {
    width: 15,
    height: 15,
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
  buttonsContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    width: 170,
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
  shippingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingsBorder: {
    borderColor: '#BBC5CB',
    width: 21,
    height: 18,
    borderWidth: 1,
    backgroundColor: '#BBC5CB',
    borderRadius: 15,
    paddingVertical: 1,
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  shippingsText: {
    fontWeight: '500',
    fontSize: 11,
    color: '#FFFFFF',
  },
  scrollingContainer: {
    backgroundColor: '#F7F7F7',
    padding: 16,
    height: '70%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  calendarText: {
    color: '#232B2F',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarImage: {
    marginRight: 8,
  },
  informContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  informText: {
    color: '#232B2F',
    fontSize: 16,
    fontWeight: '600',
  },
  informImage: {
    marginRight: 8,
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 16,
    padding: 16,
  },
  companyContainer: {
    backgroundColor: '#F7F7F7',
    padding: 8,
    borderRadius: 5,
    paddingVertical: 11,
    paddingLeft: 16,
    marginTop: 16,
  },
  littleTitle: {
    fontWeight: '500',
    fontSize: 9,
    color: '#637A86',
    marginBottom: 5,
  },
  companyName: {
    fontWeight: '500',
    fontSize: 14,
    color: '#232B2F',
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
  detailsContacts: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  contactsText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#0C48A1',
    marginLeft: 4,
  },
  contactsImage: {
    marginTop: 2,
    marginLeft: 8,
  },
  locationContainer: {
    backgroundColor: '#F7F7F7',
    paddingLeft: 8,
    paddingTop: 8,
    paddingRight: 8,
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
  phone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneText: {
    fontWeight: '500',
    fontSize: 12,
    color: '#0C48A1',
  },
  cardFooter: {
    backgroundColor: '#F7F7F7',
  },
  cardFooterBoxBtn: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cardFooterBtn: {
    width: 328,
    height: 48,
    backgroundColor: '#0C48A1',
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cardFooterBtnText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#FFFFFF',
  },
  footerBorder: {
    width: 134,
    height: 3,
    backgroundColor: '#BBC5CB',
    borderRadius: 100,
    marginTop: 20,
  },
  footerBoxBorder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default CardInform;
