import { Outlet, useRouterState } from '@tanstack/react-router';
import { AppShell } from './components/layout/AppShell';

// Pages that don't need the sidebar layout
const NO_SHELL_PATHS = ['/login'];

function App() {
  const state = useRouterState();
  const path  = state.location.pathname;

  if (NO_SHELL_PATHS.some((p) => path.startsWith(p))) {
    return <Outlet />;
  }

  return <AppShell />;
}

export default App;
