import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getUser } from '../../api/user/get';
import { createUser } from '../../api/user/create';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs, TextField } from '@mui/material';
import ProviderDialog from '../../components/ProviderDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function Connections() {

  const { user, getAccessTokenSilently }: any = useAuth0();
  const [destinations, setDestinations]: any = useState([]);
  const [sources, setSources]: any = useState([]);
  const [selectedDestinationIndex, setSelectedDestinationIndex]: any = useState('0');
  const [selectedSourceIndex, setSelectedSourceIndex]: any = useState('0');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  const Auth0Scope = import.meta.env.VITE_AUTH0_SCOPE;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const passParams = `?user=${window.localStorage.getItem('email')}&origin=${window.location.href}`
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'site', headerName: 'Site', width: 150 },
    { field: 'integrations', headerName: 'Integration Types', width: 150 }
  ];
  
  const connectionSourceTypes: any[] = [
    {value:"notion" , text: "Notion", action: () => window.location.replace(`${ServerUrl}/connect/notion${passParams}`)},
  ];


  const connectionDestinationTypes: any[] = [
    {value:"linkedin" , text: "LinkedIn", action: () => window.location.replace(`${ServerUrl}/connect/linkedin${passParams}`), control: () => <></>},
    {value:"youtube" , text: "Youtube", action: () => window.location.replace(`${ServerUrl}/connect/google${passParams}`), control: () => <></>},
    {value:"mastodon" , text: "Mastodon", action: () => window.location.replace(`${ServerUrl}/connect/mastodon${passParams}`), control: () => <></>},
    {value:"substack" , text: "Substack", action: () => handleOpen(), fromDestination: `${ServerUrl}/auth/substack/callback`, control: () => <TextField variant="standard"  type="text" name="cookie" placeholder="Substack Cookie" />},
    {value:"bluesky" , text: "Bluesky", action: () => handleOpen(), fromDestination: `${ServerUrl}/auth/bluesky/callback`, control: () => <><TextField variant="standard"  type="text" name="identifier" placeholder="Bluesky Identifier" />
    <TextField variant="standard"  type="text" name="password" placeholder="Bluesky App Password" /></>},
  ];

  useEffect(() => {
    if(!user)
      return 
    (async () => {
        let userLocal
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: auth0Audience as string,
            scope: Auth0Scope as string,
          }
        });
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('email', user.email);
        try {
          userLocal = await getUser(user.email)
          setDestinations(Object.entries(userLocal.destinations || []).map(([id,value] : any) =>({...value, id})))
          setSources(Object.entries(userLocal.sources || []).map(([id,value] : any) =>({...value, id})))
        } catch (e) {
          await createUser(user.email)
          userLocal = await getUser(user.email)
          setDestinations(Object.entries(userLocal.destinations).map(([id,value] : any) =>({...value, id})))
          setSources(Object.entries(userLocal.sources).map(([id,value] : any) =>({...value, id})))
        }
        setLoading(false)
    })();
  }, []);

  const selectedDestinationChanged = (event: SelectChangeEvent) => {
    setSelectedDestinationIndex(event.target.value);
  };


  const selectedSourceChanged = (event: SelectChangeEvent) => {
    setSelectedSourceIndex(event.target.value);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  return ( loading 
    ? <Box width={"100%"}> <CircularProgress /> </Box>
    : <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
      <Tab label="Sources" {...a11yProps(0)} />
      <Tab label="Destinations" {...a11yProps(1)} />
    </Tabs>
  </Box>
  <CustomTabPanel value={value} index={0}>
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Provider
        </InputLabel>
        <Select
          onChange={selectedSourceChanged}
          value={selectedSourceIndex}>
          {connectionSourceTypes.map((connectionType: any, index: number) =><MenuItem value={index}>{connectionType.text}</MenuItem>)}
        </Select>
      </FormControl>
        <Button size="small" onClick={() => connectionSourceTypes[selectedSourceIndex].action()}>
          Add Provider
        </Button>
      </Stack>
      <DataGrid
        autoHeight
        rows={sources}
        columns={columns}
        autosizeOptions={{
          columns: ['name', 'site', 'type'],
          includeOutliers: true,
          includeHeaders: true,
        }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
      />
    </Box>
  </CustomTabPanel>
  <CustomTabPanel value={value} index={1}>
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Provider
        </InputLabel>
        <Select
          onChange={selectedDestinationChanged}
          value={selectedDestinationIndex}>
          {connectionDestinationTypes.map((connectionType: any, index: number) =><MenuItem value={index}>{connectionType.text}</MenuItem>)}
        </Select>
      </FormControl>
        <Button size="small" onClick={() => connectionDestinationTypes[selectedDestinationIndex].action()}>
          Add Provider
        </Button>
      </Stack>
      <DataGrid
        autoHeight
        rows={destinations}
        columns={columns}
        autosizeOptions={{
          columns: ['name', 'site', 'type'],
          includeOutliers: true,
          includeHeaders: true,
        }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
      />
      <ProviderDialog 
      open={open} 
      handleClose={handleClose} 
      children={connectionDestinationTypes[selectedDestinationIndex].control()}
      formDestination={connectionDestinationTypes[selectedDestinationIndex].fromDestination}
      email={window.localStorage.getItem('email')}
      origin={window.location.href}
      provider={connectionDestinationTypes[selectedDestinationIndex].text} />
    </Box>
  </CustomTabPanel>
  </>
  )
}

export default Connections
