"use client";

import { HiXMark } from "react-icons/hi2";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TInputSelectAutocompleteProps } from "@/types/Input";
import { useReactHookForm } from "@/hooks/useReactHookForm";
import { useInputErrorMessages } from "@/hooks/useInputErrorMessages";
import { useParentController } from "@/hooks/useParentController";
import { ErrorMessages } from "./common/ErrorMessages";
import { Label } from "./common/Label";

export function InputSelectAutocomplete({
  reactHookForm: { name, control } = {},
  label,
  noDataFoundMessage,
  className,
  defaultValue,
  placeholder = "Type to search...",
  items,
  onSelect,
  onChange,
  onClear,
  transformItems,
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
        disabled && "input-disabled"
      )}
    >
      <Label className={className?.label}>{label}</Label>

      <div
        className={twMerge(
          "input-base !p-0 flex flex-col overflow-hidden divide-y-2 divide-slate-500/10",
          !!field.value && defaultValue !== field.value && "input-modified",
          errorMessageArray && "input-error",
          isSelectOpen && "!ring-opacity-80",
          className?.inputSelectContainer?.container
        )}
      >
        <div
          className={twMerge(
            "flex relative items-center",
            isSelectOpen && "z-50",
            className?.inputSelectContainer?.inputContainer
          )}
        >
          <input
            placeholder={placeholder}
            value={searchTerm}
            className={twMerge(
              "cursor-text bg-transparent rounded-t-lg block w-full p-2",
              className?.inputSelectContainer?.input
            )}
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
                if (!field.value) {
                  setSearchTerm("");
                }
              }
            }}
          />
          {field.value && (
            <HiXMark
              className={twMerge(
                "absolute right-2 size-[1.2em] cursor-pointer hover:opacity-60 active:scale-90",
                className?.inputSelectContainer?.xIcon
              )}
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
              "flex flex-col max-h-[30vh] overflow-y-auto text-sm z-50",
              className?.inputSelectContainer?.ul
            )}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className={twMerge(
                      "hover:bg-slate-500/10 px-2 py-1 cursor-pointer",
                      className?.inputSelectContainer?.li?.common
                    )}
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
                    {transformItems?.[item.value] || item.label}
                  </li>
                );
              })
            ) : (
              <li
                className={twMerge(
                  "px-2 py-1 opacity-70",
                  className?.inputSelectContainer?.li?.common,
                  className?.inputSelectContainer?.li?.noDataFound
                )}
              >
                {noDataFoundMessage || "No data found"}
              </li>
            )}
          </ul>
        )}
      </div>

      <ErrorMessages
        errorMessageArray={errorMessageArray}
        className={className?.errors || {}}
      />
    </div>
  );
}
