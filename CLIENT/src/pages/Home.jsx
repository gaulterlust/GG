// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  background-color: #f5f5f5;
  padding: 50px 20px;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #28a745;
  font-size: 48px;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #333333;
  font-size: 20px;
  margin-bottom: 40px;
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 12px 30px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

function Home() {
  return (
    <HomeWrapper>
      <Title>Вітаємо у GreenGard</Title>
      <Subtitle>Ваш надійний партнер для догляду за садом</Subtitle>
      <Button onClick={() => alert('Дякуємо за увагу!')}>Дізнатись більше</Button>
    </HomeWrapper>
  );
}

export default Home;
