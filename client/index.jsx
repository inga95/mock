import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import style from "./index.css"




function FrontPage() {
    return (
        <div>
            <h1 id="welcome">Welcome!</h1>
            <div>
                <Link id="login" to="/login">Login with Google</Link>
            </div>
        </div>
    );
}

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed ${res.status}`);
    }
    return await res.json();
}

function Login() {
    useEffect(async () => {
        const { authorization_endpoint } = await fetchJSON(
            "https://accounts.google.com/.well-known/openid-configuration"
        );

        const parameters = {
            response_type: "token",
            client_id:
                "168627664818-4rcp49utgf8fjbun2m9n9j7k2m2nenf1.apps.googleusercontent.com",
            scope: "email profile",
            redirect_uri: window.location.origin + "/login/callback",
        };

        window.location.href =
            authorization_endpoint + "?" + new URLSearchParams(parameters);
    }, []);

    return (
        <div>
            <h1>Please wait....</h1>
        </div>
    );
}

function LoginCallback() {
    useEffect(async () => {
        const { access_token } = Object.fromEntries(
            new URLSearchParams(window.location.hash.substring(1))
        );
        console.log(access_token);

        await fetch("/api/login", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ access_token }),
        });
    });

    return <h1>Login callback!!</h1>;
}

function Application() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<FrontPage />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/login/callback"} element={<LoginCallback />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.render(<Application />, document.getElementById("app"));