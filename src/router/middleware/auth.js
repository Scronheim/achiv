export default function auth ({ next, store, nextMiddleware }) {
  if (!store.getters.isLoggedIn) {
    return next({
      name: 'Login'
    })
  }
  return nextMiddleware()
}
