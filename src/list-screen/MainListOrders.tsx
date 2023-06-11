import React, {useState, useCallback} from 'react';
import useSWR from 'swr';
import {Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import OrderCard from './OrderCard';

interface Order {
  id: string;
}

const fetchOrders = async () => {
  const url =
    'https://admin-ct.cargis.pro/api/client/v2/order/list?page=0&status_1c[0]=active&status_1c[1]=on_pause&status_1c[3]=completed&order_1c_search_is_true=true';
  let response = await fetch(url, {
    headers: {
      Authorization: 'Bearer dZhzHlw8Flpsf8W9Duq4rsJ1UVT4dRlW',
    },
  });
  const data = await response.json();
  // console.log(JSON.stringify(data, null, 2));
  return data;
};

const OrdersList: React.FC = () => {
  const {
    data: ordersData,
    error: ordersError,
    mutate,
  } = useSWR<Order[]>(['orders'], fetchOrders);

  const [openCardIndex, setOpenCardIndex] = useState(-1);

  const handleCardPress = (index: number) => {
    setOpenCardIndex(index === openCardIndex ? -1 : index);
  };

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  if (ordersError) {
    return <Text>Error loading data</Text>;
  }

  if (!ordersData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={!ordersData} onRefresh={handleRefresh} />
      }>
      {ordersData['orders'].map((order: any, index: any) => (
        <OrderCard
          key={order['id']}
          order={order}
          isOpen={index === openCardIndex}
          onPress={() => handleCardPress(index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
    height: '76%',
    display: 'flex',
    flexDirection: 'column',
  },
});

export default OrdersList;
