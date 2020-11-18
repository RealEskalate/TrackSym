import 'package:ephi_healthcare_worker_app/widgets/hexColorGenerator.dart';
import 'package:ephi_healthcare_worker_app/widgets/inputField.dart';
import 'package:ephi_healthcare_worker_app/widgets/formRadioButton.dart';
import 'package:ephi_healthcare_worker_app/widgets/genderCard.dart';
import 'package:ephi_healthcare_worker_app/view_models/patientRegistrationBloc.dart';
import 'package:flutter/material.dart';

class PatientRegistryForm extends StatelessWidget {
  final bloc;
  PatientRegistryForm({this.bloc});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      alignment: Alignment.topCenter,
      color: HexColor("#F5F9FF"),
      child: StreamBuilder<Object>(
          stream: bloc.stepCounterStream,
          initialData: 0,
          builder: (context, snapshot) {
            return Stepper(
              steps: _mySteps(snapshot.data, size),
              currentStep: snapshot.data,
              onStepTapped: (step) {
                bloc.changeStep(step);
              },
              onStepContinue: () {
                if (snapshot.data == 0) {
                  bloc.eventSink.add(stepperValidate.PatientInfoValidate);
                }
                if (snapshot.data == 1) {
                  bloc.eventSink.add(stepperValidate.ContactValidate);
                }
                if (snapshot.data == 2) {
                  bloc.eventSink.add(stepperValidate.AddressValidate);
                }
              },
              onStepCancel: () {
                bloc.decreaseStepCounter();
              },
            );
          }),
    );
  }

  List<Step> _mySteps(int currentStep, Size size) {
    // Size size = MediaQuery.of(context).size;
    List<Step> _steps = [
      Step(
        title: Text('Patient Information'),
        subtitle: Text('Required'),
        content: Column(
          children: [
            StreamBuilder<Object>(
                stream: bloc.firstNameStream,
                builder: (context, snapshot) {
                  return FormInputField(
                    backgroundColor: Colors.grey[200],
                    width: size.width * 0.8,
                    height: size.height * 0.08,
                    text: "First Name",
                    errorText: snapshot.error,
                    onChanged: bloc.addFirstName,
                  );
                }),
            SizedBox(height: size.height * 0.02),
            StreamBuilder<Object>(
                stream: bloc.lasttNameStream,
                builder: (context, snapshot) {
                  return FormInputField(
                    backgroundColor: Colors.grey[200],
                    width: size.width * 0.8,
                    height: size.height * 0.08,
                    text: "Last Name",
                    errorText: snapshot.error,
                    onChanged: bloc.addLastName,
                  );
                }),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Date of Birth"),
            SizedBox(height: size.height * 0.02),
            StreamBuilder<Object>(
                stream: bloc.genderStream,
                builder: (context, snapshot) {
                  return StreamBuilder<Object>(
                      stream: bloc.genderStream,
                      builder: (context, snapshot) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            FormRadioButton(
                              size: size.height,
                              cards: [
                                GenderCard(
                                  index: 0,
                                  title: "Male",
                                  image: 'assets/images/male_.png',
                                  size: size.height * 0.075,
                                  isSelected: snapshot.data == 0 ? true : false,
                                  clickState: () {
                                    bloc.changeGenderCard(0);
                                  },
                                ),
                                GenderCard(
                                  index: 1,
                                  title: "Female",
                                  image: 'assets/images/female_.png',
                                  size: size.height * 0.075,
                                  isSelected: snapshot.data == 1 ? true : false,
                                  clickState: () {
                                    bloc.changeGenderCard(1);
                                  },
                                ),
                                GenderCard(
                                  index: 2,
                                  title: "Not say",
                                  image: 'assets/images/circled.png',
                                  size: size.height * 0.075,
                                  isSelected: snapshot.data == 2 ? true : false,
                                  clickState: () {
                                    bloc.changeGenderCard(2);
                                  },
                                ),
                              ],
                            ),
                            if (snapshot.hasError)
                              Text(snapshot.error,
                                  style: TextStyle(
                                    color: Colors.red,
                                    fontSize: 12.0,
                                  )),
                          ],
                        );
                      });
                }),
          ],
        ),
        isActive: currentStep >= 0,
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
                text: "Phone Number"),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Email"),
          ],
        ),
        isActive: currentStep >= 1,
      ),
      Step(
        title: Text('Address'),
        content: Column(
          children: [
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "State"),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "City"),
            SizedBox(height: size.height * 0.02),
            FormInputField(
                backgroundColor: Colors.grey[200],
                width: size.width * 0.8,
                height: size.height * 0.08,
                text: "Woreda")
          ],
        ),
        isActive: currentStep >= 2,
      )
    ];
    return _steps;
  }
}
