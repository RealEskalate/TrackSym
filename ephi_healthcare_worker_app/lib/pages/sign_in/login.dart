import '../../widgets/alreadyHaveAnAccountCheck.dart';
import '../../widgets/roundedInputField.dart';
import '../../widgets/roundedPasswordField.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../home/home.dart';
import '../sign_up/createAccount.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../view_models/userBloc.dart';
import '../../view_models/userRepo.dart';
import 'package:flutter/scheduler.dart';

class LoginPage extends StatefulWidget {
  @override
  LoginPageState createState() => new LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  bool wrongCredintials = false;
  @override
  Widget build(BuildContext context) {
    // Provides us total height and width of our screen
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 25),
          children: <Widget>[
            SizedBox(height: size.height * 0.07),
            Center(
                child: Image.asset('assets/images/ephi.png',
                    width: 330, height: 80)),
            SizedBox(height: size.height * 0.1),
            Text('Sign Into Your Account',
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
            SizedBox(height: size.height * 0.05),
            RoundedInputField(
              hintText: "Email",
              controller: this.emailController,
              onChanged: (value) {},
              icon: Icons.email,
            ),
            SizedBox(height: size.height * 0.02),
            RoundedPasswordField(
                controller: this.passwordController, onChanged: (value) {}),
            // SizedBox(height: size.height * 0.02),
            // AlreadyHaveAnAccountCheck(
            //     color: Colors.grey[600],
            //     login: true,
            //     press: () {
            //       Navigator.push(
            //         context,
            //         MaterialPageRoute(builder: (context) {
            //           return CreateAccountPage();
            //         }),
            //       );
            //     }),
            SizedBox(height: size.height * 0.05),
            // SizedBox(height: size.height * 0.05),
            wrongCredintials
                ? Container(
                    height: 20,
                    child: Text(
                      "Wrong Username or password, please try again!",
                      style: TextStyle(color: Colors.red),
                    ))
                : Text(""),

            ButtonTheme(
                minWidth: size.width * 0.8,
                height: size.width * 0.13,
                child: RaisedButton(
                    color: Colors.lightBlue,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(40)),
                    onPressed: () => BlocProvider.of<UserBloc>(context).add(
                        SignInUser(
                            emailController.text,
                            passwordController
                                .text)), //triggering our bloc to start the sign in process

                    child: BlocBuilder<UserBloc, UserState>(
                        builder: (context, state) {
                      if (state is UserNotSignedIn) {
                        return Text('SIGN IN',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16.0,
                            ));
                      } else if (state is SigningIn) {
                        return Container(
                            width: size.width * 0.05,
                            height: size.width * 0.05,
                            child: Center(
                                child: CircularProgressIndicator(
                                    backgroundColor: Colors.white)));
                      } else if (state is UserSignedIn) {
                        if (state.user != null) {
                          SchedulerBinding.instance.addPostFrameCallback((_) {
                            // add your code here.
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) {
                                  return Home();
                                },
                              ),
                            );
                          });

                          return Text('Success',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16.0,
                              ));
                        }
                      }
                    }))),

            SizedBox(height: size.height * 0.075),
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
