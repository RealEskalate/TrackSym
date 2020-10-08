import '../../widgets/alreadyHaveAnAccountCheck.dart';

// import '../../widgets/roundedButton.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Components
import '../../widgets/roundedPasswordField.dart';
import '../../widgets/roundedInputField.dart';
import '../sign_in/login.dart';
import 'confirmation.dart';
import '../home/home.dart';
//import 'package:email_validator/email_validator.dart';

class CreateAccountPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provides us total height and width of our screen
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          children: <Widget>[
            SizedBox(height: size.height * 0.07),
            Center(
                child: Image.asset('assets/images/ephi.png',
                    width: 330, height: 80)),
            SizedBox(height: size.height * 0.1),
            Text('Create Account',
                textAlign: TextAlign.center,
                style: TextStyle(
                  shadows: <Shadow>[
                    Shadow(
                      offset: Offset(2.0, 2.0),
                      blurRadius: 7.0,
                      color: Color.fromARGB(45, 0, 0, 0),
                    ),
                  ],
                  color: Colors.lightGreenAccent[700],
                  fontSize: 20.0,
                )),
            SizedBox(height: size.height * 0.05),
            RoundedInputField(
              signIn: false,
              hintText: "Full Name",
              onChanged: (value) {},
            ),
            SizedBox(height: size.height * 0.02),
            RoundedInputField(
              signIn: false,
              hintText: "Email",
              onChanged: (value) {},
              icon: Icons.email,
            ),
            SizedBox(height: size.height * 0.02),
            RoundedPasswordField(onChanged: (value) {}, signIn: false),
            SizedBox(height: size.height * 0.02),
            AlreadyHaveAnAccountCheck(
                color: Colors.grey[600],
                login: false,
                press: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) {
                      return LoginPage();
                    }),
                  );
                }),
            SizedBox(height: size.height * 0.05),
            ButtonTheme(
              minWidth: size.width * 0.8,
              height: size.width * 0.13,
              child: RaisedButton(
                color: Colors.lightGreenAccent[700],
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(40)),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return ConfirmationPage();
                      },
                    ),
                  );
                },
                child: Text('CREATE ACCOUNT',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16.0,
                    )),
              ),
            ),
            SizedBox(height: size.height * 0.025),
            Image.asset(
              'assets/images/a2sv.png',
              width: size.width * 0.3,
              height: size.height * 0.1,
              fit: BoxFit.contain,
            ),
          ],
        ),
      ),
    );
  }
}