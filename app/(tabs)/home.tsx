import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeRectangle from '../../components/HomeRectangle';
import HomeBubble from '../../components/HomeBubble';
import { Loan } from '../../models/Loan';

const Home = () => {
  const loans: Loan[] = [
    {
      role: 'borrower',
      userId: '1',
      amount: 3.8,
      coinType: 'ETH',
      interests: 5,
      quotas: 1,
    },
    {
      role: 'borrower',
      userId: '1',
      amount: 3.8,
      coinType: 'ETH',
      interests: 5,
      quotas: 1,
    },
    {
      role: 'borrower',
      userId: '1',
      amount: 3.8,
      coinType: 'ETH',
      interests: 5,
      quotas: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <HomeRectangle coin='ETH' balance='294.1' ars='239824' />
      <HomeBubble loans={loans} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  }
})

export default Home;