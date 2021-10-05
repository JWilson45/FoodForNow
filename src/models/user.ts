import { ObjectId } from "mongodb";

class User {
  _id: ObjectId;
  firstname: string;
  lastname: string;
  username: string;
  displayname: string;
  password: string;
  email: string;
  sex: boolean
  gender: string;
  // profilepicture: image or some~ting?;

  constructor(_id: string, fname: string, lname: string, uname: string,
    dname: string, pw: string, email: string, sex: boolean, gender: string) {

    // Create a new objectid object from a string... good for code reuse
    this._id = new ObjectId(_id)
    this.firstname = fname
    this.lastname = lname
    this.username = uname
    this.displayname = dname
    this.password = pw
    this.email = email
    this.sex = sex
    this.gender = gender
  }

}



export default User
