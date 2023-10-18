import { ReactElement } from 'react';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Greeter } from './components/Greeter';
import { SectionDivider } from './components/SectionDivider';
import { SignMessage } from './components/SignMessage';
import { WalletStatus } from './components/WalletStatus';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import {Home} from './components/Home';
import './index.css';
const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;


export function App(): ReactElement {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/example" element={<Example/>} />
      <Route path="" element={<Home/>} />
    </Routes>
    </BrowserRouter>
  );
}

function Example(): ReactElement {
  return(
<StyledAppDiv>
      <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <SignMessage />
      <SectionDivider />
      <Greeter />
    </StyledAppDiv>
  )
}
