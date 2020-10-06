import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  IndexPath,
  Layout,
  Select,
  SelectItem,
  Spinner,
} from '@ui-kitten/components';
import { PieChart } from 'react-native-chart-kit';
import userIDStore from '../../data-management/user-id-data/userIDStore';

const screenWidth = Dimensions.get('window').width;
const keys = ['confirmed', 'recovered', 'active', 'deaths'];
const RegionalStat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [key, setkey] = useState('confirmed');

  useEffect(() => {
    const fetchAboutEthiopia = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/ethiopia`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + userIDStore.getState().userToken,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const colors = [
            '#fdd835',
            '#9999ff',
            '#c158dc',
            '#43a047',
            '#fb8c00',
            '#3949ab',
            '#ff6f60',
            '#039be5',
            '#9c786c',
            '#808080',
            '#4d2600',
            '#a67b34',
          ];

          const _data = result.map((item, index) => {
            return {
              name: item.region,
              color: colors[index % colors.length],
              legendFontColor: '#7F7F7F',
              legendFontSize: 10,
              confirmed: parseInt(item.total.confirmed),
              active: parseInt(item.total.active),
              deaths: parseInt(item.total.deaths),
              recovered: parseInt(item.total.recovered),
            };
          });

          setData(
            _data.filter((item) => item.name !== '' && item.name !== 'Ethiopia')
          );
          setLoading(false);
        }
      } catch (error) {}
    };

    fetchAboutEthiopia();
  }, []);

  const onSelect = (index) => {
    setkey(keys[index]);
  };

  return (
    <>
      <AppSelect onSelect={onSelect} />

      {data.length > 0 && (
        <PieChart
          data={data}
          width={screenWidth - 10}
          height={255}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: '#08130D',
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false, // optional
          }}
          accessor={key}
          backgroundColor='transparent'
          paddingLeft='15'
        />
      )}

      {loading && (
        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 255,
          }}>
          <Spinner status='primary' size='large' />
        </Layout>
      )}
    </>
  );
};

export default RegionalStat;

const AppSelect = ({ onSelect }) => {
  const data = [
    'Confirmed Cases',
    'Recovery Count',
    'Active Cases',
    'Death Count',
  ];
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const display = data[selectedIndex.row];

  return (
    <Layout style={styles.container} level='1'>
      <Select
        selectedIndex={selectedIndex}
        value={display}
        onSelect={(index) => {
          setSelectedIndex(index);
          onSelect(index.row);
        }}>
        {data.map((item, index) => (
          <SelectItem title={item} key={index} />
        ))}
      </Select>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth - 20,
    // minHeight: 128,
  },
});
