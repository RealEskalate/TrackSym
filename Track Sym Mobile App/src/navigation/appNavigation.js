import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  Avatar,
  Icon,
  Divider,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { SafeAreaView, Platform } from 'react-native';
import { HomeStackNavigator } from './homeNavigation';
import { SettingNavigator } from '../pages/settings/settingStack';
import userIDStore from '../data-management/user-id-data/userIDStore';
import { NewsNavigator } from '../pages/news/newsStack';
import { NotificationNavigator } from '../pages/notification/notificationStack';
import AboutPage from '../pages/about-page/About';
import { strings } from '../localization/localization';
import { LangContext } from '../../assets/lang/language-context';
import Ethiopia from '../pages/ethiopia-page/ethiopia';
import { ReferenceScreen } from '../pages/references';
import { HotlineScreen } from '../pages/hotlines-page';
import SymptomAnaliticsPage from '../pages/symptom-analitics';
import AsyncStorage from '@react-native-community/async-storage';

const { Navigator, Screen } = createDrawerNavigator();

const HomeIcon = (props) => <Icon {...props} name='home-outline' />;
const AnaliticsIcon = (props) => <Icon {...props} name='bar-chart-outline' />;
const NewsIcon = (props) => <Icon {...props} name='browser-outline' />;
const NotificatonIcon = (props) => <Icon {...props} name='bell-outline' />;
const InfoIcon = (props) => <Icon {...props} name='info-outline' />;
const FlagIcon = (props) => <Icon {...props} name='flag-outline' />;
const PhoneIcon = (props) => <Icon {...props} name='phone-outline' />;
const SettingIcon = (props) => <Icon {...props} name='settings-2-outline' />;
const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
const LinkIcon = (style) => <Icon {...style} name='external-link-outline' />;

export const AppNavigator = () => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const avatars = [
    require('../../assets/images/avatars/person0-10.png'),
    require('../../assets/images/avatars/person11-29.png'),
    require('../../assets/images/avatars/person30-60.png'),
    require('../../assets/images/avatars/personold.png'),
    require('../../assets/images/avatars/w_person0-10.png'),
    require('../../assets/images/avatars/w_person11-29.png'),
    require('../../assets/images/avatars/w_person30-60.png'),
    require('../../assets/images/avatars/w_personold.png'),
  ];

  const AvatarSizeShowcase = () => {
    const userGender = userIDStore.getState().gender;
    const userAgeGroup = userIDStore.getState().userAgeGroup;

    const getMyAvavtarIdx = (userAgeGroup, userGender) => {
      if (userGender === 'MALE') {
        if (userAgeGroup === '0-10') {
          return 0;
        } else if (userAgeGroup === '11-20' || userAgeGroup === '21-30') {
          return 1;
        } else if (
          userAgeGroup === '31-40' ||
          userAgeGroup === '41-50' ||
          userAgeGroup === '51-60'
        ) {
          return 2;
        } else {
          return 3;
        }
      } else {
        if (userAgeGroup === '0-10') {
          return 4;
        } else if (userAgeGroup === '11-20' || userAgeGroup === '21-30') {
          return 5;
        } else if (
          userAgeGroup === '31-40' ||
          userAgeGroup === '41-50' ||
          userAgeGroup === '51-60'
        ) {
          return 6;
        } else {
          return 7;
        }
      }
    };

    return (
      <Layout style={styles.container} level='2'>
        {userGender && userAgeGroup && (
          <Avatar
            style={styles.avatar}
            // size='giant'
            source={avatars[getMyAvavtarIdx(userAgeGroup, userGender)]}
          />
        )}
      </Layout>
    );
  };

  const Header = (props) => (
    <React.Fragment>
      <Layout level='2' style={[props.style, styles.header]}>
        <AvatarSizeShowcase />
        <Text> {userIDStore.getState().userName}</Text>
      </Layout>
      <Divider />
    </React.Fragment>
  );

  const Footer = () => (
    <React.Fragment>
      <Divider />
      <Layout level='2' style={{ padding: 10, flexDirection: 'row' }}>
        <Text appearance='hint'>{`TrackSym for ${Platform.OS} v0.1.7`}</Text>
      </Layout>
    </React.Fragment>
  );

  const DrawerContent = ({ navigation, state }) => (
    <Drawer
      header={Header}
      footer={Footer}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      <DrawerItem title={strings.Home} accessoryLeft={HomeIcon} />
      <DrawerItem
        title={strings.SymptomAnalytics}
        accessoryLeft={AnaliticsIcon}
      />
      <DrawerItem title={strings.News} accessoryLeft={NewsIcon} />
      <DrawerItem
        title={strings.Notification}
        accessoryLeft={NotificatonIcon}
      />
      <DrawerItem title={strings.Ethiopia} accessoryLeft={FlagIcon} />
      <DrawerItem title={strings.About} accessoryLeft={InfoIcon} />
      <DrawerItem title={strings.Settings} accessoryLeft={SettingIcon} />
      <DrawerItem title={strings.Hotlines} accessoryLeft={PhoneIcon} />
      <DrawerItem title={strings.References} accessoryLeft={LinkIcon} />
    </Drawer>
  );

  const GoToAboutPage = (props) => {
    const renderBackAction = () => (
      <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={props.navigation.goBack}
      />
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={strings.AboutUs}
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <AboutPage />
      </SafeAreaView>
    );
  };

  const GoToEthiopia = (props) => {
    const renderBackAction = () => (
      <TopNavigationAction
        icon={ArrowIosBackIcon}
        onPress={props.navigation.goBack}
      />
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title={strings.Ethiopia}
          alignment='center'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Ethiopia />
      </SafeAreaView>
    );
  };

  return (
    <Navigator
      initialRouteName='HOME'
      backBehavior='initialRoute'
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name='HOME' component={HomeStackNavigator} />
      <Screen name='SYMPTOM_ANALITICS' component={SymptomAnaliticsPage} />
      <Screen name='NEWS' component={NewsNavigator} />
      <Screen name='NOTIFICATION' component={NotificationNavigator} />
      <Screen name='ETHIOPIA' component={GoToEthiopia} />
      <Screen name='ABOUT' component={GoToAboutPage} />
      <Screen name='SETTINGS' component={SettingNavigator} />
      <Screen name='HOTLINES' component={HotlineScreen} />
      <Screen name='REFERENCES' component={ReferenceScreen} />
    </Navigator>
  );
};

const styles = StyleService.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: 8,
    borderRadius: 30,
    // backgroundColor: '#5DC2FA',
  },
  avatar: {
    margin: 0,
    width: 60,
    height: 60,
  },
  header: {
    height: 128,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
