"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Header } from "../_components/header";
import { Separator } from "@/components/ui/separator";
import InProgressRequestPage from "./_components/in-progress";
import DoneRequestPage from "./_components/done";
const RequestFormBuyerPage = () => {
  const section = {
    InProgress: "In Progress",
    Done: "Done",
  };
  const [currentSection, setCurrentSection] = useState<string>(
    section.InProgress
  );
  const hanldeSelectSection = (sectionName: string) => {
    setCurrentSection(sectionName);
  };

  const session = useSession();

  return (
    <div className="w-full space-y-4">
      <Header title="Request from buyer" />
      <Separator />
      <Tabs defaultValue={currentSection}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            onClick={() => hanldeSelectSection(section.InProgress)}
            value={section.InProgress}
          >
            {section.InProgress}
          </TabsTrigger>
          <TabsTrigger
            onClick={() => hanldeSelectSection(section.Done)}
            value={section.Done}
          >
            {section.Done}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {currentSection === section.InProgress ? (
        <InProgressRequestPage
          token={session.data?.user?.token as string}
          userId={session.data?.user?.accountId as string}
        />
      ) : (
        <DoneRequestPage
          token={session.data?.user?.token as string}
          userId={session.data?.user?.accountId as string}
        />
      )}
    </div>
  );
};
export default RequestFormBuyerPage;
