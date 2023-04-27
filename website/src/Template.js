
import React from "react";
import { Outlet } from "react-router-dom";
import NavList from "./NavList";

export default function Template() {

    return (
        <>
            <header>Nosson Savin</header>
            <div id="page">
                <div id="pageData">
                    <NavList />
                    <Outlet />
                </div>
            </div>
        </>
    );
}