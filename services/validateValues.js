export function validate(values = []) {
  for (let i = 0; i < values.length; i++) {
    let mes = `Поле "${values[i].field}" не заполнено.`;
    if (
      values[i].value === "" ||
      values[i].value === null ||
      values[i].value === undefined ||
      values[i].value == "0"
    ) {
      return { isValid: false, message: mes };
    }
    if (values[i].field === "Баланс" || values[i].field === "Сумма") {
      mes = `Поле "${values[i].field}" заполнено не верно:
      * должно быть числовое значение 
      * дробная часть отделяется точкой`;
      if (isNaN(values[i].value) || String(values[i].value).includes(",")) {
        return { isValid: false, message: mes };
      }
    }
  }
  return { isValid: true, message: "" };
}
