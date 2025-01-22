import { Control, useController, useForm } from "react-hook-form";

export function useReactHookForm({
  name,
  control,
}: {
  name?: string;
  control?: Control<any, any>;
}) {
  // Cria um dummy control para não dar erro, caso o react-hook-form não seja utilizado
  const { control: fakeUnusedControl } = useForm();

  const { field } = useController({
    name: name || "-",
    control: control || fakeUnusedControl,
  });

  return { field };
}
