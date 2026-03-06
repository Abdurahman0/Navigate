import { CollectionCrudPage } from "@/components/admin/collection-crud-page";
export default function AdminCoursesPage() {
  return <CollectionCrudPage collection="courses" title="Courses" scalarFields={[{ key: "category", label: "Category" }, { key: "duration", label: "Duration" }, { key: "level", label: "Level" }, { key: "schedule", label: "Schedule" }, { key: "price", label: "Price" }, { key: "status", label: "Status" }]} />;
}
