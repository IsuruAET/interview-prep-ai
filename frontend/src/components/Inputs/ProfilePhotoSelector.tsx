import { useRef, useMemo, useEffect, type ChangeEvent } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type ProfilePhotoSelectorProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  disabled?: boolean;
};

const ProfilePhotoSelector = <T extends FieldValues>({
  name,
  control,
  disabled = false,
}: ProfilePhotoSelectorProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ProfilePhotoSelectorInner
          value={field.value ?? null}
          onChange={field.onChange}
          disabled={disabled}
        />
      )}
    />
  );
};

type ProfilePhotoSelectorInnerProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
};

const ProfilePhotoSelectorInner = ({
  value,
  onChange,
  disabled = false,
}: ProfilePhotoSelectorInnerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Derive preview URL from value
  const previewUrl = useMemo(() => {
    return value ? URL.createObjectURL(value) : null;
  }, [value]);

  // Cleanup object URL when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange?.(file);
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex justify-center mb-4 sm:mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        onClick={(e) => {
          // Prevent the click event from bubbling up
          e.stopPropagation();
        }}
        disabled={disabled}
        className="hidden"
      />

      {!value ? (
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-orange-50 rounded-full relative ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={onChooseFile}
        >
          <LuUser className="text-3xl sm:text-4xl text-orange-500" />

          <button
            type="button"
            disabled={disabled}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-linear-to-r from-orange-500/85 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[28px] sm:min-h-[32px]"
            onClick={(e) => {
              e.stopPropagation();
              onChooseFile(e);
            }}
            aria-label="Upload photo"
          >
            <LuUpload size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl ?? undefined}
            alt="profile photo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
          />
          <button
            type="button"
            disabled={disabled}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[28px] sm:min-h-[32px]"
            onClick={handleRemoveImage}
            aria-label="Remove photo"
          >
            <LuTrash size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
