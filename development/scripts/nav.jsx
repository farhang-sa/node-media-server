import { Link } from 'react-router-dom' ;
const GitLogo = './dist/drawables/vectors/github.svg' ;

const Nav = () =>
    <nav className="menu mainmenu navbar-expand-lg navbar navbar-dark bg-dark">
        <button className="navbar-toggler ms-2" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#myNavbarNav"
                aria-controls="myNavbarNav"
                aria-expanded="true"
                aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="myNavbarNav">
            <ul className="navbar-nav">
                <li className="nav-item active" data-bs-target="#myNavbarNav" data-bs-toggle="collapse">
                    <Link to="/" className="nav-link">
                        <span data-bs-target="#myNavbarNav" data-bs-toggle="collapse">
                            Home
                            <span className="sr-only hidden">(current)</span>
                        </span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="socket-radio" className="nav-link" >
                        <span data-bs-target="#myNavbarNav" data-bs-toggle="collapse">Radio</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="socket-tv" className="nav-link">
                        <span data-bs-target="#myNavbarNav" data-bs-toggle="collapse">TV</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="p2p-voice" className="nav-link">
                        <span data-bs-target="#myNavbarNav">Voice Call</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="p2p-video" className="nav-link">
                        <span data-bs-target="#myNavbarNav">Video Call</span>
                    </Link>
                </li>
            </ul>
        </div>
        <div className="ms-3 me-1">
            <a href="https://github.com/farhang-sa/node-media-server"
               className="p-2 gitub-link" target="_blank">
                <img src={GitLogo} style={{width: 35, height: 35}}
                     alt="github icon"
                     className="img img-fluid rounded-circle"/>
            </a>
        </div>
    </nav>

export default Nav;