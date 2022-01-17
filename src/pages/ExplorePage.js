import React, { useState } from "react";
import { Alert, Button, Spin } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { withRouter } from "react-router-dom";
import ExploreQueryBuilder from "../components/QueryBuilder/ExploreQueryBuilder";
import {
  GET_DASHBOARD_ITEM,
  GET_COMMENT_BY_ID_ITEM,
  GET_COMMENT_ITEMS_BY_DASHBOARD_ID,
} from "../graphql/queries";
import TitleModal from "../components/TitleModal.js";
import CommentModal from "../components/CommentModal.js";

import { getCurrentDashboardId } from "../graphql/client";
import DashboardCommentModal from "../components/DashboardCommentModal";
const ExplorePage = withRouter(({ history, location }) => {
  const [addingToDashboard, setAddingToDashboard] = useState(false);
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const { loading, error, data } = useQuery(GET_DASHBOARD_ITEM, {
    variables: {
      id: itemId,
    },
    skip: !itemId,
  });
  const [vizState, setVizState] = useState(null);
  const finalVizState =
    vizState ||
    (itemId && !loading && data && JSON.parse(data.dashboardItem.vizState)) ||
    {};
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentListModalVisible, setCommentListModalVisible] = useState(false);
  const [comment, setComment] = useState(null);
  const [addingCommentToDashboard, setAddingCommentToDashboard] =
    useState(false);

  const [editCommentModalVisible, setEditCommentModalVisible] = useState(false);
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
  var finalComment =
    comment != null
      ? comment
      : (commentItemId &&
          !commentLoading &&
          commentData &&
          commentData.commentItem.description) ||
        "Comment Description";
  const finalTitle =
    title != null
      ? title
      : (itemId && !loading && data && data.dashboardItem.name) || "New Chart";

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error.toString()} />;
  }

  const dashboardId = itemId ? itemId : getCurrentDashboardId();

  return (
    <div>
      <CommentModal
        history={history}
        data={commentData}
        itemId={commentItemId}
        dashboardItemId={itemId}
        commentModalVisible={commentModalVisible}
        setCommentModalVisible={setCommentModalVisible}
        setAddingCommentToDashboard={setAddingCommentToDashboard}
        setComment={setComment}
        finalComment={finalComment}
        setCommentItemId={setCommentItemId}
      />
      <DashboardCommentModal
        itemId={dashboardId}
        setCommentItemId={setCommentItemId}
        commentModalVisible={commentListModalVisible}
        setCommentModalVisible={setCommentListModalVisible}
        setEditCommentModalVisible={setCommentModalVisible}
      ></DashboardCommentModal>
      <TitleModal
        history={history}
        itemId={itemId}
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setAddingToDashboard={setAddingToDashboard}
        finalVizState={finalVizState}
        setTitle={setTitle}
        finalTitle={finalTitle}
      />
      <ExploreQueryBuilder
        vizState={finalVizState}
        setCommentModalVisible={setCommentModalVisible}
        setCommentListModalVisible={setCommentListModalVisible}
        addingCommentToDashboard={addingCommentToDashboard}
        chartExtra={[
          <Button
            key="button"
            type="primary"
            loading={addingToDashboard}
            onClick={() => setTitleModalVisible(true)}
          >
            {itemId ? "Update" : "Add to Dashboard"}
          </Button>,
        ]}
        onVizStateChanged={setVizState}
      />
    </div>
  );
});
export default ExplorePage;
