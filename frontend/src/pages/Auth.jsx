import Signin from './Auth/Signin';
import Signup from './Auth/Signup';

export default function Auth({ mode = 'signin', onSwitchMode, onAuthSuccess }) {
  const isSignup = mode === 'signup'

  if (isSignup) {
    return (
      <Signup
        onAuthSuccess={onAuthSuccess}
        onGoToSignin={() => onSwitchMode?.('signin')}
      />
    )
  }

  return (
    <Signin
      onAuthSuccess={onAuthSuccess}
      onGoToSignup={() => onSwitchMode?.('signup')}
    />
  )
}
