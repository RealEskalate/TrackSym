import 'package:flutter/material.dart';
import 'package:ephi_healthcare_worker_app/widgets/genderCard.dart';

class FormRadioButton extends StatelessWidget {
  final double size;
  final List<GenderCard> cards;

  const FormRadioButton({Key key, this.size, this.cards}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Gender',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w400,
            letterSpacing: 0.5,
            color: Colors.grey[700],
          ),
        ),
        SizedBox(height: size * 0.005),
        Row(
          children: cards,
        ),
      ],
    );
  }
}
