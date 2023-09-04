import { Box, Grid, useTheme } from "@mui/material";
import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
// import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
import ReactECharts from "echarts-for-react";
import { fetchData } from "../../api/dashboard/DashboardApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';


function Dashboard() {
  const theme = useTheme();
  const chartTheme = theme.palette.mode === "dark" ? "dark" : "westeros";
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery(["repoData"], () =>
    fetchData().then((res) => res.data)
  );

  useEffect(() => {
    console.log(data);
    console.log(isLoading);
    console.log(error);
    console.log(isFetching);
  }, [error]);

  const option = {
    title: {
      text: "Stacked Line",
    },
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      //   feature: {
      //     saveAsImage: false,
      //   },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        type: "line",
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        stack: "Total",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        stack: "Total",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            // avatar={<Avatar aria-label="recipe">R</Avatar>}
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title="Rentabilidade"
            titleTypographyProps={{ variant: "h6" }}
          />
          <Divider />
          <CardContent>
          {/*  <ReactECharts
              option={option}
              theme={chartTheme}
              style={{ height: 300 }}
            />
             <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              belent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography> */}
          </CardContent>
          {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </Grid>
    </Grid>
  );
}

export { Dashboard };
