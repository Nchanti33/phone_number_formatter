export interface PhoneNumber {
  id: number;
  inputId: number;
  input: string;
  rawInput: string;
  output: {
    ext: string;
    prefix: string;
    number: string;
  };
  isValid: boolean;
  note?: string;
}

export interface CSVRow {
  [key: string]: string;
}