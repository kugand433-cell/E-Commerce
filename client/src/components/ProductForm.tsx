import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import api from "@/lib/api";

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  category: string;
  brand: string;
  tags: string[];
  specs: Record<string, string>;
  images: string[];
}

const empty: ProductFormValues = {
  title: "", description: "", price: 0, discountPrice: 0, stock: 0,
  category: "", brand: "", tags: [], specs: {}, images: [],
};

export default function ProductForm({
  initial = empty,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: ProductFormValues;
  onSubmit: (v: ProductFormValues) => Promise<void> | void;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<ProductFormValues>(initial);
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [specK, setSpecK] = useState("");
  const [specV, setSpecV] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data?.data || res.data || []);
    }).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await onSubmit(form); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Basic Info</h3>
        <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} /></Field>
        <Field label="Description"><textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inp} /></Field>
          <Field label="Category">
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
              <option value="" disabled>Select a category...</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Pricing & Stock</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (₹)"><input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className={inp} /></Field>
          <Field label="Discount Price (₹)"><input type="number" min={0} value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: +e.target.value })} className={inp} /></Field>
          <Field label="Stock"><input type="number" required min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} className={inp} /></Field>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">Images</h3>
        <div className="flex gap-2">
          <input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="Paste image URL" className={inp} />
          <button type="button" onClick={() => { if (imgUrl) { setForm({ ...form, images: [...form.images, imgUrl] }); setImgUrl(""); } }} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">In production: POST /api/upload (multipart) and store returned URLs.</p>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.images.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded border">
                <img src={src} className="h-full w-full object-cover" alt="" />
                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute right-0 top-0 rounded-bl bg-destructive p-0.5 text-destructive-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">Tags</h3>
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className={inp} />
          <button type="button" onClick={() => { if (tagInput) { setForm({ ...form, tags: [...form.tags, tagInput] }); setTagInput(""); } }} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
              {t}
              <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">Specifications</h3>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input value={specK} onChange={(e) => setSpecK(e.target.value)} placeholder="Key (e.g. RAM)" className={inp} />
          <input value={specV} onChange={(e) => setSpecV(e.target.value)} placeholder="Value (e.g. 8GB)" className={inp} />
          <button type="button" onClick={() => { if (specK && specV) { setForm({ ...form, specs: { ...form.specs, [specK]: specV } }); setSpecK(""); setSpecV(""); } }} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {Object.keys(form.specs).length > 0 && (
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(form.specs).map(([k, v]) => (
                <tr key={k} className="border-t">
                  <td className="py-1.5 font-medium text-muted-foreground">{k}</td>
                  <td className="py-1.5">{v}</td>
                  <td className="py-1.5 text-right">
                    <button type="button" onClick={() => { const s = { ...form.specs }; delete s[k]; setForm({ ...form, specs: s }); }} className="text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button disabled={busy} className="btn-orange w-full rounded-md py-2.5 text-sm disabled:opacity-60">
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-nest-orange focus:ring-2 focus:ring-nest-orange/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
