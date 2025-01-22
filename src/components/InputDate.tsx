"use client";

import { useInputErrorMessages } from "@/hooks/useInputErrorMessages";
import { useParentController } from "@/hooks/useParentController";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { TInputDateProps } from "@/types/Input";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function InputDate({
  reactHookForm: { name, control } = {},
  label,
  className,
  defaultValue = "",
  errorMessage: errorFunc,
  onChange,
  disabled,
  value,
}: TInputDateProps) {
  // Valor exibido no formato correto (yyyy-mm-dd)
  const [currentValue, setCurrentValue] = useState("");

  // Controller do react-hook-form para receber o valor do input no onSubmit
  const { field } = useReactHookForm({ name, control });

  // Mensagens de erro retornadas pela função errorMessage
  const { handleErrorMessages, errorMessageArray } = useInputErrorMessages({
    errorFunc: errorFunc,
  });

  // Atualiza todos os valores e dispara os eventos necessários
  function updateValue(value: string) {
    field.onChange(value);
    setCurrentValue(value.split("T")[0]);
    onChange && onChange(value);
    handleErrorMessages(value);
  }

  // Atualiza o valor do campo toda vez que o value ou defaultValue mudam
  useParentController({ value, defaultValue, updateValue });

  return (
    <div
      className={twMerge(
        "flex flex-col",
        className?.container,
        disabled && "pointer-events-none [&>*:not(:first-child)]:opacity-75"
      )}
    >
      {label && <label className={className?.label}>{label}</label>}

      <input
        className={twMerge(
          "w-full shadow max-h-40 p-2 rounded-md bg-white/90 backdrop-blur-sm outline-none ring-2 ring-inset ring-slate-500/60 focus:ring-slate-500/80",
          defaultValue.split("T")[0] !== currentValue &&
            "ring-amber-500/60 focus:ring-amber-500/80",
          errorMessageArray && "ring-red-500/60 focus:ring-red-500/80",
          className?.input
        )}
        type="date"
        onChange={(e) => {
          const value = e.target.value;
          const date = new Date(value);
          const isoDate = isNaN(date.getTime()) ? "" : date.toISOString();
          updateValue(isoDate);
        }}
        value={currentValue}
      />

      {errorMessageArray && (
        <div className="flex flex-col pt-0.5">
          {errorMessageArray.map((errorMessage, idx) => {
            return (
              <span
                key={idx}
                className={twMerge(
                  "block text-xs font-medium text-red-500 leading-none",
                  className?.label
                )}
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
