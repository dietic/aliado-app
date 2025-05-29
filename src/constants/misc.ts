export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // International E.164 format
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_SPECIAL_CHARS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
export enum RegistrationStep {
  PHONE_CHECK = 1,
  SIGN_UP = 2,
}
