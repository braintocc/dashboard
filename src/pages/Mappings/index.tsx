import logo from '/logo.svg'
import './index.css'
import { Chip, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUser } from '../../api/user/get';
import { createUser } from '../../api/user/create';
import { getPodcasts } from '../../api/podcast/get';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import TagIcon from '@mui/icons-material/Tag';
import { SocialStepper } from '../../components/SocialStepper';
import { PodcastStepper } from '../../components/PodcastStepper';
import { updateUser } from '../../api/user/update';

import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Mappings() {

  const [open, setOpen] = useState(false);
  const {user, getAccessTokenSilently}: any = useAuth0();
  const [destinations, setDestinations]: any = useState<any[]>([]);
  const [sources, setSources]: any = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [serverUser, setServerUser] = useState<any>();
  const [__, setLoading] = useState<boolean>(true);
  const [Stepper, setStepper] = useState<any>();

  const Auth0Scope = import.meta.env.VITE_AUTH0_SCOPE;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const actions = [
    { icon: <PodcastsIcon />, name: 'Podcast', onClick: () => {
      setStepper(<PodcastStepper sources={sources} handleFinish={handleFinish}/>)
      handleOpen()
    } },
    { icon: <TagIcon />, name: 'Social', onClick: () => {
      setStepper(<SocialStepper sources={sources} destinations={destinations} handleFinish={handleFinish}/>)
      handleOpen()
    } },
  ];

  useEffect(() => {
    if(!user)
      return 
    (async () => {
        let userLocal: any
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
        } catch (e) {
          await createUser(user.email)
          userLocal = await getUser(user.email)
        }
        setServerUser(userLocal)
        
        setMappings(userLocal.mappings || [])
        setDestinations(Object.entries(userLocal.destinations).map(([id,value] : any) =>({...value, id})))
        setSources(await Promise.all(Object.entries(userLocal.sources).map(async([id,value] : any) =>{
          const tables = await getPodcasts(userLocal.sources[id].accessToken)
          return {...value, id, tables}
        })))
        setLoading(false)
    })();
  }, []);

const columns: GridColDef[] = [
  { field: 'type', headerName: 'Type', width:100 },
  { field: 'sources', headerName: 'Sources', flex: 1, 
  renderCell: function a(params: any) {
    return <>
      {params.value.map((value: any, index: number) => {
        const localSource = sources.find((sc: any) => sc.id === value.id)
        if (!localSource)
          return ""
        const localTable = localSource.tables.find((tb: any) => tb.id === value.tableId)
        if (!localTable)
          return ""
        else return <Chip key={index} label={`${localSource.name} ${localTable.title}`} />
      })}
    </>
  }},
  { field: 'destinations', headerName: 'Destinations', flex: 2, 
  renderCell: (params: any) => (
    <>
      {params.value && params.value.map((destination: any, index: number) => (
        <Chip key={index} label={`${destination.id}`} />
      ))}
    </>
  ) },
  {
    field: 'actions',
    type: 'actions',
    width: 50,
    getActions: (params: GridRowParams) => [
      <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
    ]
  }
  
];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (id:string) =>{
    const filteredMappings = mappings.filter((value: any) => value.id !== id)
    setMappings(filteredMappings)
    updateUser({...serverUser, mappings: filteredMappings})
  }

  const handleAdd = (result: any) => {
    setMappings([...mappings, result])
    updateUser({...serverUser, mappings: [...serverUser.mappings, result]})
  } 
  
  const handleFinish = (result: any) => {
    handleAdd(result);
    setOpen(false);
  }
  
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Brainto logo" />
      </div>
      <h1>Welcome to Brainto</h1>
      <DataGrid
        autoHeight
        hideFooter
        rows={mappings}
        columns={columns}
        autosizeOptions={{
          columns: ['type', 'sources'],
          includeOutliers: true,
          includeHeaders: true,
        }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
      />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          {Stepper}
        </Box>
      </Modal>
      <SpeedDial sx={{
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 50,
            left: 'auto',
            position: 'fixed',
            color: "white"
          }}
        ariaLabel="SpeedDial openIcon example"
        icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </>
  )
}

export default Mappings

