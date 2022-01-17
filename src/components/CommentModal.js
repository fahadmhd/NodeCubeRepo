import React from "react";
import { Modal, Input } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { GET_DASHBOARD_ITEMS, GET_COMMENT_ITEMS } from "../graphql/queries";
import { getCurrentDashboardId } from "../graphql/client";
import { UPDATE_COMMENT_ITEM, CREATE_COMMENT_ITEM } from "../graphql/mutations";

const CommentModal = ({
  // history,
  data,
  itemId,
  dashboardItemId,
  commentModalVisible,
  setCommentModalVisible,
  setAddingCommentToDashboard,
  setComment,
  finalComment,
  setCommentItemId,
}) => {
  const [addCommentItem] = useMutation(CREATE_COMMENT_ITEM, {
    refetchQueries: [
      {
        query: GET_COMMENT_ITEMS,
      },
    ],
  });
  const [updateCommentItem] = useMutation(UPDATE_COMMENT_ITEM, {
    refetchQueries: [
      {
        query: GET_COMMENT_ITEMS,
      },
    ],
  });
  const customStyles = {
    overlay: { zIndex: 1000 },
  };
  return (
    <Modal
      style={customStyles}
      key="modal"
      title="Save Comment"
      visible={commentModalVisible}
      onOk={async () => {
        setCommentModalVisible(false);
        setAddingCommentToDashboard(true);
        console.log("CommentID: ", itemId);
        try {
          console.log(finalComment);
          await (itemId ? updateCommentItem : addCommentItem)({
            variables: {
              id: itemId,
              input: {
                dashboardItemId:
                  itemId && data
                    ? data.commentItem.dashboardItemId
                    : dashboardItemId
                    ? dashboardItemId
                    : getCurrentDashboardId(),
                description: finalComment.toString(),
              },
            },
          });
          setComment(null);
          if (setCommentItemId) {
            setCommentItemId(null);
          }

          // window.location.reload();
        } finally {
          setAddingCommentToDashboard(false);
        }
      }}
      onCancel={() => setCommentModalVisible(false)}
    >
      <Input
        placeholder="Comment Description"
        value={finalComment}
        onChange={(e) => setComment(e.target.value)}
      />
    </Modal>
  );
};

export default CommentModal;
