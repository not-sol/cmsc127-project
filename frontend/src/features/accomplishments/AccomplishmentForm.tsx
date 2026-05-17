import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAccomplishments } from "@/hooks/use-accomplishments";
import { type Accomplishment } from "@/api/accomplishments";

const formSchema = z.object({
  activity_title: z.string().min(1, "Activity title is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  participation: z.string().optional(),
  venue: z.string().optional(),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AccomplishmentFormProps {
  editData?: Accomplishment | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const AccomplishmentForm: React.FC<AccomplishmentFormProps> = ({ 
  editData, 
  onCancel,
  onSuccess 
}) => {
  const { createAccomplishment, updateAccomplishment, isSubmitting, isUpdating } = useAccomplishments();
  
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

  useEffect(() => {
    if (editData) {
      reset({
        activity_title: editData.activity_title,
        start_date: editData.start_date,
        end_date: editData.end_date || "",
        participation: editData.participation || "",
        venue: editData.venue || "",
        remarks: editData.remarks || "",
      });
    } else {
      reset({
        activity_title: "",
        start_date: "",
        end_date: "",
        participation: "",
        venue: "",
        remarks: "",
      });
    }
  }, [editData, reset]);

  const handleSave = async (values: FormValues, status: "draft" | "submitted") => {
    try {
      if (editData) {
        await updateAccomplishment({ 
          entryId: editData.entry_id, 
          input: { ...values, status } 
        });
        alert(`Accomplishment ${status === 'draft' ? 'saved as draft' : 'updated'} successfully!`);
      } else {
        await createAccomplishment({ 
          input: values, 
          status 
        });
        alert(`Accomplishment ${status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);
        reset();
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#6b0f1a]/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-[#6b0f1a]">
          {editData ? "Edit Accomplishment" : "Add New Accomplishment"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit((values) => handleSave(values, "submitted"))}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity_title" className="text-sm font-semibold">Activity Title *</Label>
            <Input
              id="activity_title"
              {...register("activity_title")}
              placeholder="e.g. International Conference on Science"
              className="focus-visible:ring-[#6b0f1a]"
            />
            {errors.activity_title && (
              <p className="text-xs text-red-500">{errors.activity_title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-semibold">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
                className="focus-visible:ring-[#6b0f1a]"
              />
              {errors.start_date && (
                <p className="text-xs text-red-500">{errors.start_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-semibold">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
                className="focus-visible:ring-[#6b0f1a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participation" className="text-sm font-semibold">Participation</Label>
              <Input
                id="participation"
                {...register("participation")}
                placeholder="e.g. Speaker, Participant"
                className="focus-visible:ring-[#6b0f1a]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue" className="text-sm font-semibold">Venue</Label>
              <Input
                id="venue"
                {...register("venue")}
                placeholder="e.g. UP Diliman"
                className="focus-visible:ring-[#6b0f1a]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-sm font-semibold">Remarks</Label>
            <Textarea
              id="remarks"
              {...register("remarks")}
              placeholder="Any additional information..."
              className="focus-visible:ring-[#6b0f1a] min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          {editData && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleSubmit((values) => handleSave(values, "draft"))}
            disabled={isSubmitting || isUpdating}
            className="w-full sm:flex-1"
          >
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUpdating} 
            className="w-full sm:flex-1 bg-[#6b0f1a] hover:bg-[#5a0a0a]"
          >
            {isSubmitting || isUpdating ? "Saving..." : editData ? "Update" : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
