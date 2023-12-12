import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { awsCountService, azureCountService } from "../services/Services";

export const Home = () => {
  const [awsCount, setAwsCount] = useState("");
  const [azureCount,setAzureCount] = useState("");


  const bodyStyle = {
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    padding: "20px",
    overflowX: "hidden",
  };

  const getAwsCount = async () => {
    const data = await awsCountService();
    setAwsCount(data);
  };


  const getAzureCount = async () => {
    const data = await azureCountService();
    setAzureCount(data);
  };

  useEffect(() => {
    getAwsCount();
    getAzureCount();
  });

  return (
    <div style={bodyStyle}>
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Card className="felee" sx={{ maxWidth: 345 , backgroundColor:"#d3d3f3"}}>
                <CardContent>
                  <Typography className="homecards" gutterBottom variant="h5" component="div">
                    AWS Total-Bills
                  </Typography>
                  {awsCount}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card  className="felee" sx={{ maxWidth: 345,  backgroundColor:"#d1cf87" }}>
                <CardContent>
                  <Typography className="homecards" gutterBottom variant="h5" component="div">
                    Azure Total-Bills
                  </Typography>
                  {azureCount}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card className="felee" sx={{ maxWidth: 345 , backgroundColor:"#c99996"}}>
                <CardContent>
                  <Typography className="homecards" gutterBottom variant="h5" component="div">
                    GCP Total-Bills
                  </Typography>
                  0
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          

          <Box height={50} />

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4}>
              <Card className="felee" sx={{ maxWidth: 345, backgroundColor:"#9699c9" }}>
                <CardContent>
                  <Typography className="homecards" gutterBottom variant="h5" component="div">
                    GIT Total-Bills
                  </Typography>
                  0
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card className="felee" sx={{ maxWidth: 345, backgroundColor:"#d187c2"}}>
                <CardContent>
                  <Typography  className="homecards" gutterBottom variant="h5" component="div">
                    Atlassian Total-Bills
                  </Typography>
                  0
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
