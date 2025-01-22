import { useState } from "react";

export function useInputErrorMessages({
  errorFunc,
}: {
  errorFunc?: (value: string) => string | string[];
}) {
  // Mensagens de erro retornadas pela função errorMessage
  const [errorMessageArray, setErrorMessageArray] = useState(
    null as null | string[]
  );

  // Função que atualiza o valor exibido ao usuário
  function handleErrorMessages(fieldValue: string) {
    const errorMessage = errorFunc && errorFunc(fieldValue);
    if (!errorMessage) {
      setErrorMessageArray(null);
      return;
    }
    const errorsArray = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];
    setErrorMessageArray(errorsArray);
  }

  return { handleErrorMessages, errorMessageArray };
}
