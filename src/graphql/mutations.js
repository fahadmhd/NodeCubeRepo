import gql from "graphql-tag";
export const CREATE_DASHBOARD_ITEM = gql`
  mutation CreateDashboardItem($input: DashboardItemInput) {
    createDashboardItem(input: $input) {
      id
      layout
      vizState
      name
    }
  }
`;
export const CREATE_COMMENT_ITEM = gql`
  mutation CreateCommentItem($input: CommentItemInput) {
    createCommentItem(input: $input) {
      id
      dashboardItemId
      description
    }
  }
`;
export const UPDATE_DASHBOARD_ITEM = gql`
  mutation UpdateDashboardItem($id: String!, $input: DashboardItemInput) {
    updateDashboardItem(id: $id, input: $input) {
      id
      layout
      vizState
      name
    }
  }
`;
export const UPDATE_COMMENT_ITEM = gql`
  mutation UpdateCommentItem($id: String!, $input: CommentItemInput) {
    updateCommentItem(id: $id, input: $input) {
      id
      dashboardItemId
      description
    }
  }
`;
export const DELETE_DASHBOARD_ITEM = gql`
  mutation DeleteDashboardItem($id: String!) {
    deleteDashboardItem(id: $id) {
      id
      layout
      vizState
      name
    }
  }
`;

export const DELETE_COMMENT_ITEM_BY_ID = gql`
  mutation DeleteCommentItem($id: String!) {
    deleteCommentItem(id: $id) {
      id
      dashboardItemId
      description
    }
  }
`;
