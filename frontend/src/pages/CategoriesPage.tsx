import { useEffect, useState, type FormEvent } from 'react';
import { categories as catApi } from '../api/inventory';
import { extractMessage } from '../api/client';
import type { Category } from '../types/api';
import { Plus, Edit, Trash2, X, Package } from 'lucide-react';

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [err, setErr] = useState('');

  function load() {
    setLoading(true);
    catApi.list().then(setCats).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleting) return;
    try {
      await catApi.delete(deleting.id);
      setDeleting(null);
      load();
    } catch (e) {
      setErr(extractMessage(e));
    }
  }

  return (
    <div className="page-categories">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModal('create'); }}>
          <Plus size={18} /> Nouvelle categorie
        </button>
      </div>

      {err && <div className="alert alert-error">{err}<button onClick={() => setErr('')}><X size={14} /></button></div>}

      {loading
        ? <div className="page-loading"><div className="spinner" /></div>
        : cats.length === 0
          ? <div className="empty-state">Aucune categorie</div>
          : (
            <div className="cat-grid">
              {cats.map((c) => (
                <div key={c.id} className="card cat-card">
                  <div className="cat-card-header">
                    <h3>{c.name}</h3>
                    <div className="cat-card-actions">
                      <button className="btn-icon" title="Modifier" onClick={() => { setEditing(c); setModal('edit'); }}><Edit size={16} /></button>
                      <button className="btn-icon btn-icon-danger" title="Supprimer" onClick={() => setDeleting(c)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="cat-slug">{c.slug}</p>
                  {c.description && <p className="cat-desc">{c.description}</p>}
                  <div className="cat-count">
                    <Package size={16} />
                    <span>{c.products_count ?? 0} produit{(c.products_count ?? 0) !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

      {modal && (
        <CategoryModal
          mode={modal}
          category={editing}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      {deleting && (
        <div className="modal-overlay" role="button" tabIndex={0} aria-label="Fermer" onClick={() => setDeleting(null)} onKeyDown={(e) => e.key === 'Enter' && setDeleting(null)}>
          <div className="modal modal-sm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Supprimer cette categorie ?</h2>
            <p>La categorie <strong>{deleting.name}</strong> sera supprimee definitivement.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleting(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryModal({ mode, category, onClose, onSaved }: {
  mode: 'create' | 'edit';
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  function autoSlug(val: string) {
    setName(val);
    if (mode === 'create') {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      if (mode === 'edit' && category) {
        await catApi.update(category.id, { name, slug, description: description || undefined });
      } else {
        await catApi.create({ name, slug, description: description || undefined });
      }
      onSaved();
    } catch (error) {
      setErr(extractMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" role="button" tabIndex={0} aria-label="Fermer" onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Modifier la categorie' : 'Nouvelle categorie'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="cat-name">Nom *</label>
            <input id="cat-name" type="text" value={name} onChange={(e) => autoSlug(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat-slug">Slug *</label>
            <input id="cat-slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat-description">Description</label>
            <textarea id="cat-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : mode === 'edit' ? 'Modifier' : 'Creer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
