import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalCtx } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faGlobe,
  faHouseUser,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const user = <FontAwesomeIcon icon={faUser} />;
const globe = <FontAwesomeIcon icon={faGlobe} />;
const home = <FontAwesomeIcon icon={faHouseUser} />;
const searchIcon = <FontAwesomeIcon icon={faSearch} />;

const Header = () => {
  const { gState } = useContext(GlobalCtx);

  const allPosts = (
    <Link to="/">
      <h1 className="header-btn" title="Popular Posts">
        {globe}
      </h1>
    </Link>
  );
  const myFollowers = (
    <Link to="/home">
      <h1 className="header-btn" title="My Feed">
        {home}
      </h1>
    </Link>
  );
  const myProfile = (
    <Link to="/my_profile">
      <h1 className="header-btn" title="My Profile">
        {user}
      </h1>
    </Link>
  );
  const search = (
    <Link to="/search">
      <h1 className="header-btn" title="Search">
        {searchIcon}
      </h1>
    </Link>
  );

  return (
    <nav>
      {/* Show logout and myProfile if the user is currently logged in */}
      {gState.token ? myProfile : null}
      {gState.token ? myFollowers : null}
      {gState.token ? search : null}
      {gState.token ? allPosts : null}
    </nav>
  );
};

export default Header;
