"use client";
import React, { Children } from "react"
import styled from "styled-components";

interface Props {
    children: React.ReactNode;
}

function GlobalStyleProvider({children}: Props) {
    return <GlobalStyles>{children}</GlobalStyles>
}

const GlobalStyles = styled.div`
    padding: 2.5rem;
    display: flex;
    gap: 2.5rem;
    height: 
    `;

export default GlobalStyleProvider