import { Route } from 'react-router-dom';
import Drawer from './components/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';
import { AuthenticationGuard } from './components/AuthenticationGuard';
import Landing from './pages/Landing';
import Connections from './pages/Connections';
import { useAuth0 } from '@auth0/auth0-react';
import Mappings from './pages/Mappings';
import NotFound from './pages/NotFound';
import LayersIcon from '@mui/icons-material/Layers';
import { FaroRoutes } from '@grafana/faro-react';

const menuRoutes: any = [
  {
    name: "Home",
    path:"/",
    element:<AuthenticationGuard component={Landing} />,
    icon: <HomeIcon />
  },
  {
    name: "Mappings",
    path:"/mappings",
    element:<AuthenticationGuard component={Mappings} />,
    icon: <LayersIcon />
  },
  {
    name: "Connections",
    path:"/connections",
    element:<AuthenticationGuard component={Connections} />,
    icon: <LinkIcon />
  }
]

function App() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return "loading";
  }
  return (
    <>
        <Drawer routes={menuRoutes}>
        <FaroRoutes>
            { menuRoutes.map((route:any) => (<Route {...route} />))}
            <Route path="*" element={<AuthenticationGuard component={NotFound} />} />
          </FaroRoutes>
        </Drawer>
    </>
  );
}

export default App;