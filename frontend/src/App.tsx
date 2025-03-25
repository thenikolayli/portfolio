import UserDataContext from "./util/Context.tsx";
import {Route, Router} from "@solidjs/router";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AccessKeys from "./pages/AccessKeys.tsx";
import KeyClub from "./pages/KeyClub.tsx";
import NotFound from "./pages/NotFound.tsx";
import KeyClubLogging from "./pages/KeyClubLogging.tsx";
import {useContext, onMount} from "solid-js";

const App = ()=> {
    const context: any = useContext(UserDataContext)

    onMount(() => {
        context.refresh_token().finally()

        setInterval(() => {
            context.refresh_token().finally()
        }, 4 * 60 * 1000) // every 4 minutes
    })

    return (
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/accesskeys" component={AccessKeys}/>
            <Route path="/keyclub" component={KeyClub}/>
            <Route path="/keyclub/log" component={KeyClubLogging}/>
            <Route path="*" component={NotFound}/>
        </Router>
    )
}

export default App