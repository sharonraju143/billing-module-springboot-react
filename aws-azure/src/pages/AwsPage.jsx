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

export const AwsPage = () => {
  const [service, setService] = useState("");
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [months, setMonths] = useState(0);

  const [data, setData] = useState([]);


  

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

  const handleMonthChange = (event) => {
    setMonths(event.target.value);
  };

  const handleServiceChange = (event) => {
    setService(event.target.value);
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const resetFilters = () => {
    setService("");
    setDateRange({
      startDate: "",
      endDate: "",
    });
    setMonths(0);
  };

  const forAwsGet = async () => {
    try {
      const res = await awsService(
        service,
        dateRange.startDate,
        dateRange.endDate,
        months
      );
      console.log(res);
      setData(res);
    } catch (error) {
      console.log(error);
    }
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
    forAwsGet();
  }, [service, dateRange.endDate, dateRange.startDate, months]);

  return (
    <div style={bodyStyle}>
      <React.Fragment>
        <Navbar toggleSidenav={toggleSidenav} />
        <Box height={50} />
        <Box sx={{ display: "flex" }}>
          <Sidenav open={sidenavOpen} onClose={toggleSidenav} />

          <Box
            component="main"
            sx={{ ...contentStyle, marginLeft: sidenavOpen ? 250 : 0 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={11.2} md={8} lg={8}>
                {data?.monthlyTotalAmounts?.length > 0 && (
                  <BarChat data={data?.monthlyTotalAmounts} />
                )}
              </Grid>
              {data?.totalAmount && (
                <Grid item xs={11.2} md={4} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 230,
                      padding: 5,
                      backgroundColor: "#d3d3f3",
                    }}
                  >
                    <h5>Total Amount</h5>
                    <Typography component="p" variant="h6">
                      ${data?.totalAmount}
                    </Typography>
                  </Paper>
                </Grid>
              )}
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
                <Grid container>
                  <Grid item xs={12} md={4} sm={12}>
                    <h5>Select Service</h5>
                    <ServiceSelector
                      service={service}
                      handleServiceChange={handleServiceChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={5} sm={12}>
                    <h5>select Date</h5>
                    <DateSelector
                      handleStartDateChange={handleStartDateChange}
                      handleEndDateChange={handleEndDateChange}
                      dateRange={dateRange}
                      DateDisabled={DateDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.2} sm={12}>
                    <h5>select Duration</h5>
                    <DurationSelector
                      handleMonthChange={handleMonthChange}
                      months={months}
                      MonthDisabled={MonthDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} md={0.8} sm={12}>
                    <Button variant="outlined" onClick={resetFilters}>
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={2} className="mb-3">
                <Grid item xs={11} sm={11} lg={12} className="mx-auto mx-sm-0">
                  <AwsTable data={data.billingDetails} />
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Box>
      </React.Fragment>
    </div>
  );
};

export default AwsPage;
