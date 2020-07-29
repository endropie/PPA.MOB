import Vuelidate from 'vuelidate'
import * as validators from 'vuelidate/lib/validators'


const isFn = x => typeof x === 'function'
const plural = (strings, v) => {
  const text = strings.split('|')
  if (v === 0) return text[0]
  if (v === 1) return text[1]
  else return v +' '+ text[2]
}
const resolvePath = (object, path = '', defaultValue) => {
  return path
  .split(/[\.\[\]\'\"]/)
  .filter(p => p)
  .reduce((o, p) => o ? o[p] : defaultValue, object)
}

// Given a Vuelidate validations object, find the validator keys
function extractValidatorKeys (validations) {
  const keys = Object.keys(validations)
  const validatorKeys = keys.filter(x => isFn(validations[x]))
  const nested = keys.filter(x => !isFn(validations[x]))
  return validatorKeys.concat(
    ...nested.map(x => extractValidatorKeys(validations[x]))
  )
}

export const validationMessageCreators = {
  required: () => 'Required',
  email: () => 'Invalid email',
  minLength: ({ $params }) => {
    const min = plural(
      'no characters | one character |  characters',
      $params.minLength.min
    )
    return `Must be at least ${min}`
  }
}

export const getValidationMessage = (messages, name) => (validations, name2) => {
  let keys = extractValidatorKeys(validations)
  // check to make sure all validators have error messages
  const missing = keys.filter(x => !(x in messages))
  if (missing.length) {
    console.warn(
      '[Vuelidate] Validators missing validation messages: %s',
      missing.join(', ')
    )
    // remove keys that don't have validation messages
    keys = keys.filter(x => missing.indexOf(x) < 0)
  }

  // Vue component method
  // Given a vuelidate field object, maybe return a string
  return function (...args) {
    let field = args[0]
    const fieldName = () => {
      if (args[1] === null) return ''
      return Boolean(args[1]) ? `${args[1]} ` : `The field `
    }

    if (!field || !field.$error) return null;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      if (field[key] === false) {
        return fieldName() + messages[key].apply(this, args)
      }
    }
    return `${fieldName()} is failed!`
  }
}

export const validationMessage = getValidationMessage(validationMessageCreators)


export default ({ Vue }) => {

  // validators.message = validationMessage(validators)
  // validators.touching = (obj, key) => {
  //   let attr
  //   if (attr = resolvePath(obj, key)) {
  //     attr.$touch()
  //     return true
  //   }
  // }

  const vuelidate = {
    message: validationMessage(validators),
    touch: (obj, key) => {
      let attr = resolvePath(obj, key)
      if (attr) {
        console.warn('resolve', obj, key, attr)
        attr.$touch()
        return true
      }
    },
    attr: (obj, key) => {
      let attr = resolvePath(obj, key)
      if(!attr && process.env.DEV) {
        console.warn(`[vuelidate] The validation assign "${key}" undefined!`)
      }
      if (attr) return attr

      return {
        $error: false,
        $invalid: false,
        $dirty: false,
        $touch: () => {
          console.warn(`[vuelidate] The Method $touch of "${key}" Undifined!`)
        }
      }
    },
  }
  // getValidationMessage = (messages) => (validations)
  Vue.use(Vuelidate)
  Vue.prototype.$validator = validators
  Vue.prototype.$vuelidate = vuelidate
}
