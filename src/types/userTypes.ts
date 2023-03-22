export interface User {
  name: {
    title: string;
    first: string;
    last: string;
  };
  username: string;
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  results?: User[];
}
