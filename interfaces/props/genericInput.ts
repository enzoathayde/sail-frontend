export interface GenericInput {
  typeValue: string,
  changeFunction: (value: string) => void,
  fieldName: string,
  secureTextEntry?: boolean,
  maskFunction?: (raw: string) => string
}
