import React from 'react';
import { useState } from 'react'
import { Grid, TextField, Button, ButtonGroup, Box, Link, Snackbar, Typography } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { DropzoneArea } from 'material-ui-dropzone'
import './register.css'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerAction, resetRegisterStatus } from '../../state/actions'
import { axios } from '../../axios'
import useAddAxiosInterceptor from '../../hooks/addAxiosInterceptorHook'

const Register = () => {
  const registrationStatus = useSelector(state => state.registrationStatus)
  const { register, handleSubmit, errors } = useForm()
  const [password, setPassword] = useState('');
  const [photoObj, setPhotoObj] = useState(null)
  const dispatch = useDispatch()
  useAddAxiosInterceptor()

  const onSubmit = async (user) => {
    delete user.repeatPassword
    dispatch(await registerAction({ user, photo: photoObj }))
  }

  const isEmailUnique = async (email) =>
    axios.get(`/users/email/${email}/is-unique`)
      .then(({ data }) => data)
      .catch(() => false)
      .then(res => res || 'Email already exists')

  const isUsernameUnique = async (username) =>
    axios.get(`/users/username/${username}/is-unique`)
      .then(({ data }) => data)
      .catch(() => false)
      .then(res => res || 'Username already exists')



  return (
    <Grid className="fullheight" container direction="row" justify="center" alignItems="center">
      <Grid item xs={11} sm={10} md={6} lg={4}>
        <Box component="form" noValidate p={2} className="box-item" boxShadow={1} onSubmit={handleSubmit(onSubmit)}>
          <DropzoneArea
            fullWidth
            filesLimit={1}
            acceptedFiles={['image/*']}
            dropzoneText={"Drop your profile picture here or click to browse"}
            onDrop={files => files.length > 0 ? setPhotoObj(files[0]) : false}
            onDelete={() => setPhotoObj(null)}

          />
          <Box my={1}>
            <TextField fullWidth id="username-text-field" label="Username"
              inputProps={{
                name: "username",
                ref: register({
                  required: "Username is required",
                  validate: isUsernameUnique
                })
              }}
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : ''}
            />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="email-text-field" label="Email" type="email"
              inputProps={{
                name: "email",
                ref: register({
                  required: "Email is required",
                  pattern: {
                    value: /^.+@.+\..+$/,
                    message: "Email needs to be in the correct format"
                  },
                  validate: isEmailUnique
                })
              }}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : ''}
            />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="firstname-text-field" label="Firstname"
              inputProps={{
                name: "firstName",
                ref: register
              }}
              name="firstname" ref={register} />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="lastname-text-field" label="Lastname"
              inputProps={{
                name: "lastName",
                ref: register
              }}
            />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="password-text-field" label="Password" type="password"
              inputProps={{
                name: "password",
                ref: register({
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password needs to be at least 8 charachters long"
                  },
                  pattern: {
                    value: /.{7,}\d{1,}/,
                    message: "Password needs to have at least one number"
                  }
                })
              }}
              onChange={e => setPassword(e.target.value)}
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : ''}
            />
          </Box>
          <Box my={1}>
            <TextField fullWidth id="repeat-password-text-field" label="Repeat password" type="password"
              inputProps={{
                name: "repeatPassword",
                ref: register({
                  required: "Field is required", validate: {
                    sameAsPassword: value => value === password
                  }
                })
              }}
              error={errors.repeatPassword ? true : false}
              helperText={errors.repeatPassword ? errors.repeatPassword.type === "sameAsPassword" ? "Needs to be same as the password field" : errors.repeatPassword.message : ''}
            />
          </Box>
          <Box my={2} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" >
            <Link component={RouterLink} to="/login">
              Already a member, login?
            </Link>
          </Box>
          <Box mt={2}>
            <ButtonGroup fullWidth>
              <Button variant="contained" color='primary' type="submit">
                Register
              </Button>
            </ButtonGroup>

          </Box>

        </Box>

      </Grid>
      <Snackbar open={registrationStatus !== null} autoHideDuration={5000} onClose={() => dispatch(resetRegisterStatus())}>
        <MuiAlert elevation={6} variant="filled" severity={registrationStatus ? 'success' : 'warning'} onClose={() => dispatch(resetRegisterStatus())}>
          {registrationStatus ?
            <Box
              width={1}
              display="flex"
              flexDirection="row"
              flexWrap="nowrap"
              justifyContent="space-between"
              alignItems="center">
              <Typography component="span">Registration success</Typography>
              <Box component="span" ml={2}>
                <Link component={RouterLink} to="/login">
                  Login page
              </Link>
              </Box>

            </Box>
            :
            'Registration Failed'}
        </MuiAlert>
      </Snackbar>
    </Grid>

  );
}

export default Register;
