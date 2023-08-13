import { gql } from "@apollo/client";

export const USET_WITHOUT_AGE = gql`
  fragment UserWithoutAge on User {
    id
    username
  }
`;
