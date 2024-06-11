"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import React from "react";
import styled from "styled-components";

function Sidebar() {
const {theme} = useGlobalState();


console.log(theme);

    return <SidebarStyled>Sidebar</SidebarStyled>
}

const SidebarStyled = styled.nav`

`;
export default Sidebar;