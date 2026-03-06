import { CollectionCrudPage } from "@/components/admin/collection-crud-page";
export default function AdminResultsPage() {
  return <CollectionCrudPage collection="results" title="Results" scalarFields={[{ key: "studentName", label: "Student Name" }, { key: "examType", label: "Exam Type" }, { key: "beforeScore", label: "Before Score" }, { key: "afterScore", label: "After Score" }]} />;
}
