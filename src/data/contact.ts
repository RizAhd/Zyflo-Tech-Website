import { contact, isTodo, socials } from './site.config'

/** Contact values that are really set, derived once and shared by every section. */
export const email = isTodo(contact.email) ? null : contact.email
export const whatsapp = isTodo(contact.whatsapp)
  ? null
  : `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`
export const phone = isTodo(contact.phone) ? null : contact.phone
export const formKey = isTodo(contact.web3formsKey) ? null : contact.web3formsKey
export const activeSocials = socials.filter((s) => !isTodo(s.url))
