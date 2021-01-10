import { makeAutoObservable } from 'mobx';

class UserStore {
  currentUser = {}

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentUser(newUser) {
    this.currentUser = newUser
  }
}

export const userStore = new UserStore()
