//Front-end model for user.
export class User {
  name: string;
  email: string;
  password: string;
  roles: string;
  phoneNo: string;
  address: string;

  constructor(
    name: string,
    email: string,
    password: string,
    roles: string,
    phoneNo: string,
    address: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.phoneNo = phoneNo;
    this.address = address;
  }
}
