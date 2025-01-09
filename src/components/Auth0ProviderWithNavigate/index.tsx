import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const scope = import.meta.env.VITE_AUTH0_SCOPE;

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};