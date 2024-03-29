import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../view_models/userBloc.dart';

// Login Page
import '../sign_up/createAccount.dart';
import '../sign_in/login.dart';

class WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provides us total height and width of our screen
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 40),
          children: <Widget>[
            SizedBox(height: size.height * 0.07),
            Center(
              child: Image.asset('assets/images/ephi.png',
                  width: size.height * 0.5, height: 80),
            ),
            SizedBox(height: size.height * 0.3),
            Text(' Welcome To Healthcare Worker App',
                textAlign: TextAlign.center,
                style: TextStyle(
                  shadows: <Shadow>[
                    Shadow(
                      offset: Offset(2.0, 2.0),
                      blurRadius: 7.0,
                      color: Color.fromARGB(45, 0, 0, 0),
                    ),
                  ],
                  color: Colors.lightBlueAccent,
                  fontSize: 24.0,
                )),
            SizedBox(height: size.height * 0.25),
            // ButtonTheme(
            //   minWidth: size.width * 0.8,
            //   height: size.width * 0.13,
            //   child: RaisedButton(
            //     color: Colors.lightGreenAccent[700],
            //     shape: RoundedRectangleBorder(
            //         borderRadius: BorderRadius.circular(40)),
            //     onPressed: () {
            //       Navigator.push(
            //         context,
            //         MaterialPageRoute(
            //           builder: (context) {
            //             return CreateAccountPage();
            //           },
            //         ),
            //       );
            //     },
            //     child: Text('CREATE ACCOUNT',
            //         textAlign: TextAlign.center,
            //         style: TextStyle(
            //           color: Colors.white,
            //           fontSize: 16.0,
            //         )),
            //   ),
            // ),
            // SizedBox(height: size.height * 0.02),

            // ButtonTheme(
            //   minWidth: size.width * 0.8,
            //   height: size.width * 0.13,
            //   child: RaisedButton(
            //     color: Colors.lightBlueAccent,
            //     shape: RoundedRectangleBorder(
            //         borderRadius: BorderRadius.circular(40)),
            //     onPressed: () {
            //       Navigator.push(
            //         context,
            //         MaterialPageRoute(
            //           builder: (_) => LoginPage(),
            //         ),
            //       );
            //     },
            //     child: Text('SIGN IN',
            //         textAlign: TextAlign.center,
            //         style: TextStyle(
            //           color: Colors.white,
            //           fontSize: 16.0,
            //         )),
            //   ),
            // ),
            SizedBox(height: size.height * 0.05),
            Image.asset(
              'assets/images/a2sv.png',
              width: size.width * 0.3,
              height: size.height * 0.05,
              fit: BoxFit.contain,
            ),
            // Text('Eskalate LLC™. 2020 All Rights Reserved.',
            //     textAlign: TextAlign.center,
            //     style: TextStyle(
            //       color: Colors.black,
            //       fontSize: 12.0,
            //     )),
          ],
        ),
      ),
    );
  }
}
