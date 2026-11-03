import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { adminToken } from "@/lib/admin";
import PanelSkeleton from "./loading";

export const instant = false;

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto max-w-5xl">
          <Suspense fallback={<PanelSkeleton />}>
            <Gate>{children}</Gate>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function Gate({ children }: { children: ReactNode }) {
  if (!(await adminToken())) redirect("/admin/login");
  return children;
}
