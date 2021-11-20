/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    GET_EVENTS: process.env.GET_EVENTS,
    GET_ADMINS: process.env.GET_ADMINS,
    GET_MESSAGES: process.env.GET_MESSAGES,
  },
};
