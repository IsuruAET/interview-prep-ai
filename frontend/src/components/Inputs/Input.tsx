import { useState, useRef, useEffect, forwardRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type InputProps<T extends FieldValues> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  name?: FieldPath<T>;
  control?: Control<T>;
};

const Input = <T extends FieldValues>({
  name,
  control,
  ...props
}: InputProps<T>) => {
  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <InputInner
            {...props}
            value={field.value ?? ""}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }

  return <InputInner {...props} />;
};

type InputInnerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  error?: string;
};

const InputInner = forwardRef<HTMLInputElement, InputInnerProps>(
  (
    {
      value,
      onChange,
      placeholder,
      label,
      type = "text",
      required = false,
      disabled = false,
      error,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isPassword = type === "password";
    const isNumber = type === "number";

    // Combine forwarded ref with internal ref
    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (!isNumber) return;

      const input = inputRef.current;
      if (!input) return;

      const handleWheel = (e: WheelEvent) => {
        if (document.activeElement === input) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      input.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        input.removeEventListener("wheel", handleWheel);
      };
    }, [isNumber]);

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
      if (isNumber) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleNumberKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    };

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div>
        {label && <label className="text-[13px] text-slate-800">{label}</label>}

        <div className="input-box">
          <input
            ref={setRefs}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none text-base text-text-primary placeholder:text-text-secondary transition-colors ${
              isNumber
                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : ""
            }`}
            value={value}
            onChange={onChange}
            onWheel={isNumber ? handleWheel : undefined}
            onKeyDown={isNumber ? handleNumberKeyDown : undefined}
            disabled={disabled}
            required={required}
            {...rest}
          />

          {isPassword && (
            <>
              {showPassword ? (
                <FaRegEye
                  size={22}
                  className="text-primary cursor-pointer shrink-0"
                  onClick={() => toggleShowPassword()}
                />
              ) : (
                <FaRegEyeSlash
                  size={22}
                  className="text-slate-400 cursor-pointer transition-colors shrink-0"
                  onClick={() => toggleShowPassword()}
                />
              )}
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

InputInner.displayName = "InputInner";

export default Input;
