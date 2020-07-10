import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import StatusList from '../StatusList/StatusList';
import PostStatusDialog from '../PostStatusDialog/PostStatusDialog';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserFriendStatuses as fetchUserFriendStatusesAction } from '../../state/actions'
import SearchBar from '../SearchBar/SearchBar'
import { fetchStatusLikes } from '../../state/actions'

function Home() {
  const allFriendsStatuses = useSelector(state => state.usersFriendsStatuses)
  const [filteredStatuses, setFilteredStatuses] = useState([])
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [searchString, setSearchString] = useState('')
  const token = useSelector(state=>state.user.token)

  useEffect(() => {
    const fetchPosts = async () => dispatch(await fetchUserFriendStatusesAction(user.id, token))
    fetchPosts()
  }, [user.id, dispatch, token])

  useEffect(() => {
    setFilteredStatuses(allFriendsStatuses)
  }, [allFriendsStatuses])

  const filterStatuses = () => {
    setFilteredStatuses(allFriendsStatuses
      .filter(st => {
        return st.contents.toLowerCase().includes(searchString.toLowerCase())
          ||
          st.user.username.toLowerCase().includes(searchString.toLowerCase())
          ||
          (st.user.firstName && st.user.firstName.toLowerCase().includes(searchString.toLowerCase()))
          ||
          (st.user.lastName && st.user.lastName.toLowerCase().includes(searchString.toLowerCase()))
      })
    )
  }

  useEffect(()=>{
    (async ()=>dispatch(await fetchStatusLikes(user.id, token)))()
  }, [user.id, dispatch, token])

  return (
    <div>
      <Container maxWidth="md">
        <SearchBar onSearch={filterStatuses} onChange={e=>setSearchString(e.target.value)} placeholder="Search for statuses"/>
        <StatusList items={filteredStatuses} />
      </Container>
      <PostStatusDialog />
    </div>
  );
}

export default Home;
