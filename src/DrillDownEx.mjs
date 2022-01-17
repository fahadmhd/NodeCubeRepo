import React, { useEffect, useState } from "react";
import { useCubeQuery } from "@cubejs-client/react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

const colors = ["#FF6492", "#141446", "#7A77FF"];

const query = {
  measures: ["Orders.count"],
  dimensions: ["Orders.status"],
  timeDimensions: [{
    dimension: "Orders.createdAt",
    granularity: "day",
    dateRange: "last 30 days"
  }]
};

const DrillDownEx = () => {
  const { resultSet } = useCubeQuery(query);

  if (!resultSet) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={resultSet.chartPivot()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          {resultSet.seriesNames().map(({ key }, index) => {
            return (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[index]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default DrillDownEx;