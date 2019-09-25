import styled, { css } from 'styled-components';

const dragActive = css`
    border-color: #78e5d5
`;

const dragReject = css`
    border-color: #e57878
`;

export const CreateForm = styled.form`
    width: 100%;
    
    label {
        margin-top: 20px;
        font-size: 24px;
        color: #ff4d00;
    }

    div {

        width: 100%;
    }

    #error {
        color: red;
    }

    #nameSuggested{
        text-align:center;
    }
    
    p {
        margin-bottom: 10px;
    }

    button {
        margin-top: 20px;   
        background-color: #1f3e95;
    }

    #clear {
        margin-left: 50px;
    }

    & + div {
        margin-top: 15px;
      }

`;


export const DropContainer = styled.div.attrs({
    className:"dropzone"
})`
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor: pointer.App
    
    transition: height 0.2s ease;

    ${props => props.isDragActive && dragActive}
    ${props => props.isDragReject && dragReject}

`;

const messageColors = {
    default : '#999',
    error: '#e57878',
    success: '#78e5d5'
}

export const UploadMessage = styled.p`
    display: flex;
    color: ${props => messageColors[props.type || "default"]};
    justify-content: center;
    align-items: center;
    padding: 15px 0;
`;
