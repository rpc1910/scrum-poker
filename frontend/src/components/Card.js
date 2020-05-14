import React from "react";
import styled, { css } from "styled-components";

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
`;

const sharedCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border-radius: 20px;
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
`;

const FlipCardFront = styled.div`
  ${sharedCss}
  background-color: #bbb;
  color: black;
`;

const FlipCardBack = styled.div`
  ${sharedCss}
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
`;

const FlipCard = styled.div`
  background-color: transparent;
  width: 200px;
  height: 300px;
  border: 1px solid #f1f1f1;
  perspective: 1000px;
  cursor: pointer;
  ${({ open }) =>
    open &&
    css`
      ${FlipCardInner} {
        transform: rotateY(180deg);
      }
    `}
  ${({ checked }) =>
    checked &&
    css`
      ${FlipCardFront}, ${FlipCardBack} {
        box-shadow: 0px 0px 15px green;
        background-color: green;
      }
    `}
`;

function Card({ frontText, backText, open, checked, ...rest }) {
  return (
    <FlipCard open={open} checked={checked} {...rest}>
      <FlipCardInner>
        <FlipCardFront>{frontText}</FlipCardFront>
        <FlipCardBack>{backText}</FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
}

export default Card;
