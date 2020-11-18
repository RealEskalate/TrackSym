import 'package:flutter/material.dart';

class GenderCard extends StatelessWidget {
  final String title;
  final String image;
  bool isSelected;
  final double size;
  final clickState;
  final int index;

  GenderCard(
      {Key key,
      this.title,
      this.image,
      this.isSelected,
      this.size,
      this.index,
      this.clickState})
      : super(key: key);
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: clickState,
      child: Card(
        color: isSelected == true ? Colors.blue[400] : Colors.white54,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Container(
                height: this.size,
                width: this.size,
                child: Image.asset(this.image, fit: BoxFit.fill),
              ),
              SizedBox(
                height: 2.0,
              ),
              Text(
                this.title,
                style: TextStyle(
                  fontSize: 15,
                  color: isSelected == true ? Colors.white : Colors.black,
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
