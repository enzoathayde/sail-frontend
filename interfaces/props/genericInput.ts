export interface GenericInput {
  typeValue: string,
  changeFunction: (value: string) => void,
  fieldName: string,
  secureTextEntry?: boolean
}
