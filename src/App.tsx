import { useState } from "react";
import { AppShell, type Tab } from "@/components/AppShell";
import { MedsPage } from "@/components/MedsPage";
import { Onboarding } from "@/components/Onboarding";
import { TodayPage } from "@/components/TodayPage";
import { WeekPage } from "@/components/WeekPage";
import { useJournal } from "@/lib/store";

export default function App() {
  const onboardingDone = useJournal((state) => state.onboardingDone);
  const [tab, setTab] = useState<Tab>("hoy");

  if (!onboardingDone) return <Onboarding />;

  return (
    <AppShell tab={tab} onTabChange={setTab}>
      {tab === "hoy" ? <TodayPage onGoTo={setTab} /> : null}
      {tab === "semana" ? <WeekPage /> : null}
      {tab === "medicinas" ? <MedsPage /> : null}
    </AppShell>
  );
}
