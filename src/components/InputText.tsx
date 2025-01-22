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
import { useInputErrorMessages } from "@/hooks/useInputErrorMessages";
import { useParentController } from "@/hooks/useParentController";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { TInputTextProps } from "@/types/Input";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ErrorMessages } from "./ErrorMessages";

export function InputText({
  reactHookForm: { name, control } = {},
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
  // Referência do textarea
  const textAreaRef = useRef(null as HTMLTextAreaElement | null);

  // Controller do react-hook-form para receber o valor do input no onSubmit
  const { field } = useReactHookForm({ name, control });

  // Mensagens de erro retornadas pela função errorMessage
  const { handleErrorMessages, errorMessageArray } = useInputErrorMessages({
    errorFunc: errorFunc,
  });

  // Filtra caracteres indesejados
  function parseText(formattedValue: string) {
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

  // Formata o texto que é exibido para o usuário
  function formatText(parsedValue: string) {
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

    return parsedValue;
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

  // Atualiza o valor do campo toda vez que o value ou defaultValue mudam
  useParentController({ value, defaultValue, updateValue });

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

      <ErrorMessages
        errorMessageArray={errorMessageArray}
        className={className?.errors || {}}
      />
    </div>
  );
}
