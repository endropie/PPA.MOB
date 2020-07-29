export function setUser (state, data) {
  // console.warn('MUTATION USER', data)
  if (data) {
    state.user = {
      id: data.id,
      email: data.email,
      name: data.name,
      permissions: data.permissions,
    }
  } else {
    state.user = null
  }
}
