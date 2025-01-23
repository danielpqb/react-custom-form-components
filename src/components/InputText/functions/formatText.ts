import {
  cepFormatter,
  cnpjFormatter,
  cpfFormatter,
  currencyFormatter,
  danfeAccessKeyFormatter,
  phoneFormatter,
  rbnaCertificateNumberFormatter,
} from "@/functions/stringFormatter";

export function formatText({
  parsedValue,
  format,
  formatter,
}: {
  parsedValue: string;
  format?: string;
  formatter?: (parsedValue: string) => string;
}) {
  // Formata o texto exibido para cada tipo de formatação
  switch (format) {
    case "currency-brl":
      parsedValue = currencyFormatter(parsedValue);
      break;
    case "currency-usd":
      parsedValue = currencyFormatter(parsedValue, {
        currency: "USD",
      });
      break;
    case "cpf":
      parsedValue = cpfFormatter(parsedValue);
      break;
    case "cnpj":
      parsedValue = cnpjFormatter(parsedValue);
      break;
    case "phone":
      parsedValue = phoneFormatter(parsedValue);
      break;
    case "cep":
      parsedValue = cepFormatter(parsedValue);
      break;
    case "rbna-certificate-number":
      parsedValue = rbnaCertificateNumberFormatter(parsedValue);
      break;
    case "danfe-accesskey":
      parsedValue = danfeAccessKeyFormatter(parsedValue);
      break;
  }

  // Formata o texto exibido através de uma função customizada
  if (formatter) {
    parsedValue = formatter(parsedValue);
  }

  return parsedValue || "";
}
