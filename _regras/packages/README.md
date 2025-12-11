/src
  /domain
    /entities
    /value-objects
    /repositories
    /services
    /exceptions

  /application
    /use-cases
      /create-user
        CreateUser.ts
        CreateUserDTO.ts
        CreateUserResponse.ts
      /update-user
      /delete-user
    /interfaces
      IUserRepository.ts
      IEmailService.ts

  /infrastructure
    /database
      /models
      /migrations
      /repositories
        UserRepository.ts
    /http
      /controllers
      /middlewares
      /routes
    /services
      EmailService.ts
    /config
      env.ts
      logger.ts

  /presentation
    /http
      /controllers
      /view-models
      /validators

  /main
    server.ts
    app.ts
    container.ts