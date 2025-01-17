"use client";

import {
  cepFormatter,
  cnpjFormatter,
  cpfFormatter,
  currencyFormatter,
  danfeAccessKeyFormatter,
  phoneFormatter,
  rbnaCertificateNumberFormatter,
} from "@/functions/stringFormatter";
import { useEffect, useRef, useState } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export type TInputTextProps = {
  reactHookForm?: { name?: string; control?: Control<any, any> };
  label?: string;
  className?: {
    container?: string;
    textarea?: string;
    label?: string;
    errors?: { container?: string; span?: string };
  };
  defaultValue?: string;
  placeholder?: string;
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
  disabled?: boolean;
  value?: string;
  maxLenght?: number;
};

export function InputText({
  reactHookForm,
  label,
  className,
  defaultValue,
  onChange,
  parse,
  parser,
  formatter,
  format,
  placeholder,
  minRows,
  multiline,
  errorMessage: errorFunc,
  disabled,
  value,
  maxLenght,
}: TInputTextProps) {
  // Controller do react-hook-form para receber o valor do input no onSubmit
  // Cria um dummy control para não dar erro, caso o react-hook-form não seja utilizado
  const { control: fakeUnusedControl } = useForm();
  const { field } = useController({
    name: reactHookForm?.name || "-",
    control: reactHookForm?.control || fakeUnusedControl,
  });

  // Referência do textarea
  const textAreaRef = useRef(null as HTMLTextAreaElement | null);

  // Mensagens de erro retornadas pela função errorMessage
  const [errorMessageArray, setErrorMessageArray] = useState(
    null as null | string[]
  );
  function handleErrorMessages(fieldValue: string) {
    const errorMessage =
      errorFunc && errorFunc(fieldValue, parseText(fieldValue || ""));
    if (!errorMessage) {
      setErrorMessageArray(null);
      return;
    }
    const errorsArray = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage];
    setErrorMessageArray(errorsArray);
  }

  // Filtra caracteres indesejados
  function parseText(formattedValue: string) {
    // Remove quebras de linha
    if (!multiline) {
      formattedValue = formattedValue.replaceAll(/\n/g, "");
    }

    // Filtra o texto exibido através de uma função customizada
    if (parser) {
      formattedValue = parser(formattedValue);
    }

    // Filtra o texto exibido para cada tipo de parse
    switch (parse) {
      case "only-numbers":
        return formattedValue.replaceAll(/\D/g, "");

      default:
        return formattedValue;
    }
  }

  // Formata o texto que é exibido para o usuário
  function formatText(parsedValue: string) {
    // Formata o texto exibido através de uma função customizada
    if (formatter) {
      parsedValue = formatter(parsedValue);
    }

    // Formata o texto exibido para cada tipo de formatação
    switch (format) {
      case "currency-brl":
        return currencyFormatter(parsedValue);
      case "currency-usd":
        return currencyFormatter(parsedValue, {
          currency: "USD",
        });
      case "cpf":
        return cpfFormatter(parsedValue);
      case "cnpj":
        return cnpjFormatter(parsedValue);
      case "phone":
        return phoneFormatter(parsedValue);
      case "cep":
        return cepFormatter(parsedValue);
      case "rbna-certificate-number":
        return rbnaCertificateNumberFormatter(parsedValue);
      case "danfe-accesskey":
        return danfeAccessKeyFormatter(parsedValue);
      default:
        return parsedValue;
    }
  }

  // Função que atualiza o valor recebido no formulário, atualiza o valor exibido ao usuário,
  // e executa o evento onChange
  function updateValue(value: string) {
    const parsedValue = parseText(value || "");
    const formattedText = formatText(parsedValue);
    field.onChange(formattedText || "");
    onChange && onChange(parsedValue, formattedText);
    handleErrorMessages(formattedText || "");
  }

  // Atualiza o valor do campo toda vez que o defaultValue (controlado pelo pai) muda
  useEffect(() => {
    typeof defaultValue === "string" && updateValue(defaultValue);
  }, [defaultValue]);

  // Atualiza o valor do campo toda vez que o value (controlado pelo pai) muda
  useEffect(() => {
    typeof value === "string" && updateValue(value);
  }, [value]);

  // Redimensiona automaticamente o textarea quando o valor atualiza
  useEffect(() => {
    if (textAreaRef?.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [field.value]);

  return (
    <div
      className={twMerge(
        "flex flex-col",
        className?.container,
        disabled && "pointer-events-none [&>*:not(label)]:opacity-75"
      )}
    >
      {label && <label className={className?.label}>{label}</label>}

      <textarea
        ref={textAreaRef}
        style={{ resize: "none" }}
        rows={minRows || 1}
        placeholder={placeholder || "Digite aqui..."}
        className={twMerge(
          "w-full shadow max-h-40 p-2 rounded-md bg-white/90 backdrop-blur-sm outline-none ring-2 ring-inset ring-slate-500/60 focus:ring-slate-500/80",
          defaultValue !== field.value &&
            "ring-amber-500/60 focus:ring-amber-500/80",
          errorMessageArray && "ring-red-500/60 focus:ring-red-500/80",
          className?.textarea
        )}
        onChange={(e) => {
          updateValue(e.target.value || "");
        }}
        value={field.value}
        maxLength={maxLenght}
      />

      {errorMessageArray && (
        <div
          className={twMerge(
            "flex flex-col pt-0.5 text-red-500 font-medium text-xs",
            className?.errors?.container
          )}
        >
          {errorMessageArray.map((errorMessage, idx) => {
            return (
              <span
                key={idx}
                className={twMerge("leading-none", className?.errors?.span)}
              >
                *{errorMessage}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
