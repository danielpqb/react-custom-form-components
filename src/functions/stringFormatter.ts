function formatText(
  maskPositionsMap: { [position: string]: string },
  cleanText: string
) {
  const maskPositionsArray = Object.keys(maskPositionsMap);

  let currentPosition = 0;
  let formattedText = "";
  maskPositionsArray.forEach((position) => {
    const positionNumber = Number(position);
    const part = cleanText.slice(currentPosition, positionNumber);
    formattedText += part;
    if (cleanText.length > positionNumber) {
      formattedText += maskPositionsMap[position];
    }
    currentPosition = positionNumber;
  });

  return formattedText;
}

export function numberFormatter(
  value: string = "",
  options: {
    locales?: "pt-BR" | "en-US";
  } = {}
) {
  const { locales = "pt-BR" } = options;

  const countDashes = (value.match(/-/g) || []).length;
  const isNegative = countDashes % 2 === 1;
  const cleanText = value.replaceAll(/\D/g, "");

  const formattedText = Intl.NumberFormat(locales, {
    style: "decimal",
    minimumFractionDigits: 4,
  }).format(Number(isNegative ? `-${cleanText}` : cleanText) / 10000);

  return formattedText;
}

export function currencyFormatter(
  value: string = "",
  options: {
    locales?: "pt-BR" | "en-US";
    currency?: "BRL" | "USD";
  } = {}
) {
  const { locales = "pt-BR", currency = "BRL" } = options;

  const countDashes = (value.match(/-/g) || []).length;
  const isNegative = countDashes % 2 === 1;
  const cleanText = value.replaceAll(/\D/g, "");

  const formattedText = Intl.NumberFormat(locales, {
    style: "currency",
    currency,
  }).format(Number(isNegative ? `-${cleanText}` : cleanText) / 100);

  return formattedText;
}

export function numberPercentFormatter(
  value: string = "",
  options: { fractionDigits?: number; maxValue?: number } = {}
) {
  const { fractionDigits = 2, maxValue = 1 } = options;

  const countDashes = (value.match(/-/g) || []).length;
  const isNegative = countDashes % 2 === 1;
  const cleanText = value.replaceAll(/\D/g, "");

  const numberValue = Math.min(
    Number(isNegative ? `-${cleanText}` : cleanText),
    maxValue * 100 * 10 ** fractionDigits
  );

  const formattedText = Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
  }).format(numberValue / (100 * 10 ** fractionDigits));

  return formattedText;
}

export function cpfFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    3: ".",
    6: ".",
    9: "-",
    11: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}

export function cnpjFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    2: ".",
    5: ".",
    8: "/",
    12: "-",
    14: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}

export function phoneFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    0: "(",
    2: ")",
    7: "-",
    11: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}

export function cepFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    5: "-",
    8: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}

export function rbnaCertificateNumberFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    3: "-",
    5: "-",
    10: "/",
    14: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}

export function danfeAccessKeyFormatter(value: string = "") {
  const onlyNumbers = value.replaceAll(/\D/g, "");

  const maskPositionsMap = {
    4: " ",
    8: " ",
    12: " ",
    16: " ",
    20: " ",
    24: " ",
    28: " ",
    32: " ",
    36: " ",
    40: " ",
    44: "",
  };

  return formatText(maskPositionsMap, onlyNumbers);
}
