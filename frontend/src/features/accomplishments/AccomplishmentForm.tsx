import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAccomplishments } from "@/hooks/use-accomplishments";

const formSchema = z.object({
  activity_title: z.string().min(1, "Activity title is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  participation: z.string().optional(),
  venue: z.string().optional(),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AccomplishmentForm: React.FC = () => {
  const { createAccomplishment, isSubmitting, submissionError } = useAccomplishments();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity_title: "",
      start_date: "",
      end_date: "",
      participation: "",
      venue: "",
      remarks: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createAccomplishment(values);
      reset();
      alert("Accomplishment submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Accomplishment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity_title">Activity Title *</Label>
            <Input
              id="activity_title"
              {...register("activity_title")}
              placeholder="e.g. International Conference on Science"
            />
            {errors.activity_title && (
              <p className="text-sm text-red-500">{errors.activity_title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participation">Participation</Label>
            <Input
              id="participation"
              {...register("participation")}
              placeholder="e.g. Speaker, Participant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              {...register("venue")}
              placeholder="e.g. UP Diliman"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register("remarks")}
              placeholder="Any additional information..."
            />
          </div>

          {submissionError && (
            <p className="text-sm text-red-500 font-medium">
              Error: {(submissionError as Error).message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Accomplishment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
