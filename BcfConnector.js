import React, { useContext, useState, useEffect } from "react";
import useStyles from "@styles";
import AppContext from "@context";


//Material-ui
import { Drawer, Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import List from "@material-ui/core/List"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';

// Import Icons
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit"
import BackIcon from "@material-ui/icons/ArrowBack"
import DownloadIcon from "@material-ui/icons/CloudDownload"


// Implement tab panels for UI 
function TabPanel(props) {
  const {children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

// Main function
export default function BcfConnector() {

  
  const [topicDict, setTopicDict] = useState([]);
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);
  const [value, setValue] = useState(0);
  const [currentTopic, setCurrentTopic] = useState({});
  

  // Dummy Values for BCF Server; token needs is atm not automatically refetched and must be changed manually in code
  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNjaHVsekBkYy5yd3RoLWFhY2hlbi5kZSIsInVzZXJJZCI6IjVmMzE1OWExZDRkNzM3Njg0ODE3MjNkOCIsImlhdCI6MTYxMTA3MTAxMywiZXhwIjoxNjExNjc1ODEzfQ.A9zGiHJaHp9H-qc3lpQfK6EldAdlSRQWPm8nwuY8Ka8"
  var topicsUrl = "http://localhost:3000/bcf/2.1/projects/1EFC4B64-A367-4465-AE31-BA2DB983B8F9/topics/";
  var loginUrl = "http://localhost:3000/bcf/2.1/auth/login"
  
  // Standardized function for sending requests, use it when implementing new requests
  const sendHttpRequest = (method, url, data) => {
      return fetch(url, {
          method: method,
          body: JSON.stringify(data),
          headers: token ? {"Content-Type" : "application/json", "Authorization": "Bearer " + token} : {"Content-Type" : "application/json"}
      }).then(response => {
          if (response.status >= 400) {
              response.json().then(errResData => {
                  const error = new Error("Somethin went wrong!");
                  error.data = errResData;
                  throw error;
              });
          }
          return response.json();
      });
  };
  
  /*
  // Currently not implemented
  const login = () => {
      sendHttpRequest("Post", loginUrl, {
          id : "schulz@dc.rwth-aachen.de",
          password: ""
      }).then(responseData => {
          token = responseData.token
          console.log(token)
          return("responseData.token")
      }).catch(err => {
          console.log(err, err.data);
      })
  }
  */
   
  const getTopics = () => {
      sendHttpRequest("Get", topicsUrl).then(responseData => {
        setTopicDict(responseData)
      })
  }
  
  const [topics, setTopics] = useState(topicDict);
  const [singleTopic, setSingleTopic] = useState({});

  // Call handleChange(index) when Tab needs to change
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setTopics(topicDict)
  }, [topicDict])

  useEffect(() => {
    setSingleTopic(currentTopic)
    // console.log(currentTopic)
  }, [currentTopic])

  
  function BcfTopicDetailsListItems(props) {
    return(
      <List>
        <Typography variant="h6" anchor="right">{singleTopic.title}</Typography>
        {
          Object.keys(singleTopic).map((item, i) => {
            var topicValue
            if(!singleTopic[item]) {
              topicValue = "null"
            } else if (!singleTopic[item][0]) {
              topicValue = "null"
            } else {
              topicValue = singleTopic[item]
            }
            return(
              <List>
                <ListItemText primary={item} secondary={topicValue}/>
              </List>
            )
          })}
      </List>
      )
      }

  

  function BcfTopicsListItem(props) {

    return (
      <List >
        {
          topics.map((item, i) => {
            return (
              <ListItem key={item.guid} button selected onClick={() => {
                  setCurrentTopic(item)
                  // console.log(currentTopic)
                  handleChange(1)
                  }
                }>
                <ListItemText primary={item.title} secondary={item.topic_status}/>
              </ListItem>
            )
          })
        }
      </List>
        );
        }

  function TopicsPanel(props) {
    const { children, ...other } = props;
 
    return (
      <div >
        <div style={{display: "inline-block", padding: "5px"}}>
          <Button startIcon={<RefreshIcon/>} variant="outlined" onClick={() => {getTopics()}}>
            Get Topics
          </Button>
        </div>
        <Container fixed style={{height:"100%"}}>
          <List >
            <BcfTopicsListItem/>
          </List>
        </Container>
      </div>
    );
  }

  function TopicsDetailsPanel(props) {
    const { children, ...other } = props;

    return (
      <div >
        <div style={{display: "inline-block", padding: "5px"}}>
          <Button startIcon={<BackIcon/>} variant="outlined" onClick={() => {handleChange(0)}}>
            Back
          </Button>
          {/* <Button startIcon={<EditIcon/>} variant="outlined" onClick={() => {}}>
            Edit
          </Button> */}
        </div>
        <Container fixed style={{height:"100%"}}>
          <List >
            <BcfTopicDetailsListItems/>
          </List>
        </Container>
      </div>
    );
    
  }

  return (
    <div className={classes.root}>
      {context.currentProject ? (
        <div>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}></div>
            <Typography variant="h5" anchor="right">BCF Connector</Typography>
            <TabPanel value={value} index={0}>
            <div >
              <TopicsPanel></TopicsPanel>
            </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TopicsDetailsPanel></TopicsDetailsPanel>
            </TabPanel>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
