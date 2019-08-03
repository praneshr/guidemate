export enum ShortcutTypes {
  UNKNOWN = 0,
  LEFT = 1,
  VERTICAL_CENTER = 2,
  RIGHT = 3,
  TOP = 4,
  HORIZONTAL_CENTER = 5,
  BOTTOM = 6,
  CLEAR = 7,
}

export enum MessageTypes {
  UNKNOWN = 0,
  SHORTCUTS = 1,
  ADD_GUIDES = 2,
}

export enum FormInputs {
  UNKNOWN = 0,
  LEFT_MARGIN = 1,
  RIGHT_MARGIN = 2,
  TOP_MARGIN = 3,
  BOTTOM_MARGIN = 4,
  NO_OF_COLUMNS = 5,
  NO_OF_ROWS = 6,
  WIDTH = 7,
  HEIGHT = 8,
  VERTICAL_GUTTER = 9,
  HORIZONTAL_GUTTER = 10,
}

export interface FormValues {
  id: FormInputs;
  value: number;
}

export interface FormValuesAccess {
  [FormInputs: number]: string;
}
