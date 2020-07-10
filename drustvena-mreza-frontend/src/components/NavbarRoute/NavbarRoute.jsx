import React from 'react';
import Navbar from '../Navigation/Navbar'
import { Route, Switch } from 'react-router-dom'
import Home from '../Home/Home'
import CurrentUserProfile from '../CurrentUserProfile/UserProfile';
import SearchPepople from '../SearchPeople/SearchPeople';
import UserProfile from '../UserProfile/UserProfile'
import useAddAxiosInterceptor from '../../hooks/addAxiosInterceptorHook'
import useRedirectIfNotLoggedIn from '../../hooks/redirectIfNotLoggedIn'

function NavbarRoute() {
  useAddAxiosInterceptor()
  useRedirectIfNotLoggedIn()
  return (
    <div>
      <Navbar>
        <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile" exact component={CurrentUserProfile} />
        <Route path="/search-people" exact component={SearchPepople} />
        <Route path="/users/:userId" exact component={UserProfile} />
        </Switch>
      </Navbar>
    </div>
  );
}

export default NavbarRoute;
