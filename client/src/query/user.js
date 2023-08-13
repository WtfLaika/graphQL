import { gql } from "@apollo/client";
import { USET_WITHOUT_AGE } from "../fragments/user";

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      username
      age
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: ID) {
    getUser(id: $id) {
      id
      username
    }
  }
`;

export const GET_ALL_USERS_WITHOUT_AGE = gql`
  ${USET_WITHOUT_AGE}
  query {
    getAllUsers {
      ...UserWithoutAge
    }
  }
`;
