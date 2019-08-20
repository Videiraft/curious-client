import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom'; // eslint-disable-line
import RoadmapTree from '../RoadmapTree/RoadmapTree';
import { useMutation, useQuery } from '@apollo/react-hooks';

type TParams = { id: string };

const GET_ROADMAP_INFO = gql`
query getRoadmap($id: ID!) {
  roadmaps(id: $id) {
    UserId
    title
    category
    topics {
      title
      rowNumber
    }
  }
}
`;

const FORK_ROADMAP = gql`
  mutation forkRoadmap($title: String! $UserId: ID! $category: String!) {
    createRoadmap(title: $title, UserId: $UserId, category: $category) {
      id
    }
  }
`;
let flag = true;
// TODO: Make id dynamic
const RoadmapPreview = ({ match }: RouteComponentProps<TParams>) => {
  const { data, loading } = useQuery(GET_ROADMAP_INFO, {
    variables: {
      id: '1',
    },
  });

  const [createRoadmap] = useMutation(FORK_ROADMAP);
  console.log(data);

  if (loading) return null;
  if (data.roadmaps && flag) {
    const { title, category, UserId } = data.roadmaps[0];
    console.log(title, category, UserId);
    flag = false;
    createRoadmap({ variables: { title, category, UserId } })
      .then((dataRoadmap: any) => {
        console.log(dataRoadmap.data.createRoadmap.id);
      })
  }


  return (
    <div className="roadmap-tree-container">
      <RoadmapTree matchId={match.params.id} />
    </div>
  )
};

export default RoadmapPreview;
