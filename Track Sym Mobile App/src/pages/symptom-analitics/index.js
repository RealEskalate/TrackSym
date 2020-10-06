import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import {
  TopNavigationAction,
  TopNavigation,
  Layout,
  Text,
  Icon,
  Divider,
  List,
  Autocomplete,
  AutocompleteItem,
  Card,
} from '@ui-kitten/components';

import userIDStore from '../../data-management/user-id-data/userIDStore';
import { strings } from '../../localization/localization';
import languageStore from '../../data-management/language_data/languageStore';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;

const data = {
  data: [
    { count: 43, symptom: [Object] },
    { count: 27, symptom: [Object] },
    { count: 27, symptom: [Object] },
    { count: 26, symptom: [Object] },
    { count: 20, symptom: [Object] },
    { count: 20, symptom: [Object] },
    { count: 19, symptom: [Object] },
    { count: 17, symptom: [Object] },
    { count: 14, symptom: [Object] },
    { count: 13, symptom: [Object] },
    { count: 12, symptom: [Object] },
    { count: 12, symptom: [Object] },
    { count: 11, symptom: [Object] },
    { count: 11, symptom: [Object] },
    { count: 8, symptom: [Object] },
    { count: 7, symptom: [Object] },
  ],
  total: 287,
};

const SymptomAnaliticsPage = (props) => {
  languageStore.subscribe(() => {
    strings.setLanguage(languageStore.getState());
    changeLabels();
  });

  const [data, setData] = useState([
    { index: 0, val: strings.Loading, label: strings.SymptomReportsYesterday },
    { index: 1, val: strings.Loading, label: strings.TotalSymptomReports },
    { index: 2, val: strings.Loading, label: strings.MostReportedSymptom },
  ]);

  const [mostCommonFetched, setMostCommonFetched] = useState(false);
  const [pepoleFetched, setPepoleFetched] = useState(false);
  const [search, setSearch] = useState('World');
  const [countryFilter, setCountryFilter] = useState('');
  const [countries, setCountries] = useState([]);
  const [controlCountries, setControlCountries] = useState([]);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const changeLabels = async () => {
    await setData((data) =>
      data.map((d) => {
        switch (d.index) {
          case 0:
            return {
              ...d,
              val: strings.Loading,
              label: strings.TotalSymptomReports,
            };
          case 1:
            return {
              ...d,
              val: strings.Loading,
              label: strings.SymptomReportsYesterday,
            };
          case 2:
            return { ...d, label: strings.SymptomReportsToCOVIDCases };
          case 3:
            return {
              ...d,
              val: strings.Loading,
              label: strings.MostReportedSymptom,
            };
        }
      })
    );
  };

  const fetchMostCommon = async (filter) => {
    setMostCommonFetched(false);
    let url =
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/';
    if (filter && filter !== 'World') {
      url += `?country=${filter}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const json = await response.json();

        setData((data) =>
          data.map((d) => {
            if (d.index === 2) {
              return {
                ...d,
                val: json.data[0]
                  ? json.data[0].symptom.name
                  : strings.NoSymptomYet,
                percent: json.data[0]
                  ? ((json.data[0].count / json.total) * 100).toFixed(2)
                  : '',
              };
            } else if (d.index === 0) {
              return {
                ...d,
                val: json.total,
              };
            }
            return d;
          })
        );
        setMostCommonFetched(true);
      }
    } catch (error) {}
  };

  const fetchPeopleStat = async (filter) => {
    let url =
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/people';
    if (filter && filter !== 'World') {
      url += `?country=${filter}`;
    }

    setPepoleFetched(false);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const json = await response.json();
        setData((data) =>
          data.map((d) => {
            if (d.index === 1) {
              return { ...d, val: json.result };
            }
            return d;
          })
        );
        setPepoleFetched(true);
      }
    } catch (error) {
      console.log(error);
      setPepoleFetched(true);
    }
  };

  const getCountryList = async () => {
    try {
      const response = await fetch(
        'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics/countries',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + userIDStore.getState().userToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        setCountries(json);
        setControlCountries(json);
      }
    } catch (error) {}
  };

  const handleTextChange = (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase());

  useEffect(() => {
    getCountryList();
    fetchMostCommon(countryFilter);
    fetchPeopleStat(countryFilter);
  }, [countryFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title={strings.SymptomAnalytics}
        alignment='center'
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <Autocomplete
          style={{ paddingTop: 5, marginHorizontal: 10 }}
          placeholder={strings.EnterCountry}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setCountries(
              controlCountries.filter((item) => handleTextChange(item, text))
            );
          }}
          onSelect={(index) => {
            setCountryFilter(countries[index].name);
            setSearch(countries[index].name);
          }}>
          {countries.map((item, index) => (
            <AutocompleteItem
              key={index}
              title={item.name}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
            />
          ))}
        </Autocomplete>

        <List
          style={{ flex: 1, paddingTop: 5 }}
          data={data}
          refreshing={!mostCommonFetched && !pepoleFetched}
          onRefresh={() => {
            fetchMostCommon(countryFilter);
            fetchPeopleStat(countryFilter);
          }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, _ }) => (
            <Card level='1' style={styles.card} disabled>
              <Layout style={styles.layout}>
                <Text style={styles.number}>{item.val}</Text>
                {item.percent && (
                  <Text
                    category='h5'
                    appearance='hint'>{`${item.percent}%`}</Text>
                )}
                <Text appearance='hint'>{item.label}</Text>
              </Layout>
            </Card>
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default SymptomAnaliticsPage;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 45,
    // marginBottom: 10,
    // fontWeight: 'bold',
  },
  screen: { flex: 1 },
});
