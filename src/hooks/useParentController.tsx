"use client";

import { useEffect } from "react";

export function useParentController({
  updateValue,
  defaultValue,
  value,
}: {
  updateValue: (value: any) => void;
  defaultValue: any;
  value: any;
}) {
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
}