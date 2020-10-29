// This application is developed for ethiopian public health institute and Healthcare Workers.
// Made with ❤ since 2019 in Ethiopia, Turkey and USA by the Eskalate team.
// Eskalate LLC is a American company.
// Copyright © 2020 Eskalate. All rights reserved.
// Mobile Team

// Main Themes for Both Anroid and IOS Devices
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Welcome Page
import 'pages/welcome_page/welcome.dart';
import 'pages/home/home.dart';
import 'pages/sign_in/login.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SharedPreferences prefs = await SharedPreferences.getInstance();
  runApp(MaterialApp(
    // Sets a font as the default globally
    theme: ThemeData(fontFamily: 'Comfortaa'),
    debugShowCheckedModeBanner: false,
    home: prefs.getString("Token") != null
        ? Main(signedIn: true)
        : Main(signedIn: false),
  ));
}

class Main extends StatelessWidget {
  bool signedIn;
  Main({this.signedIn});
  //Initializing FireFlutter
  //final Future<FirebaseApp> _initialization = Firebase.initializeApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Nebeb',
        debugShowCheckedModeBanner: false,
        home: MyAppHomePage(
          signedIn: this.signedIn,
        ));
  }
}

class MyAppHomePage extends StatefulWidget {
  bool signedIn;
  MyAppHomePage({this.signedIn});
  @override
  MyAppHomePageState createState() =>
      MyAppHomePageState(signedIn: this.signedIn);
}

class MyAppHomePageState extends State<MyAppHomePage>
    with WidgetsBindingObserver {
  bool goingToMain = true;
  bool signedIn;
  MyAppHomePageState({this.signedIn});
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    Timer(
        Duration(seconds: 5),
        () => setState(() {
              goingToMain = false;
            }));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.amber[50],
      body: goingToMain
          ? WelcomePage()
          : signedIn
              ? Home()
              : LoginPage(),
    );
  }
}
