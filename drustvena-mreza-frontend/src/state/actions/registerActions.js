import { axios } from '../../axios'

const register = async ({ user, photo }) => {
    let registeredUser = await axios.post('/users', user).then(res => res.data).catch(err => {
        console.log(err)
        return null
    })
    var photoUploadSuccessful = true
    if (registeredUser && photo) {
        let formData = new FormData()
        formData.append("picture", photo, photo.name)
        photoUploadSuccessful = await axios.post(`/users/${registeredUser.id}/photo`,
            formData
        ).then(() => true).catch((err) => {
            console.log(err)
            return false
        })
    }
    return {
        type: 'REGISTRATION',
        payload: {
            isSuccess: (registeredUser !== null) && photoUploadSuccessful
        }
    }
}
const resetRegisterStatus = () => ({
    type: 'REGISTRATION_STATUS_RESET'
})
export { register as registerAction, resetRegisterStatus }