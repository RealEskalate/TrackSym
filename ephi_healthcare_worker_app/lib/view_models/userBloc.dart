import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'userRepo.dart';
import '../models/user.dart';

class UserEvent extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

//event to trigger the sign in process
class SignInUser extends UserEvent {
  final userName;
  final password;
  SignInUser(this.userName, this.password);
  @override
  // TODO: implement props
  List<Object> get props => [userName, password];
}

class UserState extends Equatable {
  @override
  // TODO: implement props
  List<Object> get props => [];
}

//initial state
class UserNotSignedIn extends UserState {}

//when cases are being loaded
class SigningIn extends UserState {}

//when cases are loaded
class UserSignedIn extends UserState {
  final User user;
  UserSignedIn(this.user);
  @override
  // TODO: implement props
  List<Object> get props => [user];
}

//when errors happen
class UserError extends UserState {}

//our Bloc
class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepo userRepo;
  UserBloc(this.userRepo) : super(UserNotSignedIn());
  @override
  Stream<UserState> mapEventToState(UserEvent event) async* {
    // TODO: implement mapEventToState
    if (event is SignInUser) {
      yield SigningIn();
      //we fetch our cases using our api provider
      try {
        User user = userRepo.signInUser(event.userName, event.password);
        yield UserSignedIn(user);
      } catch (_) {
        yield UserError();
      }
    }
  }
}
