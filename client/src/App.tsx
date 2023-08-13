import React, { FormEvent, useEffect, useState } from "react";
import "./App.css";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_USERS,
  GET_ALL_USERS_WITHOUT_AGE,
  GET_USER,
} from "./query/user";
import { CREATE_USER } from "./mutation/user";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface User {
  id: number;
  username: string;
  age: number;
  posts?: Post[];
}

function App() {
  const { data, loading, refetch } = useQuery(GET_ALL_USERS);
  const {
    data: usersWithoutAgeData,
    loading: usersWithoutAgeLoading,
    refetch: usersWithoutAgeRefetch,
  } = useQuery(GET_ALL_USERS_WITHOUT_AGE);

  const {
    data: userData,
    loading: userLoading,
    refetch: userRefetch,
  } = useQuery(GET_USER);

  const [newUser] = useMutation(CREATE_USER);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number>();
  const [users, setUsers] = useState<User[]>([]);
  const [usersWithoutAge, setUsersWithoutAge] = useState<Omit<User, "age">[]>(
    []
  );

  useEffect(() => {
    userRefetch({ id: 1 });
  }, []);

  useEffect(() => {
    if (userLoading) {
      return;
    }
    console.log("userData", userData);
  }, [userData]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newUser({
      variables: {
        input: {
          username,
          age,
        },
      },
    }).then(({ data }) => {
      console.log("data", data);
      refetch();
      setUsername("");
      setAge(undefined);
    });
  };

  const onGetAllUsers = () => {
    refetch();
  };

  const onGetAllUsersWithoutAge = () => {
    usersWithoutAgeRefetch();
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    setUsers(data.getAllUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (usersWithoutAgeLoading) {
      return;
    }
    setUsersWithoutAge(usersWithoutAgeData.getAllUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersWithoutAgeData]);

  if (loading || usersWithoutAgeLoading) {
    return (
      <div style={{ height: "100vh" }}>
        <Spinner
          animation="border"
          className="position-absolute top-50 start-50"
          variant="primary"
          role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="App mx-5">
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-4 mt-5" as={Row} controlId="username1">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            required
            placeholder="username"
          />
        </Form.Group>
        <Form.Group className="mb-4" as={Row} controlId="age1">
          <Form.Label>Age</Form.Label>
          <Form.Control
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            type="number"
            required
            placeholder="age"
          />
        </Form.Group>
        <Row>
          <Button className="mb-3" type="submit">
            Create User
          </Button>
          <Button className="mb-3" type="button" onClick={onGetAllUsers}>
            Get Users
          </Button>
          <Button
            className="mb-3"
            type="button"
            onClick={onGetAllUsersWithoutAge}>
            Get Users Without Age
          </Button>
        </Row>
      </Form>
      <Col className="my-4">
        <Form.Label>Users :</Form.Label>
        {users.map((user) => (
          <div>
            {user?.id}. {user?.username} {user?.age}
          </div>
        ))}
      </Col>
      <Col className="my-4">
        <Form.Label>Users without Age :</Form.Label>
        {usersWithoutAge.map((user) => (
          <div>
            {user?.id}. {user?.username}
          </div>
        ))}
      </Col>
    </div>
  );
}

export default App;
