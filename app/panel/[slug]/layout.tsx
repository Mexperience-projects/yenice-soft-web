import Menu from "./menu";
import { type ReactNode } from "react";

interface _LayoutType {
  children: ReactNode;
  params: { slug: string };
  dashboard: ReactNode;
  visit: ReactNode;
  presonels: ReactNode;
  items: ReactNode;
  services: ReactNode;
}

export default function ({
  children,
  params,
  dashboard,
  visit,
  presonels,
  items,
  services,
}: _LayoutType) {
  // render content for meny
  const renderContent = async () =>
    ({
      dashboard,
      visit,
      presonels,
      items,
      services,
    })[(await params).slug];

  return (
    <div className="flex">
      <Menu />
      <main className="w-full">{renderContent()}</main>
    </div>
  );
}
