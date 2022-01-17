import React, { useState } from "react";
import { Modal, Input } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import { Alert, Button, Spin, Divider } from "antd";
import {
  GET_COMMENT_ITEMS_BY_DASHBOARD_ID,
  GET_COMMENT_ITEMS,
} from "../graphql/queries";
import { DELETE_COMMENT_ITEM_BY_ID } from "../graphql/mutations";
const DashboardCommentModal = ({
  itemId, // Dashboard Item Id
  setCommentItemId,
  commentModalVisible,
  setCommentModalVisible,
  setEditCommentModalVisible,
}) => {
  const [removeCommentItem] = useMutation(DELETE_COMMENT_ITEM_BY_ID, {
    refetchQueries: [
      {
        query: GET_COMMENT_ITEMS,
      },
    ],
  });
  let { loading, error, data } = useQuery(GET_COMMENT_ITEMS_BY_DASHBOARD_ID, {
    pollInterval: 100,
    variables: {
      dashboardItemId: itemId,
    },
    fetchPolicy: "no-cache",
    skip: !itemId,
  });
  console.log(data, error, loading);
  console.log("Item", itemId);
  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error.toString()} />;
  }
  let comments = [];
  if (data) comments = data["commentItemsByDashboardId"];

  const customStyles = {
    overlay: { zIndex: -1000 },
  };
  console.log("State: ", commentModalVisible);
  // if (commentModalVisible && !s) {

  //   setS(true);
  // }

  return (
    <Modal
      style={customStyles}
      cancelButtonProps={{ style: { display: "none" } }}
      key="modal"
      title="Comments"
      visible={commentModalVisible}
      onOk={() => {
        setCommentModalVisible(false);
      }}
      onCancel={() => {
        setCommentModalVisible(false);
      }}
    >
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((column, index) => (
            <tr style={{ border: "black" }}>
              <th>{index + 1}</th>
              <th>{column.description}</th>
              <th>
                <Button
                  onClick={() => {
                    setCommentItemId(column.id);
                    setEditCommentModalVisible(true);
                    setCommentModalVisible(false);
                  }}
                >
                  edit
                </Button>
                <Divider type="vertical" />

                <Button
                  onClick={() =>
                    Modal.confirm({
                      title: "Are you sure you want to delete this item?",
                      okText: "Yes",
                      okType: "danger",
                      cancelText: "No",

                      onOk() {
                        removeCommentItem({
                          variables: {
                            id: column.id,
                          },
                        });
                      },
                    })
                  }
                >
                  Delete
                </Button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default DashboardCommentModal;
