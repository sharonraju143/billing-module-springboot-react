import React, { useEffect, useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import { awsService, listService } from "../services/Services";
import DurationSelector from "../components/DurationSelector";
import AwsTable from "../tables/AwsTable";
import ServiceSelector from "../components/ServiceSelector";
import DateSelector from "../components/DateSelector";
import Paper from "@mui/material/Paper";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import BarChat from "../components/BarChart";
import ServicesChart from "../components/ServicesChart";
import ServicesPieChart from "../components/servicesPiechart";
import toast from "react-hot-toast";
import CustomBarChart from "../components/CustomBarChart";
import CustomPieChart from "../components/CustomPieChart";
// import { truncateByDomain } from "recharts/types/util/ChartUtils";

export const AwsPage = () => {
  const [service, setService] = useState("");
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [months, setMonths] = useState(3);
  const [display, setDisplay] = useState(false);
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [isMonthDisabled, setIsMonthDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [calling, setCalling] = useState(true);
  console.log("dateRange",dateRange)

  useEffect(() => {
    forAwsGet();
  }, [calling]);

  const formattedTotalAmount = data?.totalAmount
    ? parseFloat(data.totalAmount).toFixed(2)
    : null;

  const handleStartDateChange = (event) => {
    setDateRange({
      ...dateRange,
      startDate: event.target.value,
    });
  
  };

  const handleEndDateChange = (event) => {
    setDateRange({
      ...dateRange,
      endDate: event.target.value,
    });
    
  };

  const handleMonthChange = (selectedMonth) => {
    console.log("selectedMjjhhdshfkhonth", selectedMonth);
    setMonths(selectedMonth);
    setDisplay(true);
    // setIsDateDisabled(event.target.value !== "0");
    setCalling(!calling);
  };

  // const handleReset = () => {
  //   setService("");
  //   setDateRange({
  //     startDate: "",
  //     endDate: "",
  //   });
  //   setMonths(1);
  //   setIsDateDisabled(false);
  //   setIsMonthDisabled(false);
  //   setData([]);
  //   setSubmitClicked(false);
  //   setDisplay(false);
  // };

  // const handleSubmitClicked = () => {
  //   forAwsGet(); // Call the function to fetch data
  //   updateLocalStorage(); // Update local storage with current values
  //   setSubmitClicked(false); // Reset submitClicked state after handling submit action
  // };

  const handleServiceChange = (event) => {
    setService(event.target.value);
    setCalling(!calling)
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const forAwsGet = async () => {
    awsService(service, dateRange?.startDate, dateRange?.endDate, months)
      .then((res) => {
        console.log(res);
        setData(res);
        // if (res.message == "No billing details available.") {
        //   toast.error("Please select required fields");
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const bodyStyle = {
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    padding: "20px",
    overflowX: "hidden",
  };

  const contentStyle = {
    transition: "margin-left 0.5s",
    marginLeft: sidenavOpen ? 250 : 0,
    width: "100%",
  };

  const MonthDisabled = () => {
    return dateRange.startDate !== "" || dateRange.endDate !== "";
  };

  const DateDisabled = () => {
    return months !== 0;
  };
  useEffect(() => {
    setDisplay(true);
  }, [display]);
  useEffect(() => {
    // Load data from localStorage on component mount
    const savedService = localStorage.getItem("service");
    // const savedStartDate = localStorage.getItem("startDate");
    // const savedEndDate = localStorage.getItem("endDate");
    // const savedMonths = localStorage.getItem("months");

    if (savedService) setService(savedService);
    // if (savedStartDate)
    //   setDateRange({ ...dateRange, startDate: savedStartDate });
    // if (savedEndDate) setDateRange({ ...dateRange, endDate: savedEndDate });
    // if (savedMonths) setMonths(savedMonths);
  }, []);

  const updateLocalStorage = () => {
    // Save state to localStorage whenever it changes
    localStorage.setItem("service", service);
    // localStorage.setItem("startDate", dateRange.startDate);
    // localStorage.setItem("endDate", dateRange.endDate);
    // localStorage.setItem("months", months);
  };

  // const monthdata = data?.monthlyTotalAmounts?.map((item)=>{
  //   const {month, amount}=item
  //   return {
  //     name:month,
  //     amount:amount?.toFixed(2)
  //   }
  // })

  const monthdata = Array.isArray(data?.monthlyTotalAmounts)
? data?.monthlyTotalAmounts?.map((item) => ({
    name: Object.keys(item)[0],
    amount: Object.values(item)[0]?.toFixed(2),
  }))
: [];

  const topFiveCustomers = data?.top10Services?.map((item)=>{
    const {serviceName,amount}=item
    return{
      name:serviceName,
      value: amount ? +amount?.toFixed(2) : 0
    }
  })
  const topFiveCustomersBarChart = data?.top10Services?.map((item)=>{
    const {serviceName,amount}=item
    return{
      name:serviceName,
      amount: amount ? +amount?.toFixed(2) : 0
    }
  })

 

  return (
    <div style={bodyStyle}>
      <React.Fragment>
        <Navbar toggleSidenav={toggleSidenav} />
        <Box height={50} />
        <Box sx={{ display: "flex" }}>
          <Sidenav open={sidenavOpen} onClose={toggleSidenav} />

          <Box
            component="main"
            sx={{
              ...contentStyle,
              marginLeft: sidenavOpen ? 250 : 0,
              width: "100%",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: 3, textAlign: "center" }}
            >
              AWS Billing-Details
            </Typography>
            <Card sx={{ px: 2, py: 4, m: 2 }}>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Grid
                  container
                  spacing={3}
                  // justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <div className="h3 fw-bold">Billing Information</div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                  <div >
                    <h5>Service</h5>
                    <ServiceSelector
                      service={service}
                      handleServiceChange={handleServiceChange}
                    />
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                  <div >
                    <h5>Duration</h5>
                    <DurationSelector
                      handleMonthChange={handleMonthChange}
                      months={months}
                      setDateRange={setDateRange}
                      setCalling={setCalling}
                      calling={calling}
                    />
                    </div>
                  </Grid>

                  {/* <Grid item xs={6} md={0.8} sm={12} xl={1}>
                    <Button variant="outlined" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitClicked}
                    >
                      Submit
                    </Button>
                  </Grid> */}
                </Grid>
              </Box>
            </Card>

            <Grid container spacing={3}>
              {/* Barchart  */}
              <Grid  item xs={11.2} md={6} lg={8}>
             
              <div className="card p-3">
              <div className="fw-bold h5">Billing Summary</div>
              <CustomBarChart data={ data?.monthlyTotalAmounts && monthdata} height={430} barLineSize={60}    colors={["#10B981", "#FE6476", "#FEA37C", "#048DAD"]} />
              </div>

                {/* {(data?.monthlyTotalAmounts?.length > 0 && service) ||
                (!service &&
                  ((dateRange.startDate && dateRange.endDate) || months)) ? (
                  <BarChat data={data?.monthlyTotalAmounts} />
                ) : (
                  <div className="chart-container">
                    
                    <div className="headtag">
                      <BarChat />
                    </div>
                  </div>
                )} */}
              </Grid>

              {/* Totalamount */}
              <Grid  item xs={11.2} md={6} lg={4}>
                <div className="card p-3">
                  <div className="p-3"><span className="h5 fw-bold">Billing Period</span> <span className=" fw-bold">({data?.billingPeriod?.map(i=>i?.BillingPeriod)})</span></div>
                  <div className="d-flex justify-content-center" ><span style={{fontSize:"20px"}}>Total Amount-</span><span style={{fontSize:"20px" , color:'#10B981',paddingLeft:"4px"}}><span className="px-1">{"$"}</span>{ data?.totalAmount && data?.totalAmount?.toFixed(2) }</span></div>
                </div>
                <div className="card p-3 mt-2">
                  <div className="h5 fw-bold">Top 5 Consumers</div>
                <CustomPieChart  data={data?.top10Services && topFiveCustomers} height={300}/>
                </div>
                {/* <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 250,
                    padding: 5,
                    backgroundColor: "#d3d3f3",
                  }}
                >
                  <h5>Total Amount</h5>
                  {formattedTotalAmount !== null ? (
                    <Typography component="p" variant="h6">
                      
                    </Typography>
                  ) : (
                    <Typography component="p" variant="body1">
                      $0.00
                    </Typography>
                  )}
                </Paper> */}
              </Grid>

              {/* ServicesChart*/}
              {/* <Grid  item xs={11.2} md={11.5} lg={12}>
                <div className="card p-3">
                  <div className="h5 fw-bold">Top 5 Consumers</div>
              <CustomBarChart data={ data?.top10Services && topFiveCustomersBarChart} height={350} barLineSize={60}    colors={["#10B981", "#FE6476", "#FEA37C", "#048DAD"]} />
              </div>
              </Grid> */}

              {/* ServicesPieChart*/}
              
            </Grid>

            <Card sx={{ px: 2, py: 4, m: 2 }}>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={2} className="mb-3">
                  <Grid
                    item
                    xs={11}
                    sm={11}
                    lg={12}
                    className="mx-auto mx-sm-0"
                  >
                    <AwsTable data={data && data?.billingDetails} />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        </Box>
      </React.Fragment>
    </div>
  );
};

export default AwsPage;
