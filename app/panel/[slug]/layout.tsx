"use client";

import { useParams } from "next/navigation";
import Menu from "./menu";
import { type ReactNode } from "react";

interface _LayoutType {
  children: ReactNode;
  dashboard: ReactNode;
  visit: ReactNode;
  presonels: ReactNode;
  items: ReactNode;
  services: ReactNode;
}

export default function ({
  children,
  dashboard,
  visit,
  presonels,
  items,
  services,
}: _LayoutType) {
  const params = useParams();

  // render content for meny
  const renderContent = () =>
    ({
      dashboard,
      visit,
      presonels,
      items,
      services,
    })[params.slug as string];

  return (
    <div className="flex">
      <Menu />
      <main className="w-full">{renderContent()}</main>
      {/* <main className="w-full">{}</main> */}
    </div>
  );
}
