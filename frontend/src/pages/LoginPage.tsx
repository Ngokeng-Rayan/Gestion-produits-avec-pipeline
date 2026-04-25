import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractMessage } from '../api/client';
import { LogIn, Mail, Lock, Box } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch (error) {
      setErr(extractMessage(error, 'Identifiants incorrects'));
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
          <p>Connexion a votre espace</p>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-icon">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : <><LogIn size={18} /> Se connecter</>}
          </button>
        </form>

        <p className="auth-footer">
          Pas de compte ?{' '}
          <Link to="/register">Creer un compte</Link>
        </p>
      </div>
    </div>
  );
}
