import styled from "styled-components";

export const Container = styled.ul`
  margin-top: 20px;
   li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #444;
    & + li {
      margin-top: 15px;
    }
  }
`;

export const Search = styled.div`
  margin-bottom: 30px;
  width:100%;

  label {
    margin-top: 20px;
    font-size: 24px;
    color: #ff4d00;
  }

  div {
    margin-left: 15px;
    div {
      color: #ff4d00;
    }
  }

`

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  overflow:auto;
  div {
    display: flex;
    flex-direction: column;
    span {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
      button {
        border: 0;
        background: transparent;
        color: #e57878;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
`;

export const Preview = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  margin-right: 10px;
`;