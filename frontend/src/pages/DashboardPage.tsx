import { useEffect, useState } from 'react';
import { dashboard } from '../api/inventory';
import type { DashboardStats } from '../types/api';
import { Package, DollarSign, AlertTriangle, XCircle, Tags, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!stats) return <div className="alert alert-error">Impossible de charger les statistiques</div>;

  const cards = [
    { label: 'Total Produits', value: stats.total_products, icon: <Package size={24} />, color: '#4f46e5' },
    { label: 'Valeur Totale', value: `${Number(stats.total_value).toLocaleString('fr-FR')} FCFA`, icon: <DollarSign size={24} />, color: '#059669' },
    { label: 'Quantite Totale', value: stats.total_quantity, icon: <Layers size={24} />, color: '#0891b2' },
    { label: 'Stock Bas (<10)', value: stats.low_stock_products, icon: <AlertTriangle size={24} />, color: '#d97706' },
    { label: 'Rupture de Stock', value: stats.out_of_stock_products, icon: <XCircle size={24} />, color: '#dc2626' },
    { label: 'Categories', value: stats.categories_count, icon: <Tags size={24} />, color: '#7c3aed' },
  ];

  const chartData = stats.products_by_category.map((p) => ({
    name: p.category?.name ?? 'Sans categorie',
    count: p.count,
  }));

  return (
    <div className="dashboard">
      <h1 className="page-title">Tableau de bord</h1>

      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="stat-card" style={{ borderLeftColor: c.color }}>
            <div className="stat-icon" style={{ color: c.color }}>{c.icon}</div>
            <div>
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="card chart-card">
          <h2>Produits par categorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="dashboard-lists">
        <div className="card">
          <h2>Derniers produits</h2>
          {stats.recent_products.length === 0
            ? <p className="empty-text">Aucun produit</p>
            : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Qte</th>
                    <th>Categorie</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{Number(p.price).toLocaleString('fr-FR')} FCFA</td>
                      <td>{p.quantity}</td>
                      <td>{p.category?.name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        <div className="card">
          <h2>Top valeur</h2>
          {stats.top_value_products.length === 0
            ? <p className="empty-text">Aucun produit</p>
            : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Qte</th>
                    <th>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_value_products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{Number(p.price).toLocaleString('fr-FR')} FCFA</td>
                      <td>{p.quantity}</td>
                      <td>{(Number(p.price) * p.quantity).toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
}
