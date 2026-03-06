import { CollectionCrudPage } from "@/components/admin/collection-crud-page";
export default function AdminTestimonialsPage() {
  return <CollectionCrudPage collection="testimonials" title="Testimonials" scalarFields={[{ key: "name", label: "Name" }, { key: "rating", label: "Rating", type: "number" }]} localizedFields={[{ key: "descriptor", label: "Descriptor" }]} />;
}
