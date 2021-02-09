export default function isAdmin ({ next, store, nextMiddleware }){
  if(!store.getters.isAdmin){
    return next({
      name: 'Profile'
    })
  }

  return nextMiddleware()
}
