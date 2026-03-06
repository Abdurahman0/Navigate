"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminApi, type LocalizedText } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CollectionName = "courses" | "teachers" | "results" | "testimonials";

type ScalarField = { key: string; label: string; type?: "text" | "url" | "number" };
type LocalizedField = { key: string; label: string };

type CrudPageProps = {
  collection: CollectionName;
  title: string;
  scalarFields: ScalarField[];
  localizedFields?: LocalizedField[];
};

const localizedSchema = z.object({ en: z.string().min(1), ru: z.string().min(1), uz: z.string().min(1) });

const formSchema = z.object({
  title: localizedSchema,
  description: localizedSchema,
  imageUrl: z.string().min(1),
  role: localizedSchema.optional(),
  descriptor: localizedSchema.optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  level: z.string().optional(),
  schedule: z.string().optional(),
  price: z.string().optional(),
  status: z.string().optional(),
  experience: z.string().optional(),
  studentName: z.string().optional(),
  examType: z.string().optional(),
  beforeScore: z.string().optional(),
  afterScore: z.string().optional(),
  rating: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyLocalized: LocalizedText = { en: "", ru: "", uz: "" };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function textFromUnknown(value: unknown) {
  return typeof value === "string" ? value : "";
}

function localizedFromUnknown(value: unknown): LocalizedText {
  if (!value || typeof value !== "object") return emptyLocalized;
  const v = value as Record<string, unknown>;
  return {
    en: textFromUnknown(v.en),
    ru: textFromUnknown(v.ru),
    uz: textFromUnknown(v.uz),
  };
}

function resolveImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
}

export function CollectionCrudPage({ collection, title, scalarFields, localizedFields = [] }: CrudPageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: emptyLocalized,
      description: emptyLocalized,
      imageUrl: "",
      role: emptyLocalized,
      descriptor: emptyLocalized,
      name: "",
      category: "",
      duration: "",
      level: "",
      schedule: "",
      price: "",
      status: "",
      experience: "",
      studentName: "",
      examType: "",
      beforeScore: "",
      afterScore: "",
      rating: 5,
    },
  });

  const imagePath = form.watch("imageUrl");
  const imagePreview = useMemo(() => resolveImageUrl(imagePath), [imagePath]);

  async function fetchItems() {
    const data = await adminApi.listCollection<Record<string, unknown>>(collection);
    setItems(data.items);
  }

  useEffect(() => {
    fetchItems();
  }, [collection]);

  function openCreate() {
    setEditingId(null);
    setUploadError(null);
    form.reset({
      title: emptyLocalized,
      description: emptyLocalized,
      imageUrl: "",
      role: emptyLocalized,
      descriptor: emptyLocalized,
      name: "",
      category: "",
      duration: "",
      level: "",
      schedule: "",
      price: "",
      status: "",
      experience: "",
      studentName: "",
      examType: "",
      beforeScore: "",
      afterScore: "",
      rating: 5,
    });
    setOpen(true);
  }

  function openEdit(item: Record<string, unknown>) {
    setEditingId(String(item.id));
    setUploadError(null);
    form.reset({
      title: localizedFromUnknown(item.title),
      description: localizedFromUnknown(item.description),
      imageUrl: textFromUnknown(item.imageUrl),
      role: localizedFromUnknown(item.role),
      descriptor: localizedFromUnknown(item.descriptor),
      name: textFromUnknown(item.name),
      category: textFromUnknown(item.category),
      duration: textFromUnknown(item.duration),
      level: textFromUnknown(item.level),
      schedule: textFromUnknown(item.schedule),
      price: textFromUnknown(item.price),
      status: textFromUnknown(item.status),
      experience: textFromUnknown(item.experience),
      studentName: textFromUnknown(item.studentName),
      examType: textFromUnknown(item.examType),
      beforeScore: textFromUnknown(item.beforeScore),
      afterScore: textFromUnknown(item.afterScore),
      rating: Number(item.rating ?? 5),
    });
    setOpen(true);
  }

  async function handleUpload(file: File) {
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    try {
      const response = await adminApi.uploadImage(file);
      form.setValue("imageUrl", response.path, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function onSubmit(values: FormValues) {
    const payload: Record<string, unknown> = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
    };

    for (const field of scalarFields) {
      payload[field.key] = (values as Record<string, unknown>)[field.key] ?? "";
    }

    for (const field of localizedFields) {
      payload[field.key] = (values as Record<string, unknown>)[field.key] ?? emptyLocalized;
    }

    if (editingId) {
      await adminApi.updateCollection(collection, editingId, payload);
    } else {
      await adminApi.createCollection(collection, payload);
    }

    setOpen(false);
    await fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await adminApi.deleteCollection(collection, id);
    await fetchItems();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{title}</CardTitle>
        <Button onClick={openCreate} className="cursor-pointer">Add New</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const imagePathFromItem = textFromUnknown(item.imageUrl);
                const src = resolveImageUrl(imagePathFromItem);
                return (
                  <TableRow key={String(item.id)}>
                    <TableCell>
                      {src ? (
                        <Image src={src} alt="thumbnail" width={48} height={48} className="h-12 w-12 rounded-md object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{String(item.id)}</TableCell>
                    <TableCell>{localizedFromUnknown(item.title).en}</TableCell>
                    <TableCell>{item.updatedAt ? new Date(String(item.updatedAt)).toLocaleString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(String(item.id))}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><span /></DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit item" : "Create item"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Image</FormLabel>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleUpload(file);
                  }}
                />
                <button
                  type="button"
                  className={`w-full rounded-lg border border-dashed p-5 text-left transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:bg-muted/40"} cursor-pointer`}
                  onClick={openFilePicker}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file) void handleUpload(file);
                  }}
                >
                  <p className="text-sm font-medium">Drag and drop image here</p>
                  <p className="text-xs text-muted-foreground">or click to choose file (max 5MB)</p>
                </button>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="cursor-pointer" onClick={openFilePicker}>
                    {imagePreview ? "Replace image" : "Upload image"}
                  </Button>
                </div>
                {uploading ? <p className="text-xs text-muted-foreground">Uploading...</p> : null}
                {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
                {imagePreview ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-md border bg-muted">
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                  </div>
                ) : null}
              </div>

              <Tabs defaultValue="en">
                <TabsList>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="uz">UZ</TabsTrigger>
                </TabsList>
                {(["en", "ru", "uz"] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`title.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title ({lang.toUpperCase()})</FormLabel>
                          <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`description.${lang}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description ({lang.toUpperCase()})</FormLabel>
                          <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {localizedFields.map((lf) => (
                      <FormField
                        key={`${lf.key}-${lang}`}
                        control={form.control}
                        name={`${lf.key}.${lang}` as "role.en"}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lf.label} ({lang.toUpperCase()})</FormLabel>
                            <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </TabsContent>
                ))}
              </Tabs>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {scalarFields.map((field) => (
                  <FormField
                    key={field.key}
                    control={form.control}
                    name={field.key as "name"}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl><Input type={field.type === "number" ? "number" : "text"} className="min-h-[44px]" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button type="submit" className="min-h-[44px] w-full cursor-pointer" disabled={uploading}>Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
