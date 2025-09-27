import {Controller} from "react-hook-form";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  error,
  control,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-600">
              {options.map((option) => (
                <SelectItem
                  value={option.value}
                  key={option.value}
                  className="focus:bg-gray-700 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default SelectField;
