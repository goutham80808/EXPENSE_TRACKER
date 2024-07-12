import * as React from "react";
import Paper from "@mui/material/Paper";
import { scaleBand } from "@devexpress/dx-chart-core";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Animation,
  ArgumentScale,
  EventTracker,
} from "@devexpress/dx-react-chart";
import dayjs from "dayjs";

const CustomBar = ({ value, ...props }) => {
  const color = value < 0 ? "red" : "green";
  return <BarSeries.Point {...props} color={color} />;
};

export default function TransactionChart({ data, initialBalance }) {
  // Adjust chart data to include initial balance
  let cumulativeBalance = initialBalance;
  const chartData = data.map((item) => {
    cumulativeBalance += item.totalExpenses;
    return {
      ...item,
      month: dayjs().month(item._id - 1).format("MMMM"),
      cumulativeBalance,
    };
  });

  return (
    <Paper>
      <Chart data={chartData} sx={{ marginTop: 4 }}>
        <ArgumentScale factory={scaleBand} />
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries
          valueField="cumulativeBalance"
          argumentField="month"
          pointComponent={CustomBar}
        />
        <Animation />
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
}
