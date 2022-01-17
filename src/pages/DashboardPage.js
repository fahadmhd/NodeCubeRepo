import React, { Fragment, useState } from "react";
import { Spin, Button, Alert } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Icon } from "@ant-design/compatible";
import {
  GET_DASHBOARD_ITEMS,
  GET_COMMENT_BY_ID_ITEM,
} from "../graphql/queries";
import ChartRenderer from "../components/ChartRenderer";
import Dashboard from "../components/Dashboard";
import DashboardItem from "../components/DashboardItem";
import DashboardCommentModal from "../components/DashboardCommentModal";
import CommentModal from "../components/CommentModal.js";

const deserializeItem = (i) => ({
  ...i,
  layout: JSON.parse(i.layout) || {},
  vizState: JSON.parse(i.vizState),
});

const defaultLayout = (i) => ({
  x: i.layout.x || 0,
  y: i.layout.y || 0,
  w: i.layout.w || 4,
  h: i.layout.h || 8,
  minW: 4,
  minH: 8,
});

const DashboardPage = ({ history, location }) => {
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [dashboardId, setDashboardId] = useState(null);
  const [editCommentModalVisible, setEditCommentModalVisible] = useState(false);
  const [comment, setComment] = useState(null);
  const [addingCommentToDashboard, setAddingCommentToDashboard] =
    useState(false);
  // const params = new URLSearchParams(location.search);
  // const commentItemId = params.get("commentItemId");
  const [commentItemId, setCommentItemId] = useState(null);
  const c = useQuery(GET_COMMENT_BY_ID_ITEM, {
    variables: {
      id: commentItemId,
    },
    skip: !commentItemId,
  });
  const commentLoading = c.loading;
  const commentData = c.data;
  const commentError = c.error;

  console.log("Before: ", commentItemId);
  console.log("Before: ", commentLoading);
  console.log("Before: ", commentData);
  if (commentData) console.log("Before: ", commentData.commentItem.description);
  var finalComment =
    comment != null
      ? comment
      : (commentItemId &&
          !commentLoading &&
          commentData &&
          commentData.commentItem.description) ||
        "Comment Description";

  var { loading, error, data } = useQuery(GET_DASHBOARD_ITEMS);
  if (loading || addingCommentToDashboard || commentLoading) {
    return <Spin />;
  }

  if (error || commentError) {
    return (
      <Alert
        message="Error occured while loading your query"
        description={error.toString()}
        type="error"
      />
    );
  }
  console.log("Final Comment: ", finalComment);
  console.log("Final Comment2: ", comment);
  console.log("Final Comment ID: ", commentItemId);
  console.log("Final Comment ID: ", c);

  const dashboardItem = (item) => (
    <div key={item.id} data-grid={defaultLayout(item)}>
      <DashboardItem
        key={item.id}
        itemId={item.id}
        title={item.name}
        setDashboardId={setDashboardId}
        setCommentModalVisible={setCommentModalVisible}
      >
        <ChartRenderer vizState={item.vizState} />
      </DashboardItem>
    </div>
  );

  const Empty = () => (
    <div
      style={{
        textAlign: "center",
        padding: 12,
      }}
    >
      <h2>There are no charts on this dashboard</h2>
      <Link to="/explore">
        <Button type="primary" size="large" icon={<Icon type="plus" />}>
          Add chart
        </Button>
      </Link>
    </div>
  );

  return !data || data.dashboardItems.length ? (
    <Fragment>
      <Dashboard dashboardItems={data && data.dashboardItems}>
        {data && data.dashboardItems.map(deserializeItem).map(dashboardItem)}
      </Dashboard>
      <CommentModal
        history={history}
        data={commentData}
        itemId={commentItemId}
        commentModalVisible={editCommentModalVisible}
        setCommentModalVisible={setEditCommentModalVisible}
        setAddingCommentToDashboard={setAddingCommentToDashboard}
        setComment={setComment}
        finalComment={finalComment}
        setCommentItemId={setCommentItemId}
      />
      <DashboardCommentModal
        itemId={dashboardId}
        setCommentItemId={setCommentItemId}
        commentModalVisible={commentModalVisible}
        setCommentModalVisible={setCommentModalVisible}
        setEditCommentModalVisible={setEditCommentModalVisible}
      ></DashboardCommentModal>
    </Fragment>
  ) : (
    <Empty />
  );
};

export default DashboardPage;
