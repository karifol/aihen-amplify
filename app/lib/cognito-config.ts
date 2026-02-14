import { Amplify } from 'aws-amplify'

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'ap-northeast-1_1BWSPzgA3',
        userPoolClientId: 'e795nri3mfonghbo32gt5bmhc',
        loginWith: {
          username: true,
        },
      },
    },
  })
}
