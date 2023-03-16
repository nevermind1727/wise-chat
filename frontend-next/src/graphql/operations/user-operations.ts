import { gql } from "@apollo/client";

export default {
  Queries: {
    findUsers: gql`
      query FindUsers($username: String!) {
        findUsers(username: $username) {
          id
          username
          image
        }
      }
    `,
    getWiseAi: gql`
      query GetWiseAi {
        getWiseAi {
          id
          username
          image
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
};
