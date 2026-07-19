import { NavLink, Outlet } from 'react-router-dom';
import { cn, Container, Switch, Typography } from '@your-org/design-system';
import { Home, User } from 'pixelarticons/react';
import { useAppState } from './AppState';
import styles from './Layout.module.css';

export function Layout() {
  const { theme, setTheme } = useAppState();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(styles.navLink, isActive && styles.navActive);

  return (
    <div className={styles.page} data-theme={theme === 'dark' ? 'dark' : undefined}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Typography as="span" variant="h6" className={styles.brand}>
            Orbit
          </Typography>

          <nav className={styles.nav}>
            <NavLink to="/" end className={linkClass}>
              <Home width={18} height={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              <User width={18} height={18} />
              <span>Profile</span>
            </NavLink>
          </nav>

          <Switch
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            label="Dark"
            labelPosition="start"
          />
        </div>
      </header>

      <Container maxWidth="md" className={styles.content}>
        <Outlet />
      </Container>
    </div>
  );
}
