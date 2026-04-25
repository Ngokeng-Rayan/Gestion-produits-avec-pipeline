import { useEffect, useState, type FormEvent } from 'react';
import { products, categories as catApi } from '../api/inventory';
import { extractMessage } from '../api/client';
import type { Product, Category, PaginatedResponse, ProductFilters } from '../types/api';
import { Plus, Search, Edit, Trash2, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function ProductsPage() {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ per_page: 10, page: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [err, setErr] = useState('');

  function load() {
    setLoading(true);
    products.list(filters).then(setData).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filters]);
  useEffect(() => { catApi.list().then(setCats); }, []);

  function openEdit(p: Product) {
    setEditing(p);
    setModal('edit');
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await products.delete(deleting.id);
      setDeleting(null);
      load();
    } catch (e) {
      setErr(extractMessage(e));
    }
  }

  return (
    <div className="page-products">
      <div className="page-header">
        <h1 className="page-title">Produits</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModal('create'); }}>
          <Plus size={18} /> Nouveau produit
        </button>
      </div>

      <div className="toolbar">
        <div className="input-icon search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <button className={`btn btn-outline ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} /> Filtres
        </button>
      </div>

      {showFilters && (
        <div className="card filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="filter-category">Categorie</label>
              <select id="filter-category" value={filters.category_id ?? ''} onChange={(e) => setFilters({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })}>
                <option value="">Toutes</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filter-min-price">Prix min</label>
              <input id="filter-min-price" type="number" min={0} value={filters.min_price ?? ''} onChange={(e) => setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined, page: 1 })} />
            </div>
            <div className="form-group">
              <label htmlFor="filter-max-price">Prix max</label>
              <input id="filter-max-price" type="number" min={0} value={filters.max_price ?? ''} onChange={(e) => setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined, page: 1 })} />
            </div>
            <div className="form-group">
              <label htmlFor="filter-sort-by">Trier par</label>
              <select id="filter-sort-by" value={filters.sort_by ?? 'created_at'} onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as ProductFilters['sort_by'] })}>
                <option value="created_at">Date</option>
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="quantity">Quantite</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filter-sort-order">Ordre</label>
              <select id="filter-sort-order" value={filters.sort_order ?? 'desc'} onChange={(e) => setFilters({ ...filters, sort_order: e.target.value as 'asc' | 'desc' })}>
                <option value="desc">Decroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
            <div className="form-group chk">
              <label>
                <input type="checkbox" checked={!!filters.in_stock} onChange={(e) => setFilters({ ...filters, in_stock: e.target.checked || undefined, page: 1 })} />{' '}
                En stock uniquement
              </label>
            </div>
          </div>
        </div>
      )}

      {err && <div className="alert alert-error">{err}<button onClick={() => setErr('')}><X size={14} /></button></div>}

      {loading && <div className="page-loading"><div className="spinner" /></div>}
      {!loading && (!data || data.data.length === 0) && <div className="empty-state">Aucun produit trouve</div>}
      {!loading && data && data.data.length > 0 && (
            <>
              <div className="table-wrap card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Quantite</th>
                      <th>Categorie</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((p) => {
                      const rowClass = p.quantity === 0 ? 'row-danger' : p.quantity < 10 ? 'row-warn' : '';
                      const badgeClass = p.quantity === 0 ? 'badge-red' : p.quantity < 10 ? 'badge-yellow' : 'badge-green';
                      return (
                      <tr key={p.id} className={rowClass}>
                        <td className="td-name">{p.name}</td>
                        <td>{Number(p.price).toLocaleString('fr-FR')} FCFA</td>
                        <td>
                          <span className={`badge ${badgeClass}`}>
                            {p.quantity}
                          </span>
                        </td>
                        <td>{p.category?.name ?? '-'}</td>
                        <td className="td-actions">
                          <button className="btn-icon" title="Modifier" onClick={() => openEdit(p)}><Edit size={16} /></button>
                          <button className="btn-icon btn-icon-danger" title="Supprimer" onClick={() => setDeleting(p)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="pagination-info">
                  {data.from}–{data.to} sur {data.total}
                </span>
                <div className="pagination-btns">
                  <button disabled={data.current_page <= 1} onClick={() => setFilters({ ...filters, page: data.current_page - 1 })}><ChevronLeft size={18} /></button>
                  <span>{data.current_page} / {data.last_page}</span>
                  <button disabled={data.current_page >= data.last_page} onClick={() => setFilters({ ...filters, page: data.current_page + 1 })}><ChevronRight size={18} /></button>
                </div>
              </div>
            </>
      )}

      {modal && (
        <ProductModal
          mode={modal}
          product={editing}
          categories={cats}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      {deleting && (
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <dialog className="modal modal-sm" open aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Supprimer ce produit ?</h2>
            <p>Le produit <strong>{deleting.name}</strong> sera supprime definitivement.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleting(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
}

function ProductModal({ mode, product, categories, onClose, onSaved }: Readonly<{
  mode: 'create' | 'edit';
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}>) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [quantity, setQuantity] = useState(product ? String(product.quantity) : '');
  const [categoryId, setCategoryId] = useState(product?.category_id ? String(product.category_id) : '');
  const [image, setImage] = useState(product?.image ?? '');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      const body = {
        name,
        description: description || undefined,
        price: Number(price),
        quantity: Number(quantity),
        category_id: categoryId ? Number(categoryId) : null,
        image: image || undefined,
      };
      if (mode === 'edit' && product) {
        await products.update(product.id, body);
      } else {
        await products.create(body);
      }
      onSaved();
    } catch (error) {
      setErr(extractMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <dialog className="modal" open aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="prod-name">Nom *</label>
            <input id="prod-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="prod-description">Description</label>
            <textarea id="prod-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-price">Prix *</label>
              <input id="prod-price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="prod-quantity">Quantite *</label>
              <input id="prod-quantity" type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="prod-category">Categorie</label>
            <select id="prod-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Sans categorie</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="prod-image">Image (URL)</label>
            <input id="prod-image" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : mode === 'edit' ? 'Modifier' : 'Creer'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
