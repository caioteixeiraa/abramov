const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (() => {
  ac.grant('basic')
    .createOwn(['mentee', 'mentor', 'user'])
    .readOwn(['mentee', 'mentor', 'user'])
    .updateOwn(['mentee', 'mentor', 'user'])
  
  ac.grant('admin')
    .extend('basic')
    .readAny(['mentee', 'mentor', 'user'])
    .createAny('connection')
    .readAny('connection')
  
  return ac
})()