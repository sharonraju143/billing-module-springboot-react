import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const DurationSelector = ({ months, handleMonthChange,MonthDisabled }) => {
  const montharray= [1,2,3,4,5,6,7,8,9,10,11,12]
  return (
    <React.Fragment>
      <div  className="marginx">
        <FormControl>
          <Select disabled={MonthDisabled()}
            labelId="duration-label"
            value={months}
            onChange={handleMonthChange}
            sx={{height:'2.4em',backgroundColor:'#FFFF',width:200,textAlign:'center'}}
          >
            <MenuItem value={0} sx={{backgroundColor:'#FFFF',':hover':{
              backgroundColor:'#FFFF',
              color:'black'
            }}} disabled>Select Month</MenuItem>
            {montharray.map((item)=>{
              return <MenuItem key={item} value={item} sx={{backgroundColor:'#FFFF',':hover':{
                backgroundColor:'#FFFF',
                color:'black'
              },
              '&.Mui-selected': {
                backgroundColor: "#FFFF !important",
                color: "black",
              }
            }}>{item} month</MenuItem>
            })}
          </Select>
        </FormControl>
      </div>
    </React.Fragment>
  );
};

export default DurationSelector;
