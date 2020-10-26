import 'package:ephi_healthcare_worker_app/widgets/hexColorGenerator.dart';

import '../symptoms/symptom_home.dart';
import '../../widgets/blurredDrawer.dart';
import '../cases/cases.dart';
import '../people/people_home.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'homePage.dart';

// Drawer Widget
class Home extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _HomeState();
  }
}

class _HomeState extends State<Home> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    HomePage(),
    CasesList(),
    SymptomView(),
    PatientsHome()
  ];
  final List<String> _titles = ["Home", "Cases", "Symptoms", "Patients"];

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      drawerScrimColor: Colors.black.withOpacity(0.2),
      // drawerScrimColor: Colors.transparent,
      drawer: BlurredDrawer(),
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(size.height * 0.068),
        child: AppBar(
            centerTitle: true,
            elevation: 1,
            backgroundColor: Colors.white,
            iconTheme: new IconThemeData(
              color: Colors.blue,
            ),
            title: Text(
              _titles[_currentIndex],
              style: TextStyle(
                color: Colors.blue,
              ),
            ),
            actions: <Widget>[
              IconButton(
                icon: Icon(
                  Icons.refresh,
                  color: Colors.lightBlueAccent[900],
                ),
                onPressed: () {},
              )
            ]),
      ),
      body: _children[_currentIndex],
      bottomNavigationBar: SizedBox(
        height: size.height * 0.068,
        child: BottomNavigationBar(
          iconSize: size.height * 0.024,
          onTap: onTabTapped,
          type: BottomNavigationBarType.shifting,
          // this will be set when a new tab is tapped
          unselectedItemColor: Colors.grey,
          selectedItemColor: HexColor("#0a6dc9"),
          currentIndex: _currentIndex,
          items: [
            BottomNavigationBarItem(
              icon: new Icon(
                Icons.home,
              ),
              title: new Text(
                'Home',
                style: TextStyle(fontSize: 14),
              ),
            ),
            BottomNavigationBarItem(
              icon: new Icon(
                Icons.visibility,
              ),
              title: new Text(
                'Cases',
                style: TextStyle(fontSize: 14),
              ),
            ),
            BottomNavigationBarItem(
                icon: Icon(Icons.record_voice_over),
                title: Text(
                  'Symptoms',
                  style: TextStyle(fontSize: 14),
                )),
            BottomNavigationBarItem(
                icon: Icon(Icons.people),
                title: Text(
                  'Patients',
                  style: TextStyle(fontSize: 14),
                ))
          ],
        ),
      ),
    );
  }

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}
