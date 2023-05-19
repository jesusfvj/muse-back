# Muze - Backend Application

Muze's backend application is built with Node.js and MongoDB. It serves as the server-side component for the Muze music application, handling user authentication, data storage, and API endpoints. Cloudinary is utilized as a service for file storage that can be managed from the backend with Node.js.

## Installation and Setup

Before running the Muze backend application, make sure you have Node.js and npm (Node Package Manager) installed on your machine. Additionally, you'll need to set up a MongoDB database and obtain Cloudinary and Stripe API credentials. 

1. Clone the repository:

```shell
git clone https://github.com/your-username/muze-backend.git
```

2. Navigate to the project's root directory:

```shell
cd muze-backend
```

3. Install the dependencies:

```shell
npm install
```

4. Set up environment variables:

   Create a `.env` file in the project's root directory and include the following variables:

   - `PORT`: The port number for the server to listen on.
   - `MONGODB_URL`: The connection URL for your MongoDB database.
   - `PASS`: The password for your MongoDB database.
   - `CLOUD_NAME`: Your Cloudinary cloud name.
   - `API_KEY`: Your Cloudinary API key.
   - `API_SECRET`: Your Cloudinary API secret.
   - `STRIPE_SECRET_KEY`: Your Stripe secret key.
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
   - `TOKEN_SECRET`: A secret key used for JWT token generation.

   > Remember to fill in the values for these variables and include them in the `.env` file.

5. Start the server:

```shell
npm start
```

The Muze backend application is now up and running.

## Cloudinary

Cloudinary is a service for file storage that allows you to easily manage and manipulate media assets such as images and videos. In the context of the Muze backend application, Cloudinary is used to handle the upload and download of music files and images associated with artists and users. With the provided Cloudinary API credentials, the Muze backend can seamlessly interact with the Cloudinary service to store and retrieve these media assets.

## Dependencies

Muze backend relies on the following dependencies:

| Dependency                | Version   |
| ------------------------- | --------- |
| bcryptjs                  | ^2.4.3    |
| cloudinary                | ^1.28.1   |
| cors                      | ^2.8.5    |
| dotenv                    | ^10.0.0   |
| express                   | ^4.17.1   |
| express-fileupload        | ^1.2.1    |
| jsonwebtoken              | ^8.5.1    |
| mongoose                  | ^6.1.10   |
| multer                    | ^1.4.3    |
| nodemailer                | ^6.7.2    |
| validator                 | ^13.6.0   |

Please ensure that you have these dependencies installed to run the Muze backend application successfully.

## Contributing

We welcome contributions to the Muze backend application! If you find any bugs or have suggestions for improvements, please feel free to open issues or submit pull requests in the [GitHub repository](https://github.com/your-username/muze-backend).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [OpenAI](https://openai.com) for providing the GPT-3.5 language model used to generate this README file.

Thank you for using the Muze backend application!
