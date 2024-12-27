import {UserDataProvider} from "./util/Context.tsx";
import {Route, Router} from "@solidjs/router";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AccessKeys from "./pages/AccessKeys.tsx";
import KeyClub from "./pages/KeyClub.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = ()=> (
    <UserDataProvider>
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/accesskeys" component={AccessKeys}/>
            <Route path="/keyclub" component={KeyClub}/>
            <Route path="*" component={NotFound}/>
        </Router>
    </UserDataProvider>
)

export default App