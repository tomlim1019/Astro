import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import {
  Grid, Card, CardMedia, CardContent, makeStyles, Typography, Divider,
  TextField, ButtonBase, FormControl, MenuItem, Select, Box, Button,
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, FormGroup, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@material-ui/icons/FilterList';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  media: {
    width: 80,
    margin: 'auto',
  },
}));

const Language = ["Malay", "Multiple Language", "Indian", "Chinese", "Korean & Japanese", "International"]

const Category = ["Special Interest", "Movies", "Variety Entertainment", "Music", "Kids", "News", "Lifestyle", "Learning", "Sports", "Radio"]

const Resolution = ["High Definition", "Standard Definition"]

function Main() {
  const [data, setData] = React.useState([]);
  const [searchField, setSearchField] = React.useState([]);
  const [sort, setSort] = React.useState(1);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [languageFilter, setLanguageFilter] = React.useState([]);
  const [categoryFilter, setCategoryFilter] = React.useState([]);
  const [resolutionFilter, setResolutionFilter] = React.useState([]);

  React.useEffect(() => {
    axios.get('https://contenthub-api.eco.astro.com.my/channel/all.json').then(res => {
      console.log(res.data.response)
      setData(res.data.response)
      setSearchField(res.data.response)
    })
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchFunction = (field) => {
    var searched
    if (field === "") {
      setData(searchField)
      filterFunction()
      return
    }

    if (isNaN(field)) {
      searched = data.filter(test => test.title.toLowerCase().includes(field)).map(searched => searched)
    }
    else
      searched = data.filter(test => test.stbNumber.includes(field)).map(searched => searched)

    setData(searched)
  }

  const sortFunction = (value) => {
    var temp = data;
    if (value === 2) {
      temp.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    }
    else
      temp.sort(function (a, b) {
        return a.stbNumber - b.stbNumber;
      });
  }

  const filterFunction = () => {
    var firstFilter = [], secondFilter = [], thirdFilter = [];

    if (categoryFilter.length === 0 && languageFilter.length === 0 && resolutionFilter.length === 0)
      setData(searchField)

    else if (categoryFilter.length !== 0 && languageFilter.length !== 0 && resolutionFilter.length !== 0) {
      categoryFilter.map(category => {
        firstFilter.push(...searchField.filter(test => test.category === category))
      })

      languageFilter.map(language => {
        secondFilter.push(...firstFilter.filter(test => test.language === language))
      })

      resolutionFilter.map(resolution => {
        thirdFilter.push(...secondFilter.filter(test => test.isHd != (resolution.localeCompare("High Definition"))))
      })

      setData(thirdFilter)
    }
    else if (categoryFilter.length === 0 && languageFilter.length !== 0 && resolutionFilter.length !== 0) {
      languageFilter.map(language => {
        firstFilter.push(...searchField.filter(test => test.language === language))
      })

      resolutionFilter.map(resolution => {
        secondFilter.push(...firstFilter.filter(test => test.isHd != (resolution.localeCompare("High Definition"))))
      })

      setData(secondFilter)
    }
    else if (categoryFilter.length !== 0 && languageFilter.length === 0 && resolutionFilter.length !== 0) {
      categoryFilter.map(category => {
        firstFilter.push(...searchField.filter(test => test.category === category))
      })

      resolutionFilter.map(resolution => {
        secondFilter.push(...firstFilter.filter(test => test.isHd != (resolution.localeCompare("High Definition"))))
      })

      setData(secondFilter)
    }
    else if (categoryFilter.length !== 0 && languageFilter.length !== 0 && resolutionFilter.length === 0) {
      categoryFilter.map(category => {
        firstFilter.push(...searchField.filter(test => test.category === category))
      })

      languageFilter.map(language => {
        secondFilter.push(...firstFilter.filter(test => test.language === language))
      })

      setData(secondFilter)
    }
    else {
      categoryFilter.map(category => {
        firstFilter.push(...searchField.filter(test => test.category === category))
      })

      languageFilter.map(language => {
        firstFilter.push(...searchField.filter(test => test.language === language))
      })

      resolutionFilter.map(resolution => {
        firstFilter.push(...searchField.filter(test => test.isHd != (resolution.localeCompare("High Definition"))))
      })

      setData(firstFilter)
    }

  }

  const classes = useStyles();

  return (
    <div className="App">
      <Box style={{ marginTop: 20, marginBottom: 20 }}>
        <TextField style={{ marginRight: 20 }} placeholder="Search" onChange={(e) => searchFunction(e.target.value)} />
        <FormControl>
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              sortFunction(e.target.value)
            }}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={1}>Sort by Channel Number</MenuItem>
            <MenuItem value={2}>Sort by Channel Name</MenuItem>
          </Select>
        </FormControl>
        <Button
          style={{ float: "right" }}
          startIcon={<FilterListIcon />}
          onClick={handleClickOpen}
        >
          Filter
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Filter</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6" color="textPrimary">
                Category
              </Typography>
              <FormGroup row>
                {
                  Category.map(category => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={categoryFilter.find((a) => !a.localeCompare(category))}
                          onChange={() => {
                            (categoryFilter.find((a) => !a.localeCompare(category)) === category)
                              ? setCategoryFilter(categoryFilter.filter(item => item !== category))
                              : setCategoryFilter([...categoryFilter, category])
                          }}
                          name={category}
                        />
                      }
                      label={category}
                    />
                  ))
                }
              </FormGroup>
              <Typography variant="h6" color="textPrimary">
                Language
              </Typography>
              <FormGroup row>
                {
                  Language.map(language => (
                    <FormControlLabel
                      key={language}
                      control={
                        <Checkbox
                          checked={languageFilter.find((a) => !a.localeCompare(language))}
                          onChange={() => {
                            (languageFilter.find((a) => !a.localeCompare(language)) === language)
                              ? setLanguageFilter(languageFilter.filter(item => item !== language))
                              : setLanguageFilter([...languageFilter, language])
                          }}
                          name={language}
                        />
                      }
                      label={language}
                    />
                  ))
                }
              </FormGroup>
              <Typography variant="h6" color="textPrimary">
                Resolution
              </Typography>
              <FormGroup row>
                {
                  Resolution.map(resolution => (
                    <FormControlLabel
                      key={resolution}
                      control={
                        <Checkbox
                          checked={resolutionFilter.find((a) => !a.localeCompare(resolution))}
                          onChange={() => {
                            (resolutionFilter.find((a) => !a.localeCompare(resolution)) === resolution)
                              ? setResolutionFilter(resolutionFilter.filter(item => item !== resolution))
                              : setResolutionFilter([...resolutionFilter, resolution])
                          }}
                          name={resolution}
                        />
                      }
                      label={resolution}
                    />
                  ))
                }
              </FormGroup>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button
              onClick={() => {
                handleClose();
                filterFunction();
              }}
              color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Grid container spacing={2}>
        {
          data.map(test => {
            let favourite = window.localStorage.getItem(test.id)
            return (
              <Grid item xs={12} sm={6} md={3} key={test.id}>
                <Card>
                  <ButtonBase
                    style={{ width: '100%' }}
                    onClick={() => navigate(`/${test.id}`)}
                  >
                    <Grid container justifyContent="center" alignItems="center" >
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          className={classes.media}
                          image={test.imageUrl}
                          title={test.title}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <CardContent >
                          <Typography align="left" noWrap variant="subtitle2" gutterBottom>
                            CH{test.stbNumber}
                          </Typography>
                          <Typography align="left" noWrap variant="subtitle2" gutterBottom>
                            {test.title}
                          </Typography>
                        </CardContent>
                      </Grid>
                      <Grid item xs={1}>
                        <FavoriteIcon color={(favourite) ? "error" : "action"} />
                      </Grid>
                      <Divider style={{ width: '90%' }} />
                      <CardContent style={{ width: '100%' }} >
                        {
                          test.currentSchedule.length === 0 ?
                            <Typography variant="subtitle2">
                              No Information Available!
                            </Typography>
                            :
                            test.currentSchedule.map((schedule, index) =>
                              <Grid container key={schedule.eventId}>
                                <Grid item xs={4}>
                                  <Typography style={index !== 0 ? { fontWeight: "normal" } : null} align="center" variant="subtitle2" gutterBottom>
                                    {index === 0 ? "On Now" : schedule.datetime.substring(11, 16)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                  <Typography style={index !== 0 ? { fontWeight: "normal" } : null} align="left" noWrap variant="subtitle2" gutterBottom>
                                    {schedule.title}
                                  </Typography>
                                </Grid>
                              </Grid>
                            )
                        }
                      </CardContent>
                    </Grid>
                  </ButtonBase>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
    </div >
  );
}

export default Main;
