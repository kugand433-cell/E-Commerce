import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import api from "@/lib/api";

const empty = {
  title: "", description: "", price: 0, discountPrice: 0, stock: 0,
  category: "", brand: "", tags: [], specs: {}, images: [],
};

const inp = {
  width: '100%', borderRadius: '6px', border: '1px solid var(--border)',
  backgroundColor: 'var(--background)', padding: '0.5rem 0.75rem', fontSize: '0.875rem',
  outline: 'none',
};

export default function ProductForm({ initial = empty, onSubmit, submitLabel = "Save" }) {
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [specK, setSpecK] = useState("");
  const [specV, setSpecV] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/categories?t=" + Date.now()).then(res => {
      console.log("Categories response:", res.data);
      setCategories(res.data?.data || res.data || []);
    }).catch((err) => {
      console.error("Categories fetch error:", err);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await onSubmit(form); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontWeight: 600 }}>Basic Info</h3>
        <Field label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inp} /></Field>
        <Field label="Description"><textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inp} /></Field>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Field label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={inp} /></Field>
          <Field label="Category">
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inp}>
              <option value="" disabled>
                {categories.length === 0 ? "No categories found..." : "Select a category..."}
              </option>
              {categories.map(c => <option key={c._id || c.name || Math.random()} value={c._id || c.name}>{c.name || JSON.stringify(c)}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontWeight: 600 }}>Pricing & Stock</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <Field label="Price (₹)"><input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} style={inp} /></Field>
          <Field label="Discount Price (₹)"><input type="number" min={0} value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: +e.target.value })} style={inp} /></Field>
          <Field label="Stock"><input type="number" required min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} style={inp} /></Field>
        </div>
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 600 }}>Images</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="Paste image URL" style={inp} />
          <button type="button" onClick={() => { if (imgUrl) { setForm({ ...form, images: [...form.images, imgUrl] }); setImgUrl(""); } }} style={{ borderRadius: '6px', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
          </button>
        </div>
        {form.images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {form.images.map((src, i) => (
              <div key={i} style={{ position: 'relative', width: '5rem', height: '5rem', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', right: 0, top: 0, borderBottomLeftRadius: '4px', backgroundColor: 'var(--destructive)', padding: '2px', color: 'var(--destructive-foreground)', border: 'none' }}>
                  <X style={{ width: 12, height: 12 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 600 }}>Tags</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" style={inp} />
          <button type="button" onClick={() => { if (tagInput) { setForm({ ...form, tags: [...form.tags, tagInput] }); setTagInput(""); } }} style={{ borderRadius: '6px', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {form.tags.map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', borderRadius: '9999px', backgroundColor: 'var(--secondary)', padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}>
              {t}
              <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><X style={{ width: 12, height: 12 }} /></button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 600 }}>Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem' }}>
          <input value={specK} onChange={(e) => setSpecK(e.target.value)} placeholder="Key (e.g. RAM)" style={inp} />
          <input value={specV} onChange={(e) => setSpecV(e.target.value)} placeholder="Value (e.g. 8GB)" style={inp} />
          <button type="button" onClick={() => { if (specK && specV) { setForm({ ...form, specs: { ...form.specs, [specK]: specV } }); setSpecK(""); setSpecV(""); } }} style={{ borderRadius: '6px', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
          </button>
        </div>
        {Object.keys(form.specs).length > 0 && (
          <table style={{ width: '100%', fontSize: '0.875rem' }}>
            <tbody>
              {Object.entries(form.specs).map(([k, v]) => (
                <tr key={k} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.375rem 0', fontWeight: 500, color: 'var(--muted-foreground)' }}>{k}</td>
                  <td style={{ padding: '0.375rem 0' }}>{v}</td>
                  <td style={{ padding: '0.375rem 0', textAlign: 'right' }}>
                    <button type="button" onClick={() => { const s = { ...form.specs }; delete s[k]; setForm({ ...form, specs: s }); }} style={{ color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button disabled={busy} className="btn-orange" style={{ width: '100%', borderRadius: '6px', padding: '0.625rem', fontSize: '0.875rem' }}>
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}
