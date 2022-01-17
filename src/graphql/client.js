/* globals window */
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema } from "graphql-tools";
const cache = new InMemoryCache();
const defaultDashboardItems = [];
const defaultCommentItems = [];

const getDashboardItems = () =>
  JSON.parse(window.localStorage.getItem("dashboardItems")) ||
  defaultDashboardItems;

const getCommentItems = () =>
  JSON.parse(window.localStorage.getItem("commentItems")) ||
  defaultCommentItems;

const setDashboardItems = (items) =>
  window.localStorage.setItem("dashboardItems", JSON.stringify(items));

const setCommentItems = (items) =>
  window.localStorage.setItem("commentItems", JSON.stringify(items));

const nextId = () => {
  const currentId =
    parseInt(window.localStorage.getItem("dashboardIdCounter"), 10) || 1;
  window.localStorage.setItem("dashboardIdCounter", currentId + 1);
  return currentId.toString();
};
export const getCurrentDashboardId = () => {
  const currentId =
    parseInt(window.localStorage.getItem("dashboardIdCounter"), 10) || 1;
  // window.localStorage.setItem("dashboardIdCounter", currentId + 1);
  return currentId.toString();
};
const nextCommentId = () => {
  const currentId =
    parseInt(window.localStorage.getItem("commentIdCounter"), 10) || 1;
  window.localStorage.setItem("commentIdCounter", currentId + 1);
  return currentId.toString();
};

const toApolloItem = (i) => ({ ...i, __typename: "DashboardItem" });
const toApolloCommentItem = (i) => ({ ...i, __typename: "CommentItem" });

const typeDefs = `
  type DashboardItem {
    id: String!
    layout: String
    vizState: String
    name: String
  }
  type CommentItem {
    id: String!
    dashboardItemId: String!
    description: String
  }

  input DashboardItemInput {
    layout: String
    vizState: String
    name: String
  }

  input CommentItemInput {
    dashboardItemId: String
    description: String
  }

  type Query {
    dashboardItems: [DashboardItem]
    dashboardItem(id: String!): DashboardItem
    commentItems: [CommentItem]
    commentItem(id: String!): CommentItem
    commentItemsByDashboardId(dashboardItemId: String!): [CommentItem]
  }

  type Mutation {
    createDashboardItem(input: DashboardItemInput): DashboardItem
    updateDashboardItem(id: String!, input: DashboardItemInput): DashboardItem
    deleteDashboardItem(id: String!): DashboardItem
    createCommentItem(input: CommentItemInput): CommentItem
    updateCommentItem(id: String!,input: CommentItemInput): CommentItem
    deleteCommentItem(id: String!): CommentItem
  }
`;
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      dashboardItems() {
        const dashboardItems = getDashboardItems();
        return dashboardItems.map(toApolloItem);
      },
      commentItems() {
        const commentItems = getCommentItems();
        return commentItems.map(toApolloCommentItem);
      },

      dashboardItem(_, { id }) {
        const dashboardItems = getDashboardItems();
        return toApolloItem(dashboardItems.find((i) => i.id.toString() === id));
      },

      commentItem(_, { id }) {
        const commentItems = getCommentItems();
        return toApolloCommentItem(
          commentItems.find((i) => i.id.toString() === id)
        );
      },

      commentItemsByDashboardId(_, { dashboardItemId }) {
        const commentItems = getCommentItems();
        const a = commentItems.filter(
          (i) => i.dashboardItemId.toString() === dashboardItemId
        );
        console.log("DATA: ", a);
        return a;
      },
    },
    Mutation: {
      createDashboardItem: (_, { input: { ...item } }) => {
        const dashboardItems = getDashboardItems();
        item = { ...item, id: nextId(), layout: JSON.stringify({}) };
        dashboardItems.push(item);
        setDashboardItems(dashboardItems);
        return toApolloItem(item);
      },
      createCommentItem: (_, { input: { ...item } }) => {
        const commentItems = getCommentItems();
        item = { ...item, id: nextCommentId() };
        commentItems.push(item);
        setCommentItems(commentItems);
        return toApolloCommentItem(item);
      },
      updateDashboardItem: (_, { id, input: { ...item } }) => {
        const dashboardItems = getDashboardItems();
        item = Object.keys(item)
          .filter((k) => !!item[k])
          .map((k) => ({
            [k]: item[k],
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        const index = dashboardItems.findIndex((i) => i.id.toString() === id);
        dashboardItems[index] = { ...dashboardItems[index], ...item };
        setDashboardItems(dashboardItems);
        return toApolloItem(dashboardItems[index]);
      },
      updateCommentItem: (_, { id, input: { ...item } }) => {
        const commentItems = getCommentItems();
        item = Object.keys(item)
          .filter((k) => !!item[k])
          .map((k) => ({
            [k]: item[k],
          }))
          .reduce((a, b) => ({ ...a, ...b }), {});
        const index = commentItems.findIndex((i) => i.id.toString() === id);
        commentItems[index] = { ...commentItems[index], ...item };
        setCommentItems(commentItems);
        return toApolloCommentItem(commentItems[index]);
      },
      deleteDashboardItem: (_, { id }) => {
        const dashboardItems = getDashboardItems();
        const index = dashboardItems.findIndex((i) => i.id.toString() === id);
        const [removedItem] = dashboardItems.splice(index, 1);
        setDashboardItems(dashboardItems);
        return toApolloItem(removedItem);
      },
      deleteCommentItem: (_, { id }) => {
        const commentItems = getCommentItems();
        const index = commentItems.findIndex((i) => i.id.toString() === id);
        const [removedItem] = commentItems.splice(index, 1);
        setCommentItems(commentItems);
        return toApolloCommentItem(removedItem);
      },
    },
  },
});
export default new ApolloClient({
  cache,
  link: new SchemaLink({
    schema,
  }),
});
