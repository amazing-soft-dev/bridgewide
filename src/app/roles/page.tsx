import { RolesClose } from "@/components/roles/RolesClose";
import { RolesExplorer } from "@/components/roles/RolesExplorer";
import { RolesHero } from "@/components/roles/RolesHero";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Roles",
  description:
    "Open software engineering roles across the USA, Canada, Latin America, and Europe. Salary on every role, and a named consultant behind each one.",
  path: "/roles",
});

export default function RolesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Roles", path: "/roles" }])} />
      <RolesHero />
      <RolesExplorer />
      <RolesClose />
    </>
  );
}
