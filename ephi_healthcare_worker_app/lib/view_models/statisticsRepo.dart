import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';
import '../models/statistics.dart';

class StatisticsRepo {
  getStatistics(String healthCareWorkerId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.StatisticsEndPoints.getTotalStats(healthCareWorkerId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      //print(" >>>>>>>>>>> " + response.body.toString());
      Statistics stat;
      if (response.statusCode == 200) {
        stat = Statistics.fromJson(json.decode(response.body));
      } else {
        //print("Status code fail " + response.statusCode.toString());
      }
      return stat;
    }
  }
}
