import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractMessage } from '../api/client';
import { UserPlus, Mail, Lock, User, Box } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    if (password !== confirm) {
      setErr('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, confirm);
      nav('/');
    } catch (error) {
      setErr(extractMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Box size={40} className="auth-logo" />
          <h1>StockPro</h1>
          <p>Creer votre compte</p>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <div className="input-icon">
              <User size={18} />
              <input id="name" type="text" placeholder="Jean Dupont" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon">
              <Mail size={18} />
              <input id="email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-icon">
              <Lock size={18} />
              <input id="password" type="password" placeholder="Min. 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirmer le mot de passe</label>
            <div className="input-icon">
              <Lock size={18} />
              <input id="confirm" type="password" placeholder="Retapez le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Inscription...' : <><UserPlus size={18} /> Creer un compte</>}
          </button>
        </form>

        <p className="auth-footer">
          Deja inscrit ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
