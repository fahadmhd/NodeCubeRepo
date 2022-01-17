import gql from "graphql-tag";
export const GET_DASHBOARD_ITEMS = gql`
  query GetDashboardItems {
    dashboardItems {
      id
      layout
      vizState
      name
    }
  }
`;
export const GET_DASHBOARD_ITEM = gql`
  query GetDashboardItem($id: String!) {
    dashboardItem(id: $id) {
      id
      layout
      vizState
      name
    }
  }
`;
export const GET_COMMENT_BY_ID_ITEM = gql`
  query GetCommentItem($id: String!) {
    commentItem(id: $id) {
      id
      dashboardItemId
      description
    }
  }
`;
export const GET_COMMENT_ITEMS = gql`
  query GetCommentItems {
    commentItems {
      id
      dashboardItemId
      description
    }
  }
`;
export const GET_COMMENT_ITEMS_BY_DASHBOARD_ID = gql`
  query GetCommentItemsByDashboardId($dashboardItemId: String!) {
    commentItemsByDashboardId(dashboardItemId: $dashboardItemId) {
      id
      dashboardItemId
      description
    }
  }
`;
