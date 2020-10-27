// This application is developed for ethiopian public health institute and Healthcare Workers.
// Made with ❤ since 2019 in Ethiopia, Turkey and USA by the Eskalate team.
// Eskalate LLC is a American company.
// Copyright © 2020 Eskalate. All rights reserved.
// Mobile Team

// Main Themes for Both Anroid and IOS Devices
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'view_models/caseBloc.dart';
import 'view_models/patientBloc.dart';
import 'view_models/userBloc.dart';
import 'view_models/caseRepo.dart';
import 'view_models/patientRepo.dart';
import 'view_models/userRepo.dart';

// Welcome Page
import 'pages/welcome_page/welcome.dart';

void main() => runApp(MaterialApp(
      // Sets a font as the default globally
      theme: ThemeData(fontFamily: 'Comfortaa'),
      debugShowCheckedModeBanner: false,
      home: Main(),
    ));

class Main extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
        providers: [
          BlocProvider(create: (context) => CaseBloc(CaseRepo())),
          BlocProvider(create: (context) => PatientBloc(PatientRepo())),
          BlocProvider(create: (context) => UserBloc(UserRepo()))
        ],
        child: Scaffold(
          backgroundColor: Colors.amber[50],
          body: WelcomePage(),
        ));
  }
}
