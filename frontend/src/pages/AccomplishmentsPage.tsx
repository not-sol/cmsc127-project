import React from "react";
import { AccomplishmentForm } from "@/features/accomplishments/AccomplishmentForm";
import { AccomplishmentList } from "@/features/accomplishments/AccomplishmentList";
import { Separator } from "@/components/ui/separator";

const AccomplishmentsPage: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Faculty Accomplishment Tracker</h1>
        <p className="text-muted-foreground">
          Manage and track your professional accomplishments easily.
        </p>
      </header>
      
      <section className="space-y-6">
        <AccomplishmentForm />
      </section>
      
      <Separator />
      
      <section className="space-y-6">
        <AccomplishmentList />
      </section>
    </div>
  );
};

export default AccomplishmentsPage;
