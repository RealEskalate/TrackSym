import 'package:ephi_healthcare_worker_app/widgets/hexColorGenerator.dart';
import 'package:ephi_healthcare_worker_app/widgets/inputField.dart';
import 'package:ephi_healthcare_worker_app/widgets/roundedInputField.dart';
import 'package:ephi_healthcare_worker_app/widgets/textFieldContainer.dart';
import 'package:flutter/material.dart';

class PatientRegistryPage extends StatefulWidget {
  @override
  _PatientRegistryPageState createState() => _PatientRegistryPageState();
}

class _PatientRegistryPageState extends State<PatientRegistryPage> {
  int _currentStep = 0;
  List<bool> _selections = List.generate(2, (_) => false);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(size.height * 0.068),
        child: AppBar(
          centerTitle: true,
          backgroundColor: Colors.white,
          iconTheme: new IconThemeData(
            color: Colors.blue,
          ),
          title: Text(
            "Patient Registration",
            style: TextStyle(
              color: Colors.blue,
            ),
          ),
        ),
      ),
      body: Container(
        alignment: Alignment.topCenter,
        color: HexColor("#F5F9FF"),
        child: Stepper(
          steps: _mySteps(),
          currentStep: this._currentStep,
          onStepTapped: (step) {
            setState(() {
              this._currentStep = step;
            });
          },
          onStepContinue: () {
            setState(() {
              if (this._currentStep < this._mySteps().length - 1) {
                this._currentStep = this._currentStep + 1;
              } else {
                //Logic to check if everything is completed
                print('Completed, check fields.');
              }
            });
          },
          onStepCancel: () {
            setState(() {
              if (this._currentStep > 0) {
                this._currentStep = this._currentStep - 1;
              } else {
                this._currentStep = 0;
              }
            });
          },
        ),
      ),
    );
  }

  List<Step> _mySteps() {
    Size size = MediaQuery.of(context).size;
    List<Step> _steps = [
      Step(
        title: Text('Suspect Entry'),
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Is the patient a healthcare worker?',
                style: TextStyle(fontSize: 18, color: Colors.black)),
            SizedBox(height: size.height * 0.02),
            ToggleButtons(
              borderRadius: BorderRadius.circular(15),
              // renderBorder: false,
              children: [
                Padding(
                  padding: const EdgeInsets.all(1.0),
                  child: Text(
                    'Yes',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(1.0),
                  child: Text(
                    'No',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
                // Icon(Icons.done),
                // Icon(Icons.clear),
              ],
              isSelected: _selections,
              onPressed: (int index) {
                setState(() {
                  _selections[index] = true;
                  if (index == 0) {
                    _selections[1] = false;
                  } else {
                    _selections[0] = false;
                  }
                });
              },
            ),
            SizedBox(height: size.height * 0.02),
            Text('Select all that apply',
                style: TextStyle(fontSize: 18, color: Colors.black),
                textAlign: TextAlign.left),
            Column(
              // crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: size.height * 0.04,
                  child: CheckboxListTile(
                    value: true,
                    title: Text("They are exhibiting symptoms",
                        style: TextStyle(fontSize: 14, color: Colors.black)),
                  ),
                ),
                SizedBox(
                  height: size.height * 0.04,
                  child: CheckboxListTile(
                    value: true,
                    title: Text("They have been hospitalized",
                        style: TextStyle(fontSize: 14, color: Colors.black)),
                  ),
                ),
                SizedBox(
                  height: size.height * 0.04,
                  child: CheckboxListTile(
                    value: false,
                    title: Text("They are under 18 years of age",
                        style: TextStyle(fontSize: 14, color: Colors.black)),
                  ),
                ),
              ],
            ),
          ],
        ),
        isActive: _currentStep >= 0,
      ),
      Step(
        subtitle: Text('Required'),
        title: Text('Contact Information'),
        content: Column(
          children: [
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Full Name"),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Address"),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Home Phone Number"),
          ],
        ),
        isActive: _currentStep >= 1,
      ),
      Step(
        title: Text('Patient Information'),
        content: FormInputField(
            backgroundColor: Colors.grey[200],
            width: size.width * 0.8,
            height: size.height * 0.08,
            text: "Master ID"),
        isActive: _currentStep >= 2,
      )
    ];
    return _steps;
  }
}
