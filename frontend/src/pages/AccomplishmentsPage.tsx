import React, { useState } from "react";
import { AccomplishmentForm } from "@/features/accomplishments/AccomplishmentForm";
import { AccomplishmentList } from "@/features/accomplishments/AccomplishmentList";
import { Separator } from "@/components/ui/separator";
import { type Accomplishment } from "@/api/accomplishments";
import Sidebar from "@/components/sidebar";

const AccomplishmentsPage: React.FC = () => {
  const [editingAccomplishment, setEditingAccomplishment] = useState<Accomplishment | null>(null);

  const handleEdit = (accomplishment: Accomplishment) => {
    setEditingAccomplishment(accomplishment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingAccomplishment(null);
  };

  const handleSuccess = () => {
    setEditingAccomplishment(null);
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="h-12 bg-[#6b0f1a] w-full" />
        <div className="container max-w-5xl mx-auto py-10 px-6 space-y-12">
          <header className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Faculty Accomplishment Tracker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Document and manage your professional achievements, conferences, and certifications in one place.
            </p>
          </header>
          
          <div className="grid grid-cols-1 gap-12">
            <section id="accomplishment-form" className="animate-in fade-in slide-in-from-top-4 duration-500">
              <AccomplishmentForm 
                editData={editingAccomplishment} 
                onCancel={handleCancelEdit}
                onSuccess={handleSuccess}
              />
            </section>
            
            <Separator className="bg-slate-200" />
            
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <AccomplishmentList onEdit={handleEdit} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccomplishmentsPage;
