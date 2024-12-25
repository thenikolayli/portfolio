import {UserDataProvider} from "./util/Context.tsx";
import Home from "./pages/Home.tsx";
import {Route, Router} from "@solidjs/router";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Register from "./pages/Register.tsx";
import AccessKeys from "./pages/AccessKeys.tsx";

const App = ()=> (
    <UserDataProvider>
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/accesskeys" component={AccessKeys}/>
            <Route path="*" component={NotFound}/>
        </Router>
    </UserDataProvider>
)

export default App