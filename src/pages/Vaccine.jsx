import React,{ useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from '@mui/material/LinearProgress';
import { isMobile } from "../components/utils"
import Futter from './Futter'

import "./style.css";

const top100Films = [
  { label: "Nakashipara", block: "Nakashipara" },
  { label: "Kaliganj", block: "Kaliganj" },
];

const mobile_diplay ={
  fontWeight: isMobile ? 600 : 400, padding: isMobile ? "20px 0px"  : "15px"
}


function Vaccine() {
  const [inputValue, setInputValue] = useState([]);
  const [totalSlotsDetails, setTotalSlotsDetails] = React.useState([]);
  useEffect(() => {
    let todayDate = new Date();
    const lang = todayDate.toLocaleTimeString('en-GB');
    const timer= "18" < lang ? 2000: 10000;
    getVacationSlot();
    let steTimer = setInterval(() => getVacationSlot(), timer)

    return(
     ()=> clearInterval(steTimer)
    )
    //getVacationSlot();
  },[inputValue]);

  const getSlotSearchBox = () => {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Autocomplete
          multiple
          limitTags={2}
          size="small"
          id="combo-box-demo"
          className="Auto-complete-textbox"
          options={top100Films}
          sx={{ width: isMobile ? "90vw":  400 }}
          value={inputValue}
          onChange={(event, newValue) => {
            setInputValue(newValue);
           // getVacationSlot();
          }}
        //   onInputChange={(event, newInputValue) => {
        //       debugger;
        //     setInputValue(newInputValue);
        //     getVacationSlot();
        //   }}
          renderInput={(params) => <TextField {...params} label="Block" />}
        />
      </Stack>
    );
  };

  const getLoadder = () =>{
    return(
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <LinearProgress sx={{width: isMobile ? "90vw" : "60vw", margin: "20px 0px"}}/>
      </Stack>
    )
  }

  const getSlotDetails = (totalSlots) => {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      > 
          {totalSlots &&
          totalSlots.length > 0 ?
          totalSlots.map((data, value) => CardDetails(data, value)): <span className="data-loading"> { inputValue.length >0 ? "No Data Present..." :  "Data Loading ..."}</span>}
      </Stack>
    );
  };

  const getAllSlotsDetails = (value) => {
    return (
      <Card
                sx={{
                  width: "200px",
                  p: 1,
                  margin: 1,
                  backgroundColor:
                    value.available_capacity_dose1 > 0 ||
                    value.available_capacity_dose2 > 0
                      ? "green"
                      : "white",
                }}
              >
                <Typography
                  sx={{ fontSize: 14, color: "darkblue", fontWeight: "bold" }}
                >
                  {value.date}
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  <div className="slot-view-text">
                    Dose 1:{" "}
                    <span
                      className="slot-view"
                      style={{
                        color:
                          value.available_capacity_dose1 > 0 ||
                          value.available_capacity_dose2 > 0
                            ? "white"
                            : "black",
                      }}
                    >
                      {" "}
                      {value.available_capacity_dose1}
                    </span>
                  </div>
                  <div className="slot-view-text">
                    Dose 2:{" "}
                    <span
                      className="slot-view"
                      style={{
                        color:
                          value.available_capacity_dose1 > 0 ||
                          value.available_capacity_dose2 > 0
                            ? "white"
                            : "black",
                      }}
                    >
                      {" "}
                      {value.available_capacity_dose2}
                    </span>
                  </div>
                </Grid>
              </Card> 
    );
  };

  const CardDetails = (data, value) => {
    return (
      <Card sx={{ minWidth: "60%", width: isMobile? "90vw": "60vw" }} key={value}>
        <CardContent classes="card-classes">
          <Typography sx={{ fontSize: 14,}} className={isMobile ? "mobile-name-test-style" : ""} gutterBottom>
            {data.name}
            {data.fee_type === "Free" ? <span className="slot-text free-slot">FREE</span> : <span className="slot-text paid-slot"> PAID </span>}
          </Typography>
          <Typography sx={{ fontSize: 14 }} className={isMobile ? "mobile-name-test-style" : ""}>{data.address +","+data.pincode}</Typography>
        </CardContent>
        <div style={{ display: "flex" }}>
          {data.sessions &&
            data.sessions.length > 0 &&
            data.sessions.map((value, index) => (
              isMobile? index<3 && getAllSlotsDetails(value) : index<6 && getAllSlotsDetails(value)
            ))}
        </div>
      </Card>
    );
  };

  const getVacationSlot = () => {
    let todayDate = new Date();
    const lang = todayDate.toLocaleTimeString('en-GB');
    const date =`${ "17" < lang ? todayDate.getDate() + 1 : todayDate.getDate()}-${todayDate.getMonth()+1}-${todayDate.getUTCFullYear()}`
    console.log("date", date); 
    let myRequest =
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=728&date=${date}`;
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    const myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "default",
    };
    fetch(myRequest, myInit)
    .then(response => response.json())
      .then((res) => {
        const slotModifyData= (res && res.centers) || [] ;
        setTotalSlotsDetails(slotModifyData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let generateFilterSlot=(allSlots, filterBlock)=>{
     return inputValue.length > 0 ? allSlots.filter(item => inputValue.some(filter => filter.block === item.block_name)) : allSlots;
  }

  return (
    <div>
      <Typography sx={{ fontSize: isMobile? 18 : 54, ...mobile_diplay }} gutterBottom>
        Vaccination Center And Slots Availability
      </Typography>

      <div>
        {getSlotSearchBox()}
       {getLoadder()}
        <div style={{ marginTop: "-5px" }}>
          {getSlotDetails(generateFilterSlot(totalSlotsDetails, inputValue))}
          {console.log("Dat",inputValue )}
        </div>
      </div>
      <Futter />
    </div>
  );
}

export default Vaccine;
