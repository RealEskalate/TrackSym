//sample file of our case view provider
import '../models/patientSymptom.dart';
import 'package:flutter/cupertino.dart';
import '../util/api_end_points.dart' as API;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:retry/retry.dart';
import 'dart:io';
import 'dart:async';

class SymptomRepo {
  //get the details of a list of symptoms from backend
  getListOfSymptoms(String healthCareWorkerId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.SymptomEndPoints.getSymptoms(healthCareWorkerId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      ////print(response.body);
      List<PatientSymptom> symptomList = [];
      var symptomListResponse = json.decode(response.body);
      if (response.statusCode == 200) {
        for (int index = 0;
            index < symptomListResponse['data'].length;
            index++) {
          //print(articlesListResponse['data'][index]['title']);
          symptomList
              .add(PatientSymptom.fromJson(symptomListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return symptomList;
    }
  }

  //get a list of current symptoms of a patient from backend
  getCurrentSymptoms(String patientId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.SymptomEndPoints.getCurrentSymptoms(patientId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      ////print(response.body);
      List<PatientSymptom> symptomList = [];
      var symptomListResponse = json.decode(response.body);
      if (response.statusCode == 200) {
        for (int index = 0;
            index < symptomListResponse['data'].length;
            index++) {
          //print(articlesListResponse['data'][index]['title']);
          symptomList
              .add(PatientSymptom.fromJson(symptomListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return symptomList;
    }
  }

  //get a list of current symptoms of a patient from backend
  getSymptomsHistory(String patientId) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (prefs.getString('Token') != null) {
      var headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + prefs.getString('Token')
      };

      var response = await retry(
        () => http
            .get(API.SymptomEndPoints.getSymptomHistory(patientId),
                headers: headers)
            .timeout(Duration(seconds: 10)),
        retryIf: (e) => e is SocketException || e is TimeoutException,
      );
      ////print(response.body);
      List<PatientSymptom> symptomList = [];
      var symptomListResponse = json.decode(response.body);
      if (response.statusCode == 200) {
        for (int index = 0;
            index < symptomListResponse['data'].length;
            index++) {
          //print(articlesListResponse['data'][index]['title']);
          symptomList
              .add(PatientSymptom.fromJson(symptomListResponse['data'][index]));
        }
      } else {
        print("Status code fail " + response.statusCode.toString());
      }
      return symptomList;
    }
  }
}
