export type AdminFormProps<TFormValues> = {
  onSubmit: (value: TFormValues) => void
  formId: string
  formValues?: TFormValues
}
