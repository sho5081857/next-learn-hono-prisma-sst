/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'next-learn-hono',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: process.env.AWS_REGION as aws.Region,
        },
      },
      dev: {
        username: 'postgres',
        password: 'password',
        database: 'local',
        port: 5432,
      },
    }
  },
  async run() {
    const vpc = new sst.aws.Vpc('MyVpc', { bastion: true, nat: 'ec2' })
    const rds = new sst.aws.Postgres('MyPostgres', {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dev: {
        username: 'postgres',
        password: 'password',
        database: 'local',
        host: 'localhost',
        port: 5432,
      },
      vpc,
    })

    const databaseUrl = $interpolate`postgresql://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}`

    new sst.x.DevCommand('Prisma', {
      environment: { DATABASE_URL: databaseUrl },
      dev: {
        autostart: false,
        command: 'npx prisma studio',
      },
    })

    new sst.aws.Function('Hono', {
      url: true,
      vpc,
      link: [rds],
      environment: { DATABASE_URL: databaseUrl },
      handler: 'src/index.handler',
      copyFiles: [{ from: 'node_modules/.prisma/client/' }],
    })
  },
})
