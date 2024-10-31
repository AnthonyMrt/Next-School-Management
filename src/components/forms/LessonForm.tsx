"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface LessonFormProps {
  type: "create" | "update";
  data?: LessonSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    teachers: { id: string; name: string }[];
  };
}

const LessonForm = ({ type, data, setOpen, relatedData }: LessonFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFormSubmit = async (formData: LessonSchema) => {
    setLoading(true);
    setErrorMessage(null);

    console.log(formData);

    try {
      const action = type === "create" ? createLesson : updateLesson;
      const response = await action({ success: false, error: false }, formData);
      if (response.success) {
        toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      } else {
        setErrorMessage(response.error as string);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        (error as Error).message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSelectField = (
    label: string,
    name: keyof LessonSchema,
    options: { id: number | string; name: string }[],
    defaultValue?: number | string
  ) => (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <select
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...register(name)}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-xs text-red-400">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );

  const formatForDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-8"
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={
            data?.startTime ? formatForDateTimeLocal(data.startTime) : undefined
          }
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />

        <InputField
          label="End Date"
          name="endTime"
          defaultValue={
            data?.endTime ? formatForDateTimeLocal(data.endTime) : undefined
          }
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />

        {relatedData && (
          <>
            {renderSelectField(
              "Subject",
              "subjectId",
              relatedData.subjects,
              data?.subjectId
            )}
            {renderSelectField(
              "Class",
              "classId",
              relatedData.classes,
              data?.classId
            )}
            {renderSelectField(
              "Teacher",
              "teacherId",
              relatedData.teachers,
              data?.teacherId
            )}
          </>
        )}
      </div>

      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-400 text-white p-2 rounded-md"
      >
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
