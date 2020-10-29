import 'package:ephi_healthcare_worker_app/pages/patient_registry_page/patientRegistryPage.dart';
import 'package:ephi_healthcare_worker_app/pages/profile/profilePage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'dart:ui';
import '../pages/sign_in/login.dart';
import 'hexColorGenerator.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Drawer(
      elevation: 90.0,
      child: Column(
        children: <Widget>[
          Container(color: HexColor("#0a6dc9"), child: _createHeader()),
          Container(
            child: Column(
              children: <Widget>[
                _createDrawerItem(
                    icon: Icons.person, text: 'Profile', context: context),
                _createDrawerItem(
                    icon: Icons.local_hospital,
                    text: 'Patient Registry',
                    context: context),
                _createDrawerItem(
                    icon: Icons.settings, text: 'Settings', context: context),
                // _createDrawerItem(icon: Icons.bug_report, text: 'Bug Report'),
                _createDrawerItem(
                    icon: Icons.info, text: 'About', context: context),
                _createDrawerItem(
                    icon: Icons.exit_to_app, text: 'Logout', context: context),
                SizedBox(height: size.height * 0.1),
                Column(
                  // mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text('Beta version 0.2',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 12.0,
                        )),
                    SizedBox(height: size.height * 0.01),
                    Text('Eskalate™. 2020 All Rights Reserved.',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 12.0,
                        )),
                    SizedBox(height: size.height * 0.01),
                    Image.asset(
                      'assets/images/a2sv.png',
                      width: size.width * 0.35,
                      height: size.height * 0.1,
                      fit: BoxFit.contain,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _createHeader() {
    return DrawerHeader(
      margin: EdgeInsets.zero,
      padding: EdgeInsets.all(10),
      child: Stack(
        children: <Widget>[
          Positioned(
            top: 110,
            left: 0,
            width: 310,
            height: 20,
            // Note: without ClipRect, the blur region will be expanded to full
            // size of the Image instead of custom size
            child: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 2, sigmaY: 2),
              ),
            ),
          ),
          Center(
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: <Widget>[
                SizedBox(width: 10),
                CircleAvatar(
                  backgroundImage: AssetImage('assets/images/user1.jpg'),
                  maxRadius: 30,
                ),
                SizedBox(width: 10),
                Text("Dr. Lensa Billion",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18.0))
              ])),
        ],
      ),
    );
  }
}

Widget _createDrawerItem(
    {IconData icon,
    String text,
    GestureTapCallback onTap,
    BuildContext context}) {
  return ListTile(
    title: Row(
      children: <Widget>[
        Icon(icon),
        Padding(
          padding: EdgeInsets.only(left: 8.0),
          child: Text(text, style: TextStyle(color: Colors.black)),
        )
      ],
    ),
    onTap: () async {
      switch (text) {
        case "Settings":
          break;
        case "Patient Registry":
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => PatientRegistryPage(),
            ),
          );
          break;
        case "Profile":
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProfilePage(),
            ),
          );
          break;
        case "Logout":
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.clear();
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => LoginPage(),
            ),
          );
          break;
      }
    },
  );
}
