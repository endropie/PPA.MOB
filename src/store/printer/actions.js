

export function connectBTPrinter ({state, commit, dispatch}, item) {
  return new Promise( function(resolve, reject) {
    return BTPrinter.connect((conn) => {
      commit('usePrinter', 'BTPrinter')
      commit('setBTPrinter', item)
      setTimeout(() => {
        resolve(conn)
      }, 1500)
    },(fail) => {
      reject(fail)
    }, item.name)
  })
}

export function disconnectBTPrinter ({commit}, item) {
  return new Promise( function(resolve, reject) {
    return BTPrinter.disconnect((conn) => {
      commit('usePrinter', null)
      commit('setBTPrinter', null)
      setTimeout(() => {
        resolve(conn)
      }, 500)
    },(fail) => {
      reject(fail)
    }, item.name)
  })
}


