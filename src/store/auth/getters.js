export function user (state) {
  return state.user
}

export function loggedIn (state) {
  return state.user !== null
}

export const check = state => permissions => {
  const user = state.user
  if (user) {
    if (Array.isArray(permissions) && permissions.length > 0) {
      for (let permission of permissions) {
        if (!user.permissions.includes(permission)) {
          return false
        }
      }
    } else if (permissions) {
      if (!user.permissions.includes(permissions)) {
        return false
      }
    }
    return true
  }
  return false
}
