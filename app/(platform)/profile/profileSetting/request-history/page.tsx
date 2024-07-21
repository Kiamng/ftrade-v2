"use client";
import { Separator } from "@/components/ui/separator";
import { Header } from "../_components/header";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import UserInProgressRequest from "./_components/in-progress/in-progress";
import UserDoneRequestPage from "./_components/done/done";
const RequestHistoryPage = () => {
  const session = useSession();
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
  return (
    <div className="w-full space-y-4">
      <Header title="Request history" />
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
        <UserInProgressRequest
          token={session.data?.user?.token as string}
          userId={session.data?.user?.accountId as string}
        />
      ) : (
        <UserDoneRequestPage
          token={session.data?.user?.token as string}
          userId={session.data?.user?.accountId as string}
        />
      )}
    </div>
  );
};
export default RequestHistoryPage;
