import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { Link, Redirect } from "react-router-dom";
import { BASE_API_URL } from '../../../util/config';
import { sendPostRequest, sendImagePostRequest } from '../common/api';

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const TitleInput = styled.input``;

const ContentWrap = styled.div`
    width: 300px;
    height: auto;
    position: relative;
    display: inline-block;
`;

const TextCountSpan = styled.span`
    display: ${props => (props.timeCheck ? 'flex' : 'none')};
    position: absolute;
    bottom: 2px;
    right: 2px;
`;

const ContentTextarea = styled.textarea`
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
`;

const CancelButton = styled.button`
    background-color: white;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    background-color: #2EA44F;
    color: white;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
`;

const ImageFileBoxLabel = styled.label`
    background-color: white;
    cursor: pointer;
`;

const ImageFileBoxInput = styled.input`
    position: absolute;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
`;

const Content = (props) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [characterCount, setCharacterCount] = useState(0);
    const [timeCheck, setTimeCheck] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [imageFileName, setImageFileName] = useState("");
    const [issueId, setIssueId] = useState(-1);
    const [redirect, setRedirect] = useState(false);

    useEffect( () => {
        const timeout = setTimeout( () => {
            setTimeCheck(true);
            setTimeout( () => {
                setTimeCheck(false);
            }, 2000);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [content]);

    useEffect( () => {
        if(imageURL && imageFileName) {
            setContent(content + convertMarkDownImage(imageFileName, imageURL));
        }
    }, [imageURL]);

    const changeTitleData = (e) => {
        setTitle(e.target.value);
    };

    const changeContentData = (e) => {
        const {value} = e.target;
        setContent(e.target.value);
        setCharacterCount(value.length);
    };

    const submitClickEvent = async (e) => {
        const resultIssueId = await sendPostRequest('/issue', {title:title});
        setIssueId(resultIssueId.result);
        await sendPostRequest(`/issue/${resultIssueId.result}/comment`, {contents:content});
        setRedirect(true);
    };
    
    const handleImageFile = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        setImageFileName(e.target.files[0].name.split('.')[0]);
        const result = await sendImagePostRequest('/upload', formData);
        setImageURL(BASE_API_URL + result.url);
    };

    return (
        <ContentContainer>
            <TitleInput placeholder="Title" onChange={changeTitleData}/>
            <div>Write</div>
            <ContentWrap>
                <ContentTextarea placeholder="Leave a comment" value={content} onChange={changeContentData} />
                <TextCountSpan timeCheck={timeCheck}>{characterCount} characters</TextCountSpan>
            </ContentWrap>
            
            <ImageFileBoxLabel htmlFor="file">Attach files by selecting here</ImageFileBoxLabel>
            <ImageFileBoxInput type="file" id="file" accept="image/jpeg, image/jpg, image/png" onChange={handleImageFile}></ImageFileBoxInput>
            
            <ButtonContainer>
                <Link to="/issue">
                    <CancelButton>Cancel</CancelButton>
                </Link>
                <SubmitButton onClick={submitClickEvent}>Submit new issue</SubmitButton>
            </ButtonContainer>
            {(!redirect)? null : <Redirect to={`/issue/${issueId}`}/>}
        </ContentContainer>
    );
};

function convertMarkDownImage(imageFileName, imageURL) {
    return `![${imageFileName}](${imageURL})`;
}

export default Content;
