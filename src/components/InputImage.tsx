"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { InputText } from "./InputText";
import { TInputImageProps } from "@/types/Input";

export function InputImage({
  label,
  className,
  inputTextProps,
}: TInputImageProps) {
  const [url, setUrl] = useState("");

  return (
    <div
      className={twMerge(
        "flex flex-col items-center w-full",
        className?.container
      )}
    >
      <div className="pb-1 w-full">
        {label && <label className={className?.label}>{label}</label>}
        <InputText
          {...inputTextProps}
          onChange={(value, formattedValue) => {
            setUrl(formattedValue);
            inputTextProps?.onChange?.(value, formattedValue);
          }}
        />
      </div>
      <picture
        className={twMerge(
          "[&>*]:max-h-52 [&>*]:rounded-lg [&>*]:shadow flex justify-center items-center self-start",
          className?.picture
        )}
        onError={() => {
          setUrl("");
        }}
      >
        <source srcSet={url}></source>
        <img
          src=""
          alt=""
        />
      </picture>
    </div>
  );
}
