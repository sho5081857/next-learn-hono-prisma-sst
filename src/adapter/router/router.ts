import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { RevenueRepositoryImpl } from '../gateway/revenue'
import { RevenueUseCaseImpl } from '../../usecase/revenue'
import { RevenueHandler } from '../controller/handler/revenue'
import { prisma } from '../../database/config'
import { CustomerRepositoryImpl } from '../gateway/customer'
import { CustomerUseCaseImpl } from '../../usecase/customer'
import { CustomerHandler } from '../controller/handler/customer'
import { InvoiceRepositoryImpl } from '../gateway/invoice'
import { InvoiceUseCaseImpl } from '../../usecase/invoice'
import { InvoiceHandler } from '../controller/handler/invoice'
import { zValidator } from '@hono/zod-validator'
import { UserRepositoryImpl } from '../gateway/user'
import { UserUseCaseImpl } from '../../usecase/user'
import { UserHandler } from '../controller/handler/user'
import { newCreateInvoiceRequest } from '../controller/presenter/invoice/request/createInvoice'
import { newUpdateInvoiceRequest } from '../controller/presenter/invoice/request/updateInvoice'
import { newCreateUserRequest } from '../controller/presenter/user/request/createUser'
import { newLoginRequest } from '../controller/presenter/user/request/login'
import { createInvoiceRequestValid, updateInvoiceRequestValid } from '../controller/presenter/invoice/request/validation'
import { createUserRequestValid, loginRequestValid } from '../controller/presenter/user/request/validation'
import { apiVersion } from '../../api/constants'

const JWT_SECRET = process.env.SECRET ?? 'secret'

const userRepository = new UserRepositoryImpl(prisma)
const userUseCase = new UserUseCaseImpl(userRepository)
const userHandler = new UserHandler(userUseCase)

const customerRepository = new CustomerRepositoryImpl(prisma)
const customerUseCase = new CustomerUseCaseImpl(customerRepository)
const customerHandler = new CustomerHandler(customerUseCase)

const invoiceRepository = new InvoiceRepositoryImpl(prisma)
const invoiceUseCase = new InvoiceUseCaseImpl(invoiceRepository)
const invoiceHandler = new InvoiceHandler(invoiceUseCase)

const revenueRepository = new RevenueRepositoryImpl(prisma)
const revenueUseCase = new RevenueUseCaseImpl(revenueRepository)
const revenueHandler = new RevenueHandler(revenueUseCase)

const user = new Hono().get('/:id', (c) => {
  return userHandler.getUserById(c)
})

const customer = new Hono()
  .get('', (c) => {
    return customerHandler.getAllCustomerList(c)
  })
  .get('/filtered', (c) => {
    return customerHandler.getFilteredCustomerList(c)
  })
  .get('/count', (c) => {
    return customerHandler.getAllCustomerCount(c)
  })

const invoice = new Hono()
  .get('/latest', (c) => {
    return invoiceHandler.getLatestInvoicesList(c)
  })
  .get('/filtered', (c) => {
    return invoiceHandler.getFilteredInvoicesList(c)
  })
  .get('/pages', (c) => {
    return invoiceHandler.getInvoicesPages(c)
  })
  .get('/count', (c) => {
    return invoiceHandler.getAllInvoicesCount(c)
  })
  .get('/:id', (c) => {
    return invoiceHandler.getInvoiceById(c)
  })
  .get('/status/count', (c) => {
    return invoiceHandler.getAllInvoicesStatusCount(c)
  })
  .post('', zValidator('json', createInvoiceRequestValid), (c) => {
    const validated = c.req.valid('json')
    const createInvoice = newCreateInvoiceRequest(validated)
    return invoiceHandler.createInvoice(c, createInvoice)
  })
  .patch('/:id', zValidator('json', updateInvoiceRequestValid), (c) => {
    const validated = c.req.valid('json')
    const updateInvoice = newUpdateInvoiceRequest(validated)
    return invoiceHandler.updateInvoiceById(c, updateInvoice)
  })
  .delete('/:id', (c) => {
    return invoiceHandler.deleteInvoiceById(c)
  })

const revenue = new Hono().get('', (c) => {
  return revenueHandler.getAllRevenueList(c)
})

const base = new Hono()
  .post('/register', zValidator('json', createUserRequestValid), (c) => {
    const validated = c.req.valid('json')
    const createUser = newCreateUserRequest(validated)
    return userHandler.createUser(c, createUser)
  })
  .post('/login', zValidator('json', loginRequestValid), (c) => {
    const validated = c.req.valid('json')
    const loginUser = newLoginRequest(validated)
    return userHandler.loginUser(c, loginUser)
  })

const router = new Hono()
  .use(
    '*',
    cors({
      origin: [process.env.FE_URL ?? 'http://localhost:3000'],
      allowHeaders: ['Content-Type', 'Authorization', 'application/json'],
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    })
  )
  .use('*', logger())
  .use('*', timeout(2000))
  .get('/', (c) => c.html('<h1>Index Page</h1>'))
  .get('/health', (c) => c.json({ status: 'healthy' }))
  .basePath(`/api/${apiVersion}`)
  .use(
    '/users/*',
    jwt({
      secret: JWT_SECRET,
    })
  )
  .use(
    '/customers/*',
    jwt({
      secret: JWT_SECRET,
    })
  )
  .use(
    '/revenues/*',
    jwt({
      secret: JWT_SECRET,
    })
  )
  .use(
    '/invoices/*',
    jwt({
      secret: JWT_SECRET,
    })
  )
  .route('', base)
  .route('/users', user)
  .route('/customers', customer)
  .route('/revenues', revenue)
  .route('/invoices', invoice)

export { router }
export type AppType = typeof router
