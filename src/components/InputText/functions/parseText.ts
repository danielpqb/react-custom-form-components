export function parseText({
  formattedValue,
  multiline,
  parse,
  parser,
}: {
  formattedValue: string;
  multiline?: boolean;
  parse?: string;
  parser?: (formattedValue: string) => string;
}) {
  // Remove quebras de linha
  if (!multiline) {
    formattedValue = formattedValue.replaceAll(/\n/g, "");
  }

  // Filtra o texto exibido para cada tipo de parse
  switch (parse) {
    case "only-numbers":
      formattedValue = formattedValue.replaceAll(/\D/g, "");
      break;
    case "positive-negative-numbers":
      const countDashes = (formattedValue.match(/-/g) || []).length;
      const isNegative = countDashes % 2 === 1;
      formattedValue = formattedValue.replaceAll(/\D/g, "");
      formattedValue = isNegative ? `-${formattedValue}` : formattedValue;
      break;
  }

  // Filtra o texto exibido através de uma função customizada
  if (parser) {
    formattedValue = parser(formattedValue);
  }

  return formattedValue;
}
