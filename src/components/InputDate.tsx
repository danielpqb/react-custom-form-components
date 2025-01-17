"use client";

import { useEffect, useState } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type TProps = {
  name?: string;
  control?: Control<any, any>;
  label?: string;
  className?: { container?: string; input?: string; label?: string };
  defaultValue?: string;
  errorMessage?: (value: string) => string | string[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  value?: string;
};
export function InputDate({
  name,
  control,
  label,
  className,
  defaultValue = "",
  errorMessage: errorFunc,
  onChange,
  disabled,
  value,
}: TProps) {
  // Valor necessário para o input exibir o valor correto (yyyy-mm-dd)
  const [currentValue, setCurrentValue] = useState("");

  // Controller do react-hook-form para receber o valor do input no onSubmit
  // Cria um dummy control para não dar erro, caso o react-hook-form não seja utilizado
  const { control: fakeUnusedControl } = useForm();
  const { field } = useController({
    name: name || "-",
    control: control || fakeUnusedControl,
  });

  // Mensagens de erro retornadas pela função errorMessage
  const [errorMessageArray, setErrorMessageArray] = useState(
    null as null | string[]
  );
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

  // Função que atualiza o valor recebido no formulário, atualiza o valor exibido ao usuário,
  // e executa o evento onChange
  function updateValue(value: string) {
    field.onChange(value);
    onChange && onChange(value);
    setCurrentValue(value.split("T")[0]);
    handleErrorMessages(value);
  }

  // Atualiza o valor do campo toda vez que o defaultValue muda
  useEffect(() => {
    if (defaultValue) {
      updateValue(defaultValue);
    }
  }, [defaultValue]);

  // Atualiza o valor do campo toda vez que o value (controlado pelo pai) muda
  useEffect(() => {
    if (value) {
      updateValue(value);
    }
  }, [value]);

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
