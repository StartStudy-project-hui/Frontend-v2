import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Cookies } from 'react-cookie'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  })
  const formattedDate = date
    .replace(/\./g, '')
    .replace(' ', '.')
    .replace(' ', '.')
    .slice(0, -3)

  return formattedDate
}

export function sanitizeContent(content: string) {
  const reg = /(<([^>]+)>)/g
  const sanitizedContent = content.replace(reg, '')

  return sanitizedContent
}

/* 쿠키 & 토큰 */
interface CookieOptions {
  path: string
}

const cookies = new Cookies()

export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions
) => {
  return cookies.set(name, value, { ...options })
}

export const getCookie = (name: string) => {
  return cookies.get(name)
}

export const removeCookie = (name: string) => {
  cookies.remove(name)
}

export const setAccessToken = (token: string) => {
  removeAccessToken()
  localStorage.setItem('accessToken', token)
}

export const setRefreshToken = (token: string) => {
  removeRefreshToken()
  localStorage.setItem('refreshToken', token)
}

export const setRefreshTokenCookie = (token: string) => {
  removeRefreshTokenAtCookie()
  setCookie('refreshToken', token, { path: '/' })
}

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('accessToken')
  return accessToken
}

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken')
  return refreshToken
}

export const getRefreshTokenCookie = () => {
  const refreshToken = getCookie('refreshToken')
  return refreshToken
}

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken')
}

export const removeRefreshToken = () => {
  localStorage.removeItem('refreshToken')
}

export const removeRefreshTokenAtCookie = () => {
  removeCookie('refreshToken')
}
