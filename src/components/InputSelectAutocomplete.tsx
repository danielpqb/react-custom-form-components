"use client";

import { HiXMark } from "react-icons/hi2";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TInputSelectAutocompleteProps } from "@/types/Input";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useInputErrorMessages } from "@/hooks/useInputErrorMessages";
import { useParentController } from "@/hooks/useParentController";

export function InputSelectAutocomplete({
  reactHookForm: { name, control } = {},
  label,
  className,
  defaultValue,
  placeholder,
  items,
  onSelect,
  onChange,
  onClear,
  errorMessage: errorFunc,
  value,
  disabled,
}: TInputSelectAutocompleteProps) {
  // Armazena o texto digitado pelo usuário
  const [searchTerm, setSearchTerm] = useState("");

  // Controla se o select está aberto ou fechado
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Identifica se o clique do usuário está sendo em um item da lista ou fora dela
  const [isClickingOnItem, setIsClickingOnItem] = useState(false);

  // Controller do react-hook-form para receber o valor do input no onSubmit
  const { field } = useReactHookForm({ name, control });

  // Mensagens de erro retornadas pela função errorMessage
  const { handleErrorMessages, errorMessageArray } = useInputErrorMessages({
    errorFunc: errorFunc,
  });

  // Atualiza todos os valores e dispara os eventos necessários
  function updateValue(value: string) {
    const itemLabel = items.find((item) => item.value === value)?.label || "";
    setSearchTerm(itemLabel);
    field.onChange(value);
    onChange && onChange(value, itemLabel);
    handleErrorMessages(value);
  }

  // Atualiza o valor do campo toda vez que o value ou defaultValue mudam
  useParentController({ value, defaultValue, updateValue });

  // Filtra os itens de acordo com o texto digitado pelo usuário
  // Se já houver um item selecionado, não filtra
  const filteredItems = field.value
    ? items
    : items.filter((item) => {
        return item.label.toLowerCase().includes(searchTerm.toLowerCase());
      });

  return (
    <div
      className={twMerge(
        "w-full",
        className?.container,
        disabled && "pointer-events-none opacity-80"
      )}
    >
      {label && <label className={className?.label}>{label}</label>}

      <div
        className={twMerge(
          "flex flex-col shadow rounded-md bg-white/90 backdrop-blur-sm outline-none",
          "ring-2 ring-inset ring-slate-500/60 overflow-hidden divide-y-2 divide-slate-500/10",
          isSelectOpen && "ring-slate-500/80",
          defaultValue !== field.value &&
            (isSelectOpen ? "ring-amber-500/80" : "ring-amber-500/60"),
          errorMessageArray &&
            (isSelectOpen ? "ring-red-500/80" : "ring-red-500/60")
        )}
      >
        <div
          className={twMerge(
            "flex relative items-center",
            isSelectOpen && "z-50"
          )}
        >
          <input
            placeholder={placeholder ?? "Digite para buscar"}
            value={searchTerm}
            className="cursor-text bg-transparent text-sm rounded-t-lg block w-full p-2"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              field.onChange("");
              setIsSelectOpen(true);
              onChange && onChange("");
              handleErrorMessages("");
            }}
            onFocus={() => {
              setIsSelectOpen(true);
            }}
            onBlur={() => {
              if (!isClickingOnItem) {
                setIsSelectOpen(false);
              }
            }}
          />
          {field.value && (
            <HiXMark
              className="absolute right-2 size-[1.2em] cursor-pointer hover:opacity-60 active:scale-90"
              onClick={() => {
                field.onChange("");
                setSearchTerm("");
                onClear && onClear();
                onChange && onChange("");
                setIsSelectOpen(false);
                handleErrorMessages("");
              }}
            />
          )}
        </div>
        {isSelectOpen && (
          <ul
            className={twMerge(
              "flex flex-col max-h-[30vh] overflow-y-auto text-sm z-50"
            )}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className="hover:bg-slate-500/10 px-2 py-1 cursor-pointer"
                    onMouseDown={() => {
                      setIsClickingOnItem(true);
                    }}
                    onMouseLeave={() => {
                      setIsClickingOnItem(false);
                    }}
                    onClick={() => {
                      field.onChange(item.value);
                      setSearchTerm(item.label);
                      setIsSelectOpen(false);
                      onChange && onChange(item.value, item.label);
                      onSelect && onSelect(item.value, item.label);
                      setIsClickingOnItem(false);
                      handleErrorMessages(item.value);
                    }}
                  >
                    {item.label}
                  </li>
                );
              })
            ) : (
              <li className="px-2 py-1 opacity-70">Nenhum valor encontrado</li>
            )}
          </ul>
        )}
      </div>

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
