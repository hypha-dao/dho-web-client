import axios from 'axios'

export default {
  verifyChallenge(params) {
    return new Promise((resolve, reject) => {
      const verifyChallangeURL = `${process.env.CAPTCHA_HOST}/challenge/verify/recaptcha`

      axios
        .post(verifyChallangeURL, params)
        .then((response) => {
          if (response.data.hasErrors) {
            reject(response.data.message)
          } else {
            resolve(response.data)
          }
        })
        .catch((error) => {
          reject(error.message)
        })
    })
  }
}
