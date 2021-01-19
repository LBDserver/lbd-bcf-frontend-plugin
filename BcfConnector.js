import React, { useContext, useState, useEffect } from "react";
import { Drawer, Typography } from "@material-ui/core";
import useStyles from "@styles";
import AppContext from "@context";

import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';

import List from "@material-ui/core/List"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import RefreshIcon from "@material-ui/icons/Refresh";



export default function BcfConnector() {

  
  const [bcfDict, setBcfDict] = useState([]);
  
  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNjaHVsekBkYy5yd3RoLWFhY2hlbi5kZSIsInVzZXJJZCI6IjVmMzE1OWExZDRkNzM3Njg0ODE3MjNkOCIsImlhdCI6MTYxMTA3MTAxMywiZXhwIjoxNjExNjc1ODEzfQ.A9zGiHJaHp9H-qc3lpQfK6EldAdlSRQWPm8nwuY8Ka8"
  
  var topicsUrl = "http://localhost:3000/bcf/2.1/projects/1EFC4B64-A367-4465-AE31-BA2DB983B8F9/topics/";
  var loginUrl = "http://localhost:3000/bcf/2.1/auth/login"
  
  
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
  
  const login = () => {
      sendHttpRequest("Post", loginUrl, {
          id : "schulz@dc.rwth-aachen.de",
          password: "login1"
      }).then(responseData => {
          token = responseData.token
          console.log(token)
          return("responseData.token")
      }).catch(err => {
          console.log(err, err.data);
      })
  }
   
  const getTopics = () => {
      sendHttpRequest("Get", topicsUrl).then(responseData => {
        setBcfDict(responseData)
      })
  }
  
  const [topics, setTopics] = useState(bcfDict);

  useEffect(() => {
    setTopics(bcfDict)
    /*console.log("test")*/
  }, [bcfDict])  


  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);


  function setState(state) {
    setContext({...context, states: {...context.states, [context.plugin]: state}})
  }

  function BcfTopics(props) {

    return (
      <List >
        {
          topics.map((item, i) => {
            console.log(item)
            return (
              <ListItem button>
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
        <div>
          {}
        </div>
        <div style={{display: "inline-block", padding: "5px"}}><Typography anchor="left">Topics</Typography></div>
        <div style={{display: "inline-block", padding: "5px"}}>
          <Button startIcon={<RefreshIcon/>} onClick={() => {login()}}>
            Login
          </Button>
          <Button startIcon={<RefreshIcon/>} onClick={() => {getTopics()}}>
            Get Topics
          </Button>
        </div>
        <Container fixed style={{height:"100%"}}>
          <List >
            <BcfTopics/>
          </List>
        </Container>
      </div>
    );
  }

  const state = context.states[context.plugin]

  return (
    <div style={{height: '100%'}}>
      {context.currentProject ? (
        <div>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="top"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}></div>
            <div></div>
            <div >
              <Typography variant="h5" anchor="right">BCF Connector</Typography>
              <TopicsPanel></TopicsPanel>
            </div>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
