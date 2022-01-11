import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, makeStyles, Typography, IconButton, Tabs, Tab, MenuItem, Select } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  media: {
    width: 160,
    margin: 'auto',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Details() {
  let { id } = useParams();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState(0);
  let favourite = window.localStorage.getItem(id)

  React.useEffect(() => {
    axios.get(`https://contenthub-api.eco.astro.com.my/channel/${id}.json`).then(res => {
      //Object.keys(res.data.response.schedule).map(day => console.log(day))
      console.log(favourite)
      setData(res.data.response)
      setLoading(false);
    })
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addOrRemoveFavourite = () => {
    if (favourite)
      window.localStorage.removeItem(id)
    else
      window.localStorage.setItem(id, id)

    window.location.reload()
  }

  const classes = useStyles();

  if (loading) return "Loading...";

  return (
    <div className="App">
      <Card style={{ margin: 10 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={5} md={6}>
            <CardMedia
              component="img"
              className={classes.media}
              image={data.imageUrl}
              title={data.title}
            />
          </Grid>
          <Grid item xs={5} md={5}>
            <CardContent style={{ marginTop: 30 }}>
              <Typography noWrap variant="h5" gutterBottom>
                CH{data.stbNumber}
              </Typography>
              <Typography noWrap variant="h5" gutterBottom>
                {data.title}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={2} md={1}>
            <CardContent style={{ marginTop: 30 }}>
              <IconButton onClick={addOrRemoveFavourite}>
                <FavoriteIcon color={(favourite) ? "error" : "action"} />
              </IconButton>
            </CardContent>
          </Grid>
          <CardContent>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Category: {data.category}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Language: {data.language}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="subtitle1">
                  {data.description}
                </Typography>
              </Grid>
            </Grid>

            <Tabs
              style={{ marginTop: 20 }}
              value={value}
              indicatorColor="primary"
              variant="fullWidth"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              {
                Object.keys(data.schedule).map((day, index) => (
                  (index > 2) ? null :
                    (index !== 0 && index !== 1) ?
                      <Tab label={day} key={day} {...a11yProps(index)} key={day} />
                      :
                      <Tab label={(index === 0) ? "Today" : "Tomorrow"} {...a11yProps(index)} key={day} />
                ))
              }
            </Tabs>
            {
              Object.keys(data.schedule).map((day, index) => (
                (index === value) ?
                  <TabPanel style={{ paddingTop: 20 }} value={value} index={index} key={index}>
                    {
                      data.schedule[day].map((daily) => (
                        <Grid container spacing={2} key={daily.eventId}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              {daily.datetime.substring(11, 16)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              {daily.title}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))
                    }
                  </TabPanel>
                  :
                  null
              ))
            }
          </CardContent>
        </Grid>
      </Card>
    </div >
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

export default Details;
