
import React from "react";
import Layout from "@/components/ui/app/layout";

export default async function MainAppPages({
  children,
}: { children: React.ReactNode; }) {
  return (
    <>
      <div className="block relative h-full flex-col items-center justify-center">
        <Layout>
          {children}
        </Layout>
      </div>
    </>
  )
}

