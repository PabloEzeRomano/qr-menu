import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error('Missing MP_ACCESS_TOKEN')
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export const mpPreference = new Preference(mpClient)
export const mpPayment = new Payment(mpClient)
