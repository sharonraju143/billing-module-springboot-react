import React, { useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import { azureService, gcpService } from "../services/Services";
import DurationSelector from "../components/DurationSelector";
import DateSelector from "../components/DateSelector";
import Paper from "@mui/material/Paper";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import GcpMonthlyTotalBillsChart from "../components/Gcp/GcpMonthlyTotalBillsChart";
import TopServiceDescPieChart from "../components/Gcp/TopServiceDescPieChart";
import AzureSelector from "../components/Azure/AzureSelector";
import AzureTable from "../tables/AzureTable";
import TopResourseTypeHorz from "../components/Azure/TopResourseTypeHorz";
import TopResourceTypePieChart from "../components/Azure/TopResourseTypePieChart";

export const AzurePage = () => {
  const [resourseType, setResourseType] = useState("");
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [months, setMonths] = useState(0);
  const [display, setDisplay] = useState(false);
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [isMonthDisabled, setIsMonthDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);

  const formattedTotalCost = data?.totalCost
    ? parseFloat(data.totalCost).toFixed(2)
    : null;

  const handleStartDateChange = (event) => {
    setDateRange({
      ...dateRange,
      startDate: event.target.value,
    });
    setIsMonthDisabled(event.target.value !== "" || dateRange.endDate !== "");
  };

  const handleEndDateChange = (event) => {
    setDateRange({
      ...dateRange,
      endDate: event.target.value,
    });
    setIsMonthDisabled(dateRange.startDate !== "" || event.target.value !== "");
  };

  const handleMonthChange = (event) => {
    setMonths(event.target.value);
    setDisplay(true);
    setIsDateDisabled(event.target.value !== "0");
  };

  const handleReset = () => {
    setResourseType("");
    setDateRange({
      startDate: "",
      endDate: "",
    });
    setMonths(0);
    setIsDateDisabled(false);
    setIsMonthDisabled(false);
    setData([]);
    setSubmitClicked(false);
    setDisplay(false);
  };

  const handleSubmitClicked = () => {
    forAzureGet();
    setSubmitClicked(false);
  };

  const handleServiceChange = (event) => {
    setResourseType(event.target.value);
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const forAzureGet = async () => {
    azureService(resourseType, dateRange.startDate, dateRange.endDate, months)
      .then((res) => {
        console.log(res);
        setData(res);
        if (res.message === "No billing details available.") {
          toast.error("Please select required fields");
        }
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
              Azure Billing-Details
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <h5>Select Service</h5>
                    <AzureSelector
                      resourseType={resourseType}
                      handleServiceChange={handleServiceChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={5} xl={5}>
                    <h5>Select Date</h5>
                    <DateSelector
                      handleStartDateChange={handleStartDateChange}
                      handleEndDateChange={handleEndDateChange}
                      dateRange={dateRange}
                      DateDisabled={DateDisabled}
                      disabled={isDateDisabled} // Pass isDateDisabled as a prop here
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={2} xl={1.9}>
                    <h5>Select Duration</h5>
                    <DurationSelector
                      handleMonthChange={handleMonthChange}
                      months={months}
                      MonthDisabled={MonthDisabled}
                      disabled={isMonthDisabled}
                    />
                  </Grid>

                  <Grid item xs={6} md={0.8} sm={12}>
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
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Grid container spacing={3}>
              {/* Barchart  */}
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={8}>
                {data &&
                  ((data?.monthlyTotalBills &&
                    Object.keys(data.monthlyTotalBills).length > 0 &&
                    resourseType) ||
                  (!resourseType &&
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

              {/* TotalCost */}
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

              {/* ServicesChart */}
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={7}>
                <TopResourseTypeHorz
                  top5ResourceTypes={data && data?.top5ResourceTypes}
                />
              </Grid>

              {/* ServicesPieChart*/}
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={4}>
                <TopResourceTypePieChart
                  top5ResourceTypes={data && data.top5ResourceTypes}
                />
              </Grid>
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
                    <AzureTable data={data?.billingDetails} />
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

export default AzurePage;
