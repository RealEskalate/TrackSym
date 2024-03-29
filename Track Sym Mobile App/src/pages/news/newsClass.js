import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  Layout,
  Input,
  Spinner,
  Icon,
  List,
  Text,
  Divider,
  TopNavigation,
  TopNavigationAction,
  Button,
} from '@ui-kitten/components';
import userIDStore from '../../data-management/user-id-data/userIDStore';
import { strings } from '../../localization/localization';
import languageStore from '../../data-management/language_data/languageStore';
import moment from 'moment';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
const SearchIcon = (props) => <Icon {...props} name='search-outline' />;

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      searchTag: '',
      searching: false,
      refreshing: false,
      page: 1,
    };
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.componentDidMount();
    });
  }

  fetchNews = (isOverride) => {
    let url = `https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/news?page=${this.state.page}`;
    if (this.state.searchTag) {
      url += `&country=${this.state.searchTag}`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          ...this.state,
          data: isOverride ? json.data : [...this.state.data, ...json.data],
          isLoading: false,
          refreshing: false,
          searching: false,
        });
      })
      .catch(() => {
        // alert('Wrong');
      });
  };

  getMyTitle = (title) => {
    var array = title.split('-');
    var _title = '';

    for (let index = 0; index < array.length - 1; index++) {
      _title += array[index];
      if (index != array.length - 2) {
        _title += '-';
      }
    }

    return _title;
  };

  getNewsDate = (date) => {
    return moment(new Date(date)).fromNow();
  };

  onSearchChange = (tag) => {
    this.setState({ searchTag: tag });
  };

  searchNews = () => {
    this.setState({ searching: this.state.searchTag !== '' }, () => {
      this.fetchNews(true);
    });
  };

  onRefreshNews = () => {
    this.setState({ refreshing: true, page: 1 }, () => {
      this.fetchNews(true);
    });
  };

  goToNews = (reference_link) => {
    if (Platform.Version > 22) {
      this.props.navigation.navigate('NewsView', { uri: reference_link });
    } else {
      Linking.openURL(reference_link);
    }
  };

  addNews = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.fetchNews(false);
    });
  };

  renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={this.props.navigation.goBack}
    />
  );

  renderFooter = () => (
    <Layout
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
      }}>
      <Spinner size='small' />
    </Layout>
  );

  componentDidMount = () => {
    this.fetchNews(false);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          alignment='center'
          title={strings.News}
          accessoryLeft={this.renderBackAction}
        />
        <Divider />
        {this.state.isLoading ? (
          <Layout
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Spinner {...this.props} size='large' />
          </Layout>
        ) : (
          <Layout style={{ flex: 1, flexDirection: 'column' }}>
            <Input
              style={{ marginHorizontal: 10, marginVertical: 5 }}
              placeholder={strings.Search}
              value={this.state.searchTag}
              accessoryLeft={SearchIcon}
              size='small'
              onSubmitEditing={() => this.searchNews()}
              returnKeyType='done'
              accessoryRight={() =>
                this.state.searching ? (
                  <Spinner {...this.props} size='small' />
                ) : (
                  <></>
                )
              }
              onChangeText={(nextValue) => this.onSearchChange(nextValue)}
            />
            <Divider />
            <List
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefreshNews()}
              data={this.state.data}
              onEndReached={this.addNews}
              onEndReachedThreshold={0.5}
              ListFooterComponent={this.renderFooter}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <>
                  <Layout style={styles.newsRow}>
                    <Image
                      source={{ uri: item.logo }}
                      resizeMethod='auto'
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 25,
                        backgroundColor: '#eee',
                      }}
                    />
                    <Layout style={{ flex: 1 }}>
                      <Layout
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text appearance='hint' category='s2'>
                          {item.source}
                        </Text>
                        <Text appearance='hint' category='s2'>
                          {this.getNewsDate(item.date)}
                        </Text>
                      </Layout>
                      <Layout>
                        <Text>{this.getMyTitle(item.title)}</Text>
                      </Layout>
                      <Layout
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}>
                        <Button
                          size='tiny'
                          onPress={() => this.goToNews(item.reference_link)}>
                          {strings.GoToNews}
                        </Button>
                      </Layout>
                    </Layout>
                  </Layout>
                  <Divider />
                </>
              )}
            />
          </Layout>
        )}
      </SafeAreaView>
    );
  }
}

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // marginBottom: 10,
  },
  newsRow: {
    flex: 1,
    padding: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
});
