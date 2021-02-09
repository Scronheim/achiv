export default function guest ({ next, store, nextMiddleware }) {
  if (store.getters.isLoggedIn) {
    return next({
      name: 'profile'
    })
  }
  return nextMiddleware()
}
