import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';

class UserRepo {
  signInUser(String username, String password) async {
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
    return response.statusCode;
  }
}
