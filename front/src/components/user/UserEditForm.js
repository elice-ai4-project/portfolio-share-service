import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../api";

function UserEditForm({ user, setIsEditing, setUser }) {
  //useState로 name 상태를 생성함.
  const [name, setName] = useState(user.name);
  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState(user.email);
  //useState로 description 상태를 생성함.
  const [description, setDescription] = useState(user.description);
  const [image, setImage] = useState(user.image);
  const [blob, setBlob] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 사진을 s3에 저장합니다.
    const formData = new FormData();
    formData.append("file", blob);
    await axios.post(`http://localhost:5000/user/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
      },
    });

    // "users/유저id" 엔드포인트로 PUT 요청함.
    const res = await Api.put(`users/${user.id}`, {
      name,
      email,
      description,
      image,
    });
    // 유저 정보는 response의 data임.
    const updatedUser = res.data;
    // 해당 유저 정보로 user을 세팅함.
    setUser(updatedUser);

    // isEditing을 false로 세팅함.
    setIsEditing(false);
  };

  const imagePreview = (fileBlob) => {
    setBlob(fileBlob);
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      setImage(reader.result);
    };
  };
  return (
    <Card className="mb-2">
      <Card.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group controlId="useEditImage" className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                imagePreview(e.target.files[0]);
              }}
            />
          </Form.Group>
          {image && (
            <div className="text-center mb-3">
              <img
                style={{ width: "10rem", height: "8rem" }}
                src={image}
                alt="이미지 미리보기"
              />
            </div>
          )}
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="userEditEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="userEditDescription">
            <Form.Control
              type="text"
              placeholder="정보, 인사말"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button type="submit" variant="primary" className="me-3">
                확인
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UserEditForm;
