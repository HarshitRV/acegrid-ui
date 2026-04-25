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
import { Switch } from '#/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { Info } from 'lucide-react'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export function TextField({
  label,
  placeholder,
  required = false,
  type = 'text',
  description,
  autoComplete,
}: {
  label: React.ReactNode
  placeholder?: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
  description?: React.ReactNode
  autoComplete?: string
}) {
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
}: {
  label: React.ReactNode
  placeholder?: string
  required?: boolean
}) {
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
}: {
  label: React.ReactNode
  placeholder?: string
  required?: boolean
  options: { label: string; value: string }[]
  groupLabel?: string
  disabled?: boolean
  info?: string
}) {
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
}: {
  label: React.ReactNode
  placeholder?: string
  required?: boolean
  description?: React.ReactNode
  min?: number
  max?: number
  step?: number | 'any'
}) {
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

export function SwitchField({
  label,
  description,
}: {
  label: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation="horizontal" className="flex flex-col items-start">
      <div className="flex space-x-2">
        <Switch
          id={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
        />
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      </div>
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
    SwitchField,
  },
  formComponents: {},
})
