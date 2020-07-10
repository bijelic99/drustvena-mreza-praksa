import React from 'react';
import './search-people.css'
import { Container, Box } from '@material-ui/core'
import PersonList from '../PersonList/PersonList';
import { axios } from '../../axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFriendList } from '../../state/actions'
import SearchBar from '../SearchBar/SearchBar'

function SearchPepople() {
  const [users, setUsers] = React.useState([])
  const [searchString, setSearchString] = React.useState("")
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const fetchIfNotSet = async () => {
    if (!user.friends) dispatch(await fetchFriendList(user.id))
  }

  fetchIfNotSet()

  const getPeople = () => {
    axios.get('/users', {
      params: {
        search: searchString
      }
    }).then(({ data }) => setUsers(data.map(u => {
      if (!user.friends) u.friend = null
      else u.friend = user.friends
        .filter(fr => fr.firstUser === u.id || fr.secondUser === u.id).length > 0
      u.currentUser = user.id === u.id
      return u
    }))).catch(() => setUsers([]))
  }


  return (
    <Container maxWidth="md">
      <SearchBar onSearch={getPeople} onChange={e => setSearchString(e.target.value)} placeholder="Search for people" />
      <Box p={1} mt={2} display="flex" width={1} flexDirection="column" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
        <PersonList items={users} />
      </Box>
    </Container>

  );
}

export default SearchPepople;
