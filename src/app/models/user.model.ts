// export class User {
//     userEmail: string;
//     userPhone: string;
//     userName: string;
//     userAddress: string;
//     userPass: string;
//     userPassConfirm: string;
//     agreeTOS: string;
//     roles: string;
  
//     constructor(
//       userEmail: string,
//       userPhone: string,
//       userName: string,
//       userAddress: string,
//       userPass: string,
//       userPassConfirm: string,
//       agreeTOS: string,
//       roles: string = '',
//     ) {
//       this.userEmail = userEmail;
//       this.userPhone = userPhone;
//       this.userName = userName;
//       this.userAddress = userAddress;
//       this.userPass = userPass;
//       this.userPassConfirm = userPassConfirm;
//       this.agreeTOS = agreeTOS;
//       this.roles = roles;
//     }
//   }


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
