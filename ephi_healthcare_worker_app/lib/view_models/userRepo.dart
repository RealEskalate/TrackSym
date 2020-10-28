import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';
import '../models/user.dart';

class UserRepo {
  signInUser(String username, String password) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    var response = await retry(
      // Make a GET request
      () => http
          .post(API.UserEndPoints.getSignInEndpoint(),
              headers: headers,
              body: json.encode({"username": username, "password": password}))
          .timeout(Duration(seconds: 10)),
      retryIf: (e) => e is SocketException || e is TimeoutException,
    );
    var responseDecoded = json.decode(response.body);
    User user;
    if (response.statusCode != 404) {
      //print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      user = User.fromJson(responseDecoded['user']);
      await prefs.setString("token", responseDecoded['token']);
    }
    return user;
  }
}
