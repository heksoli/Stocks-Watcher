import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

const InputField = ({
  type = "text",
  name,
  label,
  placeholder,
  disabled,
  value,
  register,
  validation,
  error,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={cn(
          "form-input",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
