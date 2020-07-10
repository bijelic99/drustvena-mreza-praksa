import React, { useEffect } from 'react';
import { Grid, TextField, Button, ButtonGroup, Box, FormControlLabel, Checkbox, Link, Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import './login.css'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, resetLoginStatus } from '../../state/actions'
import useAddAxiosInterceptor from '../../hooks/addAxiosInterceptorHook'

function Login() {
  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()
  const loginStatus = useSelector(state => state.loginStatus)
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const history = useHistory()
  useAddAxiosInterceptor()

  const onSubmit = async (data) => {
    const { rememberMe, ...credentials } = data
    dispatch(await loginAction({ credentials, rememberMe }))
  }

  const redirectToHome = () => history.push('/')

  useEffect(() => {
    if (isLoggedIn) redirectToHome()
  })


  return (
    <Grid className="fullheight" container direction="row" justify="center" alignItems="center">
      <Grid item xs={11} sm={10} md={6} lg={4}>
        <Box component="form" noValidate p={2} className="box-item" boxShadow={1} onSubmit={handleSubmit(onSubmit)}>
          <Box my={1}>
            <TextField fullWidth id="username-text-field" label="Username"
              inputProps={{
                name: "username",
                ref: register({
                  required: "Username is required"
                })
              }}
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : ''}
            />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="password-text-field" label="Password" type="password"
              inputProps={{
                name: "password",
                ref: register({
                  required: "Password is required"
                })
              }}
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : ''}
            />
          </Box>
          <Box my={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" >
            <Link component={RouterLink} to="/register">
              Not a member yet, register?
            </Link>
            <FormControlLabel
              control={
                <Checkbox
                  name="remember_me"
                  color="primary"
                  inputProps={{
                    name: "rememberMe",
                    ref: register
                  }}
                />
              }
              label="Remember me"
            />
          </Box>
          <Box mt={2}>
            <ButtonGroup fullWidth>
              <Button variant="contained" color='primary' type="submit">
                Login
              </Button>
            </ButtonGroup>

          </Box>

        </Box>

      </Grid>
      <Snackbar open={loginStatus === false} autoHideDuration={5000} onClose={() => dispatch(resetLoginStatus())}>
        <MuiAlert elevation={6} variant="filled" severity={'warning'} onClose={() => dispatch(resetLoginStatus())}>
          Wrong username or password
      </MuiAlert>

      </Snackbar>

    </Grid>
  );
}

export default Login;
