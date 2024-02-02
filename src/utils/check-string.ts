import { GenPassDto } from '../routes/users/dto/gen-pass.dto';
import * as bcrypt from 'bcrypt';
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(email);
}

export const genPass = (data: GenPassDto) => {
  const { name, phone, email } = data;
  const date = new Date()
    .getTime()
    .toString()
    .split('')
    .reverse()
    .join('')
    .substring(0, 3);
  const phoneNum = phone.split('').reverse().join('').substring(0, 2);
  const username = /([^@]+)/
    .exec(email)[0]
    .toUpperCase()
    .split('')
    .reverse()
    .join('')
    .substring(0, 3);
  const myArray = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '-',
    '+',
    '=',
    '{',
    '}',
    '[',
    ']',
  ];
  const randomElement1 = myArray[Math.floor(Math.random() * myArray.length)];
  const randomElement2 = myArray[Math.floor(Math.random() * myArray.length)];
  const getCharFromName = name.trim().substring(0, 2).toLowerCase();
  const allConcat =
    getCharFromName +
    phoneNum +
    randomElement1 +
    username +
    randomElement2 +
    date;

  allConcat
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
  return allConcat;
};

export const isMatchedPassword = async (
  password: string,
  hashpassword: string,
) => await bcrypt.compare(password, hashpassword);
