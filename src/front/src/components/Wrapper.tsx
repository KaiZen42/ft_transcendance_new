import * as React from 'react';
import Nav from './Nav';
// import bgVideo from '../assets/movie2.webm';

interface Props {
  children: JSX.Element | JSX.Element[];
  noImage?: boolean;
}

export default function Wrapper({ children, noImage }: Props) {
  return (
    <>
      <Nav noImage={noImage} />
      <main style={{ height: '100%' }}>{children}</main>

      <video autoPlay muted loop className="video">
        <source src="./movie2.webm" type="video/webm" />
        <source src="../movie2.webm" type="video/webm" />
      </video>
    </>
  );
}
