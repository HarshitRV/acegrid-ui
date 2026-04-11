import { createFormHookContexts, createFormHook } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { Info } from 'lucide-react'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

type BaseFieldProps = {
  label: React.ReactNode
  placeholder?: string
  required?: boolean
}

type DescribedFieldProps = BaseFieldProps & {
  description?: React.ReactNode
}

type TextFieldProps = DescribedFieldProps & {
  type?: React.HTMLInputTypeAttribute
  autoComplete?: string
}

type TagFieldProps = BaseFieldProps

type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps = BaseFieldProps & {
  options: SelectOption[]
  groupLabel?: string
  disabled?: boolean
  info?: string
}

type NumberFieldProps = DescribedFieldProps & {
  min?: number
  max?: number
  step?: number | 'any'
}

export function TextField({
  label,
  placeholder,
  required = false,
  type = 'text',
  description,
  autoComplete,
}: TextFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
      {description && (
        <div className="text-muted-foreground text-sm">{description}</div>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function TagField({
  label,
  placeholder,
  required,
}: TagFieldProps) {
  const field = useFieldContext<string[] | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="text"
        defaultValue={field.state.value?.join(', ') || ''}
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(
            e.target.value
              ? e.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : undefined,
          )
        }
        aria-invalid={isInvalid}
        placeholder={placeholder}
        required={required}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export function SelectField({
  label,
  placeholder,
  required,
  options,
  groupLabel,
  disabled,
  info,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
        {info && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-muted-foreground size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </FieldLabel>
      <Select
        required={required}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
      >
        <SelectTrigger id={field.name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
export function NumberField({
  label,
  placeholder,
  required = false,
  description,
  min,
  max,
  step,
}: NumberFieldProps) {
  const field = useFieldContext<number | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const val = e.target.value
          field.handleChange(val === '' ? undefined : Number(val))
        }}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {description && (
        <div className="text-muted-foreground text-sm">{description}</div>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TagField,
    SelectField,
    NumberField,
  },
  formComponents: {},
})
