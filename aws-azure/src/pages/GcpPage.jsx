import React, { useEffect, useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import { gcpService } from "../services/Services";
import DurationSelector from "../components/DurationSelector";
import DateSelector from "../components/DateSelector";
import Paper from "@mui/material/Paper";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import GcpTable from "../tables/GcpTable";
import GcpSelector from "../components/Gcp/GcpSelector";
import GcpMonthlyTotalBillsChart from "../components/Gcp/GcpMonthlyTotalBillsChart";
import TopServiceDescHoriz from "../components/Gcp/TopServiceDescHoriz";
import TopServiceDescPieChart from "../components/Gcp/TopServiceDescPieChart";
import CustomBarChart from "../components/CustomBarChart";
import CustomPieChart from "../components/CustomPieChart";

export const GcpPage = () => {
  const [serviceDescription, setServiceDescription] = useState("");
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [months, setMonths] = useState(3);
  const [display, setDisplay] = useState(false);
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [isMonthDisabled, setIsMonthDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [calling, setCalling] = useState(true);
  const [mdata, setMdata] = useState();
  console.log("data", data);

  useEffect(() => {
    forGcpGet();
  }, [calling]);

  const formattedTotalCost = data?.totalCost
    ? parseFloat(data.totalCost).toFixed(2)
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
    //setIsMonthDisabled(dateRange.startDate !== "" || event.target.value !== "");
  };

  const handleMonthChange = (selectedMonth) => {
    console.log("selectedMonthsss", selectedMonth);
    setMonths(selectedMonth);
    setDisplay(true);
    //setIsDateDisabled(event.target.value !== "0");
    setCalling(!calling);
  };

  // const handleReset = () => {
  //   setServiceDescription("");
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

  //   const handleSubmitClicked = () => {

  //     const isAnySelectorChosen =
  //     serviceDescription || (dateRange.startDate && dateRange.endDate) || months !== 0;

  //   if (!isAnySelectorChosen) {
  //     toast.error("Please select required fields");
  //     return;
  //   }

  // const isServiceChosen = !!serviceDescription;
  // const isDateSelected = dateRange.startDate && dateRange.endDate;
  // const isMonthSelected = months !== 0;

  // if (isServiceChosen && !(isDateSelected || isMonthSelected)) {
  //   toast.error("Select dates or months to get the data");
  //   return;
  // }

  //     forGcpGet();
  //     setSubmitClicked(false);
  //   };

  const handleServiceChange = (event) => {
    setServiceDescription(event.target.value);
    setCalling(!calling);
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const forGcpGet = async () => {
    gcpService(
      serviceDescription,
      dateRange.startDate,
      dateRange.endDate,
      months
    )
      .then((res) => {
        console.log(res, "prudhvi");
        setData(res);
        // console.log([...res?.monthlyTotalBills],"rehsj")
        //setMdata([...res?.monthlyTotalBills])
        // if (res.message === "No billing details available.") {
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
  // console.log("monthsbjjkbvbadkbkbjadf", months);

  useEffect(() => {
    setDisplay(true);
  }, [display]);

  useEffect(() => {
    const savedService = localStorage.getItem("service");

    if (savedService) setServiceDescription(savedService);
  }, []);

  const updateLocalStorage = () => {
    localStorage.setItem("service", serviceDescription);
  };
  // const monthdata =data?.length>0 && Object.keys(data?.monthlyTotalBills)?.map(key => ({
  //   name: key,
  //   value: data?.monthlyTotalBills[key]
  // }));
  console.log("mdata", mdata);

  // const monthdata = data && mdata?.map((item) => {
  //           const keys = Object.keys(item);
  //           return keys.map((key) => ({
  //               name: key,
  //               value: item[key],
  //           }));
  //       }).flat()
  //       ;
  //       console.log("monthdata",monthdata)

  // const monthdata = mdata?.map((item) => ({
  //   name: Object.keys(item)[0],
  //   value: Object.values(item)[0],
  // }));

  // console.log("monthdata", monthdata);

  const monthdata = Array.isArray(data?.monthlyTotalBills)
    ? data.monthlyTotalBills.map((item) => ({
        name: Object.keys(item)[0],
        value: Object.values(item)[0],
      }))
    : [];

  // const monthdata = data?.monthlyTotalAmounts?.map((item) => {
  //   const { month, amount } = item;
  //   return {
  //     name: month,
  //     amount: amount?.toFixed(2),
  //   };
  // });

  const topFiveCustomers = data?.top5ServiceDescriptions?.map((item) => {
    const { serviceDescription, totalCost } = item;
    return {
      name: serviceDescription,
      value: totalCost && +totalCost?.toFixed(0),
    };
  });
  // console.log("topFiveCustomers",)

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
              GCP Billing-Details
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
                  alignItems="center"
                >
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <div className="h3 fw-bold">Billing Information</div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <div>
                      <h5>Service</h5>
                      <GcpSelector
                        serviceDescription={serviceDescription}
                        handleServiceChange={handleServiceChange}
                      />
                    </div>
                  </Grid>

                  {/* <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                  <div style={{ textAlign: 'center' }}>
                    <h5>Select Date</h5>
                    <DateSelector
                      handleStartDateChange={handleStartDateChange}
                      handleEndDateChange={handleEndDateChange}
                      dateRange={dateRange}
                      DateDisabled={DateDisabled}
                      disabled={isDateDisabled} // Pass isDateDisabled as a prop here
                    />
                    </div>
                  </Grid> */}

                  {/* <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                    <div style={{ textAlign: "center" }}>
                      <h5>Select Duration</h5>
                      <DurationSelector
                        handleMonthChange={handleMonthChange}
                        months={months}
                        // MonthDisabled={MonthDisabled}
                        // disabled={isMonthDisabled}
                        //setCalling={setCalling}
                      />
                    </div>
                  </Grid> */}

                  <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                    <div>
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

                  {/* <Grid item xs={6} md={0.8} sm={12}>
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

            {/* <Grid container spacing={3}>
              
              <Grid item xs={11.2} md={6} lg={8}>
                {data &&
                  ((data?.monthlyTotalBills &&
                    Object.keys(data.monthlyTotalBills).length > 0 &&
                    serviceDescription) || 
                  (!serviceDescription &&
                    ((dateRange.startDate && dateRange.endDate) || months)) ? (
                    <GcpMonthlyTotalBillsChart
                      monthlyTotalBills={data?.monthlyTotalBills}
                    />
                  ) : (
                    <div className="chart-container">
                      <div className="headtag">
                        <GcpMonthlyTotalBillsChart />
                      </div>
                    </div>
                  ))}
              </Grid>

              
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={3}>
                <Paper
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
                  {formattedTotalCost !== null ? (
                    <Typography component="p" variant="h6">
                      ₹{formattedTotalCost}
                    </Typography>
                  ) : (
                    <Typography component="p" variant="body1">
                      ₹0.00
                    </Typography>
                  )}
                </Paper>
              </Grid>

              
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={7}>
                <TopServiceDescHoriz
                  top5ServiceDescriptions={
                    data && data?.top5ServiceDescriptions
                  }
                />
              </Grid>

             
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={4}>
                <TopServiceDescPieChart
                  top5ServiceDescriptions={data && data.top5ServiceDescriptions}
                />
              </Grid>
            </Grid> */}
            <Grid container spacing={3}>
              {/* Barchart  */}
              <Grid item xs={11.2} md={6} lg={8}>
                <div className="card p-3">
                  <div className="fw-bold h5">Billing Summary</div>
                  <CustomBarChart
                    data={data && monthdata}
                    height={430}
                    barLineSize={60}
                    colors={["#10B981", "#FE6476", "#FEA37C", "#048DAD"]}
                  />
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
              <Grid item xs={11.2} md={6} lg={4}>
                <div className="card p-3">
                  <div className="p-3">
                    <span className="h5 fw-bold">Billing Period</span>
                    <span className=" fw-bold">
                      ({data?.billingPeriod?.map(i=>i?.BillingPeriod)})
                      
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontSize: "20px" }}>Total Amount-</span>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#10B981",
                        paddingLeft: "4px",
                      }}
                    >
                      <span className="px-1">{"$"}</span>
                      {data?.totalCost && data?.totalCost?.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="card p-3 mt-2">
                  <div className="h5 fw-bold">Top 5 Consumers</div>
                  <CustomPieChart
                    data={data?.top5ServiceDescriptions && topFiveCustomers}
                    height={300}
                  />
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
                    <GcpTable data={data?.billingDetails} />
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

export default GcpPage;
