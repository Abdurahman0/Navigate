import { CollectionCrudPage } from "@/components/admin/collection-crud-page";
export default function AdminTeachersPage() {
  return <CollectionCrudPage collection="teachers" title="Teachers" scalarFields={[{ key: "name", label: "Name" }, { key: "experience", label: "Experience" }, { key: "specialization", label: "Specialization" }]} localizedFields={[{ key: "role", label: "Role" }]} />;
}
