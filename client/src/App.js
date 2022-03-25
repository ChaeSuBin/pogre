import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Home } from "./pages/rootPage";
import { UploadIead } from "./pages/IdeaUpage";
import { JoinIead }  from "./pages/ideaJoin";
//import { Viewidea } from "./pages/ideaView";
import ViewItems from "./pages/ideaView";
import Resist from './pages/Resist';

function Footer() {
  return (
    <footer className="footer ">
      <div className="content">
        <p className="has-text-centered">
          this program is PROTO of main stream。
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="App">
      <header>
        <Router>
          <section className="">
            <div className="container">
              <Routes>
                <Route exact path='/' element={<Home />}/>
                <Route exact path='/regist' element={<Resist />}/>
                <Route exact path='/upload' element={<UploadIead />}/>
                <Route exact path='/search' element={<ViewItems />}/>
                <Route exact path='/upjoin' element={<JoinIead />}/>
              </Routes>
            </div>
          </section>
          <Footer />
        </Router>
      </header>
    </div>
  );
}

export default App;
