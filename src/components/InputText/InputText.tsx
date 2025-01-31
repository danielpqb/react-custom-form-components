"use client";

import { useInputErrorMessages } from "@/hooks/useInputErrorMessages";
import { useParentController } from "@/hooks/useParentController";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { TInputTextProps } from "@/types/Input";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ErrorMessages } from "../common/ErrorMessages";
import { parseText } from "./functions/parseText";
import { formatText } from "./functions/formatText";
import { Label } from "../common/Label";

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
  placeholder = "Type here...",
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

  // Função que atualiza o valor recebido no formulário, atualiza o valor exibido ao usuário,
  // e executa o evento onChange
  function updateValue(formattedValue: string) {
    const parsedValue = parseText({
      formattedValue,
      multiline,
      parse,
      parser,
    });
    const formattedText = formatText({ parsedValue, format, formatter });
    field.onChange(formattedText);
    onChange && onChange(parsedValue, formattedText);
    handleErrorMessages(formattedText);
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
        disabled && "input-disabled"
      )}
    >
      <Label className={className?.label}>{label}</Label>

      <textarea
        ref={textAreaRef}
        style={{ resize: "none" }}
        rows={minRows || 1}
        placeholder={placeholder}
        className={twMerge(
          "input-base max-h-40",
          !!field.value && defaultValue !== field.value && "input-modified",
          errorMessageArray && "input-error",
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
