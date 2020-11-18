//sample file of our case view provider
import '../models/patientCase.dart';
import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';

class CaseRepo {
  //get the details of a list of cases from backend
  getCases(String healthCareWorkerId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.CaseEndPoints.getCases(healthCareWorkerId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      List<PatientCase> caseList = [];
      if (response.statusCode == 200) {
        var caseListResponse = json.decode(response.body);
        for (int index = 0; index < caseListResponse['data'].length; index++) {
          caseList.add(PatientCase.fromJson(caseListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return caseList;
    }
  }

  //get the details of a specific case from backend
  getCaseDetails(String caseId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.CaseEndPoints.getCaseDetails(caseId), headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      ////print(response.body);
      PatientCase patientCase;
      if (response.statusCode == 200) {
        patientCase = PatientCase.fromJson(json.decode(response.body));
      } else {
        //print("Status code fail " + response.statusCode.toString());
      }
      return patientCase;
    }
  }
}
