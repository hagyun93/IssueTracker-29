import React, { useState } from 'react';
import { useIssues } from '../issuelist/issueHook.js';
import styled from 'styled-components';

const IssueHeadContainer = styled.div`
  border-bottom: 1px solid #d1d5da;
  margin-bottom: 20px;
`;

const EditTitleButton = styled.button`
  float: right;
  padding: 10px;
  margin-right: 100px;
`;

const SaveTitleButton = styled.button``;

const CancelTitleButton = styled.button``;

const EditContentsButton = styled.button``;

const IssueBodyContainer = styled.div`
  border: 1px solid #d1d5da;
  width: 60%;
`;

const IssueContentsTopBar = styled.div`
  background-color: #d1d5da;
  border: 1px solid #d1d5da;
`;

const IssueContents = styled.div`
  padding: 15px;
`;

const CloseIssueButton = styled.button``;
const CommentIssueButton = styled.button``;

const IssueDetail = ({ match }) => {
  const [isOpen, setIsOpen] = useState(1);

  const editTitle = (e) => {
    setTitle(e.target.value);
  };

  const issues = useIssues();
  const { id } = match.params;
  const issue = issues[id - 1];

  if (!issue) {
    return <div>존재하지 않는 유저입니다.</div>
  }
  return (
    <>
      <IssueHeadContainer>
        <EditTitleButton onClick={editTitle}>Edit</EditTitleButton>
        <h3>{issue.title} #{issue.id}</h3>
        {issue.is_open === 1 ? <p>Open</p> : <p>Closed</p>}
      </IssueHeadContainer>
      <IssueBodyContainer>
        <IssueContentsTopBar>{issue.user_id} commented 3 days ago</IssueContentsTopBar>
        <IssueContents>{issue.contents}</IssueContents>
      </IssueBodyContainer>
    </>
  );
};

export default IssueDetail;