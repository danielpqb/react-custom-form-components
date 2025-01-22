import { Control } from "react-hook-form";

export type TCommonProps = {
  reactHookForm?: { name?: string; control?: Control<any, any> };
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  errorMessage?: (value: string) => string | string[];
};

export type TInputTextProps = TCommonProps & {
  className?: {
    container?: string;
    textarea?: string;
    label?: string;
    errors?: { container?: string; span?: string };
  };
  onChange?: (parsedValue: string, formattedValue: string) => void;
  parse?: "only-numbers";
  parser?: (formattedValue: string) => string;
  format?:
    | "currency-brl"
    | "currency-usd"
    | "cpf"
    | "cnpj"
    | "phone"
    | "cep"
    | "rbna-certificate-number"
    | "danfe-accesskey";
  formatter?: (parsedValue: string) => string;
  minRows?: number;
  multiline?: boolean;
  errorMessage?: (
    formattedValue: string,
    parsedValue: string
  ) => string | string[];
  maxLenght?: number;
};

export type TInputSelectAutocompleteProps = {
  reactHookForm?: { name?: string; control?: Control<any, any> };
  label?: string;
  className?: { label?: string; select?: string; container?: string };
  defaultValue?: string;
  placeholder?: string;
  items: { value: string; label: string }[];
  onSelect?: (value: string, label: string) => void;
  onChange?: (value: string, label?: string) => void;
  onClear?: () => void;
  errorMessage?: (value: string) => string | string[];
  value?: string;
  disabled?: boolean;
};

export type TInputImageProps = {
  label?: string;
  className?: {
    container?: string;
    picture?: string;
    label?: string;
  };
  inputTextProps?: TInputTextProps;
};

export type TInputDateProps = TCommonProps & {
  className?: { container?: string; input?: string; label?: string };
  onChange?: (value: string) => void;
};
