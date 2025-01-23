"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { InputText } from "./InputText/InputText";
import { TInputImageProps } from "@/types/Input";
import { Label } from "./common/Label";

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
        <Label className={className?.label}>{label}</Label>

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
